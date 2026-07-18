import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-8 w-full rounded-md border border-[var(--panel-border)] bg-[var(--background)] px-2 text-sm outline-none focus:border-[var(--accent)]",
        className,
      )}
      {...props}
    />
  );
}
