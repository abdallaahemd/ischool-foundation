import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnswerCardProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  index?: number;
}

const letters = ["A", "B", "C", "D", "E", "F"];

export function AnswerCard({ label, selected, onClick, index = 0 }: AnswerCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all",
        selected
          ? "border-primary bg-primary/5 shadow-soft"
          : "border-border bg-card hover:border-primary/40 hover:bg-primary-pale",
      )}
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl font-display text-base font-bold transition-colors",
          selected
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
        )}
      >
        {selected ? <Check className="size-5" /> : letters[index]}
      </span>
      <span className="flex-1 text-base font-medium text-foreground">{label}</span>
    </button>
  );
}
