import type { Question, AnswerValue } from "@/lib/quiz/types";
import { McqRenderer } from "./McqRenderer";
import { TrueFalseRenderer } from "./TrueFalseRenderer";
import { OrderingRenderer } from "./OrderingRenderer";
import { DragDropRenderer } from "./DragDropRenderer";

interface Props {
  question: Question;
  value: AnswerValue | undefined;
  onChange: (v: AnswerValue) => void;
}

export function QuestionRenderer({ question, value, onChange }: Props) {
  switch (question.type) {
    case "mcq":
      return <McqRenderer question={question} value={value} onChange={onChange} />;
    case "true-false":
      return <TrueFalseRenderer question={question} value={value} onChange={onChange} />;
    case "ordering":
      return <OrderingRenderer question={question} value={value} onChange={onChange} />;
    case "drag-drop":
      return <DragDropRenderer question={question} value={value} onChange={onChange} />;
  }
}
