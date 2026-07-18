"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { typeColor, typeToString, type TaskDef, type WdlType } from "@/features/project/types";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/context";

export type CallNodeData = {
  label: string;
  taskName: string;
  task?: TaskDef;
  hasOverride?: boolean;
  selected?: boolean;
  /** Highlighted as endpoint of the selected edge */
  edgeLinked?: boolean;
  edgeRole?: "source" | "target";
  [key: string]: unknown;
};

function PortRow({
  name,
  type,
  side,
}: {
  name: string;
  type: WdlType;
  side: "left" | "right";
}) {
  const color = typeColor(type);
  return (
    <div
      className={cn(
        "relative flex items-center gap-2 px-3 py-1 text-xs",
        side === "right" && "justify-end",
      )}
    >
      {side === "left" && (
        <Handle
          type="target"
          position={Position.Left}
          id={name}
          style={{ background: color, width: 10, height: 10, border: "2px solid var(--node-bg)" }}
        />
      )}
      <span className="flex min-w-0 max-w-[120px] items-center gap-1" title={typeToString(type)}>
        <span className="truncate text-[var(--muted)]">{name}</span>
      </span>
      {side === "right" && (
        <Handle
          type="source"
          position={Position.Right}
          id={name}
          style={{ background: color, width: 10, height: 10, border: "2px solid var(--node-bg)" }}
        />
      )}
    </div>
  );
}

export function CallNodeView({ data, selected }: NodeProps & { data: CallNodeData }) {
  const { t } = useI18n();
  const inputs = data.task?.inputs ?? [];
  const outputs = data.task?.outputs ?? [];
  const rows = Math.max(inputs.length, outputs.length, 1);
  const linked = Boolean(data.edgeLinked);

  return (
    <div
      className={cn(
        "min-w-[220px] rounded-xl border bg-[var(--node-bg)] shadow-lg shadow-black/10 transition-shadow",
        linked
          ? "border-amber-500 shadow-[0_0_0_3px_rgba(245,158,11,0.35)]"
          : selected
            ? "border-[var(--accent)] shadow-[0_0_0_3px_color-mix(in_oklab,var(--accent)_28%,transparent)]"
            : "border-[var(--node-border)] hover:border-[color-mix(in_oklab,var(--accent)_45%,var(--node-border))]",
      )}
      title={t("canvas.editBottom")}
    >
      <div className="flex items-center justify-between gap-2 rounded-t-xl border-b border-[var(--node-border)] bg-[var(--node-header)] px-3 py-2">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{data.label}</div>
          <div className="truncate text-[10px] text-[var(--muted)]">{data.taskName}</div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {linked && (
            <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
              {data.edgeRole === "source"
                ? t("canvas.upstream")
                : data.edgeRole === "target"
                  ? t("canvas.downstream")
                  : t("canvas.linked")}
            </span>
          )}
          {data.hasOverride && (
            <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-500">
              {t("canvas.runtime")}
            </span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 py-1">
        <div>
          {Array.from({ length: rows }).map((_, i) => {
            const input = inputs[i];
            if (!input) return <div key={`i-${i}`} className="h-7" />;
            return <PortRow key={input.name} name={input.name} type={input.type} side="left" />;
          })}
        </div>
        <div>
          {Array.from({ length: rows }).map((_, i) => {
            const output = outputs[i];
            if (!output) return <div key={`o-${i}`} className="h-7" />;
            return <PortRow key={output.name} name={output.name} type={output.type} side="right" />;
          })}
        </div>
      </div>
    </div>
  );
}
