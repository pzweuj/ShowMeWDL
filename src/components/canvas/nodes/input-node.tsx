"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { typeColor, type WdlType } from "@/features/project/types";
import { cn } from "@/lib/utils";
import { TypeBadge } from "@/components/ui/type-badge";
import { useI18n } from "@/i18n/context";

export type InputNodeData = {
  label: string;
  type: WdlType;
  edgeLinked?: boolean;
  edgeRole?: "source" | "target";
  [key: string]: unknown;
};

export function InputNodeView({ data, selected }: NodeProps & { data: InputNodeData }) {
  const { t } = useI18n();
  const color = typeColor(data.type);
  const linked = Boolean(data.edgeLinked);
  return (
    <div
      className={cn(
        "min-w-[140px] rounded-lg border bg-[var(--node-bg)] px-3 py-2 shadow transition-shadow",
        linked
          ? "border-amber-500 shadow-[0_0_0_3px_rgba(245,158,11,0.35)]"
          : selected
            ? "border-[var(--accent)] shadow-[0_0_0_3px_color-mix(in_oklab,var(--accent)_28%,transparent)]"
            : "border-[var(--node-border)] hover:border-[color-mix(in_oklab,var(--accent)_45%,var(--node-border))]",
      )}
      title={t("canvas.editBottom")}
    >
      <div className="flex items-center justify-between gap-1">
        <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">
          {t("canvas.workflowInput")}
        </div>
        {linked && (
          <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400">
            {data.edgeRole === "source" ? t("canvas.upstream") : t("canvas.downstream")}
          </span>
        )}
      </div>
      <div className="text-sm font-medium">{data.label}</div>
      <div className="mt-1">
        <TypeBadge type={data.type} compact />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id={data.label}
        style={{ background: color, width: 10, height: 10, border: "2px solid var(--node-bg)" }}
      />
    </div>
  );
}
