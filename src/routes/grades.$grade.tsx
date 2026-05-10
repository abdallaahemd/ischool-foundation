import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ModuleCard } from "@/components/ModuleCard";
import { listModules } from "@/lib/quiz/loader";
import type { Module } from "@/lib/quiz/types";

export const Route = createFileRoute("/grades/$grade")({
  head: ({ params }) => ({
    meta: [
      { title: `Grade ${params.grade} modules — iSchool` },
      { name: "description", content: `Pick a quiz module for Grade ${params.grade}.` },
    ],
  }),
  loader: ({ params }) => {
    const grade = Number(params.grade);
    if (!Number.isInteger(grade) || grade < 1 || grade > 12) throw notFound();
    const modules: Module[] = listModules(grade);
    return { grade, modules };
  },
  component: GradeModulesPage,
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-20 text-center">
      <h2 className="font-display text-2xl font-semibold">Grade not found</h2>
      <Link to="/grades" className="mt-4 inline-block text-primary underline">Back to grades</Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="container mx-auto px-4 py-20 text-center">
      <p className="text-destructive">{error.message}</p>
    </div>
  ),
});

function GradeModulesPage() {
  const { grade, modules } = Route.useLoaderData();
  return (
    <section className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <Link
        to="/grades"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> All grades
      </Link>

      <div className="mt-6 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Grade {grade}</p>
        <h1 className="mt-1 font-display text-4xl font-bold md:text-5xl">Choose a module</h1>
        <p className="mt-3 text-muted-foreground">
          Each module focuses on a different topic. Start with module 1 and work your way up.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((m: Module, i: number) => (
          <ModuleCard key={m.id} module={m} index={i} />
        ))}
      </div>

      {modules.length === 0 && (
        <p className="mt-12 text-center text-muted-foreground">No modules yet for this grade.</p>
      )}
    </section>
  );
}
