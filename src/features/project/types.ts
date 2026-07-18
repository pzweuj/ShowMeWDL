export type WdlPrimitive =
  | "String"
  | "Int"
  | "Float"
  | "Boolean"
  | "File"
  | "Directory";

export type WdlType =
  | { kind: "primitive"; name: WdlPrimitive; optional?: boolean }
  | { kind: "array"; item: WdlType; optional?: boolean }
  | { kind: "map"; key: WdlType; value: WdlType; optional?: boolean }
  | { kind: "pair"; left: WdlType; right: WdlType; optional?: boolean }
  | { kind: "struct"; name: string; optional?: boolean }
  | { kind: "unknown"; raw: string; optional?: boolean };

export type Expr =
  | { kind: "literal"; value: string | number | boolean; typeHint?: WdlPrimitive }
  | { kind: "identifier"; name: string }
  | { kind: "member"; object: Expr; field: string }
  | { kind: "index"; object: Expr; index: Expr }
  | { kind: "call"; name: string; args: Expr[] }
  | { kind: "binary"; op: string; left: Expr; right: Expr }
  | { kind: "unary"; op: string; expr: Expr }
  | { kind: "ternary"; condition: Expr; then: Expr; else: Expr }
  | { kind: "array"; items: Expr[] }
  | { kind: "raw"; text: string };

export type PortRef = {
  nodeId: string;
  port: string;
};

export type IOPort = {
  name: string;
  type: WdlType;
  optional?: boolean;
  default?: Expr;
  description?: string;
};

export type RuntimeSpec = {
  docker?: string;
  cpu?: number;
  memory?: string;
  disks?: string;
  gpu?: number;
  [key: string]: string | number | boolean | undefined;
};

export type TaskDef = {
  id: string;
  name: string;
  groupId: string;
  inputs: IOPort[];
  outputs: IOPort[];
  command: string;
  runtime: RuntimeSpec;
  meta?: Record<string, string>;
  isVariant?: boolean;
  baseTaskId?: string;
};

export type DockerRuntimeGroup = {
  id: string;
  /** Optional default docker image for tasks in this group */
  docker?: string;
  label: string;
  defaults?: Partial<RuntimeSpec>;
  taskIds: string[];
};

/** User-defined WDL struct type */
export type StructDef = {
  id: string;
  name: string;
  members: IOPort[];
};

export type CallNode = {
  kind: "call";
  id: string;
  taskId: string;
  alias?: string;
  inputBindings: Record<string, Expr | { from: PortRef }>;
  runtimeOverride?: RuntimeSpec;
  parentId?: string;
  /** Canvas section column (from `# Section01` comments) */
  sectionId?: string;
};

export type ScatterNode = {
  kind: "scatter";
  id: string;
  itemVar: string;
  collection: Expr;
  childIds: string[];
  parentId?: string;
};

export type IfNode = {
  kind: "if";
  id: string;
  condition: Expr;
  childIds: string[];
  parentId?: string;
};

export type WorkflowInputNode = {
  kind: "workflow_input";
  id: string;
  portName: string;
};

export type DeclNode = {
  kind: "decl";
  id: string;
  name: string;
  type: WdlType;
  expression: Expr;
  parentId?: string;
  sectionId?: string;
};

export type GraphNode = CallNode | ScatterNode | IfNode | WorkflowInputNode | DeclNode;

export type GraphEdge = {
  id: string;
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
};

export type WorkflowOutput = {
  name: string;
  type: WdlType;
  value: Expr;
};

export type NodeLayout = { x: number; y: number; width?: number; height?: number };

export type WorkflowSection = {
  id: string;
  /** Display title, e.g. "01 · BAM" */
  title: string;
  /** Sort order left-to-right (0 = first section after inputs) */
  order: number;
};

export type WorkflowDef = {
  id: string;
  name: string;
  inputs: IOPort[];
  outputs: WorkflowOutput[];
  nodes: GraphNode[];
  edges: GraphEdge[];
  layout: Record<string, NodeLayout>;
  /** Canvas sections from `# SectionNN` comments in WDL */
  sections?: WorkflowSection[];
};

export type ShowMeProject = {
  version: 1;
  name: string;
  wdlVersion: "1.1" | "1.2";
  dockerGroups: DockerRuntimeGroup[];
  tasks: TaskDef[];
  /** Custom WDL struct definitions (exported at file top) */
  structs?: StructDef[];
  workflows: WorkflowDef[];
  activeWorkflowId?: string;
};

export type ValidationIssue = {
  id: string;
  severity: "error" | "warning";
  message: string;
  nodeId?: string;
  workflowId?: string;
};

export function typeToString(t: WdlType): string {
  const opt = t.optional ? "?" : "";
  switch (t.kind) {
    case "primitive":
      return `${t.name}${opt}`;
    case "array":
      return `Array[${typeToString(t.item)}]${opt}`;
    case "map":
      return `Map[${typeToString(t.key)}, ${typeToString(t.value)}]${opt}`;
    case "pair":
      return `Pair[${typeToString(t.left)}, ${typeToString(t.right)}]${opt}`;
    case "struct":
      return `${t.name}${opt}`;
    case "unknown":
      return `${t.raw}${opt}`;
  }
}

export function parseTypeString(raw: string): WdlType {
  const text = raw.trim();
  const optional = text.endsWith("?");
  const core = optional ? text.slice(0, -1).trim() : text;

  const arrayMatch = /^Array\[(.+)\]$/.exec(core);
  if (arrayMatch) {
    return { kind: "array", item: parseTypeString(arrayMatch[1]), optional };
  }

  const primitives: WdlPrimitive[] = [
    "String",
    "Int",
    "Float",
    "Boolean",
    "File",
    "Directory",
  ];
  if ((primitives as string[]).includes(core)) {
    return { kind: "primitive", name: core as WdlPrimitive, optional };
  }

  if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(core)) {
    return { kind: "struct", name: core, optional };
  }

  return { kind: "unknown", raw: core, optional };
}

export function typesCompatible(source: WdlType, target: WdlType): boolean {
  if (target.optional && !source.optional) {
    return typesCompatible({ ...source, optional: true }, target) ||
      typesCompatible(source, { ...target, optional: false });
  }
  if (source.kind === "unknown" || target.kind === "unknown") return true;
  if (source.kind !== target.kind) return false;
  switch (source.kind) {
    case "primitive":
      return target.kind === "primitive" && source.name === target.name;
    case "array":
      return target.kind === "array" && typesCompatible(source.item, target.item);
    case "struct":
      return target.kind === "struct" && source.name === target.name;
    case "map":
      return (
        target.kind === "map" &&
        typesCompatible(source.key, target.key) &&
        typesCompatible(source.value, target.value)
      );
    case "pair":
      return (
        target.kind === "pair" &&
        typesCompatible(source.left, target.left) &&
        typesCompatible(source.right, target.right)
      );
  }
}

export function exprToString(expr: Expr): string {
  switch (expr.kind) {
    case "literal":
      if (typeof expr.value === "string") return JSON.stringify(expr.value);
      return String(expr.value);
    case "identifier":
      return expr.name;
    case "member":
      return `${exprToString(expr.object)}.${expr.field}`;
    case "index":
      return `${exprToString(expr.object)}[${exprToString(expr.index)}]`;
    case "call":
      return `${expr.name}(${expr.args.map(exprToString).join(", ")})`;
    case "binary":
      return `(${exprToString(expr.left)} ${expr.op} ${exprToString(expr.right)})`;
    case "unary":
      return `${expr.op}${exprToString(expr.expr)}`;
    case "ternary":
      return `if ${exprToString(expr.condition)} then ${exprToString(expr.then)} else ${exprToString(expr.else)}`;
    case "array":
      return `[${expr.items.map(exprToString).join(", ")}]`;
    case "raw":
      return expr.text;
  }
}

export function parseExpr(text: string): Expr {
  const t = text.trim();
  if (!t) return { kind: "raw", text: "" };
  if (/^".*"$/.test(t) || /^'.*'$/.test(t)) {
    try {
      return { kind: "literal", value: JSON.parse(t.replace(/^'/, '"').replace(/'$/, '"')), typeHint: "String" };
    } catch {
      return { kind: "raw", text: t };
    }
  }
  if (/^-?\d+$/.test(t)) return { kind: "literal", value: Number(t), typeHint: "Int" };
  if (/^-?\d+\.\d+$/.test(t)) return { kind: "literal", value: Number(t), typeHint: "Float" };
  if (t === "true" || t === "false") return { kind: "literal", value: t === "true", typeHint: "Boolean" };
  if (/^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)+$/.test(t)) {
    const parts = t.split(".");
    let expr: Expr = { kind: "identifier", name: parts[0] };
    for (let i = 1; i < parts.length; i++) {
      expr = { kind: "member", object: expr, field: parts[i] };
    }
    return expr;
  }
  if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(t)) return { kind: "identifier", name: t };
  return { kind: "raw", text: t };
}

export const TYPE_COLORS: Record<string, string> = {
  File: "#3b82f6",
  Directory: "#8b5cf6",
  String: "#22c55e",
  Int: "#f59e0b",
  Float: "#eab308",
  Boolean: "#ef4444",
  Array: "#06b6d4",
  Map: "#14b8a6",
  Pair: "#a855f7",
  Struct: "#64748b",
  default: "#94a3b8",
};

export function typeColor(t: WdlType): string {
  if (t.kind === "primitive") return TYPE_COLORS[t.name] ?? TYPE_COLORS.default;
  if (t.kind === "array") return TYPE_COLORS.Array;
  if (t.kind === "map") return TYPE_COLORS.Map;
  if (t.kind === "pair") return TYPE_COLORS.Pair;
  if (t.kind === "struct") return TYPE_COLORS.Struct;
  return TYPE_COLORS.default;
}

export function typeColorKey(t: WdlType): string {
  if (t.kind === "primitive") return t.name;
  if (t.kind === "array") return "Array";
  if (t.kind === "map") return "Map";
  if (t.kind === "pair") return "Pair";
  if (t.kind === "struct") return t.name || "Struct";
  return "Unknown";
}

/** Soft background from type color for badges / chips */
export function typeColorSoft(t: WdlType, alpha = 0.14): string {
  const hex = typeColor(t);
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
