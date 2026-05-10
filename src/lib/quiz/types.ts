import { z } from "zod";

export type McqQuestion = {
  id: string;
  type: "mcq";
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
};

export type TrueFalseQuestion = {
  id: string;
  type: "true-false";
  prompt: string;
  correct: boolean;
  explanation?: string;
};

export type OrderingQuestion = {
  id: string;
  type: "ordering";
  prompt: string;
  /** items shown in shuffled order; correctOrder lists indices into items */
  items: string[];
  correctOrder: number[];
  explanation?: string;
};

export type DragDropQuestion = {
  id: string;
  type: "drag-drop";
  prompt: string;
  pairs: { left: string; right: string }[];
  explanation?: string;
};

export type Question =
  | McqQuestion
  | TrueFalseQuestion
  | OrderingQuestion
  | DragDropQuestion;

export type Module = {
  id: string;
  grade: number;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  questions: Question[];
};

export type AnswerValue =
  | { type: "mcq"; selected: number | null }
  | { type: "true-false"; selected: boolean | null }
  | { type: "ordering"; order: number[] }
  | { type: "drag-drop"; mapping: Record<string, string> };

export type StoredAnswer = {
  questionId: string;
  value: AnswerValue;
  correct: boolean;
};

export const studentSchema = z.object({
  name: z.string().min(1).max(60),
  grade: z.number().int().min(1).max(12),
});
export type StudentInput = z.infer<typeof studentSchema>;
