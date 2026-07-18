"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, GripHorizontal, X } from "lucide-react";
import { useProjectStore } from "@/features/project/store";
import { Button } from "@/components/ui/button";
import { WorkflowEditorBody } from "@/components/workflow-editor/workflow-editor-body";
import { NodeEditorBody } from "@/components/center-editor/node-editor-body";
import { TaskEditorBody } from "@/components/center-editor/task-editor-body";
import { StructEditorBody } from "@/components/center-editor/struct-editor-body";
import { TypeLegend } from "@/components/ui/type-badge";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/context";

const MIN_H = 200;
const MAX_H = 620;
const DEFAULT_H = 360;

export function BottomEditor() {
  const { t } = useI18n();
  const centerEditor = useProjectStore((s) => s.centerEditor);
  const closeCenterEditor = useProjectStore((s) => s.closeCenterEditor);
  const project = useProjectStore((s) => s.project);
  const [height, setHeight] = useState(DEFAULT_H);
  const dragRef = useRef<{ startY: number; startH: number } | null>(null);

  useEffect(() => {
    if (!centerEditor) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCenterEditor();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [centerEditor, closeCenterEditor]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      dragRef.current = { startY: e.clientY, startH: height };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [height],
  );

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const delta = dragRef.current.startY - e.clientY;
    setHeight(Math.min(MAX_H, Math.max(MIN_H, dragRef.current.startH + delta)));
  }, []);

  const onPointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  if (!centerEditor) return null;

  const workflow =
    project.workflows.find((w) => w.id === project.activeWorkflowId) ?? project.workflows[0];

  let kindLabel = t("editor.kindEdit");
  let title = t("editor.kindEdit");
  let hint = t("editor.liveEdit");
  if (centerEditor.kind === "workflow") {
    kindLabel = t("editor.kindWorkflow");
    title = workflow?.name ?? t("editor.kindWorkflow");
    hint = t("editor.hintWorkflow");
  } else if (centerEditor.kind === "node") {
    const node = workflow?.nodes.find((n) => n.id === centerEditor.nodeId);
    if (node?.kind === "call") {
      kindLabel = t("editor.kindCall");
      title = node.alias ?? node.id;
      hint = t("editor.hintCall");
    } else if (node?.kind === "decl") {
      kindLabel = t("editor.kindVar");
      title = node.name;
      hint = t("editor.hintVar");
    } else if (node?.kind === "workflow_input") {
      kindLabel = t("editor.kindInput");
      title = node.portName;
      hint = t("editor.hintInput");
    } else {
      kindLabel = t("editor.kindNode");
      title = t("editor.kindNode");
    }
  } else if (centerEditor.kind === "task") {
    const task = project.tasks.find((tk) => tk.id === centerEditor.taskId);
    kindLabel = t("editor.kindTask");
    title = task?.name ?? t("editor.kindTask");
    hint = t("editor.hintTask");
  } else if (centerEditor.kind === "struct") {
    const st = (project.structs ?? []).find((s) => s.id === centerEditor.structId);
    kindLabel = t("editor.kindStruct");
    title = st?.name ?? t("editor.kindStruct");
    hint = t("editor.hintStruct");
  }

  return (
    <div
      className="flex shrink-0 flex-col border-t border-[var(--panel-border)] bg-[var(--panel)] shadow-[0_-10px_30px_rgba(0,0,0,0.08)]"
      style={{ height }}
    >
      <div
        className="flex h-2.5 cursor-ns-resize items-center justify-center bg-[var(--node-header)] hover:bg-black/5 dark:hover:bg-white/5"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        title={t("editor.resize")}
      >
        <GripHorizontal className="h-3.5 w-3.5 text-[var(--muted)]" />
      </div>

      <div className="flex items-center gap-3 border-b border-[var(--panel-border)] px-3 py-2">
        <span
          className={cn(
            "shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
            "bg-[var(--accent)]/15 text-[var(--accent)]",
          )}
        >
          {kindLabel}
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{title}</div>
          <div className="truncate text-[11px] text-[var(--muted)]">{hint}</div>
        </div>
        <TypeLegend className="hidden max-w-[42%] justify-end opacity-90 xl:flex" />
        <Button size="icon" variant="ghost" onClick={closeCenterEditor} aria-label={t("common.collapse")}>
          <ChevronDown className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={closeCenterEditor} aria-label={t("common.close")}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-3 py-3">
        {centerEditor.kind === "workflow" && <WorkflowEditorBody />}
        {centerEditor.kind === "node" && <NodeEditorBody nodeId={centerEditor.nodeId} />}
        {centerEditor.kind === "task" && <TaskEditorBody taskId={centerEditor.taskId} />}
        {centerEditor.kind === "struct" && <StructEditorBody structId={centerEditor.structId} />}
      </div>
    </div>
  );
}

/** @deprecated use BottomEditor */
export const CenterEditor = BottomEditor;
