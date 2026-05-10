import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const palettes = [
  "from-primary to-sky",
  "from-accent to-highlight",
  "from-sky to-primary-deep",
  "from-highlight-soft to-accent",
];

export function GradeCard({ grade, index = 0 }: { grade: number; index?: number }) {
  const palette = palettes[(grade - 1) % palettes.length];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
    >
      <Link
        to="/grades/$grade"
        params={{ grade: String(grade) }}
        className={cn(
          "group relative block overflow-hidden rounded-3xl bg-gradient-to-br p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card",
          palette,
        )}
      >
        <div className="absolute -right-6 -top-6 size-24 rounded-full bg-white/20 blur-2xl" />
        <div className="relative flex flex-col gap-2 text-primary-foreground">
          <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Grade</span>
          <span className="font-display text-5xl font-bold leading-none">{grade}</span>
          <span className="mt-2 text-sm opacity-90">2 modules · Tap to explore</span>
        </div>
      </Link>
    </motion.div>
  );
}
