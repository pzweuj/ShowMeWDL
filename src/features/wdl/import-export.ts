import { uid } from "@/lib/utils";
import type {
  CallNode,
  DeclNode,
  GraphEdge,
  ShowMeProject,
  StructDef,
  TaskDef,
  WorkflowDef,
  WorkflowInputNode,
  WorkflowSection,
} from "@/features/project/types";
import { parseWdl } from "./parser";
import { exportProjectToWdl, exportSingleFileWdl, type ExportedFile } from "./printer";

const SECTION_COL_W = 340;
const INPUT_COL_X = 40;
const SECTION_START_X = 280;
const ROW_H = 150;
const TOP_Y = 100;

export { exportProjectToWdl, exportSingleFileWdl };
export type { ExportedFile };

export function projectToShowMeJson(project: ShowMeProject): string {
  return JSON.stringify(project, null, 2);
}

export function projectFromShowMeJson(text: string): ShowMeProject {
  if (text.length > 8 * 1024 * 1024) throw new Error("工程文件过大（上限 8MB）");
  const data = JSON.parse(text) as ShowMeProject;
  if (!data || typeof data !== "object") throw new Error("无效的工程文件");
  if (data.version !== 1) throw new Error("不支持的工程版本");
  if (!Array.isArray(data.workflows) || !Array.isArray(data.tasks)) {
    throw new Error("工程缺少 workflows / tasks");
  }
  if (!data.activeWorkflowId && data.workflows[0]) {
    data.activeWorkflowId = data.workflows[0].id;
  }
  return data;
}

/** Import one or more WDL sources into a ShowMe project */
export function importWdlFiles(
  files: Array<{ path: string; content: string }>,
  projectName = "导入的工程",
): ShowMeProject {
  const docs = files.map((f) => ({
    path: f.path,
    doc: parseWdl(f.content),
  }));

  const tasks: TaskDef[] = [];
  const structs: StructDef[] = [];
  const structNames = new Set<string>();
  const groupMap = new Map<
    string,
    { id: string; docker?: string; label: string; taskIds: string[] }
  >();

  for (const { path, doc } of docs) {
    for (const s of doc.structs) {
      if (structNames.has(s.name)) continue;
      structNames.add(s.name);
      structs.push({
        id: uid("struct"),
        name: s.name,
        members: s.members,
      });
    }
    for (const t of doc.tasks) {
      const dockerRaw = t.runtime.docker != null && t.runtime.docker !== "" ? String(t.runtime.docker) : "";
      const groupKey = dockerRaw || "__no_docker__";
      let group = groupMap.get(groupKey);
      if (!group) {
        group = {
          id: uid("grp"),
          docker: dockerRaw || undefined,
          label: dockerRaw
            ? dockerRaw.split("/").pop()?.split(":")[0] ?? "tasks"
            : "未分组",
          taskIds: [],
        };
        groupMap.set(groupKey, group);
      }
      const id = uid("task");
      const task: TaskDef = {
        id,
        name: t.name,
        groupId: group.id,
        inputs: t.inputs,
        outputs: t.outputs.map(({ expression: _e, ...port }) => port),
        command: t.command,
        runtime: t.runtime,
        meta: t.meta,
      };
      tasks.push(task);
      group.taskIds.push(id);
      void path;
    }
  }

  const taskByName = new Map(tasks.map((t) => [t.name, t]));
  // also map Alias.Name from imports — simplified: use bare task name
  const workflows: WorkflowDef[] = [];

  for (const { doc } of docs) {
    for (const w of doc.workflows) {
      const wfId = uid("wf");
      const nodes: WorkflowDef["nodes"] = [];
      const edges: GraphEdge[] = [];
      const layout: WorkflowDef["layout"] = {};

      // workflow inputs as nodes
      w.inputs.forEach((input, idx) => {
        const id = uid("win");
        const n: WorkflowInputNode = { kind: "workflow_input", id, portName: input.name };
        nodes.push(n);
        layout[id] = { x: 40, y: 40 + idx * 100 };
      });

      const callAliasToId = new Map<string, string>();
      const declNameToId = new Map<string, string>();
      const sectionOrder: string[] = [];
      const sectionTitles = new Map<string, string>();
      const sectionRows = new Map<string, number>();

      const ensureSection = (raw?: string) => {
        const key = raw?.trim() || "00 · Main";
        if (!sectionTitles.has(key)) {
          sectionTitles.set(key, key);
          sectionOrder.push(key);
          sectionRows.set(key, 0);
        }
        return key;
      };

      const placeInSection = (sectionKey: string) => {
        const order = sectionOrder.indexOf(sectionKey);
        const row = sectionRows.get(sectionKey) ?? 0;
        sectionRows.set(sectionKey, row + 1);
        return {
          x: SECTION_START_X + order * SECTION_COL_W,
          y: TOP_Y + row * ROW_H,
        };
      };

      const placeCall = (
        taskName: string,
        alias: string | undefined,
        inputs: Record<string, import("@/features/project/types").Expr>,
        section?: string,
      ) => {
        const bare = taskName.includes(".") ? taskName.split(".").pop()! : taskName;
        const task = taskByName.get(bare);
        const id = uid("call");
        const sectionId = ensureSection(section);
        const node: CallNode = {
          kind: "call",
          id,
          taskId: task?.id ?? "",
          alias: alias ?? bare,
          inputBindings: {},
          sectionId,
        };
        for (const [port, expr] of Object.entries(inputs)) {
          node.inputBindings[port] = expr;
        }
        nodes.push(node);
        layout[id] = placeInSection(sectionId);
        callAliasToId.set(node.alias ?? bare, id);
        return node;
      };

      const placeDecl = (
        name: string,
        type: import("@/features/project/types").WdlType,
        expression: import("@/features/project/types").Expr,
        section?: string,
      ) => {
        const id = uid("decl");
        const sectionId = ensureSection(section);
        const node: DeclNode = { kind: "decl", id, name, type, expression, sectionId };
        nodes.push(node);
        layout[id] = placeInSection(sectionId);
        declNameToId.set(name, id);
        return node;
      };

      for (const el of w.body) {
        if (el.kind === "call") {
          placeCall(el.taskName, el.alias, el.inputs, el.section);
        } else if (el.kind === "decl") {
          placeDecl(el.name, el.type, el.expression ?? { kind: "raw", text: "" }, el.section);
        } else if (el.kind === "scatter") {
          for (const child of el.body) {
            if (child.kind === "call")
              placeCall(child.taskName, child.alias, child.inputs, child.section ?? el.section);
            else if (child.kind === "decl")
              placeDecl(
                child.name,
                child.type,
                child.expression ?? { kind: "raw", text: "" },
                child.section ?? el.section,
              );
          }
        } else if (el.kind === "if") {
          for (const child of el.body) {
            if (child.kind === "call")
              placeCall(child.taskName, child.alias, child.inputs, child.section ?? el.section);
            else if (child.kind === "decl")
              placeDecl(
                child.name,
                child.type,
                child.expression ?? { kind: "raw", text: "" },
                child.section ?? el.section,
              );
          }
        }
      }

      // stack workflow inputs on the far left
      w.inputs.forEach((input, idx) => {
        const win = nodes.find((n) => n.kind === "workflow_input" && n.portName === input.name);
        if (win) layout[win.id] = { x: INPUT_COL_X, y: 40 + idx * 90 };
      });

      const sections: WorkflowSection[] = sectionOrder.map((title, order) => ({
        id: `sec_${order}_${title.replace(/[^A-Za-z0-9]+/g, "_").slice(0, 24)}`,
        title,
        order,
      }));
      // map sectionId on nodes to stable ids
      const titleToSecId = new Map(sections.map((s) => [s.title, s.id]));
      for (const n of nodes) {
        if (n.kind === "call" || n.kind === "decl") {
          if (n.sectionId) n.sectionId = titleToSecId.get(n.sectionId) ?? n.sectionId;
        }
      }

      // convert identifier/member bindings to edges when possible
      for (const node of nodes) {
        if (node.kind !== "call") continue;
        for (const [port, binding] of Object.entries(node.inputBindings)) {
          if ("from" in binding) continue;
          if (binding.kind === "identifier") {
            // workflow input?
            const win = nodes.find((n) => n.kind === "workflow_input" && n.portName === binding.name);
            if (win) {
              edges.push({
                id: uid("e"),
                source: win.id,
                sourceHandle: binding.name,
                target: node.id,
                targetHandle: port,
              });
              node.inputBindings[port] = { from: { nodeId: win.id, port: binding.name } };
              continue;
            }
            // decl?
            const declId = declNameToId.get(binding.name);
            if (declId) {
              edges.push({
                id: uid("e"),
                source: declId,
                sourceHandle: binding.name,
                target: node.id,
                targetHandle: port,
              });
              node.inputBindings[port] = { from: { nodeId: declId, port: binding.name } };
            }
          } else if (binding.kind === "member" && binding.object.kind === "identifier") {
            const srcAlias = binding.object.name;
            const srcId = callAliasToId.get(srcAlias);
            if (srcId) {
              edges.push({
                id: uid("e"),
                source: srcId,
                sourceHandle: binding.field,
                target: node.id,
                targetHandle: port,
              });
              node.inputBindings[port] = { from: { nodeId: srcId, port: binding.field } };
            }
          }
        }
      }

      workflows.push({
        id: wfId,
        name: w.name,
        inputs: w.inputs,
        outputs: w.outputs,
        nodes,
        edges,
        layout,
        sections: sections.length ? sections : undefined,
      });
    }
  }

  if (!workflows.length) {
    const wfId = uid("wf");
    workflows.push({
      id: wfId,
      name: "Main",
      inputs: [],
      outputs: [],
      nodes: [],
      edges: [],
      layout: {},
    });
  }

  return {
    version: 1,
    name: projectName,
    wdlVersion: "1.2",
    dockerGroups: [...groupMap.values()],
    tasks,
    structs: structs.length ? structs : undefined,
    workflows,
    activeWorkflowId: workflows[0]?.id,
  };
}

export function importWdlSource(source: string, name?: string): ShowMeProject {
  return importWdlFiles([{ path: "imported.wdl", content: source }], name);
}
