import { AnswerCard } from "@/components/AnswerCard";
import type { TrueFalseQuestion, AnswerValue } from "@/lib/quiz/types";

interface Props {
  question: TrueFalseQuestion;
  value: AnswerValue | undefined;
  onChange: (v: AnswerValue) => void;
}

export function TrueFalseRenderer({ value, onChange }: Props) {
  const selected = value?.type === "true-false" ? value.selected : null;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <AnswerCard label="True" index={0} selected={selected === true} onClick={() => onChange({ type: "true-false", selected: true })} />
      <AnswerCard label="False" index={1} selected={selected === false} onClick={() => onChange({ type: "true-false", selected: false })} />
    </div>
  );
}
