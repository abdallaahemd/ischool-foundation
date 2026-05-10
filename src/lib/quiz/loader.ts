import type { Module } from "./types";

// Eager-import all module JSON. Vite bundles them at build time.
const modules = import.meta.glob<{ default: Module }>(
  "../../data/quizzes/grade-*/module-*.json",
  { eager: true },
);

function key(grade: number, moduleId: string) {
  return `../../data/quizzes/grade-${grade}/${moduleId}.json`;
}

export function getModule(grade: number, moduleId: string): Module | null {
  const file = modules[key(grade, moduleId)];
  return file?.default ?? null;
}

export function listModules(grade: number): Module[] {
  return Object.entries(modules)
    .filter(([path]) => path.includes(`grade-${grade}/`))
    .map(([, mod]) => mod.default)
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function listGrades(): number[] {
  return Array.from({ length: 12 }, (_, i) => i + 1);
}
