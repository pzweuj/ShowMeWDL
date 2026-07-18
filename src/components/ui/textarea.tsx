import { cn } from "@/lib/utils";
import type { TextareaHTMLAttributes } from "react";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-[80px] w-full rounded-md border border-[var(--panel-border)] bg-[var(--background)] px-2 py-1.5 text-sm outline-none focus:border-[var(--accent)] font-mono",
        className,
      )}
      {...props}
    />
  );
}
