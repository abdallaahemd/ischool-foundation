import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";
import { QuestionRenderer } from "@/components/quiz/QuestionRenderer";
import { Button } from "@/components/ui/button";
import { getModule } from "@/lib/quiz/loader";
import { isCorrect } from "@/lib/quiz/grade";
import { getSessionId, getStudent } from "@/lib/session";
import { supabase } from "@/integrations/supabase/client";
import type { AnswerValue, StoredAnswer } from "@/lib/quiz/types";
import { toast } from "sonner";

export const Route = createFileRoute("/quiz/$grade/$module")({
  head: ({ params }) => ({
    meta: [
      { title: `Quiz · Grade ${params.grade} ${params.module} — iSchool` },
      { name: "description", content: "Take an interactive iSchool quiz." },
    ],
  }),
  loader: ({ params }) => {
    const grade = Number(params.grade);
    const module = getModule(grade, params.module);
    if (!module) throw notFound();
    return { module };
  },
  component: QuizPage,
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-20 text-center">
      <h2 className="font-display text-2xl font-semibold">Quiz not found</h2>
      <Link to="/grades" className="mt-4 inline-block text-primary underline">Back to grades</Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="container mx-auto px-4 py-20 text-center">
      <p className="text-destructive">{error.message}</p>
    </div>
  ),
});

function QuizPage() {
  const { module } = Route.useLoaderData();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [submitting, setSubmitting] = useState(false);

  const question = module.questions[index];
  const total = module.questions.length;
  const isLast = index === total - 1;

  const setAnswer = (v: AnswerValue) => setAnswers((a) => ({ ...a, [question.id]: v }));

  const submit = async () => {
    setSubmitting(true);
    try {
      const stored: StoredAnswer[] = module.questions.map((q) => ({
        questionId: q.id,
        value: answers[q.id] ?? ({ type: q.type === "mcq" ? "mcq" : q.type === "true-false" ? "true-false" : q.type === "ordering" ? "ordering" : "drag-drop" } as AnswerValue),
        correct: isCorrect(q, answers[q.id]),
      }));
      const score = stored.filter((s) => s.correct).length;
      const percentage = Math.round((score / total) * 100);
      const sessionId = getSessionId();
      const student = getStudent();

      const { data, error } = await supabase
        .from("quiz_attempts")
        .insert({
          session_id: sessionId,
          grade: module.grade,
          module_id: module.id,
          score,
          total,
          percentage,
          answers: stored as unknown as never,
          student_id: null,
        })
        .select("id")
        .single();

      if (error) throw error;

      // Best-effort: also create student row if one isn't tracked yet
      if (student && !student.id) {
        await supabase.from("students").insert({
          session_id: sessionId,
          name: student.name,
          grade: student.grade,
        });
      }

      navigate({ to: "/result/$attemptId", params: { attemptId: data.id } });
    } catch (err) {
      console.error(err);
      toast.error("Could not save your result. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <section className="container mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-14">
      <Link
        to="/grades/$grade"
        params={{ grade: String(module.grade) }}
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to modules
      </Link>

      <div className="mt-6 space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Grade {module.grade} · {module.difficulty}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold md:text-3xl">{module.title}</h1>
        </div>

        <ProgressBar current={index + 1} total={total} />

        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8"
          >
            <p className="font-display text-xl font-semibold leading-snug md:text-2xl">
              {question.prompt}
            </p>
            <div className="mt-6">
              <QuestionRenderer question={question} value={answers[question.id]} onChange={setAnswer} />
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className="rounded-full"
          >
            <ArrowLeft className="size-4" /> Previous
          </Button>

          {isLast ? (
            <Button
              onClick={submit}
              disabled={submitting}
              size="lg"
              className="rounded-full bg-accent text-accent-foreground hover:bg-accent-deep"
            >
              {submitting ? "Submitting…" : "Submit Quiz"}
            </Button>
          ) : (
            <Button
              onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
              size="lg"
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary-deep"
            >
              Next <ArrowRight className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
