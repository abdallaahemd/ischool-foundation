import { AnswerCard } from "@/components/AnswerCard";
import type { McqQuestion, AnswerValue } from "@/lib/quiz/types";

interface Props {
  question: McqQuestion;
  value: AnswerValue | undefined;
  onChange: (v: AnswerValue) => void;
}

export function McqRenderer({ question, value, onChange }: Props) {
  const selected = value?.type === "mcq" ? value.selected : null;
  return (
    <div className="space-y-3">
      {question.options.map((opt, i) => (
        <AnswerCard
          key={i}
          index={i}
          label={opt}
          selected={selected === i}
          onClick={() => onChange({ type: "mcq", selected: i })}
        />
      ))}
    </div>
  );
}
