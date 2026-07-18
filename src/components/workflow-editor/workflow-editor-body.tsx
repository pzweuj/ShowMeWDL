"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useProjectStore } from "@/features/project/store";
import {
  exprToString,
  parseTypeString,
  type Expr,
  type WdlType,
} from "@/features/project/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TypeBadge } from "@/components/ui/type-badge";

export function WorkflowEditorBody() {
  const project = useProjectStore((s) => s.project);
  const workflow = useMemo(
    () => project.workflows.find((w) => w.id === project.activeWorkflowId) ?? project.workflows[0],
    [project],
  );
  const updateWorkflowMeta = useProjectStore((s) => s.updateWorkflowMeta);
  const addWorkflowInput = useProjectStore((s) => s.addWorkflowInput);
  const removeWorkflowInput = useProjectStore((s) => s.removeWorkflowInput);
  const addWorkflowDecl = useProjectStore((s) => s.addWorkflowDecl);
  const removeNode = useProjectStore((s) => s.removeNode);
  const addWorkflowOutput = useProjectStore((s) => s.addWorkflowOutput);
  const removeWorkflowOutput = useProjectStore((s) => s.removeWorkflowOutput);
  const openCenterEditor = useProjectStore((s) => s.openCenterEditor);
  const issues = useProjectStore((s) => s.issues);

  if (!workflow) return <div className="text-sm text-[var(--muted)]">无 workflow</div>;

  const goToNode = (nodeId: string) => {
    if (!nodeId) return;
    openCenterEditor({ kind: "node", nodeId });
  };

  const decls = workflow.nodes.filter((n) => n.kind === "decl") as Array<{
    id: string;
    name: string;
    type: WdlType;
    expression: Expr;
  }>;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[var(--panel-border)] bg-[var(--node-header)] p-3">
        <Label htmlFor="wf-name" className="mb-1.5 block">
          Workflow 名称
        </Label>
        <Input
          id="wf-name"
          value={workflow.name}
          onChange={(e) => updateWorkflowMeta({ name: e.target.value })}
        />
        <p className="mt-2 text-[11px] text-[var(--muted)]">
          画布分节：在 WDL 中用{" "}
          <code className="rounded bg-black/5 px-1 dark:bg-white/10"># Section01 · 标题</code>{" "}
          注释划分阶段；输入始终在最左侧。
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <EditorCard
          title="输入"
          count={workflow.inputs.length}
          hint="对应画布最左侧输入节点"
        >
          <div className="space-y-1.5">
            {workflow.inputs.map((input) => (
              <Row key={input.name}>
                <button
                  type="button"
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  onClick={() =>
                    goToNode(
                      workflow.nodes.find(
                        (n) => n.kind === "workflow_input" && n.portName === input.name,
                      )?.id ?? "",
                    )
                  }
                >
                  <span className="truncate text-xs font-medium">{input.name}</span>
                  <TypeBadge type={input.type} compact />
                </button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  aria-label="删除输入"
                  onClick={() => removeWorkflowInput(input.name)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </Row>
            ))}
            <AddRow
              placeholderName="input 名"
              placeholderType="File"
              onAdd={(name, type) =>
                addWorkflowInput(name, parseTypeString(type || "String") as WdlType)
              }
            />
          </div>
        </EditorCard>

        <EditorCard title="流程变量" count={decls.length} hint="workflow 级 decl">
          <div className="space-y-1.5">
            {decls.map((decl) => (
              <Row key={decl.id}>
                <button
                  type="button"
                  className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-left"
                  onClick={() => goToNode(decl.id)}
                >
                  <div className="flex w-full items-center gap-2">
                    <span className="truncate text-xs font-medium">{decl.name}</span>
                    <TypeBadge type={decl.type} compact />
                  </div>
                  <span className="w-full truncate font-mono text-[10px] text-[var(--muted)]">
                    = {exprToString(decl.expression)}
                  </span>
                </button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  aria-label="删除变量"
                  onClick={() => removeNode(decl.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </Row>
            ))}
            <AddRow
              placeholderName="变量名"
              placeholderType="String"
              exprPlaceholder="例如 basename(fasta)"
              onDecl={(name, type, expr) =>
                addWorkflowDecl(name, parseTypeString(type || "String") as WdlType, expr)
              }
            />
          </div>
        </EditorCard>

        <EditorCard title="输出" count={workflow.outputs.length} hint="导出 workflow output">
          <div className="space-y-1.5">
            {workflow.outputs.map((out) => (
              <Row key={out.name}>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-xs font-medium">{out.name}</span>
                    <TypeBadge type={out.type} compact />
                  </div>
                  <span className="truncate font-mono text-[10px] text-[var(--muted)]">
                    = {exprToString(out.value)}
                  </span>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  aria-label="删除输出"
                  onClick={() => removeWorkflowOutput(out.name)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </Row>
            ))}
            <AddRow
              placeholderName="output 名"
              placeholderType="File"
              exprPlaceholder="例如 Markdup.markdup_bam"
              onDecl={(name, type, expr) =>
                addWorkflowOutput(name, parseTypeString(type || "File") as WdlType, expr)
              }
            />
          </div>
        </EditorCard>
      </div>

      {issues.length > 0 && (
        <div className="rounded-xl border border-[var(--danger)]/30 bg-[color-mix(in_oklab,var(--danger)_8%,transparent)] p-3">
          <div className="mb-1 text-xs font-semibold text-[var(--danger)]">
            校验问题 ({issues.length})
          </div>
          <ul className="space-y-1">
            {issues.map((iss) => (
              <li key={iss.id} className="text-xs text-[var(--danger)]">
                {iss.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function EditorCard({
  title,
  count,
  hint,
  children,
}: {
  title: string;
  count: number;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex min-h-0 flex-col rounded-xl border border-[var(--panel-border)] bg-[var(--panel)]">
      <header className="border-b border-[var(--panel-border)] px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs font-semibold">{title}</h3>
          <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-medium text-[var(--muted)] dark:bg-white/10">
            {count}
          </span>
        </div>
        {hint && <p className="mt-0.5 text-[10px] text-[var(--muted)]">{hint}</p>}
      </header>
      <div className="max-h-[280px] space-y-1.5 overflow-auto p-2">{children}</div>
    </section>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-transparent px-1.5 py-1 hover:border-[var(--panel-border)] hover:bg-[var(--node-header)]">
      {children}
    </div>
  );
}

function AddRow({
  placeholderName,
  placeholderType,
  exprPlaceholder,
  onAdd,
  onDecl,
}: {
  placeholderName: string;
  placeholderType: string;
  exprPlaceholder?: string;
  onAdd?: (name: string, type: string) => void;
  onDecl?: (name: string, type: string, expr: string) => void;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [expr, setExpr] = useState("");

  const submit = () => {
    const n = name.trim();
    if (!n) return;
    if (onDecl) onDecl(n, type.trim(), expr.trim());
    else onAdd?.(n, type.trim());
    setName("");
    setType("");
    setExpr("");
  };

  return (
    <div className="rounded-lg border border-dashed border-[var(--panel-border)] p-2">
      <div className="grid grid-cols-2 gap-1.5">
        <Input
          className="h-7 text-xs"
          placeholder={placeholderName}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        <Input
          className="h-7 font-mono text-xs"
          placeholder={placeholderType}
          value={type}
          onChange={(e) => setType(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        {exprPlaceholder && (
          <Input
            className="col-span-2 h-7 font-mono text-xs"
            placeholder={exprPlaceholder}
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        )}
      </div>
      <Button size="sm" variant="outline" className="mt-1.5 w-full" onClick={submit}>
        <Plus className="h-3.5 w-3.5" />
        添加
      </Button>
    </div>
  );
}
