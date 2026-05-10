
create table public.students (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  name text not null,
  grade int not null check (grade between 1 and 12),
  created_at timestamptz not null default now()
);

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.students(id) on delete cascade,
  session_id text not null,
  grade int not null,
  module_id text not null,
  score int not null default 0,
  total int not null default 0,
  percentage numeric(5,2) not null default 0,
  answers jsonb not null default '[]'::jsonb,
  completed_at timestamptz not null default now()
);

create index idx_attempts_session on public.quiz_attempts(session_id);
create index idx_students_session on public.students(session_id);

alter table public.students enable row level security;
alter table public.quiz_attempts enable row level security;

create policy "Anyone can insert students" on public.students for insert with check (true);
create policy "Anyone can read students" on public.students for select using (true);

create policy "Anyone can insert attempts" on public.quiz_attempts for insert with check (true);
create policy "Anyone can read attempts" on public.quiz_attempts for select using (true);
