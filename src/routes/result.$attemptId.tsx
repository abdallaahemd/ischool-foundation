import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Home, RotateCw } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/result/$attemptId")({
  head: () => ({
    meta: [
      { title: "Your result — iSchool" },
      { name: "description", content: "See your iSchool quiz results and feedback." },
    ],
  }),
  component: ResultPage,
});

function ResultPage() {
  const { attemptId } = Route.useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["attempt", attemptId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quiz_attempts")
        .select("*")
        .eq("id", attemptId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="container mx-auto max-w-2xl px-4 py-12 md:px-6 md:py-20">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Results</p>
        <h1 className="mt-1 font-display text-4xl font-bold md:text-5xl">All done!</h1>
      </div>

      <div className="mt-10">
        {isLoading && <Skeleton className="h-72 w-full rounded-3xl" />}
        {error && <p className="text-center text-destructive">Could not load result.</p>}
        {data && (
          <ResultCard
            score={data.score}
            total={data.total}
            percentage={Math.round(Number(data.percentage))}
          />
        )}
      </div>

      {data && (
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link to="/grades/$grade" params={{ grade: String(data.grade) }}>
              <RotateCw className="size-4" /> Try another module
            </Link>
          </Button>
          <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary-deep">
            <Link to="/">
              <Home className="size-4" /> Home
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
}
