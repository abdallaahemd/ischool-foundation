import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { Module } from "@/lib/quiz/types";
import { Badge } from "@/components/ui/badge";

const difficultyClass: Record<Module["difficulty"], string> = {
  Easy: "bg-success/10 text-success border-success/30",
  Medium: "bg-highlight-soft/20 text-accent-deep border-accent/30",
  Hard: "bg-destructive/10 text-destructive border-destructive/30",
};

export function ModuleCard({ module, index = 0 }: { module: Module; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to="/quiz/$grade/$module"
        params={{ grade: String(module.grade), module: module.id }}
        className="group flex h-full flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-card"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-hero text-primary-foreground">
            <Sparkles className="size-6" />
          </div>
          <Badge variant="outline" className={difficultyClass[module.difficulty]}>
            {module.difficulty}
          </Badge>
        </div>

        <div className="flex-1 space-y-2">
          <h3 className="font-display text-xl font-semibold text-foreground">{module.title}</h3>
          <p className="text-sm text-muted-foreground">{module.description}</p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{module.questions.length} questions</span>
          <span className="flex items-center gap-1 font-semibold text-primary transition-transform group-hover:translate-x-1">
            Start <ArrowRight className="size-4" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
