import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost" | "outline" | "danger" | "accent";
  size?: "sm" | "md" | "icon";
};

export function Button({
  className,
  variant = "default",
  size = "md",
  ...props
}: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none",
        size === "sm" && "h-7 px-2 text-xs",
        size === "md" && "h-8 px-3 text-sm",
        size === "icon" && "h-8 w-8",
        variant === "default" &&
          "bg-[var(--panel)] border border-[var(--panel-border)] hover:bg-black/5 dark:hover:bg-white/5",
        variant === "ghost" && "hover:bg-black/5 dark:hover:bg-white/5",
        variant === "outline" &&
          "border border-[var(--panel-border)] bg-transparent hover:bg-black/5 dark:hover:bg-white/5",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-500",
        variant === "accent" && "bg-[var(--accent)] text-white hover:opacity-90",
        className,
      )}
      {...props}
    />
  );
}
