
# iSchool — Foundation Plan

A modern educational assessment platform for kids/teens (ages 8–18) to test programming and tech knowledge. This phase delivers the structure, navigation, reusable components, and quiz engine scaffold — minimal animation polish, no scoring backend yet.

Note on stack: Lovable projects use **TanStack Start** (React + TypeScript + Tailwind + Framer Motion), not Next.js. Same DX, file-based routing under `src/routes/`. Lovable Cloud will be enabled for persistence.

---

## 1. Branding & Design System

Update `src/styles.css` with the iSchool palette as semantic tokens (oklch):

- `--primary` → #056FEC (iSchool blue)
- `--primary-foreground` → white
- `--accent` → #FF7F1C (iSchool orange)
- `--secondary` → #CAE2F0 (soft blue)
- `--warning` / highlight → #FFD700 (gold)
- Secondary scale: #043FAD, #C76316, #B1D1E6, #05ACFF, #FFBB1C, #ECF8FF
- Gradients: `--gradient-hero` (blue → cyan), `--gradient-warm` (orange → gold)
- Soft shadows, larger border radius (`--radius: 1rem`) for friendly/kid-appropriate feel
- Typography: Poppins (display) + Inter (body) via Google Fonts
- Dark mode tokens included

Copy iSchool logo from `user-uploads://Screenshot_2025-06-17_102317.png` into `src/assets/ischool-logo.png`.

## 2. Lovable Cloud + Database

Enable Lovable Cloud and add tables:

- `students` — id, name, grade, created_at
- `quiz_attempts` — id, student_id, grade, module_id, score, total, percentage, answers (jsonb), completed_at
- RLS: public insert (anonymous students), readable by owner via session id stored in localStorage

(Auth is intentionally skipped now — students are anonymous, identified by a session id.)

## 3. Routes (`src/routes/`)

```
__root.tsx          → shell + Navbar + Footer + QueryClientProvider
index.tsx           → Landing page (hero, CTA, intro)
start.tsx           → Student info (name input + grade quick-pick)
grades.tsx          → Grade selection (1–12 cards)
grades.$grade.tsx   → Module selection for chosen grade
quiz.$grade.$module.tsx → Quiz runner
result.$attemptId.tsx   → Result page (score, %, feedback)
```

Each route has its own `head()` metadata, `errorComponent`, and `notFoundComponent` (root has global 404).

## 4. Reusable Components (`src/components/`)

- `Navbar` — logo, links, mobile sheet menu
- `Sidebar` — shadcn sidebar (used inside quiz layout for module nav)
- `Footer`
- `GradeCard` — grade number, icon, gradient, hover lift
- `ModuleCard` — title, question count, difficulty badge, CTA
- `QuizCard` — wrapper for question container
- `ProgressBar` — animated fill, "X of Y"
- `AnswerCard` — selectable, supports correct/incorrect states (revealed only on submit)
- `ResultCard` — circular score, percentage, feedback tier
- `Button` (already from shadcn — extend with `hero`, `playful` variants in `button.tsx`)
- `Modal` — wrapper around shadcn Dialog with consistent header/footer
- `LogoMark` — wraps the logo image

All components use design tokens; no raw color classes.

## 5. Quiz Engine

Question types supported via discriminated union in `src/lib/quiz/types.ts`:

```ts
type Question =
  | { id; type: "mcq"; prompt; options: string[]; correctIndex }
  | { id; type: "true-false"; prompt; correct: boolean }
  | { id; type: "ordering"; prompt; items: string[]; correctOrder: number[] }
  | { id; type: "drag-drop"; prompt; pairs: { left; right }[] };
```

Loader pattern: `src/data/quizzes/grade-{n}/module-{m}.json` loaded dynamically by route loader.

Renderer dispatches by `question.type` to:
- `McqQuestion`
- `TrueFalseQuestion`
- `OrderingQuestion` (uses `@dnd-kit/sortable`)
- `DragDropQuestion` (uses `@dnd-kit/core`)

State managed by `useQuiz()` hook: current index, answers map, navigation, submit → writes attempt to `quiz_attempts`, redirects to result.

## 6. Sample Content

Seed JSON for **all 12 grades, 2 modules each**, with 4–5 questions per module covering each question type at least once across the set. Age-appropriate programming/tech topics (basic computer parts → algorithms/JS).

## 7. Responsive Design

- Mobile-first Tailwind utilities
- Navbar collapses to Sheet menu < md
- Grade grid: 2 cols mobile → 3 tablet → 4 desktop
- Quiz: full-width container, sticky progress on mobile
- Tested mentally at 375px / 768px / 1280px

## 8. What's NOT in this phase

- Auth / login
- Question randomization, timers
- Leaderboards, certificates
- Heavy animations (just subtle Framer Motion page transitions + card hover)
- Admin panel for editing questions

---

## Technical notes

- Install: `framer-motion`, `@dnd-kit/core`, `@dnd-kit/sortable`, `zod`
- Use `createServerFn` (with `requireSupabaseAuth` skipped — anonymous insert) for saving attempts
- Quiz JSON loaded via `import.meta.glob` for type-safe static bundling
- Session id (uuid) stored in `localStorage` to associate attempts with a student
