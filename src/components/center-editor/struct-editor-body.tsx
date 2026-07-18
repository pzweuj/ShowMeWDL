"use client";

import { useMemo } from "react";
import { useProjectStore } from "@/features/project/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PortEditor } from "@/components/ui/port-editor";
import { TypeBadge } from "@/components/ui/type-badge";

export function StructEditorBody({ structId }: { structId: string }) {
  const project = useProjectStore((s) => s.project);
  const updateStruct = useProjectStore((s) => s.updateStruct);
  const removeStruct = useProjectStore((s) => s.removeStruct);
  const setSelection = useProjectStore((s) => s.setSelection);

  const struct = useMemo(
    () => (project.structs ?? []).find((x) => x.id === structId),
    [project.structs, structId],
  );

  if (!struct) {
    return <div className="text-sm text-[var(--muted)]">未找到 Struct</div>;
  }

  const otherStructNames = (project.structs ?? [])
    .filter((s) => s.id !== struct.id)
    .map((s) => s.name);

  return (
    <div className="mx-auto max-w-2xl space-y-3">
      <section className="rounded-xl border border-[var(--panel-border)] p-3">
        <Label htmlFor="struct-name">Struct 名称</Label>
        <Input
          id="struct-name"
          className="mt-1 font-mono"
          value={struct.name}
          onChange={(e) => updateStruct(struct.id, { name: e.target.value })}
        />
        <p className="mt-1.5 text-[11px] text-[var(--muted)]">
          导出为 <code className="rounded bg-black/5 px-1 dark:bg-white/10">struct {struct.name} {"{ ... }"}</code>
          ，可在端口类型中引用
        </p>
      </section>

      <section className="rounded-xl border border-[var(--panel-border)]">
        <header className="border-b border-[var(--panel-border)] px-3 py-2">
          <div className="text-xs font-semibold">成员字段</div>
          <p className="text-[10px] text-[var(--muted)]">
            每个成员：类型 + 名称（与 WDL struct 体一致）
          </p>
          {struct.members.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {struct.members.map((m) => (
                <TypeBadge key={m.name} type={m.type} compact />
              ))}
            </div>
          )}
        </header>
        <div className="p-2">
          <PortEditor
            ports={struct.members}
            namePlaceholder="字段名"
            extraTypes={otherStructNames}
            onChange={(members) => updateStruct(struct.id, { members })}
          />
        </div>
      </section>

      <button
        type="button"
        className="text-xs text-[var(--danger)] hover:underline"
        onClick={() => {
          removeStruct(struct.id);
          setSelection({ kind: "none" });
        }}
      >
        删除此 Struct
      </button>
    </div>
  );
}
