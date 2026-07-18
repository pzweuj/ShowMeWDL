import { singleWesDemo } from "../src/data/demo/single-wes.ts";

const wf = singleWesDemo.workflows[0];
const secs = [...(wf.sections ?? [])].sort((a, b) => a.order - b.order);
console.log("=== SingleWES sections ===");
for (const s of secs) {
  const nodes = wf.nodes.filter(
    (n) => (n.kind === "call" || n.kind === "decl") && n.sectionId === s.id,
  );
  const labels = nodes.map((n) =>
    n.kind === "call" ? `call:${n.alias}` : n.kind === "decl" ? `decl:${n.name}` : n.id,
  );
  console.log(`[${s.order}] ${s.title} (${labels.length})`);
  console.log("   ", labels.join(", "));
}
const missing = wf.nodes.filter(
  (n) => (n.kind === "call" || n.kind === "decl") && !n.sectionId,
);
console.log("unsectioned", missing.map((n) => (n.kind === "call" ? n.alias : n.kind === "decl" ? n.name : n.id)));
