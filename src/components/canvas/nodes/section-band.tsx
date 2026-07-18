"use client";

import { type NodeProps } from "@xyflow/react";
import { GripHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/context";

export type SectionBandData = {
  title: string;
  order: number;
  height: number;
  width: number;
  memberIds: string[];
  [key: string]: unknown;
};

export function SectionBandView({ data, selected }: NodeProps & { data: SectionBandData }) {
  const { t } = useI18n();
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed",
        "bg-[color-mix(in_oklab,var(--accent)_6%,transparent)]",
        selected
          ? "border-[var(--accent)] shadow-[0_0_0_2px_color-mix(in_oklab,var(--accent)_25%,transparent)]"
          : "border-[var(--panel-border)]",
      )}
      style={{ width: data.width, height: data.height, minHeight: 200 }}
    >
      <div className="flex cursor-grab items-center gap-2 border-b border-dashed border-[var(--panel-border)] px-3 py-2 active:cursor-grabbing">
        <GripHorizontal className="h-3.5 w-3.5 shrink-0 text-[var(--muted)]" />
        <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-[var(--accent)] px-1.5 text-[10px] font-bold text-white">
          {String(data.order + 1).padStart(2, "0")}
        </span>
        <span className="min-w-0 flex-1 truncate text-xs font-semibold tracking-wide text-[var(--foreground)]">
          {data.title}
        </span>
        <span className="shrink-0 text-[10px] text-[var(--muted)]">
          {t("canvas.sectionNodes", { count: data.memberIds.length })}
        </span>
      </div>
    </div>
  );
}

export type InputsBandData = {
  height: number;
  width: number;
  count: number;
  memberIds: string[];
  [key: string]: unknown;
};

export function InputsBandView({ data, selected }: NodeProps & { data: InputsBandData }) {
  const { t } = useI18n();
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed bg-[color-mix(in_oklab,var(--success)_8%,transparent)]",
        selected
          ? "border-[var(--success)] shadow-[0_0_0_2px_color-mix(in_oklab,var(--success)_25%,transparent)]"
          : "border-[var(--panel-border)]",
      )}
      style={{ width: data.width, height: data.height, minHeight: 160 }}
    >
      <div className="flex cursor-grab items-center gap-2 border-b border-dashed border-[var(--panel-border)] px-3 py-2 active:cursor-grabbing">
        <GripHorizontal className="h-3.5 w-3.5 shrink-0 text-[var(--muted)]" />
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
            {t("canvas.inputs")}
          </div>
          <div className="text-xs font-semibold">{t("canvas.inputsTitle", { count: data.count })}</div>
        </div>
        <span className="shrink-0 text-[10px] text-[var(--muted)]">{t("canvas.dragGroup")}</span>
      </div>
    </div>
  );
}
