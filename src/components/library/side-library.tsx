"use client";

import { useState } from "react";
import {
  Box,
  Braces,
  ChevronRight,
  Layers,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Plus,
  Trash2,
  Workflow,
} from "lucide-react";
import { useProjectStore } from "@/features/project/store";
import { Button } from "@/components/ui/button";
import { AddDockerGroupDialog } from "@/components/library/add-docker-group-dialog";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/context";

export function SideLibrary() {
  const { t } = useI18n();
  const project = useProjectStore((s) => s.project);
  const leftTab = useProjectStore((s) => s.leftTab);
  const setLeftTab = useProjectStore((s) => s.setLeftTab);
  const selection = useProjectStore((s) => s.selection);
  const setSelection = useProjectStore((s) => s.setSelection);
  const openCenterEditor = useProjectStore((s) => s.openCenterEditor);
  const addDockerGroup = useProjectStore((s) => s.addDockerGroup);
  const addTask = useProjectStore((s) => s.addTask);
  const removeTask = useProjectStore((s) => s.removeTask);
  const removeDockerGroup = useProjectStore((s) => s.removeDockerGroup);
  const addWorkflow = useProjectStore((s) => s.addWorkflow);
  const removeWorkflow = useProjectStore((s) => s.removeWorkflow);
  const setActiveWorkflow = useProjectStore((s) => s.setActiveWorkflow);
  const addStruct = useProjectStore((s) => s.addStruct);
  const removeStruct = useProjectStore((s) => s.removeStruct);
  const leftCollapsed = useProjectStore((s) => s.leftCollapsed);
  const toggleLeftCollapsed = useProjectStore((s) => s.toggleLeftCollapsed);
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const structs = project.structs ?? [];

  if (leftCollapsed) {
    return (
      <aside className="flex h-full w-10 shrink-0 flex-col items-center border-r border-[var(--panel-border)] bg-[var(--panel)] py-2">
        <Button size="icon" variant="ghost" title={t("common.expand")} onClick={toggleLeftCollapsed}>
          <PanelLeftOpen className="h-4 w-4" />
        </Button>
        <div
          className="mt-3 text-[10px] font-medium tracking-wider text-[var(--muted)]"
          style={{ writingMode: "vertical-rl" }}
        >
          {t("library.library")}
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-[var(--panel-border)] bg-[var(--panel)]">
      <AddDockerGroupDialog
        open={groupDialogOpen}
        onOpenChange={setGroupDialogOpen}
        onSubmit={(docker, label) => addDockerGroup(docker, label)}
      />
      <div className="flex items-center gap-0.5 border-b border-[var(--panel-border)] p-1">
        <button
          className={cn(
            "flex flex-1 items-center justify-center gap-0.5 rounded-md py-1.5 text-[11px] font-medium",
            leftTab === "tasks"
              ? "bg-[var(--accent)] text-white"
              : "text-[var(--muted)] hover:bg-black/5 dark:hover:bg-white/5",
          )}
          onClick={() => setLeftTab("tasks")}
        >
          <Box className="h-3.5 w-3.5" />
          {t("library.task")}
        </button>
        <button
          className={cn(
            "flex flex-1 items-center justify-center gap-0.5 rounded-md py-1.5 text-[11px] font-medium",
            leftTab === "structs"
              ? "bg-[var(--accent)] text-white"
              : "text-[var(--muted)] hover:bg-black/5 dark:hover:bg-white/5",
          )}
          onClick={() => setLeftTab("structs")}
        >
          <Braces className="h-3.5 w-3.5" />
          {t("library.struct")}
        </button>
        <button
          className={cn(
            "flex flex-1 items-center justify-center gap-0.5 rounded-md py-1.5 text-[11px] font-medium",
            leftTab === "workflows"
              ? "bg-[var(--accent)] text-white"
              : "text-[var(--muted)] hover:bg-black/5 dark:hover:bg-white/5",
          )}
          onClick={() => setLeftTab("workflows")}
        >
          <Workflow className="h-3.5 w-3.5" />
          {t("library.wf")}
        </button>
        <Button size="icon" variant="ghost" title={t("common.collapse")} onClick={toggleLeftCollapsed}>
          <PanelLeftClose className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-2">
        {leftTab === "tasks" ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 px-1">
              <span className="text-xs text-[var(--muted)]">
                {t("library.groups", { count: project.dockerGroups.length })}
              </span>
              <Button size="sm" variant="ghost" onClick={() => setGroupDialogOpen(true)}>
                <Plus className="h-3.5 w-3.5" />
                {t("library.group")}
              </Button>
            </div>
            {project.dockerGroups.map((group) => (
              <div key={group.id} className="rounded-lg border border-[var(--panel-border)]">
                <div className="flex items-center gap-1 border-b border-[var(--panel-border)] bg-black/[0.02] px-2 py-1.5 dark:bg-white/[0.02]">
                  <Layers className="h-3.5 w-3.5 text-[var(--muted)]" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-semibold">{group.label}</div>
                    {group.docker ? (
                      <div className="truncate text-[10px] text-[var(--muted)]" title={group.docker}>
                        {group.docker}
                      </div>
                    ) : (
                      <div className="text-[10px] text-[var(--muted)]">{t("library.noDefaultImage")}</div>
                    )}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    title={t("library.addTask")}
                    onClick={() => addTask(group.id)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    title={t("library.deleteGroup")}
                    onClick={() => removeDockerGroup(group.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="p-1">
                  {project.tasks
                    .filter((tk) => tk.groupId === group.id)
                    .map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("application/showme-task", task.id);
                          e.dataTransfer.effectAllowed = "move";
                        }}
                        onClick={() => {
                          setSelection({ kind: "task", taskId: task.id });
                          openCenterEditor({ kind: "task", taskId: task.id });
                        }}
                        className={cn(
                          "group flex cursor-grab items-center gap-1 rounded-md px-2 py-1.5 text-sm active:cursor-grabbing",
                          selection.kind === "task" && selection.taskId === task.id
                            ? "bg-[var(--accent)]/15 text-[var(--accent)]"
                            : "hover:bg-black/5 dark:hover:bg-white/5",
                        )}
                      >
                        <ChevronRight className="h-3 w-3 opacity-40" />
                        <span className="flex-1 truncate">{task.name}</span>
                        <button
                          className="hidden rounded p-0.5 text-[var(--muted)] hover:text-[var(--accent)] group-hover:block"
                          title={t("common.edit")}
                          onClick={(e) => {
                            e.stopPropagation();
                            openCenterEditor({ kind: "task", taskId: task.id });
                          }}
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          className="hidden rounded p-0.5 text-[var(--muted)] hover:text-[var(--danger)] group-hover:block"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeTask(task.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  {!project.tasks.some((tk) => tk.groupId === group.id) && (
                    <div className="px-2 py-2 text-[11px] text-[var(--muted)]">
                      {t("library.noTask")}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {!project.dockerGroups.length && (
              <div className="rounded-lg border border-dashed border-[var(--panel-border)] p-4 text-center text-xs text-[var(--muted)]">
                {t("library.createGroupHint")}
                <div className="mt-2">
                  <Button size="sm" variant="outline" onClick={() => setGroupDialogOpen(true)}>
                    <Plus className="h-3.5 w-3.5" />
                    {t("library.newGroup")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : leftTab === "structs" ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 px-1">
              <span className="text-xs text-[var(--muted)]">
                {t("library.structCount", { count: structs.length })}
              </span>
              <Button size="sm" variant="ghost" onClick={() => addStruct()}>
                <Plus className="h-3.5 w-3.5" />
                {t("common.new")}
              </Button>
            </div>
            {structs.map((st) => (
              <div
                key={st.id}
                className={cn(
                  "group flex cursor-pointer items-center gap-2 rounded-md border px-2 py-2 text-sm",
                  selection.kind === "struct" && selection.structId === st.id
                    ? "border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent)]"
                    : "border-transparent hover:bg-black/5 dark:hover:bg-white/5",
                )}
                onClick={() => openCenterEditor({ kind: "struct", structId: st.id })}
              >
                <Braces className="h-4 w-4 shrink-0 opacity-70" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-mono font-medium">{st.name}</div>
                  <div className="truncate text-[10px] opacity-70">
                    {t("library.fields", { count: st.members.length })}
                  </div>
                </div>
                <button
                  className="rounded p-0.5 text-[var(--muted)] opacity-0 hover:text-[var(--danger)] group-hover:opacity-100"
                  title={t("common.delete")}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeStruct(st.id);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            {!structs.length && (
              <div className="rounded-lg border border-dashed border-[var(--panel-border)] p-4 text-center text-xs text-[var(--muted)]">
                {t("library.structEmpty")}
                <div className="mt-2">
                  <Button size="sm" variant="outline" onClick={() => addStruct()}>
                    <Plus className="h-3.5 w-3.5" />
                    {t("library.newStruct")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 px-1">
              <span className="text-xs text-[var(--muted)]">
                {t("library.workflows", { count: project.workflows.length })}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  addWorkflow();
                  openCenterEditor({ kind: "workflow" });
                }}
              >
                <Plus className="h-3.5 w-3.5" />
                {t("common.new")}
              </Button>
            </div>
            {project.workflows.map((wf) => (
              <div
                key={wf.id}
                className={cn(
                  "group flex cursor-pointer items-center gap-2 rounded-md border px-2 py-2 text-sm",
                  project.activeWorkflowId === wf.id
                    ? "border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent)]"
                    : "border-transparent hover:bg-black/5 dark:hover:bg-white/5",
                )}
                onClick={() => setActiveWorkflow(wf.id)}
                onDoubleClick={() => {
                  setActiveWorkflow(wf.id);
                  openCenterEditor({ kind: "workflow" });
                }}
              >
                <Workflow className="h-4 w-4 shrink-0 opacity-70" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{wf.name}</div>
                  <div className="truncate text-[10px] opacity-70">
                    {wf.nodes.filter((n) => n.kind === "call").length} call · {wf.inputs.length} in ·{" "}
                    {wf.outputs.length} out
                  </div>
                </div>
                <button
                  className="rounded p-0.5 text-[var(--muted)] opacity-0 hover:text-[var(--accent)] group-hover:opacity-100"
                  title={t("common.edit")}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveWorkflow(wf.id);
                    openCenterEditor({ kind: "workflow" });
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                {project.workflows.length > 1 && (
                  <button
                    className="rounded p-0.5 text-[var(--muted)] opacity-0 hover:text-[var(--danger)] group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeWorkflow(wf.id);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="border-t border-[var(--panel-border)] p-2 text-[10px] leading-relaxed text-[var(--muted)]">
        {t("library.footer")}
      </div>
    </aside>
  );
}
