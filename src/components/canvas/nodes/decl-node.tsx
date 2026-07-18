"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { exprToString, typeColor, type Expr, type WdlType } from "@/features/project/types";
import { cn } from "@/lib/utils";
import { TypeBadge } from "@/components/ui/type-badge";
import { useI18n } from "@/i18n/context";

export type DeclNodeData = {
  name: string;
  type: WdlType;
  expression: Expr;
  edgeLinked?: boolean;
  edgeRole?: "source" | "target";
  [key: string]: unknown;
};

export function DeclNodeView({ data, selected }: NodeProps & { data: DeclNodeData }) {
  const { t } = useI18n();
  const color = typeColor(data.type);
  const exprText = exprToString(data.expression);
  const linked = Boolean(data.edgeLinked);
  return (
    <div
      className={cn(
        "min-w-[180px] rounded-lg border bg-[var(--node-bg)] shadow transition-shadow",
        linked
          ? "border-amber-500 shadow-[0_0_0_3px_rgba(245,158,11,0.35)]"
          : selected
            ? "border-[var(--accent)] shadow-[0_0_0_3px_color-mix(in_oklab,var(--accent)_28%,transparent)]"
            : "border-[var(--node-border)] hover:border-[color-mix(in_oklab,var(--accent)_45%,var(--node-border))]",
      )}
      title={t("canvas.editBottom")}
    >
      <div className="border-b border-[var(--node-border)] bg-[var(--node-header)] px-3 py-1.5">
        <div className="flex items-center justify-between gap-1">
          <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">
            {t("canvas.decl")}
          </div>
          {linked && (
            <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400">
              {data.edgeRole === "source" ? t("canvas.upstream") : t("canvas.downstream")}
            </span>
          )}
        </div>
        <div className="truncate text-sm font-semibold">{data.name}</div>
        <div className="mt-1">
          <TypeBadge type={data.type} compact />
        </div>
      </div>
      {exprText && (
        <div className="px-3 py-1.5">
          <div className="truncate font-mono text-[11px] text-[var(--muted)]" title={exprText}>
            = {exprText}
          </div>
        </div>
      )}
      <Handle
        type="source"
        position={Position.Right}
        id={data.name}
        style={{ background: color, width: 10, height: 10, border: "2px solid var(--node-bg)" }}
      />
    </div>
  );
}
