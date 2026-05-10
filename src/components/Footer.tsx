import { LogoMark } from "./LogoMark";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-6">
        <div className="flex items-center gap-3">
          <LogoMark size={28} />
          <span className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} iSchool. Learning made playful.
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Quizzes for ages 8–18 · Programming & technology
        </p>
      </div>
    </footer>
  );
}
