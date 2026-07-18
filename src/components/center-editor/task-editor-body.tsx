"use client";

import { useMemo } from "react";
import { useProjectStore } from "@/features/project/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CodeEditor } from "@/components/ui/code-editor";
import { PortEditor } from "@/components/ui/port-editor";
import { RuntimeFields } from "@/components/ui/runtime-fields";
import { TypeLegend } from "@/components/ui/type-badge";

export function TaskEditorBody({ taskId }: { taskId: string }) {
  const project = useProjectStore((s) => s.project);
  const updateTask = useProjectStore((s) => s.updateTask);

  const task = useMemo(
    () => project.tasks.find((t) => t.id === taskId),
    [project.tasks, taskId],
  );
  const group = useMemo(
    () => project.dockerGroups.find((g) => g.id === task?.groupId),
    [project.dockerGroups, task?.groupId],
  );
  const structNames = useMemo(
    () => (project.structs ?? []).map((s) => s.name),
    [project.structs],
  );

  if (!task) {
    return <div className="text-sm text-[var(--muted)]">未找到 Task</div>;
  }

  return (
    <div className="grid gap-3 xl:grid-cols-[1fr_1.15fr]">
      <div className="space-y-3">
        <section className="rounded-xl border border-[var(--panel-border)] p-3">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-xs font-semibold">基本信息</div>
              {group && (
                <p className="text-[10px] text-[var(--muted)]">
                  分组 {group.label}
                  {group.docker ? ` · ${group.docker}` : " · 无默认镜像"}
                </p>
              )}
            </div>
            <TypeLegend className="hidden sm:flex" />
          </div>
          <Label htmlFor="task-name">Task 名称</Label>
          <Input
            id="task-name"
            className="mt-1"
            value={task.name}
            onChange={(e) => updateTask(task.id, { name: e.target.value })}
          />
        </section>

        <div className="grid gap-3 sm:grid-cols-2">
          <section className="rounded-xl border border-[var(--panel-border)]">
            <header className="border-b border-[var(--panel-border)] px-3 py-2">
              <div className="text-xs font-semibold">输入 (input)</div>
              <p className="text-[10px] text-[var(--muted)]">类型色与画布端口一致</p>
            </header>
            <div className="max-h-[260px] overflow-auto p-2">
              <PortEditor
                ports={task.inputs}
                extraTypes={structNames}
                onChange={(inputs) => updateTask(task.id, { inputs })}
              />
            </div>
          </section>
          <section className="rounded-xl border border-[var(--panel-border)]">
            <header className="border-b border-[var(--panel-border)] px-3 py-2">
              <div className="text-xs font-semibold">输出 (output)</div>
              <p className="text-[10px] text-[var(--muted)]">导出时用于 output 块</p>
            </header>
            <div className="max-h-[260px] overflow-auto p-2">
              <PortEditor
                ports={task.outputs}
                extraTypes={structNames}
                onChange={(outputs) => updateTask(task.id, { outputs })}
              />
            </div>
          </section>
        </div>

        <section className="rounded-xl border border-[var(--panel-border)]">
          <header className="border-b border-[var(--panel-border)] px-3 py-2">
            <div className="text-xs font-semibold">Runtime</div>
            <p className="text-[10px] text-[var(--muted)]">任意键值，如 docker / cpu / memory</p>
          </header>
          <div className="p-3">
            <RuntimeFields
              runtime={task.runtime}
              onChange={(runtime) => updateTask(task.id, { runtime })}
            />
          </div>
        </section>
      </div>

      <section className="flex min-h-0 flex-col rounded-xl border border-[var(--panel-border)]">
        <header className="border-b border-[var(--panel-border)] px-3 py-2">
          <div className="text-xs font-semibold">Command</div>
          <p className="text-[10px] text-[var(--muted)]">bash · 使用 ~{"{var}"} 插值</p>
        </header>
        <div className="min-h-0 flex-1 p-2">
          <CodeEditor
            language="shell"
            minHeight={280}
            value={task.command}
            placeholder="# 在此编写 shell 命令"
            onChange={(value) => updateTask(task.id, { command: value })}
          />
        </div>
      </section>
    </div>
  );
}
