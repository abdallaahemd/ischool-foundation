import logo from "@/assets/ischool-logo.png";
import { cn } from "@/lib/utils";

export function LogoMark({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    <img
      src={logo}
      alt="iSchool logo"
      width={size * 2.5}
      height={size}
      className={cn("h-auto w-auto select-none", className)}
      style={{ height: size }}
    />
  );
}
