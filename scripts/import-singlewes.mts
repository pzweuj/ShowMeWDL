import fs from "fs";
import path from "path";
import { importWdlFiles } from "../src/features/wdl/import-export.ts";
import type {
  CallNode,
  DeclNode,
  ShowMeProject,
  TaskDef,
  WorkflowInputNode,
  WorkflowSection,
} from "../src/features/project/types.ts";

/** Insert `# SectionNN · Title` on its own line before known anchors */
function injectSections(src: string): string {
  // Keep markers aligned with SECTION_ORDER / ALIAS_SECTION below
  const markers: Array<{ re: RegExp; section: string }> = [
    { re: /^([ \t]*)String\s+ref_fasta_name\s*=/m, section: "# Section01 · Prep" },
    { re: /^([ \t]*)call\s+FASTP\.Fastp\b/m, section: "# Section02 · BAM" },
    { re: /^([ \t]*)call\s+SAMTOOLS\.SamtoolsSexCheck\b/m, section: "# Section03 · QC" },
    { re: /^([ \t]*)call\s+DEEPVARIANT\.DeepVariant\b/m, section: "# Section04 · SNP Call" },
    {
      re: /^([ \t]*)call\s+GERMLINE\.SplitVcf\s+as\s+SplitVcf\b/m,
      section: "# Section05 · SNP Anno",
    },
    { re: /^([ \t]*)call\s+GATK\.MitochondrialMutect2\b/m, section: "# Section06 · MT" },
    { re: /^([ \t]*)call\s+CNVKIT\.CNVKitAntitarget\b/m, section: "# Section07 · CNV" },
    { re: /^([ \t]*)call\s+AUTOMAP\.AutoMap\b/m, section: "# Section08 · ROH" },
    { re: /^([ \t]*)call\s+TIEAWES\.TIEA_WES\b/m, section: "# Section09 · MEI" },
    {
      re: /^([ \t]*)call\s+EXPANSIONHUNTER\.ExpansionHunter\b/m,
      section: "# Section10 · STR",
    },
  ];

  let out = src;
  for (const { re, section } of markers) {
    if (out.includes(section)) continue;
    out = out.replace(re, (_m, indent: string) => `${indent}${section}\n${indent}`);
    // re-match the original line content: replace only inserted the section + indent,
    // we accidentally dropped the call line. Fix by capturing full line.
  }
  // Redo properly — capture full line
  out = src;
  for (const { re, section } of markers) {
    if (out.includes(section)) continue;
    out = out.replace(re, (full, indent: string) => `${indent}${section}\n${full}`);
  }
  return out;
}

/**
 * Section map from actual SingleWES call graph / WDL comments:
 *
 *  Prep      → 参数 + BED 整理（FixBed / TargetBed）
 *  BAM       → Fastp → BwaAlign → Markdup 生产线
 *  QC        → 覆盖度 / 性别 / 指纹 / 汇总报表
 *  SNP Call  → DeepVariant + Whatshap 分型 + LeftAlign（原始 SNP 链路）
 *  SNP Anno  → VEP 注释 + SNPInDelReport（报表并入，避免单节点分节）
 *  MT        → 线粒体 Mutect2 → VEP → Report
 *  CNV       → CNVkit 全流程 + 注释
 *  ROH       → AutoMap + ROHReport
 *  MEI       → TIEA → VEP → Report
 *  STR       → ExpansionHunter → Stranger → Report
 */
const ALIAS_SECTION: Record<string, string> = {
  // 01 · Prep
  FixBed: "01 · Prep",
  TargetBed: "01 · Prep",
  // 02 · BAM
  Fastp: "02 · BAM",
  BwaAlign: "02 · BAM",
  Markdup: "02 · BAM",
  // 03 · QC
  SamtoolsSexCheck: "03 · QC",
  Xamdst: "03 · QC",
  CreateMitoBed: "03 · QC",
  MtXamdst: "03 · QC",
  CollectQCMetrics: "03 · QC",
  FingerPrint: "03 · QC",
  QCReport: "03 · QC",
  // 04 · SNP Call (calling + phasing)
  DeepVariant: "04 · SNP Call",
  SplitVcfHap: "04 · SNP Call",
  Whatshap: "04 · SNP Call",
  UniversalMergeVcfsHap: "04 · SNP Call",
  LeftAlignAndTrimVariants: "04 · SNP Call",
  // 05 · SNP Anno (VEP + report)
  SplitVcf: "05 · SNP Anno",
  VEP_Parallel: "05 · SNP Anno",
  UniversalMergeVcfs: "05 · SNP Anno",
  SNPInDelReport: "05 · SNP Anno",
  // 06 · MT
  MitochondrialMutect2: "06 · MT",
  MtVEP: "06 · MT",
  MTReport: "06 · MT",
  // 07 · CNV
  CNVKitAntitarget: "07 · CNV",
  CNVKitCoverage: "07 · CNV",
  CNVKitFix: "07 · CNV",
  CNVGene: "07 · CNV",
  CNVRegion: "07 · CNV",
  CNVAnnoGene: "07 · CNV",
  CNVAnnoRegion: "07 · CNV",
  // 08 · ROH
  AutoMap: "08 · ROH",
  ROHReport: "08 · ROH",
  // 09 · MEI
  TIEA_WES: "09 · MEI",
  MeiVEP: "09 · MEI",
  MEIReport: "09 · MEI",
  // 10 · STR
  ExpansionHunter: "10 · STR",
  Stranger: "10 · STR",
  STRReport: "10 · STR",
};

const DECL_SECTION: Record<string, string> = {
  ref_fasta_name: "01 · Prep",
  clinvar_version: "01 · Prep",
  mt_xamdst_prefix: "03 · QC",
  phase_vcf_prefix: "04 · SNP Call",
  merged_vcf_prefix: "05 · SNP Anno",
  mt_vep_prefix: "06 · MT",
  cnv_gene_prefix: "07 · CNV",
  cnv_region_prefix: "07 · CNV",
  mei_vep_prefix: "09 · MEI",
  str_prefix: "10 · STR",
};

const SECTION_ORDER = [
  "01 · Prep",
  "02 · BAM",
  "03 · QC",
  "04 · SNP Call",
  "05 · SNP Anno",
  "06 · MT",
  "07 · CNV",
  "08 · ROH",
  "09 · MEI",
  "10 · STR",
];

const COL_W = 340;
const INPUT_X = 40;
const SECTION_X0 = 280;
const ROW_H = 150;
const TOP_Y = 100;

const root = "D:/Github/schema-germline";
const singleRaw = fs.readFileSync(path.join(root, "single.wdl"), "utf8");
const injected = injectSections(singleRaw);

const files: Array<{ path: string; content: string }> = [
  { path: "single.wdl", content: injected },
];
for (const name of fs.readdirSync(path.join(root, "tasks")).filter((f) => f.endsWith(".wdl"))) {
  files.push({
    path: `tasks/${name}`,
    content: fs.readFileSync(path.join(root, "tasks", name), "utf8"),
  });
}

const raw = importWdlFiles(files, "Schema Germline · SingleWES");
const wf = raw.workflows.find((w) => w.name === "SingleWES") ?? raw.workflows[0];
if (!wf) throw new Error("SingleWES workflow not found");

const usedTaskIds = new Set(
  wf.nodes
    .filter((n): n is CallNode => n.kind === "call")
    .map((n) => n.taskId)
    .filter(Boolean),
);

const nameCount = new Map<string, number>();
const finalTasks: TaskDef[] = [];
const taskIdMap = new Map<string, string>();
const groups = new Map<
  string,
  {
    id: string;
    docker?: string;
    label: string;
    taskIds: string[];
    defaults?: Record<string, string | number>;
  }
>();

for (const t of raw.tasks.filter((x) => usedTaskIds.has(x.id))) {
  const docker = t.runtime.docker ? String(t.runtime.docker) : undefined;
  const label = docker ? docker.split("/").pop()?.split(":")[0] || "tasks" : "local";
  const key = docker || `__${label}`;
  let g = groups.get(key);
  if (!g) {
    g = {
      id: `grp_${label.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase()}_${groups.size + 1}`,
      docker,
      label,
      taskIds: [],
      defaults: docker ? { docker, cpu: 8, memory: "16G" } : { cpu: 4, memory: "8G" },
    };
    groups.set(key, g);
  }
  const n = (nameCount.get(t.name) ?? 0) + 1;
  nameCount.set(t.name, n);
  const id = n === 1 ? `task_${t.name}` : `task_${t.name}_${n}`;
  g.taskIds.push(id);
  taskIdMap.set(t.id, id);
  const runtime: TaskDef["runtime"] = {};
  for (const [k, v] of Object.entries(t.runtime ?? {})) {
    if (v === null || v === undefined || v === "") continue;
    if (typeof v === "number" && Number.isNaN(v)) continue;
    runtime[k] = v as string | number | boolean;
  }
  finalTasks.push({
    ...t,
    id,
    groupId: g.id,
    command: t.command.replace(/\r\n/g, "\n").replace(/\r/g, "\n"),
    runtime,
  });
}

// Build sections from fixed order
const sections: WorkflowSection[] = SECTION_ORDER.map((title, i) => ({
  id: `sec_${String(i + 1).padStart(2, "0")}`,
  title,
  order: i,
}));
const titleToId = new Map(sections.map((s) => [s.title, s.id]));
const sectionRows = new Map<string, number>();
for (const s of sections) sectionRows.set(s.id, 0);

function place(sectionTitle: string) {
  const sid = titleToId.get(sectionTitle) ?? sections[0].id;
  const order = sections.find((s) => s.id === sid)?.order ?? 0;
  const row = sectionRows.get(sid) ?? 0;
  sectionRows.set(sid, row + 1);
  return {
    sectionId: sid,
    layout: { x: SECTION_X0 + order * COL_W, y: TOP_Y + row * ROW_H },
  };
}

const nodeIdMap = new Map<string, string>();
const newNodes: typeof wf.nodes = [];
const newLayout: Record<string, { x: number; y: number }> = {};

wf.inputs.forEach((input, idx) => {
  const old = wf.nodes.find((n) => n.kind === "workflow_input" && n.portName === input.name);
  const id = `win_${input.name}`;
  if (old) nodeIdMap.set(old.id, id);
  newNodes.push({ kind: "workflow_input", id, portName: input.name } as WorkflowInputNode);
  newLayout[id] = { x: INPUT_X, y: 40 + idx * 90 };
});

for (const n of wf.nodes) {
  if (n.kind === "workflow_input") continue;
  if (n.kind === "decl") {
    const id = `decl_${n.name}`;
    nodeIdMap.set(n.id, id);
    const title = DECL_SECTION[n.name] ?? "01 · Prep";
    const { sectionId, layout } = place(title);
    newNodes.push({ ...(n as DeclNode), id, sectionId });
    newLayout[id] = layout;
  } else if (n.kind === "call") {
    const alias = n.alias ?? n.id;
    const id = `call_${alias}`;
    nodeIdMap.set(n.id, id);
    const title = ALIAS_SECTION[alias] ?? "02 · BAM";
    const { sectionId, layout } = place(title);
    const bindings: CallNode["inputBindings"] = {};
    for (const [port, b] of Object.entries(n.inputBindings)) {
      if ("from" in b) bindings[port] = { from: { nodeId: b.from.nodeId, port: b.from.port } };
      else bindings[port] = b;
    }
    newNodes.push({
      ...n,
      id,
      taskId: taskIdMap.get(n.taskId) ?? "",
      sectionId,
      inputBindings: bindings,
    });
    newLayout[id] = layout;
  }
}

for (const node of newNodes) {
  if (node.kind !== "call") continue;
  for (const [port, b] of Object.entries(node.inputBindings)) {
    if ("from" in b) {
      const mapped = nodeIdMap.get(b.from.nodeId);
      if (mapped) node.inputBindings[port] = { from: { nodeId: mapped, port: b.from.port } };
    }
  }
}

const newEdges = wf.edges.map((e, i) => ({
  ...e,
  id: `e_${i + 1}`,
  source: nodeIdMap.get(e.source) ?? e.source,
  target: nodeIdMap.get(e.target) ?? e.target,
}));

const project: ShowMeProject = {
  version: 1,
  name: "Schema Germline · SingleWES",
  wdlVersion: "1.2",
  dockerGroups: [...groups.values()],
  tasks: finalTasks,
  workflows: [
    {
      id: "wf_single_wes",
      name: "SingleWES",
      inputs: wf.inputs,
      outputs: wf.outputs,
      nodes: newNodes,
      edges: newEdges,
      layout: newLayout,
      sections,
    },
  ],
  activeWorkflowId: "wf_single_wes",
};

const outPath = path.join("src", "data", "demo", "single-wes.ts");
fs.writeFileSync(
  outPath,
  `import type { ShowMeProject } from "@/features/project/types";

/** Demo from schema-germline/single.wdl — layout by # SectionNN pipeline stages */
export const singleWesDemo: ShowMeProject = ${JSON.stringify(project, null, 2)} as ShowMeProject;
`,
);

const bySec = new Map<string, number>();
for (const n of newNodes) {
  if (n.kind === "call" || n.kind === "decl") {
    const t = sections.find((s) => s.id === n.sectionId)?.title ?? "?";
    bySec.set(t, (bySec.get(t) ?? 0) + 1);
  }
}

console.log(
  JSON.stringify(
    {
      outPath,
      tasks: project.tasks.length,
      sections: sections.map((s) => s.title),
      nodesPerSection: Object.fromEntries(bySec),
      calls: newNodes.filter((n) => n.kind === "call").length,
      edges: newEdges.length,
      markers: (injected.match(/# Section\d+/g) || []).length,
    },
    null,
    2,
  ),
);
