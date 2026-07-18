"use client";

import {
  typeColor,
  typeColorSoft,
  typeToString,
  type WdlType,
} from "@/features/project/types";
import { cn } from "@/lib/utils";

export function TypeBadge({
  type,
  className,
  compact,
}: {
  type: WdlType;
  className?: string;
  compact?: boolean;
}) {
  const color = typeColor(type);
  const label = typeToString(type);
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1 truncate rounded-md border font-mono font-medium",
        compact ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]",
        className,
      )}
      style={{
        color,
        borderColor: `${color}55`,
        background: typeColorSoft(type, 0.12),
      }}
      title={label}
    >
      <span
        className="h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ background: color }}
      />
      <span className="truncate">{label}</span>
    </span>
  );
}

export function TypeDot({ type, className }: { type: WdlType; className?: string }) {
  return (
    <span
      className={cn("inline-block h-2 w-2 shrink-0 rounded-full", className)}
      style={{ background: typeColor(type) }}
      title={typeToString(type)}
    />
  );
}

export function TypeLegend({ className }: { className?: string }) {
  const items: Array<{ name: string; type: WdlType }> = [
    { name: "String", type: { kind: "primitive", name: "String" } },
    { name: "Int", type: { kind: "primitive", name: "Int" } },
    { name: "Float", type: { kind: "primitive", name: "Float" } },
    { name: "Boolean", type: { kind: "primitive", name: "Boolean" } },
    { name: "File", type: { kind: "primitive", name: "File" } },
    { name: "Directory", type: { kind: "primitive", name: "Directory" } },
    {
      name: "Array",
      type: { kind: "array", item: { kind: "primitive", name: "String" } },
    },
  ];
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {items.map((it) => (
        <TypeBadge key={it.name} type={it.type} compact />
      ))}
    </div>
  );
}
