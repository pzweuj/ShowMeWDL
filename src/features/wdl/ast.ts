import type { Expr, IOPort, RuntimeSpec, WdlType } from "@/features/project/types";

export type WdlDocument = {
  version: string;
  imports: WdlImport[];
  tasks: WdlTaskAst[];
  workflows: WdlWorkflowAst[];
  structs: WdlStructAst[];
};

export type WdlImport = {
  path: string;
  alias?: string;
};

export type WdlTaskAst = {
  name: string;
  inputs: IOPort[];
  outputs: Array<IOPort & { expression: Expr }>;
  command: string;
  runtime: RuntimeSpec;
  meta?: Record<string, string>;
};

export type WdlStructAst = {
  name: string;
  members: IOPort[];
};

export type WdlCallAst = {
  kind: "call";
  taskName: string;
  alias?: string;
  inputs: Record<string, Expr>;
  /** From preceding `# Section01` comment */
  section?: string;
};

export type WdlScatterAst = {
  kind: "scatter";
  itemVar: string;
  collection: Expr;
  body: WdlBodyElement[];
  section?: string;
};

export type WdlIfAst = {
  kind: "if";
  condition: Expr;
  body: WdlBodyElement[];
  section?: string;
};

export type WdlBodyElement = WdlCallAst | WdlScatterAst | WdlIfAst | WdlDeclAst;

export type WdlDeclAst = {
  kind: "decl";
  name: string;
  type: WdlType;
  expression?: Expr;
  section?: string;
};

export type WdlWorkflowAst = {
  name: string;
  inputs: IOPort[];
  body: WdlBodyElement[];
  outputs: Array<{ name: string; type: WdlType; value: Expr }>;
};
