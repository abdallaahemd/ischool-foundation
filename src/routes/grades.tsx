import { createFileRoute } from "@tanstack/react-router";
import { GradeCard } from "@/components/GradeCard";
import { listGrades } from "@/lib/quiz/loader";

export const Route = createFileRoute("/grades")({
  head: () => ({
    meta: [
      { title: "Choose your grade — iSchool" },
      { name: "description", content: "Browse quizzes by grade level, from Grade 1 to Grade 12." },
    ],
  }),
  component: GradesPage,
});

function GradesPage() {
  const grades = listGrades();
  return (
    <section className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-bold md:text-5xl">Choose your grade</h1>
        <p className="mt-3 text-muted-foreground">Pick the grade that matches your level — you can always switch later.</p>
      </div>
      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {grades.map((g, i) => (
          <GradeCard key={g} grade={g} index={i} />
        ))}
      </div>
    </section>
  );
}
