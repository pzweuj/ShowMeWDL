"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { singleWesDemo } from "@/data/demo/single-wes";
import { uid } from "@/lib/utils";
import type {
  CallNode,
  DeclNode,
  DockerRuntimeGroup,
  GraphEdge,
  IOPort,
  NodeLayout,
  RuntimeSpec,
  ShowMeProject,
  StructDef,
  TaskDef,
  ValidationIssue,
  WorkflowDef,
  WorkflowOutput,
  WdlType,
} from "./types";
import { parseExpr, typesCompatible } from "./types";

type Selection =
  | { kind: "none" }
  | { kind: "node"; nodeId: string }
  | { kind: "edge"; edgeId: string }
  | { kind: "task"; taskId: string }
  | { kind: "group"; groupId: string }
  | { kind: "struct"; structId: string };

export type CenterEditor =
  | null
  | { kind: "workflow" }
  | { kind: "node"; nodeId: string }
  | { kind: "task"; taskId: string }
  | { kind: "struct"; structId: string };

export type ToastMessage = {
  id: string;
  message: string;
  tone: "info" | "success" | "error";
  durationMs?: number;
};

type ProjectState = {
  project: ShowMeProject;
  selection: Selection;
  leftTab: "tasks" | "workflows" | "structs";
  issues: ValidationIssue[];
  centerEditor: CenterEditor;
  leftCollapsed: boolean;
  toast: ToastMessage | null;

  loadProject: (project: ShowMeProject) => void;
  loadDemo: () => void;
  newEmptyProject: () => void;
  setProjectName: (name: string) => void;
  setLeftTab: (tab: "tasks" | "workflows" | "structs") => void;
  setSelection: (selection: Selection) => void;
  openCenterEditor: (editor: NonNullable<CenterEditor>) => void;
  closeCenterEditor: () => void;
  setLeftCollapsed: (v: boolean) => void;
  toggleLeftCollapsed: () => void;
  showToast: (message: string, tone?: ToastMessage["tone"], durationMs?: number) => void;
  clearToast: () => void;

  getActiveWorkflow: () => WorkflowDef | undefined;
  setActiveWorkflow: (id: string) => void;
  addWorkflow: (name?: string) => void;
  removeWorkflow: (id: string) => void;

  addDockerGroup: (docker?: string, label?: string) => void;
  updateDockerGroup: (id: string, patch: Partial<DockerRuntimeGroup>) => void;
  removeDockerGroup: (id: string) => void;

  addTask: (groupId: string, name?: string) => void;
  updateTask: (id: string, patch: Partial<TaskDef>) => void;
  removeTask: (id: string) => void;
  getTask: (id: string) => TaskDef | undefined;

  addStruct: (name?: string) => void;
  updateStruct: (id: string, patch: Partial<StructDef>) => void;
  removeStruct: (id: string) => void;

  addCallFromTask: (taskId: string, position: { x: number; y: number }) => void;
  updateNodeLayout: (nodeId: string, layout: NodeLayout) => void;
  updateNodeLayouts: (layouts: Record<string, NodeLayout>) => void;
  removeNode: (nodeId: string) => void;
  updateCall: (nodeId: string, patch: Partial<CallNode>) => void;
  setCallBindingExpr: (nodeId: string, port: string, text: string) => void;
  setCallRuntimeOverride: (nodeId: string, runtime?: RuntimeSpec) => void;

  addEdge: (edge: Omit<GraphEdge, "id"> & { id?: string }) => boolean;
  removeEdge: (edgeId: string) => void;

  updateWorkflowMeta: (patch: Partial<Pick<WorkflowDef, "name" | "inputs" | "outputs">>) => void;
  addWorkflowInput: (name: string, type: WdlType) => void;
  updateWorkflowInput: (name: string, patch: { name?: string; type?: WdlType }) => void;
  removeWorkflowInput: (name: string) => void;
  addWorkflowDecl: (name: string, type: WdlType, expression: string) => void;
  updateWorkflowDecl: (nodeId: string, patch: Partial<DeclNode>) => void;
  addWorkflowOutput: (name: string, type: WdlType, value: string) => void;
  updateWorkflowOutput: (
    name: string,
    patch: { name?: string; type?: WdlType; value?: string },
  ) => void;
  removeWorkflowOutput: (name: string) => void;
  validate: () => ValidationIssue[];
};

function emptyProject(): ShowMeProject {
  const wfId = uid("wf");
  return {
    version: 1,
    name: "未命名工程",
    wdlVersion: "1.2",
    dockerGroups: [],
    tasks: [],
    structs: [],
    workflows: [
      {
        id: wfId,
        name: "Main",
        inputs: [],
        outputs: [],
        nodes: [],
        edges: [],
        layout: {},
      },
    ],
    activeWorkflowId: wfId,
  };
}

function ensureStructs(project: ShowMeProject) {
  if (!project.structs) project.structs = [];
  return project.structs;
}

function resolvePortType(
  project: ShowMeProject,
  workflow: WorkflowDef,
  nodeId: string,
  handle: string,
  side: "source" | "target",
): WdlType | undefined {
  const node = workflow.nodes.find((n) => n.id === nodeId);
  if (!node) return undefined;

  if (node.kind === "workflow_input") {
    if (side === "source" && handle === node.portName) {
      return workflow.inputs.find((i) => i.name === node.portName)?.type;
    }
    return undefined;
  }

  if (node.kind === "call") {
    const task = project.tasks.find((t) => t.id === node.taskId);
    if (!task) return undefined;
    if (side === "source") return task.outputs.find((o) => o.name === handle)?.type;
    return task.inputs.find((i) => i.name === handle)?.type;
  }

  if (node.kind === "decl") {
    if (side === "source" && handle === node.name) return node.type;
    return undefined;
  }

  return undefined;
}

export const useProjectStore = create<ProjectState>()(
  immer((set, get) => ({
    project: structuredClone(singleWesDemo),
    selection: { kind: "none" },
    leftTab: "tasks",
    issues: [],
    centerEditor: null,
    leftCollapsed: false,
    toast: null,

    loadProject: (project) =>
      set((s) => {
        s.project = project;
        s.selection = { kind: "none" };
        s.issues = [];
        s.centerEditor = null;
      }),

    loadDemo: () =>
      set((s) => {
        s.project = structuredClone(singleWesDemo);
        s.selection = { kind: "none" };
        s.issues = [];
        s.centerEditor = null;
      }),

    newEmptyProject: () =>
      set((s) => {
        s.project = emptyProject();
        s.selection = { kind: "none" };
        s.issues = [];
        s.centerEditor = null;
      }),

    setProjectName: (name) =>
      set((s) => {
        s.project.name = name;
      }),

    setLeftTab: (tab) =>
      set((s) => {
        s.leftTab = tab;
      }),

    setSelection: (selection) =>
      set((s) => {
        s.selection = selection;
      }),

    openCenterEditor: (editor) =>
      set((s) => {
        s.centerEditor = editor;
        if (editor.kind === "node") s.selection = { kind: "node", nodeId: editor.nodeId };
        if (editor.kind === "task") s.selection = { kind: "task", taskId: editor.taskId };
        if (editor.kind === "struct") s.selection = { kind: "struct", structId: editor.structId };
        if (editor.kind === "workflow") s.selection = { kind: "none" };
      }),

    closeCenterEditor: () =>
      set((s) => {
        s.centerEditor = null;
      }),

    setLeftCollapsed: (v) =>
      set((s) => {
        s.leftCollapsed = v;
      }),

    toggleLeftCollapsed: () =>
      set((s) => {
        s.leftCollapsed = !s.leftCollapsed;
      }),

    showToast: (message, tone = "info", durationMs = 2800) =>
      set((s) => {
        s.toast = { id: uid("toast"), message, tone, durationMs };
      }),

    clearToast: () =>
      set((s) => {
        s.toast = null;
      }),

    getActiveWorkflow: () => {
      const { project } = get();
      return project.workflows.find((w) => w.id === project.activeWorkflowId) ?? project.workflows[0];
    },

    setActiveWorkflow: (id) =>
      set((s) => {
        s.project.activeWorkflowId = id;
        s.selection = { kind: "none" };
        s.centerEditor = null;
      }),

    addWorkflow: (name) =>
      set((s) => {
        const id = uid("wf");
        s.project.workflows.push({
          id,
          name: name ?? `Workflow${s.project.workflows.length + 1}`,
          inputs: [],
          outputs: [],
          nodes: [],
          edges: [],
          layout: {},
        });
        s.project.activeWorkflowId = id;
      }),

    removeWorkflow: (id) =>
      set((s) => {
        if (s.project.workflows.length <= 1) return;
        s.project.workflows = s.project.workflows.filter((w) => w.id !== id);
        if (s.project.activeWorkflowId === id) {
          s.project.activeWorkflowId = s.project.workflows[0]?.id;
        }
      }),

    addDockerGroup: (docker, label) =>
      set((s) => {
        const d = docker?.trim() || undefined;
        const lbl =
          label?.trim() ||
          (d ? d.split("/").pop()?.split(":")[0] : undefined) ||
          `分组${s.project.dockerGroups.length + 1}`;
        const defaults: Partial<RuntimeSpec> = { cpu: 4, memory: "8G" };
        if (d) defaults.docker = d;
        s.project.dockerGroups.push({
          id: uid("grp"),
          docker: d,
          label: lbl,
          taskIds: [],
          defaults,
        });
      }),

    updateDockerGroup: (id, patch) =>
      set((s) => {
        const g = s.project.dockerGroups.find((x) => x.id === id);
        if (g) Object.assign(g, patch);
      }),

    removeDockerGroup: (id) =>
      set((s) => {
        s.project.dockerGroups = s.project.dockerGroups.filter((g) => g.id !== id);
        s.project.tasks = s.project.tasks.filter((t) => t.groupId !== id);
      }),

    addTask: (groupId, name) =>
      set((s) => {
        const group = s.project.dockerGroups.find((g) => g.id === groupId);
        if (!group) return;
        const id = uid("task");
        const taskName = name ?? `Task${s.project.tasks.length + 1}`;
        const task: TaskDef = {
          id,
          name: taskName,
          groupId,
          inputs: [{ name: "prefix", type: { kind: "primitive", name: "String" } }],
          outputs: [{ name: "out", type: { kind: "primitive", name: "File" } }],
          command: `echo ~{prefix} > ~{prefix}.out`,
          runtime: {
            ...(group.docker ? { docker: group.docker } : {}),
            ...(group.defaults?.docker && !group.docker
              ? { docker: group.defaults.docker }
              : {}),
            cpu: group.defaults?.cpu ?? 1,
            memory: group.defaults?.memory ?? "2G",
          },
        };
        s.project.tasks.push(task);
        group.taskIds.push(id);
        s.selection = { kind: "task", taskId: id };
        s.centerEditor = { kind: "task", taskId: id };
      }),

    updateTask: (id, patch) =>
      set((s) => {
        const t = s.project.tasks.find((x) => x.id === id);
        if (t) Object.assign(t, patch);
      }),

    removeTask: (id) =>
      set((s) => {
        s.project.tasks = s.project.tasks.filter((t) => t.id !== id);
        for (const g of s.project.dockerGroups) {
          g.taskIds = g.taskIds.filter((tid) => tid !== id);
        }
        for (const wf of s.project.workflows) {
          const removeIds = new Set(
            wf.nodes.filter((n) => n.kind === "call" && n.taskId === id).map((n) => n.id),
          );
          wf.nodes = wf.nodes.filter((n) => !removeIds.has(n.id));
          wf.edges = wf.edges.filter((e) => !removeIds.has(e.source) && !removeIds.has(e.target));
          for (const rid of removeIds) delete wf.layout[rid];
        }
        if (s.centerEditor?.kind === "task" && s.centerEditor.taskId === id) {
          s.centerEditor = null;
        }
      }),

    getTask: (id) => get().project.tasks.find((t) => t.id === id),

    addStruct: (name) =>
      set((s) => {
        const structs = ensureStructs(s.project);
        const base = name?.trim() || `MyStruct${structs.length + 1}`;
        let structName = base;
        let i = 2;
        while (structs.some((x) => x.name === structName)) {
          structName = `${base}${i++}`;
        }
        const id = uid("struct");
        structs.push({
          id,
          name: structName,
          members: [{ name: "field1", type: { kind: "primitive", name: "String" } }],
        });
        s.selection = { kind: "struct", structId: id };
        s.leftTab = "structs";
        s.centerEditor = { kind: "struct", structId: id };
      }),

    updateStruct: (id, patch) =>
      set((s) => {
        const structs = ensureStructs(s.project);
        const st = structs.find((x) => x.id === id);
        if (!st) return;
        if (patch.name !== undefined) {
          const next = patch.name.trim();
          if (next && !structs.some((x) => x.id !== id && x.name === next)) {
            st.name = next;
          }
        }
        if (patch.members !== undefined) st.members = patch.members;
      }),

    removeStruct: (id) =>
      set((s) => {
        s.project.structs = (s.project.structs ?? []).filter((x) => x.id !== id);
        if (s.selection.kind === "struct" && s.selection.structId === id) {
          s.selection = { kind: "none" };
        }
        if (s.centerEditor?.kind === "struct" && s.centerEditor.structId === id) {
          s.centerEditor = null;
        }
      }),

    addCallFromTask: (taskId, position) =>
      set((s) => {
        const wf = s.project.workflows.find((w) => w.id === s.project.activeWorkflowId);
        const task = s.project.tasks.find((t) => t.id === taskId);
        if (!wf || !task) return;
        const id = uid("call");
        const node: CallNode = {
          kind: "call",
          id,
          taskId,
          alias: task.name,
          inputBindings: {},
        };
        const aliases = new Set(
          wf.nodes.filter((n): n is CallNode => n.kind === "call").map((n) => n.alias ?? ""),
        );
        if (aliases.has(node.alias ?? "")) {
          let i = 2;
          while (aliases.has(`${task.name}_${i}`)) i++;
          node.alias = `${task.name}_${i}`;
        }
        wf.nodes.push(node);
        wf.layout[id] = position;
        s.selection = { kind: "node", nodeId: id };
      }),

    updateNodeLayout: (nodeId, layout) =>
      set((s) => {
        const wf = s.project.workflows.find((w) => w.id === s.project.activeWorkflowId);
        if (!wf) return;
        wf.layout[nodeId] = layout;
      }),

    updateNodeLayouts: (layouts) =>
      set((s) => {
        const wf = s.project.workflows.find((w) => w.id === s.project.activeWorkflowId);
        if (!wf) return;
        Object.assign(wf.layout, layouts);
      }),

    removeNode: (nodeId) =>
      set((s) => {
        const wf = s.project.workflows.find((w) => w.id === s.project.activeWorkflowId);
        if (!wf) return;
        const node = wf.nodes.find((n) => n.id === nodeId);
        if (node?.kind === "workflow_input") {
          wf.inputs = wf.inputs.filter((i) => i.name !== node.portName);
        }
        wf.nodes = wf.nodes.filter((n) => n.id !== nodeId);
        wf.edges = wf.edges.filter((e) => e.source !== nodeId && e.target !== nodeId);
        delete wf.layout[nodeId];
        if (s.selection.kind === "node" && s.selection.nodeId === nodeId) {
          s.selection = { kind: "none" };
        }
        if (s.centerEditor?.kind === "node" && s.centerEditor.nodeId === nodeId) {
          s.centerEditor = null;
        }
      }),

    updateCall: (nodeId, patch) =>
      set((s) => {
        const wf = s.project.workflows.find((w) => w.id === s.project.activeWorkflowId);
        const node = wf?.nodes.find((n) => n.id === nodeId);
        if (node && node.kind === "call") Object.assign(node, patch);
      }),

    setCallBindingExpr: (nodeId, port, text) =>
      set((s) => {
        const wf = s.project.workflows.find((w) => w.id === s.project.activeWorkflowId);
        const node = wf?.nodes.find((n) => n.id === nodeId);
        if (!node || node.kind !== "call") return;
        wf!.edges = wf!.edges.filter((e) => !(e.target === nodeId && e.targetHandle === port));
        if (!text.trim()) {
          delete node.inputBindings[port];
        } else {
          node.inputBindings[port] = parseExpr(text);
        }
      }),

    setCallRuntimeOverride: (nodeId, runtime) =>
      set((s) => {
        const wf = s.project.workflows.find((w) => w.id === s.project.activeWorkflowId);
        const node = wf?.nodes.find((n) => n.id === nodeId);
        if (!node || node.kind !== "call") return;
        if (!runtime || Object.keys(runtime).length === 0) {
          delete node.runtimeOverride;
        } else {
          node.runtimeOverride = runtime;
        }
      }),

    addEdge: (edge) => {
      const state = get();
      const wf = state.getActiveWorkflow();
      if (!wf) return false;

      const srcType = resolvePortType(state.project, wf, edge.source, edge.sourceHandle, "source");
      const tgtType = resolvePortType(state.project, wf, edge.target, edge.targetHandle, "target");
      if (srcType && tgtType && !typesCompatible(srcType, tgtType)) {
        get().showToast("类型不兼容，无法连接", "error");
        return false;
      }

      set((s) => {
        const w = s.project.workflows.find((x) => x.id === s.project.activeWorkflowId);
        if (!w) return;
        w.edges = w.edges.filter(
          (e) => !(e.target === edge.target && e.targetHandle === edge.targetHandle),
        );
        const id = edge.id ?? uid("e");
        w.edges.push({
          id,
          source: edge.source,
          sourceHandle: edge.sourceHandle,
          target: edge.target,
          targetHandle: edge.targetHandle,
        });
        const node = w.nodes.find((n) => n.id === edge.target);
        if (node && node.kind === "call") {
          node.inputBindings[edge.targetHandle] = {
            from: { nodeId: edge.source, port: edge.sourceHandle },
          };
        }
      });
      return true;
    },

    removeEdge: (edgeId) =>
      set((s) => {
        const wf = s.project.workflows.find((w) => w.id === s.project.activeWorkflowId);
        if (!wf) return;
        const edge = wf.edges.find((e) => e.id === edgeId);
        if (edge) {
          const node = wf.nodes.find((n) => n.id === edge.target);
          if (node && node.kind === "call") {
            delete node.inputBindings[edge.targetHandle];
          }
        }
        wf.edges = wf.edges.filter((e) => e.id !== edgeId);
        if (s.selection.kind === "edge" && s.selection.edgeId === edgeId) {
          s.selection = { kind: "none" };
        }
      }),

    updateWorkflowMeta: (patch) =>
      set((s) => {
        const wf = s.project.workflows.find((w) => w.id === s.project.activeWorkflowId);
        if (!wf) return;
        Object.assign(wf, patch);
      }),

    addWorkflowInput: (name, type) =>
      set((s) => {
        const wf = s.project.workflows.find((w) => w.id === s.project.activeWorkflowId);
        if (!wf) return;
        const trimmed = name.trim();
        if (!trimmed || wf.inputs.some((i) => i.name === trimmed)) return;
        wf.inputs.push({ name: trimmed, type });
        const id = uid("win");
        const existingY = Math.max(
          0,
          ...wf.nodes.filter((n) => n.kind === "workflow_input").map((n) => wf.layout[n.id]?.y ?? 0),
        );
        wf.nodes.push({ kind: "workflow_input", id, portName: trimmed });
        wf.layout[id] = { x: 40, y: existingY + 100 };
      }),

    updateWorkflowInput: (name, patch) =>
      set((s) => {
        const wf = s.project.workflows.find((w) => w.id === s.project.activeWorkflowId);
        if (!wf) return;
        const input = wf.inputs.find((i) => i.name === name);
        if (!input) return;
        const nextName = patch.name?.trim();
        if (nextName && nextName !== name) {
          if (wf.inputs.some((i) => i.name === nextName)) return;
          input.name = nextName;
          const win = wf.nodes.find((n) => n.kind === "workflow_input" && n.portName === name);
          if (win && win.kind === "workflow_input") {
            win.portName = nextName;
            wf.edges = wf.edges.map((e) =>
              e.source === win.id && e.sourceHandle === name
                ? { ...e, sourceHandle: nextName }
                : e,
            );
          }
        }
        if (patch.type) input.type = patch.type;
      }),

    removeWorkflowInput: (name) =>
      set((s) => {
        const wf = s.project.workflows.find((w) => w.id === s.project.activeWorkflowId);
        if (!wf) return;
        wf.inputs = wf.inputs.filter((i) => i.name !== name);
        const win = wf.nodes.find((n) => n.kind === "workflow_input" && n.portName === name);
        if (win) {
          wf.nodes = wf.nodes.filter((n) => n.id !== win.id);
          wf.edges = wf.edges.filter((e) => e.source !== win.id && e.target !== win.id);
          delete wf.layout[win.id];
          if (s.centerEditor?.kind === "node" && s.centerEditor.nodeId === win.id) {
            s.centerEditor = null;
          }
        }
      }),

    addWorkflowDecl: (name, type, expression) =>
      set((s) => {
        const wf = s.project.workflows.find((w) => w.id === s.project.activeWorkflowId);
        if (!wf) return;
        const trimmed = name.trim();
        if (!trimmed) return;
        const id = uid("decl");
        const node: DeclNode = {
          kind: "decl",
          id,
          name: trimmed,
          type,
          expression: parseExpr(expression),
        };
        const maxY = Math.max(0, ...Object.values(wf.layout).map((l) => l.y));
        wf.nodes.push(node);
        wf.layout[id] = { x: 320, y: maxY + 120 };
        s.selection = { kind: "node", nodeId: id };
      }),

    updateWorkflowDecl: (nodeId, patch) =>
      set((s) => {
        const wf = s.project.workflows.find((w) => w.id === s.project.activeWorkflowId);
        const node = wf?.nodes.find((n) => n.id === nodeId);
        if (node && node.kind === "decl") {
          const newName = patch.name;
          if (newName) {
            wf!.edges = wf!.edges.map((e) =>
              e.source === nodeId ? { ...e, sourceHandle: newName } : e,
            );
          }
          Object.assign(node, patch);
        }
      }),

    addWorkflowOutput: (name, type, value) =>
      set((s) => {
        const wf = s.project.workflows.find((w) => w.id === s.project.activeWorkflowId);
        if (!wf) return;
        const trimmed = name.trim();
        if (!trimmed || wf.outputs.some((o) => o.name === trimmed)) return;
        const out: WorkflowOutput = { name: trimmed, type, value: parseExpr(value) };
        wf.outputs.push(out);
      }),

    updateWorkflowOutput: (name, patch) =>
      set((s) => {
        const wf = s.project.workflows.find((w) => w.id === s.project.activeWorkflowId);
        if (!wf) return;
        const out = wf.outputs.find((o) => o.name === name);
        if (!out) return;
        const nextName = patch.name?.trim();
        if (nextName && nextName !== name) {
          if (wf.outputs.some((o) => o.name === nextName)) return;
          out.name = nextName;
        }
        if (patch.type) out.type = patch.type;
        if (patch.value !== undefined) out.value = parseExpr(patch.value);
      }),

    removeWorkflowOutput: (name) =>
      set((s) => {
        const wf = s.project.workflows.find((w) => w.id === s.project.activeWorkflowId);
        if (!wf) return;
        wf.outputs = wf.outputs.filter((o) => o.name !== name);
      }),

    validate: () => {
      const { project } = get();
      const issues: ValidationIssue[] = [];
      for (const wf of project.workflows) {
        for (const node of wf.nodes) {
          if (node.kind !== "call") continue;
          const task = project.tasks.find((t) => t.id === node.taskId);
          if (!task) {
            issues.push({
              id: uid("iss"),
              severity: "error",
              message: `节点 ${node.alias ?? node.id} 引用了不存在的 task`,
              nodeId: node.id,
              workflowId: wf.id,
            });
            continue;
          }
          for (const input of task.inputs) {
            if (input.optional || input.default) continue;
            const bound = node.inputBindings[input.name];
            const edged = wf.edges.some(
              (e) => e.target === node.id && e.targetHandle === input.name,
            );
            if (!bound && !edged) {
              issues.push({
                id: uid("iss"),
                severity: "error",
                message: `${node.alias ?? task.name}.${input.name} 未连接`,
                nodeId: node.id,
                workflowId: wf.id,
              });
            }
          }
        }
      }
      set((s) => {
        s.issues = issues;
      });
      return issues;
    },
  })),
);

export function ensureWorkflowInputsAsNodes(wf: WorkflowDef) {
  const existing = new Set(
    wf.nodes.filter((n) => n.kind === "workflow_input").map((n) => (n as { portName: string }).portName),
  );
  let y = 40;
  for (const input of wf.inputs) {
    if (existing.has(input.name)) continue;
    const id = uid("win");
    wf.nodes.push({ kind: "workflow_input", id, portName: input.name });
    wf.layout[id] = { x: 40, y };
    y += 100;
  }
}

export type { Selection, IOPort };
