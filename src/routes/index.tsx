import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Award, BookOpen, Sparkles } from "lucide-react";
import { LogoMark } from "@/components/LogoMark";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "iSchool — Programming quizzes for kids & teens" },
      { name: "description", content: "Test your programming and technology skills with interactive quizzes designed for ages 8–18." },
      { property: "og:title", content: "iSchool — Learn through quizzes" },
      { property: "og:description", content: "Interactive programming and tech quizzes for grades 1 to 12." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-soft" aria-hidden />
        <div className="pointer-events-none absolute -left-32 top-20 size-72 rounded-full bg-primary/15 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -right-20 top-40 size-80 rounded-full bg-accent/15 blur-3xl" aria-hidden />

        <div className="container relative mx-auto grid items-center gap-12 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-pale px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="size-3.5" /> For ages 8 to 18
            </div>

            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
              Learn programming
              <span className="block bg-gradient-to-r from-primary to-sky bg-clip-text text-transparent">
                one quiz at a time.
              </span>
            </h1>

            <p className="max-w-lg text-lg text-muted-foreground">
              iSchool is a playful assessment platform for curious minds. Pick your grade,
              choose a module, and test what you know — across coding, the web, and tech essentials.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full bg-accent px-7 text-base text-accent-foreground hover:bg-accent-deep">
                <Link to="/start">
                  Start Your Quiz <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-7 text-base">
                <Link to="/grades">Browse Grades</Link>
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4 text-sm text-muted-foreground">
              <div><strong className="font-display text-foreground">12</strong> grades</div>
              <div><strong className="font-display text-foreground">24+</strong> modules</div>
              <div><strong className="font-display text-foreground">4</strong> question types</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="relative rounded-[2rem] border border-border bg-card p-8 shadow-card">
              <div className="absolute -right-4 -top-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-warm shadow-glow">
                <Award className="size-8 text-accent-foreground" />
              </div>
              <LogoMark size={64} className="mx-auto" />
              <div className="mt-8 space-y-4">
                <div className="rounded-2xl bg-primary-pale p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">Question 1 of 5</p>
                  <p className="mt-2 font-medium">What does HTML stand for?</p>
                </div>
                <div className="space-y-2">
                  {["High Tech ML", "HyperText Markup Language", "Home Tool ML"].map((opt, i) => (
                    <div
                      key={opt}
                      className={`flex items-center gap-3 rounded-xl border-2 p-3 text-sm ${
                        i === 1 ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      <span className={`flex size-7 items-center justify-center rounded-md text-xs font-bold ${
                        i === 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}>{String.fromCharCode(65 + i)}</span>
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Built for every learner</h2>
          <p className="mt-3 text-muted-foreground">
            From foundational tech basics to advanced computer science — there's a module for every level.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: BookOpen, title: "Grades 1–4", desc: "Computer basics, files, and logical thinking." },
            { icon: Sparkles, title: "Grades 5–8", desc: "Scratch, HTML, CSS, and your first JavaScript." },
            { icon: Award, title: "Grades 9–12", desc: "Algorithms, OOP, databases, and real-world CS." },
          ].map((card) => (
            <div key={card.title} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-hero text-primary-foreground">
                <card.icon className="size-6" />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold">{card.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
