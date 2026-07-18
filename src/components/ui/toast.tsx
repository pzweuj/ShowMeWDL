"use client";

import { useEffect } from "react";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { useProjectStore } from "@/features/project/store";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export function ToastHost() {
  const toast = useProjectStore((s) => s.toast);
  const clearToast = useProjectStore((s) => s.clearToast);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => clearToast(), toast.durationMs ?? 2800);
    return () => window.clearTimeout(t);
  }, [toast, clearToast]);

  if (!toast) return null;

  const Icon =
    toast.tone === "error" ? AlertTriangle : toast.tone === "success" ? CheckCircle2 : Info;

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 px-4">
      <div
        className={cn(
          "pointer-events-auto flex min-w-[240px] max-w-[min(92vw,420px)] items-start gap-2 rounded-xl border px-3 py-2.5 shadow-2xl backdrop-blur-md",
          toast.tone === "error" &&
            "border-red-500/30 bg-[color-mix(in_oklab,var(--panel)_92%,#ef4444)] text-[var(--danger)]",
          toast.tone === "success" &&
            "border-emerald-500/30 bg-[color-mix(in_oklab,var(--panel)_92%,#22c55e)] text-[var(--success)]",
          toast.tone === "info" &&
            "border-[var(--panel-border)] bg-[color-mix(in_oklab,var(--panel)_94%,transparent)] text-[var(--foreground)]",
        )}
      >
        <Icon className="mt-0.5 h-4 w-4 shrink-0" />
        <div className="min-w-0 flex-1 text-sm leading-snug">{toast.message}</div>
        <Button size="icon" variant="ghost" className="h-6 w-6 shrink-0" onClick={clearToast}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
