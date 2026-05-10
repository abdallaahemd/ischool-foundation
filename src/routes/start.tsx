import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setStudent, getStudent, getSessionId } from "@/lib/session";
import { listGrades } from "@/lib/quiz/loader";
import { studentSchema } from "@/lib/quiz/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/start")({
  head: () => ({
    meta: [
      { title: "Get started — iSchool" },
      { name: "description", content: "Tell us your name and grade to begin your iSchool quiz journey." },
    ],
  }),
  component: StartPage,
});

function StartPage() {
  const navigate = useNavigate();
  const existing = typeof window !== "undefined" ? getStudent() : null;
  const [name, setName] = useState(existing?.name ?? "");
  const [grade, setGrade] = useState<number | null>(existing?.grade ?? null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = studentSchema.safeParse({ name: name.trim(), grade: grade ?? -1 });
    if (!parsed.success) {
      toast.error("Please enter your name and pick a grade.");
      return;
    }
    getSessionId(); // ensure created
    setStudent(parsed.data);
    toast.success(`Welcome, ${parsed.data.name}!`);
    navigate({ to: "/grades/$grade", params: { grade: String(parsed.data.grade) } });
  };

  return (
    <section className="container mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-20">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="font-display text-4xl font-bold md:text-5xl">Let's get to know you</h1>
        <p className="mt-3 text-muted-foreground">Enter your name and grade to start.</p>
      </motion.div>

      <form onSubmit={submit} className="mt-10 space-y-8 rounded-3xl border border-border bg-card p-6 shadow-soft md:p-10">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-base font-medium">Your name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex"
            className="h-12 rounded-xl text-base"
            maxLength={60}
            required
          />
        </div>

        <div className="space-y-3">
          <Label className="text-base font-medium">Pick your grade</Label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {listGrades().map((g) => (
              <button
                type="button"
                key={g}
                onClick={() => setGrade(g)}
                className={cn(
                  "rounded-2xl border-2 px-4 py-4 font-display text-lg font-semibold transition-all",
                  grade === g
                    ? "border-primary bg-primary text-primary-foreground shadow-soft"
                    : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary-pale",
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent-deep">
          Continue <ArrowRight className="ml-1 size-4" />
        </Button>
      </form>
    </section>
  );
}
