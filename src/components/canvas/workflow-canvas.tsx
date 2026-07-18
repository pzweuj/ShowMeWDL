"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
  type NodeTypes,
  type OnSelectionChangeParams,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useProjectStore } from "@/features/project/store";
import {
  typeColor,
  type ShowMeProject,
  type WdlType,
  type WorkflowDef,
} from "@/features/project/types";
import { CallNodeView } from "./nodes/call-node";
import { InputNodeView } from "./nodes/input-node";
import { DeclNodeView } from "./nodes/decl-node";
import { InputsBandView, SectionBandView } from "./nodes/section-band";
import { useI18n } from "@/i18n/context";

const nodeTypes = {
  call: CallNodeView,
  workflowInput: InputNodeView,
  decl: DeclNodeView,
  sectionBand: SectionBandView,
  inputsBand: InputsBandView,
} as NodeTypes;

const CALL_W = 240;
const INPUT_W = 160;
const DECL_W = 200;
const NODE_H = 120;

function isBandId(id: string) {
  return id.startsWith("__band_");
}

function resolveEdgeType(
  project: ShowMeProject,
  workflow: WorkflowDef,
  sourceId: string,
  sourceHandle: string,
): WdlType | undefined {
  const node = workflow.nodes.find((n) => n.id === sourceId);
  if (!node) return undefined;
  if (node.kind === "workflow_input") {
    return workflow.inputs.find((i) => i.name === node.portName)?.type;
  }
  if (node.kind === "decl") return node.type;
  if (node.kind === "call") {
    const task = project.tasks.find((t) => t.id === node.taskId);
    return task?.outputs.find((o) => o.name === sourceHandle)?.type;
  }
  return undefined;
}

type BandDragState = {
  bandId: string;
  startBand: { x: number; y: number };
  members: Array<{ id: string; x: number; y: number }>;
};

function CanvasInner() {
  const { t } = useI18n();
  const { screenToFlowPosition, fitView } = useReactFlow();
  const project = useProjectStore((s) => s.project);
  const selection = useProjectStore((s) => s.selection);
  const setSelection = useProjectStore((s) => s.setSelection);
  const addEdgeStore = useProjectStore((s) => s.addEdge);
  const removeEdge = useProjectStore((s) => s.removeEdge);
  const removeNode = useProjectStore((s) => s.removeNode);
  const updateNodeLayouts = useProjectStore((s) => s.updateNodeLayouts);
  const addCallFromTask = useProjectStore((s) => s.addCallFromTask);
  const openCenterEditor = useProjectStore((s) => s.openCenterEditor);
  const fittedFor = useRef<string | null>(null);
  const bandDrag = useRef<BandDragState | null>(null);

  const workflow =
    project.workflows.find((w) => w.id === project.activeWorkflowId) ?? project.workflows[0];

  const edgeEndpointIds = useMemo(() => {
    if (selection.kind !== "edge" || !workflow) return null;
    const edge = workflow.edges.find((e) => e.id === selection.edgeId);
    if (!edge) return null;
    return { source: edge.source, target: edge.target, edgeId: edge.id };
  }, [selection, workflow]);

  const rfNodes: Node[] = useMemo(() => {
    if (!workflow) return [];
    const graphNodes: Node[] = [];
    const highlightIds = edgeEndpointIds
      ? new Set([edgeEndpointIds.source, edgeEndpointIds.target])
      : null;

    const inputNodes = workflow.nodes.filter((n) => n.kind === "workflow_input");
    if (inputNodes.length) {
      const xs = inputNodes.map((n) => workflow.layout[n.id]?.x ?? 0);
      const ys = inputNodes.map((n) => workflow.layout[n.id]?.y ?? 0);
      const minX = Math.min(...xs) - 24;
      const minY = Math.min(...ys) - 56;
      const maxX = Math.max(...xs) + INPUT_W + 24;
      const maxY = Math.max(...ys) + NODE_H + 24;
      const memberIds = inputNodes.map((n) => n.id);
      graphNodes.push({
        id: "__band_inputs",
        type: "inputsBand",
        position: { x: minX, y: minY },
        data: {
          height: Math.max(180, maxY - minY),
          width: Math.max(200, maxX - minX),
          count: inputNodes.length,
          memberIds,
        },
        draggable: true,
        selectable: true,
        connectable: false,
        zIndex: -1,
      });
    }

    const sections = [...(workflow.sections ?? [])].sort((a, b) => a.order - b.order);
    for (const sec of sections) {
      const members = workflow.nodes.filter(
        (n) => (n.kind === "call" || n.kind === "decl") && n.sectionId === sec.id,
      );
      if (!members.length) continue;
      const xs = members.map((n) => workflow.layout[n.id]?.x ?? 0);
      const ys = members.map((n) => workflow.layout[n.id]?.y ?? 0);
      const minX = Math.min(...xs) - 24;
      const minY = Math.min(...ys) - 64;
      const maxX =
        Math.max(
          ...members.map((n) => {
            const x = workflow.layout[n.id]?.x ?? 0;
            return x + (n.kind === "decl" ? DECL_W : CALL_W);
          }),
        ) + 24;
      const maxY = Math.max(...ys) + NODE_H + 32;
      const memberIds = members.map((n) => n.id);
      graphNodes.push({
        id: `__band_${sec.id}`,
        type: "sectionBand",
        position: { x: minX, y: minY },
        data: {
          title: sec.title,
          order: sec.order,
          height: Math.max(220, maxY - minY),
          width: Math.max(280, maxX - minX),
          memberIds,
        },
        draggable: true,
        selectable: true,
        connectable: false,
        zIndex: -1,
      });
    }

    for (const node of workflow.nodes) {
      const pos = workflow.layout[node.id] ?? { x: 0, y: 0 };
      const edgeLinked = Boolean(highlightIds?.has(node.id));
      const isSource = edgeEndpointIds?.source === node.id;
      const isTarget = edgeEndpointIds?.target === node.id;
      if (node.kind === "workflow_input") {
        const input = workflow.inputs.find((i) => i.name === node.portName);
        graphNodes.push({
          id: node.id,
          type: "workflowInput",
          position: { x: pos.x, y: pos.y },
          data: {
            label: node.portName,
            type: input?.type ?? { kind: "primitive" as const, name: "String" as const },
            edgeLinked,
            edgeRole: isSource ? "source" : isTarget ? "target" : undefined,
          },
          selected: selection.kind === "node" && selection.nodeId === node.id,
          zIndex: edgeLinked ? 3 : 1,
        });
        continue;
      }
      if (node.kind === "call") {
        const task = project.tasks.find((t) => t.id === node.taskId);
        graphNodes.push({
          id: node.id,
          type: "call",
          position: { x: pos.x, y: pos.y },
          data: {
            label: node.alias ?? task?.name ?? node.id,
            taskName: task?.name ?? "?",
            task,
            hasOverride: Boolean(node.runtimeOverride),
            edgeLinked,
            edgeRole: isSource ? "source" : isTarget ? "target" : undefined,
          },
          selected: selection.kind === "node" && selection.nodeId === node.id,
          zIndex: edgeLinked ? 3 : 1,
        });
        continue;
      }
      if (node.kind === "decl") {
        graphNodes.push({
          id: node.id,
          type: "decl",
          position: { x: pos.x, y: pos.y },
          data: {
            name: node.name,
            type: node.type,
            expression: node.expression,
            edgeLinked,
            edgeRole: isSource ? "source" : isTarget ? "target" : undefined,
          },
          selected: selection.kind === "node" && selection.nodeId === node.id,
          zIndex: edgeLinked ? 3 : 1,
        });
        continue;
      }
      graphNodes.push({
        id: node.id,
        type: "call",
        position: { x: pos.x, y: pos.y },
        data: {
          label: node.kind,
          taskName: node.kind,
          hasOverride: false,
          edgeLinked,
          edgeRole: isSource ? "source" : isTarget ? "target" : undefined,
        },
        zIndex: edgeLinked ? 3 : 1,
      });
    }
    return graphNodes;
  }, [workflow, project.tasks, selection, edgeEndpointIds]);

  const rfEdges: Edge[] = useMemo(() => {
    if (!workflow) return [];
    const selectedEdgeId = selection.kind === "edge" ? selection.edgeId : null;
    return workflow.edges.map((e) => {
      const t = resolveEdgeType(project, workflow, e.source, e.sourceHandle);
      const stroke = t ? typeColor(t) : "#64748b";
      const selected = selectedEdgeId === e.id;
      const dimmed = Boolean(selectedEdgeId && !selected);
      return {
        id: e.id,
        source: e.source,
        sourceHandle: e.sourceHandle,
        target: e.target,
        targetHandle: e.targetHandle,
        animated: selected,
        style: {
          stroke,
          strokeWidth: selected ? 3.5 : 2,
          opacity: dimmed ? 0.22 : 1,
        },
        selected,
        zIndex: selected ? 4 : 0,
      };
    });
  }, [workflow, project, selection]);

  const [nodes, setNodes, onNodesChange] = useNodesState(rfNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(rfEdges);

  useEffect(() => {
    // Don't clobber in-progress band drag
    if (bandDrag.current) return;
    setNodes(rfNodes);
    setEdges(rfEdges);
  }, [rfNodes, rfEdges, setNodes, setEdges]);

  useEffect(() => {
    const id = workflow?.id ?? "";
    if (!id || fittedFor.current === id) return;
    fittedFor.current = id;
    requestAnimationFrame(() => {
      void fitView({ padding: 0.15, duration: 200 });
    });
  }, [workflow?.id, fitView]);

  const onConnect = useCallback(
    (connection: Connection) => {
      if (
        !connection.source ||
        !connection.target ||
        !connection.sourceHandle ||
        !connection.targetHandle
      ) {
        return;
      }
      const ok = addEdgeStore({
        source: connection.source,
        sourceHandle: connection.sourceHandle,
        target: connection.target,
        targetHandle: connection.targetHandle,
      });
      if (ok) {
        setEdges((eds) => addEdge({ ...connection, style: { stroke: "#64748b" } }, eds));
      }
    },
    [addEdgeStore, setEdges],
  );

  const onSelectionChange = useCallback(
    ({ nodes: ns, edges: es }: OnSelectionChangeParams) => {
      // Prefer edge selection so endpoint highlight works
      if (es[0] && !ns.some((n) => !isBandId(n.id))) {
        setSelection({ kind: "edge", edgeId: es[0].id });
        return;
      }
      const real = ns.find((n) => !isBandId(n.id));
      if (real) {
        const nodeId = real.id;
        const state = useProjectStore.getState();
        const already =
          state.centerEditor?.kind === "node" && state.centerEditor.nodeId === nodeId;
        if (!already) openCenterEditor({ kind: "node", nodeId });
        else if (state.selection.kind !== "node" || state.selection.nodeId !== nodeId) {
          setSelection({ kind: "node", nodeId });
        }
      } else if (es[0]) {
        setSelection({ kind: "edge", edgeId: es[0].id });
      } else if (!ns.some((n) => isBandId(n.id))) {
        setSelection({ kind: "none" });
      }
    },
    [setSelection, openCenterEditor],
  );

  const onNodeDragStart = useCallback((_event: unknown, node: Node) => {
    if (!isBandId(node.id)) {
      bandDrag.current = null;
      return;
    }
    const memberIds = (node.data?.memberIds as string[] | undefined) ?? [];
    // capture current RF positions of members
    setNodes((nds) => {
      const members = memberIds
        .map((id) => {
          const n = nds.find((x) => x.id === id);
          return n ? { id, x: n.position.x, y: n.position.y } : null;
        })
        .filter((m): m is { id: string; x: number; y: number } => Boolean(m));
      bandDrag.current = {
        bandId: node.id,
        startBand: { x: node.position.x, y: node.position.y },
        members,
      };
      return nds;
    });
  }, [setNodes]);

  const onNodeDrag = useCallback(
    (_event: unknown, node: Node) => {
      const st = bandDrag.current;
      if (!st || st.bandId !== node.id) return;
      const dx = node.position.x - st.startBand.x;
      const dy = node.position.y - st.startBand.y;
      const memberMap = new Map(st.members.map((m) => [m.id, m]));
      setNodes((nds) =>
        nds.map((n) => {
          const m = memberMap.get(n.id);
          if (!m) return n;
          return {
            ...n,
            position: { x: m.x + dx, y: m.y + dy },
          };
        }),
      );
    },
    [setNodes],
  );

  const onNodeDragStop = useCallback(
    (_event: unknown, node: Node) => {
      const st = bandDrag.current;
      if (st && st.bandId === node.id) {
        const dx = node.position.x - st.startBand.x;
        const dy = node.position.y - st.startBand.y;
        const layouts: Record<string, { x: number; y: number }> = {};
        for (const m of st.members) {
          layouts[m.id] = { x: m.x + dx, y: m.y + dy };
        }
        if (Object.keys(layouts).length) updateNodeLayouts(layouts);
        bandDrag.current = null;
        return;
      }
      if (isBandId(node.id)) return;
      updateNodeLayouts({ [node.id]: { x: node.position.x, y: node.position.y } });
    },
    [updateNodeLayouts],
  );

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      for (const n of deleted) {
        if (!isBandId(n.id)) removeNode(n.id);
      }
    },
    [removeNode],
  );

  const onEdgesDelete = useCallback(
    (deleted: Edge[]) => {
      for (const e of deleted) removeEdge(e.id);
    },
    [removeEdge],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const taskId = event.dataTransfer.getData("application/showme-task");
      if (!taskId) return;
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      addCallFromTask(taskId, position);
    },
    [addCallFromTask, screenToFlowPosition],
  );

  const onPaneClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.detail === 2) openCenterEditor({ kind: "workflow" });
    },
    [openCenterEditor],
  );

  return (
    <div className="h-full w-full" onDragOver={onDragOver} onDrop={onDrop}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        onNodeDragStart={onNodeDragStart}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        deleteKeyCode={["Backspace", "Delete"]}
        proOptions={{ hideAttribution: true }}
        minZoom={0.15}
        maxZoom={2}
        nodesConnectable
        elementsSelectable
        nodeDragThreshold={2}
      >
        <Background variant={BackgroundVariant.Dots} gap={18} size={1} color="var(--canvas-dot)" />
        <MiniMap pannable zoomable />
        <Controls />
      </ReactFlow>
      <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full border border-[var(--panel-border)] bg-[color-mix(in_oklab,var(--panel)_88%,transparent)] px-3 py-1 text-[11px] text-[var(--muted)] shadow-sm backdrop-blur">
        {t("canvas.tip")}
      </div>
    </div>
  );
}

export function WorkflowCanvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
