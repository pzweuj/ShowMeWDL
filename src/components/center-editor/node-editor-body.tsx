"use client";

import { useProjectStore } from "@/features/project/store";
import { exprToString, parseTypeString, typeToString } from "@/features/project/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RuntimeFields,
  mergeRuntime,
  runtimeDiff,
} from "@/components/ui/runtime-fields";
import { TypeBadge } from "@/components/ui/type-badge";

export function NodeEditorBody({ nodeId }: { nodeId: string }) {
  const project = useProjectStore((s) => s.project);
  const updateCall = useProjectStore((s) => s.updateCall);
  const setCallBindingExpr = useProjectStore((s) => s.setCallBindingExpr);
  const setCallRuntimeOverride = useProjectStore((s) => s.setCallRuntimeOverride);
  const updateWorkflowDecl = useProjectStore((s) => s.updateWorkflowDecl);
  const updateWorkflowInput = useProjectStore((s) => s.updateWorkflowInput);
  const removeWorkflowInput = useProjectStore((s) => s.removeWorkflowInput);
  const removeNode = useProjectStore((s) => s.removeNode);
  const openCenterEditor = useProjectStore((s) => s.openCenterEditor);

  const workflow =
    project.workflows.find((w) => w.id === project.activeWorkflowId) ?? project.workflows[0];
  const node = workflow?.nodes.find((n) => n.id === nodeId);

  if (!workflow || !node) {
    return <div className="text-sm text-[var(--muted)]">未找到节点</div>;
  }

  if (node.kind === "workflow_input") {
    const input = workflow.inputs.find((i) => i.name === node.portName);
    return (
      <div className="mx-auto grid max-w-xl gap-3">
        <Card title="Workflow 输入" subtitle="修改会同步到画布节点与连线端口">
          <div className="mb-3">
            {input && <TypeBadge type={input.type} />}
          </div>
          <Field label="名称">
            <Input
              value={node.portName}
              onChange={(e) => updateWorkflowInput(node.portName, { name: e.target.value })}
            />
          </Field>
          <Field label="类型">
            <Input
              className="font-mono"
              value={input ? typeToString(input.type) : "String"}
              onChange={(e) =>
                updateWorkflowInput(node.portName, { type: parseTypeString(e.target.value) })
              }
            />
          </Field>
        </Card>
        <Button size="sm" variant="danger" onClick={() => removeWorkflowInput(node.portName)}>
          删除此输入
        </Button>
      </div>
    );
  }

  if (node.kind === "decl") {
    return (
      <div className="mx-auto grid max-w-xl gap-3">
        <Card title="流程变量 (decl)" subtitle="可被下游 call 引用">
          <div className="mb-3">
            <TypeBadge type={node.type} />
          </div>
          <Field label="名称">
            <Input
              value={node.name}
              onChange={(e) => updateWorkflowDecl(node.id, { name: e.target.value })}
            />
          </Field>
          <Field label="类型">
            <Input
              className="font-mono"
              value={typeToString(node.type)}
              onChange={(e) =>
                updateWorkflowDecl(node.id, { type: parseTypeString(e.target.value) })
              }
            />
          </Field>
          <Field label="表达式">
            <Input
              className="font-mono"
              value={exprToString(node.expression)}
              placeholder="basename(fasta) 或 Markdup.markdup_bam"
              onChange={(e) =>
                updateWorkflowDecl(node.id, {
                  expression: { kind: "raw", text: e.target.value },
                })
              }
            />
          </Field>
        </Card>
        <Button size="sm" variant="danger" onClick={() => removeNode(node.id)}>
          删除此变量
        </Button>
      </div>
    );
  }

  if (node.kind === "call") {
    const task = project.tasks.find((t) => t.id === node.taskId);
    const override = node.runtimeOverride ?? {};
    return (
      <div className="grid gap-3 lg:grid-cols-[280px_1fr_280px]">
        <Card title="Call" subtitle={task ? `Task · ${task.name}` : "未绑定 Task"}>
          <Field label="别名 (as)">
            <Input
              value={node.alias ?? ""}
              onChange={(e) => updateCall(node.id, { alias: e.target.value })}
            />
          </Field>
          {task && (
            <Button
              size="sm"
              variant="outline"
              className="mt-3 w-full"
              onClick={() => openCenterEditor({ kind: "task", taskId: task.id })}
            >
              编辑 Task 定义
            </Button>
          )}
          <Button
            size="sm"
            variant="danger"
            className="mt-2 w-full"
            onClick={() => removeNode(node.id)}
          >
            删除此节点
          </Button>
        </Card>

        <Card
          title="输入绑定"
          subtitle="已连线端口不可手写；未连线可填字面量或表达式"
        >
          <div className="space-y-2">
            {(task?.inputs ?? []).map((input) => {
              const edge = workflow.edges.find(
                (e) => e.target === node.id && e.targetHandle === input.name,
              );
              const binding = node.inputBindings[input.name];
              const value = edge
                ? `← ${edge.sourceHandle}`
                : binding && !("from" in binding)
                  ? exprToString(binding)
                  : "";
              return (
                <div
                  key={input.name}
                  className="rounded-lg border border-[var(--panel-border)] bg-[var(--node-header)] p-2"
                >
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="truncate text-xs font-medium">{input.name}</span>
                      <TypeBadge type={input.type} compact />
                    </div>
                    {edge ? (
                      <span className="shrink-0 text-[10px] font-medium text-[var(--success)]">
                        已连线
                      </span>
                    ) : (
                      <span className="shrink-0 text-[10px] text-[var(--muted)]">表达式</span>
                    )}
                  </div>
                  <Input
                    className="h-8 font-mono text-xs"
                    disabled={Boolean(edge)}
                    value={value}
                    placeholder="字面量或表达式"
                    onChange={(e) => setCallBindingExpr(node.id, input.name, e.target.value)}
                  />
                </div>
              );
            })}
            {!task?.inputs?.length && (
              <div className="text-xs text-[var(--muted)]">该 Task 没有输入端口</div>
            )}
          </div>
        </Card>

        <Card title="Runtime 覆盖" subtitle="差异会导出为 task 变体">
          <RuntimeFields
            runtime={mergeRuntime(task?.runtime ?? {}, override)}
            onChange={(runtime) => {
              setCallRuntimeOverride(node.id, runtimeDiff(task?.runtime ?? {}, runtime));
            }}
          />
          {node.runtimeOverride && (
            <Button
              size="sm"
              variant="ghost"
              className="mt-2 w-full"
              onClick={() => setCallRuntimeOverride(node.id, undefined)}
            >
              清除覆盖
            </Button>
          )}
        </Card>
      </div>
    );
  }

  return <div className="text-sm text-[var(--muted)]">暂不支持编辑此节点类型</div>;
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel)]">
      <header className="border-b border-[var(--panel-border)] px-3 py-2">
        <h3 className="text-xs font-semibold">{title}</h3>
        {subtitle && <p className="mt-0.5 text-[10px] text-[var(--muted)]">{subtitle}</p>}
      </header>
      <div className="space-y-2 p-3">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
