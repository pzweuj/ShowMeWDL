import {
  exprToString,
  type Expr,
  type IOPort,
  type RuntimeSpec,
  type ShowMeProject,
  type StructDef,
  type TaskDef,
  type WdlType,
  typeToString,
} from "@/features/project/types";
import type { CallNode, DeclNode, WorkflowDef } from "@/features/project/types";

function indent(level: number) {
  return "    ".repeat(level);
}

/** Indent command body so its first column aligns with `command` / `>>>`. */
function printCommandBody(command: string, level: number): string {
  const base = indent(level);
  const lines = command.replace(/\r\n/g, "\n").split("\n");
  const nonEmpty = lines.filter((l) => l.trim().length > 0);
  const minIndent = nonEmpty.length
    ? Math.min(...nonEmpty.map((l) => (l.match(/^[ \t]*/)?.[0].length ?? 0)))
    : 0;
  return lines
    .map((line) => {
      if (!line.trim()) return "";
      return base + line.slice(minIndent);
    })
    .join("\n");
}

function printType(t: WdlType) {
  return typeToString(t);
}

function printExpr(e: Expr) {
  return exprToString(e);
}

function printInputs(inputs: IOPort[], level: number) {
  if (!inputs.length) return `${indent(level)}input {\n${indent(level)}}\n`;
  const lines = inputs.map((p) => {
    const def = p.default ? ` = ${printExpr(p.default)}` : "";
    return `${indent(level + 1)}${printType(p.type)} ${p.name}${def}`;
  });
  return `${indent(level)}input {\n${lines.join("\n")}\n${indent(level)}}\n`;
}

function printRuntime(runtime: RuntimeSpec, level: number) {
  const keys = Object.keys(runtime).filter((k) => runtime[k] !== undefined && runtime[k] !== "");
  if (!keys.length) return "";
  const lines = keys.map((k) => {
    const v = runtime[k];
    if (typeof v === "number") return `${indent(level + 1)}${k}: ${v}`;
    if (typeof v === "boolean") return `${indent(level + 1)}${k}: ${v}`;
    return `${indent(level + 1)}${k}: "${v}"`;
  });
  return `${indent(level)}runtime {\n${lines.join("\n")}\n${indent(level)}}\n`;
}

function printStruct(struct: StructDef): string {
  const body = struct.members
    .map((m) => {
      const def = m.default ? ` = ${printExpr(m.default)}` : "";
      return `    ${printType(m.type)} ${m.name}${def}`;
    })
    .join("\n");
  return `struct ${struct.name} {
${body || "    # empty"}
}
`;
}

function printStructs(structs: StructDef[] | undefined): string {
  if (!structs?.length) return "";
  return structs.map(printStruct).join("\n") + "\n";
}

function printTask(task: TaskDef): string {
  const outputs = task.outputs
    .map((o) => {
      return `        ${printType(o.type)} ${o.name} = ${guessOutputExpr(task, o.name)}`;
    })
    .join("\n");

  return `task ${task.name} {
${printInputs(task.inputs, 1)}    command <<<
${printCommandBody(task.command, 1)}
    >>>

    output {
${outputs || "        # no outputs"}
    }

${printRuntime(task.runtime, 1)}}
`;
}

function guessOutputExpr(task: TaskDef, outName: string): string {
  // try to find "~{prefix}....outName" patterns in command; fallback
  const re = new RegExp(`(~\\{[^}]+\\}[^\\s]*${outName}[^\\s]*)`);
  const m = task.command.match(/(~\{prefix\}[^\s]+)/g);
  if (m) {
    const hit = m.find((x) => x.includes(outName) || outName.split("_").some((p) => x.includes(p)));
    if (hit) return `"${hit.replace(/^~/, "~")}"`.replace(/""/g, '"');
  }
  // common patterns from demo
  if (outName === "clean_read_1") return `"~{prefix}_R1.clean.fq.gz"`;
  if (outName === "clean_read_2") return `"~{prefix}_R2.clean.fq.gz"`;
  if (outName === "json_report") return `"~{prefix}.fastp_stats.json"`;
  if (outName === "out_bam") return `"~{prefix}.sorted.bam"`;
  if (outName === "out_bai") return `"~{prefix}.sorted.bam.bai"`;
  if (outName === "markdup_bam") return `"~{prefix}.markdup.bam"`;
  if (outName === "markdup_bai") return `"~{prefix}.markdup.bam.bai"`;
  if (outName === "qc_json") return `"~{prefix}.qc.json"`;
  return `"~{prefix}.${outName}"`;
}

function callAlias(node: CallNode) {
  return node.alias ?? node.id;
}

function resolveRef(
  project: ShowMeProject,
  wf: WorkflowDef,
  nodeId: string,
  port: string,
): string {
  const node = wf.nodes.find((n) => n.id === nodeId);
  if (!node) return port;
  if (node.kind === "workflow_input") return node.portName;
  if (node.kind === "call") return `${callAlias(node)}.${port}`;
  return port;
}

function printCall(
  project: ShowMeProject,
  wf: WorkflowDef,
  node: CallNode,
  taskName: string,
  level: number,
): string {
  const alias = callAlias(node);
  const header =
    alias !== taskName.split(".").pop()
      ? `${indent(level)}call ${taskName} as ${alias}`
      : `${indent(level)}call ${taskName}`;

  const inputLines: string[] = [];
  for (const edge of wf.edges.filter((e) => e.target === node.id)) {
    const ref = resolveRef(project, wf, edge.source, edge.sourceHandle);
    inputLines.push(`${indent(level + 2)}${edge.targetHandle} = ${ref}`);
  }
  for (const [port, binding] of Object.entries(node.inputBindings)) {
    if ("from" in binding) continue;
    inputLines.push(`${indent(level + 2)}${port} = ${printExpr(binding)}`);
  }

  if (!inputLines.length) {
    return `${header}\n`;
  }
  return `${header} {
${indent(level + 1)}input:
${inputLines.join(",\n")}
${indent(level)}}\n`;
}

function collectExportTasks(project: ShowMeProject): TaskDef[] {
  const tasks = [...project.tasks.filter((t) => !t.isVariant)];
  const variants: TaskDef[] = [];

  for (const wf of project.workflows) {
    for (const node of wf.nodes) {
      if (node.kind !== "call" || !node.runtimeOverride) continue;
      const base = project.tasks.find((t) => t.id === node.taskId);
      if (!base) continue;
      const override = node.runtimeOverride;
      const merged = { ...base.runtime, ...override };
      const same = Object.keys({ ...base.runtime, ...override }).every(
        (k) => base.runtime[k] === merged[k],
      );
      if (same) continue;

      const suffixParts = Object.entries(override)
        .filter(([, v]) => v !== undefined && v !== "")
        .map(([k, v]) => `${k}${String(v).replace(/[^A-Za-z0-9]/g, "")}`)
        .slice(0, 3);
      const suffix = suffixParts.join("_") || "override";
      const variantName = `${base.name}_${suffix}`;
      let variant = variants.find((v) => v.name === variantName);
      if (!variant) {
        variant = {
          ...structuredClone(base),
          id: `variant_${variantName}`,
          name: variantName,
          isVariant: true,
          baseTaskId: base.id,
          runtime: { ...base.runtime, ...override },
        };
        variants.push(variant);
      }
      // tag node with export task name via alias meta — store on node by mutating a temp map later
      (node as CallNode & { __exportTaskName?: string }).__exportTaskName = variantName;
    }
  }

  return [...tasks, ...variants];
}

export type ExportedFile = { path: string; content: string };

function printDecl(node: DeclNode, level: number): string {
  return `${indent(level)}${printType(node.type)} ${node.name} = ${printExpr(node.expression)}`;
}

/** Emit WDL-safe section marker: `# Section02` or `# Section02 · BAM` */
function printSectionComment(
  sec: { title: string; order: number },
  level: number,
): string {
  const title = sec.title.trim();
  const m = /^0*(\d+)\s*(?:[·:\-|–—]\s*(.+))?$/.exec(title);
  const num = (m?.[1] ?? String(sec.order + 1)).padStart(2, "0");
  const name = (m?.[2] ?? (!m ? title : "")).trim();
  if (name) return `${indent(level)}# Section${num} · ${name}`;
  return `${indent(level)}# Section${num}`;
}

function nodeLayoutY(wf: WorkflowDef, id: string) {
  return wf.layout[id]?.y ?? 0;
}

function nodeLayoutX(wf: WorkflowDef, id: string) {
  return wf.layout[id]?.x ?? 0;
}

function printWorkflowBody(
  project: ShowMeProject,
  wf: WorkflowDef,
  resolveTaskRef: (node: CallNode) => string,
): string {
  const bodyNodes = wf.nodes.filter(
    (n): n is CallNode | DeclNode => n.kind === "call" || n.kind === "decl",
  );

  const sections = [...(wf.sections ?? [])].sort((a, b) => a.order - b.order);
  const secById = new Map(sections.map((s) => [s.id, s]));

  // Order: known sections by order, then unsectioned; within group by layout
  const groups = new Map<string, Array<CallNode | DeclNode>>();
  const unsectioned: Array<CallNode | DeclNode> = [];
  for (const n of bodyNodes) {
    if (n.sectionId && secById.has(n.sectionId)) {
      const list = groups.get(n.sectionId) ?? [];
      list.push(n);
      groups.set(n.sectionId, list);
    } else {
      unsectioned.push(n);
    }
  }

  const sortNodes = (list: Array<CallNode | DeclNode>) =>
    [...list].sort((a, b) => {
      const dy = nodeLayoutY(wf, a.id) - nodeLayoutY(wf, b.id);
      if (dy !== 0) return dy;
      return nodeLayoutX(wf, a.id) - nodeLayoutX(wf, b.id);
    });

  const parts: string[] = [];
  const emitNode = (node: CallNode | DeclNode) => {
    if (node.kind === "decl") parts.push(printDecl(node, 1));
    else parts.push(printCall(project, wf, node, resolveTaskRef(node), 1));
  };

  // Unsectioned first (params / free nodes), no marker
  for (const n of sortNodes(unsectioned)) emitNode(n);

  for (const sec of sections) {
    const list = groups.get(sec.id);
    if (!list?.length) continue;
    if (parts.length) parts.push(""); // blank line before section
    parts.push(printSectionComment(sec, 1));
    for (const n of sortNodes(list)) emitNode(n);
  }

  // Fallback: if no sections defined but nodes have sectionId titles missing
  if (!sections.length) {
    // already emitted unsectioned (= all); nothing else
  }

  return parts.join("\n");
}

/**
 * Structured multi-file export:
 *   tasks/<group>.wdl   — one file per task group (+ variants.wdl if needed)
 *   <Workflow>.wdl      — root workflow with import lines
 *
 * Structs are written into each task module that needs types available,
 * and also into workflow file when there are no task modules.
 */
export function exportProjectToWdl(project: ShowMeProject): ExportedFile[] {
  const exportTasks = collectExportTasks(project);
  const files: ExportedFile[] = [];

  const byGroup = new Map<string, TaskDef[]>();
  for (const task of exportTasks) {
    if (task.isVariant) continue;
    const list = byGroup.get(task.groupId) ?? [];
    list.push(task);
    byGroup.set(task.groupId, list);
  }

  // Stable unique import aliases
  const usedAliases = new Set<string>();
  const groupAlias = new Map<string, string>();
  const makeAlias = (raw: string) => {
    let base = raw.replace(/[^A-Za-z0-9_]/g, "_").toUpperCase() || "TASKS";
    if (/^\d/.test(base)) base = `G_${base}`;
    let alias = base;
    let i = 2;
    while (usedAliases.has(alias)) {
      alias = `${base}_${i++}`;
    }
    usedAliases.add(alias);
    return alias;
  };

  const importLines: string[] = [];
  const structsBlock = printStructs(project.structs);

  // Groups in project order, then any orphan groupIds
  const groupIds: string[] = [
    ...project.dockerGroups.map((g) => g.id),
    ...[...byGroup.keys()].filter((id) => !project.dockerGroups.some((g) => g.id === id)),
  ];

  for (const groupId of groupIds) {
    const tasks = byGroup.get(groupId) ?? [];
    if (!tasks.length) continue;
    const group = project.dockerGroups.find((g) => g.id === groupId);
    const label = group?.label ?? tasks[0]?.name ?? groupId;
    const safe = label.replace(/[^A-Za-z0-9_-]/g, "_") || groupId;
    const fileName = `tasks/${safe}.wdl`;
    const alias = makeAlias(label);
    groupAlias.set(groupId, alias);

    const content =
      `version ${project.wdlVersion}\n\n` + structsBlock + tasks.map(printTask).join("\n");
    files.push({ path: fileName, content });
    importLines.push(`import "${fileName}" as ${alias}`);
  }

  const variants = exportTasks.filter((t) => t.isVariant);
  if (variants.length) {
    const content =
      `version ${project.wdlVersion}\n\n` + structsBlock + variants.map(printTask).join("\n");
    files.push({ path: "tasks/variants.wdl", content });
    importLines.push(`import "tasks/variants.wdl" as VARIANTS`);
  }

  // Structs-only shared file when there are structs but no task modules
  const hasTaskModules = files.some((f) => f.path.startsWith("tasks/"));
  if (!hasTaskModules && (project.structs?.length ?? 0) > 0) {
    files.push({
      path: "tasks/types.wdl",
      content: `version ${project.wdlVersion}\n\n${structsBlock}`,
    });
    importLines.push(`import "tasks/types.wdl" as TYPES`);
  }

  const workflows =
    project.workflows.length > 0
      ? project.workflows
      : [];

  for (const wf of workflows) {
    const resolveTaskRef = (node: CallNode) => {
      const tagged = (node as CallNode & { __exportTaskName?: string }).__exportTaskName;
      if (tagged) return `VARIANTS.${tagged}`;
      const task = project.tasks.find((t) => t.id === node.taskId);
      if (!task) return "UNKNOWN";
      const alias = groupAlias.get(task.groupId) ?? "TASKS";
      return `${alias}.${task.name}`;
    };

    const body = printWorkflowBody(project, wf, resolveTaskRef);
    const outputs = wf.outputs
      .map((o) => `${indent(2)}${printType(o.type)} ${o.name} = ${printExpr(o.value)}`)
      .join("\n");

    const safeWfName = wf.name.replace(/[^A-Za-z0-9_-]/g, "_") || "workflow";
    const content = `version ${project.wdlVersion}

${importLines.length ? importLines.join("\n") + "\n" : ""}
workflow ${wf.name} {
${printInputs(wf.inputs, 1)}
${body}
    output {
${outputs || "        # no outputs"}
    }
}
`;
    files.push({ path: `${safeWfName}.wdl`, content });
  }

  for (const wf of project.workflows) {
    for (const n of wf.nodes) {
      if (n.kind === "call") delete (n as CallNode & { __exportTaskName?: string }).__exportTaskName;
    }
  }

  return files;
}

export function exportSingleFileWdl(project: ShowMeProject, workflowId?: string): string {
  const wf =
    project.workflows.find((w) => w.id === workflowId) ??
    project.workflows.find((w) => w.id === project.activeWorkflowId) ??
    project.workflows[0];
  if (!wf) return `version ${project.wdlVersion}\n`;

  const exportTasks = collectExportTasks(project);
  const structsText = printStructs(project.structs);
  const tasksText = exportTasks.map(printTask).join("\n");

  const resolveTaskRef = (node: CallNode) => {
    const tagged = (node as CallNode & { __exportTaskName?: string }).__exportTaskName;
    if (tagged) return tagged;
    return project.tasks.find((t) => t.id === node.taskId)?.name ?? "Unknown";
  };

  const body = printWorkflowBody(project, wf, resolveTaskRef);

  const outputs = wf.outputs
    .map((o) => `${indent(2)}${printType(o.type)} ${o.name} = ${printExpr(o.value)}`)
    .join("\n");

  const text = `version ${project.wdlVersion}

${structsText}${tasksText}
workflow ${wf.name} {
${printInputs(wf.inputs, 1)}
${body}
    output {
${outputs || "        # no outputs"}
    }
}
`;

  for (const n of wf.nodes) {
    if (n.kind === "call") delete (n as CallNode & { __exportTaskName?: string }).__exportTaskName;
  }

  return text;
}
