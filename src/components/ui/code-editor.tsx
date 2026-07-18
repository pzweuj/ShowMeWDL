"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const TextareaCodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[160px] rounded-md border border-[var(--panel-border)] bg-[var(--background)] px-2 py-2 text-xs text-[var(--muted)]">
        加载编辑器…
      </div>
    ),
  },
);

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  placeholder?: string;
  className?: string;
  minHeight?: number;
};

export function CodeEditor({
  value,
  onChange,
  language = "shell",
  placeholder,
  className,
  minHeight = 160,
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-[var(--panel-border)] focus-within:border-[var(--accent)]",
        className,
      )}
    >
      <TextareaCodeEditor
        value={value}
        language={language}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        padding={12}
        data-color-mode={isDark ? "dark" : "light"}
        style={{
          fontSize: 12,
          minHeight,
          backgroundColor: "var(--background)",
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
        }}
      />
    </div>
  );
}
