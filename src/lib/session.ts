import { v4 as uuid } from "uuid";

const SESSION_KEY = "ischool.session_id";
const STUDENT_KEY = "ischool.student";

export type StoredStudent = { id?: string; name: string; grade: number };

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = uuid();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function getStudent(): StoredStudent | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STUDENT_KEY);
  return raw ? (JSON.parse(raw) as StoredStudent) : null;
}

export function setStudent(s: StoredStudent) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STUDENT_KEY, JSON.stringify(s));
}

export function clearStudent() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STUDENT_KEY);
}
