import type { AnswerValue, Question } from "./types";

export function isCorrect(q: Question, value: AnswerValue | undefined): boolean {
  if (!value) return false;
  switch (q.type) {
    case "mcq":
      return value.type === "mcq" && value.selected === q.correctIndex;
    case "true-false":
      return value.type === "true-false" && value.selected === q.correct;
    case "ordering":
      return (
        value.type === "ordering" &&
        value.order.length === q.correctOrder.length &&
        value.order.every((v, i) => v === q.correctOrder[i])
      );
    case "drag-drop":
      return (
        value.type === "drag-drop" &&
        q.pairs.every((p) => value.mapping[p.left] === p.right)
      );
  }
}
