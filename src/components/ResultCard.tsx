import { motion } from "framer-motion";
import { Trophy, Sparkles, Target } from "lucide-react";

interface ResultCardProps {
  score: number;
  total: number;
  percentage: number;
}

function feedback(p: number) {
  if (p >= 90) return { tier: "Outstanding!", icon: Trophy, message: "You're a tech genius. Keep it up!", color: "text-highlight" };
  if (p >= 70) return { tier: "Great job!", icon: Sparkles, message: "Strong work — try a harder module next.", color: "text-primary" };
  if (p >= 50) return { tier: "Good effort", icon: Target, message: "Review the questions and try again.", color: "text-accent" };
  return { tier: "Keep practicing", icon: Target, message: "Don't worry — every expert started here.", color: "text-muted-foreground" };
}

export function ResultCard({ score, total, percentage }: ResultCardProps) {
  const fb = feedback(percentage);
  const Icon = fb.icon;

  return (
    <motion.div
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="overflow-hidden rounded-3xl border border-border bg-card shadow-card"
    >
      <div className="bg-gradient-hero p-8 text-center text-primary-foreground">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
          <Icon className="size-8" />
        </div>
        <h2 className="font-display text-3xl font-bold">{fb.tier}</h2>
        <p className="mt-2 text-sm opacity-90">{fb.message}</p>
      </div>

      <div className="grid grid-cols-2 divide-x divide-border">
        <div className="p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Score</p>
          <p className="mt-2 font-display text-4xl font-bold text-foreground">
            {score}<span className="text-xl text-muted-foreground">/{total}</span>
          </p>
        </div>
        <div className="p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Percentage</p>
          <p className="mt-2 font-display text-4xl font-bold text-primary">{percentage}%</p>
        </div>
      </div>
    </motion.div>
  );
}
