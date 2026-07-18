import { beforeEach, describe, expect, it } from "vitest";
import { useProjectStore } from "@/features/project/store";
import { miniNgsDemo } from "@/data/demo/mini-ngs";
import { exportSingleFileWdl } from "@/features/wdl/printer";

function reset() {
  useProjectStore.getState().loadProject(structuredClone(miniNgsDemo));
}

describe("workflow editing", () => {
  beforeEach(reset);

  it("adds and removes workflow inputs", () => {
    const before = useProjectStore.getState().getActiveWorkflow()?.inputs.length ?? 0;
    useProjectStore.getState().addWorkflowInput("new_ref", { kind: "primitive", name: "File" });
    const wf = useProjectStore.getState().getActiveWorkflow()!;
    expect(wf.inputs.some((i) => i.name === "new_ref")).toBe(true);
    expect(wf.nodes.some((n) => n.kind === "workflow_input" && n.portName === "new_ref")).toBe(true);
    useProjectStore.getState().removeWorkflowInput("new_ref");
    const after = useProjectStore.getState().getActiveWorkflow()!;
    expect(after.inputs.some((i) => i.name === "new_ref")).toBe(false);
    expect(after.inputs.length).toBe(before);
  });

  it("adds a workflow-level decl and exports it", () => {
    useProjectStore.getState().addWorkflowDecl(
      "ref_fasta_name",
      { kind: "primitive", name: "String" },
      'basename("ref.fasta")',
    );
    const wf = useProjectStore.getState().getActiveWorkflow()!;
    expect(wf.nodes.some((n) => n.kind === "decl" && n.name === "ref_fasta_name")).toBe(true);
    const text = exportSingleFileWdl(useProjectStore.getState().project);
    expect(text).toContain("String ref_fasta_name = ");
  });

  it("supports one output -> many call inputs (one-to-many)", () => {
    const wf = useProjectStore.getState().getActiveWorkflow()!;
    const bwa = wf.nodes.find((n) => n.kind === "call" && n.alias === "BwaAlign")!;
    const markdup = wf.nodes.find((n) => n.kind === "call" && n.alias === "Markdup")!;

    // connect BwaAlign.out_bam to Markdup.bam (already exists in demo) — ensure we can add another edge from same source
    const ok1 = useProjectStore.getState().addEdge({
      source: bwa.id,
      sourceHandle: "out_bam",
      target: markdup.id,
      targetHandle: "bam",
    });
    // connect same output to a different input handle on the same target
    const ok2 = useProjectStore.getState().addEdge({
      source: bwa.id,
      sourceHandle: "out_bam",
      target: markdup.id,
      targetHandle: "bai",
    });
    expect(ok1).toBe(true);
    expect(ok2).toBe(true);

    const after = useProjectStore.getState().getActiveWorkflow()!;
    const fromBwaBam = after.edges.filter(
      (e) => e.source === bwa.id && e.sourceHandle === "out_bam",
    );
    expect(fromBwaBam.length).toBeGreaterThanOrEqual(2);
    expect(fromBwaBam.some((e) => e.targetHandle === "bam")).toBe(true);
    expect(fromBwaBam.some((e) => e.targetHandle === "bai")).toBe(true);
  });

  it("replaces edge when same target handle is connected again", () => {
    const wf = useProjectStore.getState().getActiveWorkflow()!;
    const bwa = wf.nodes.find((n) => n.kind === "call" && n.alias === "BwaAlign")!;
    const markdup = wf.nodes.find((n) => n.kind === "call" && n.alias === "Markdup")!;
    const before = useProjectStore
      .getState()
      .getActiveWorkflow()!
      .edges.filter((e) => e.target === markdup.id && e.targetHandle === "bam").length;
    useProjectStore.getState().addEdge({
      source: bwa.id,
      sourceHandle: "out_bam",
      target: markdup.id,
      targetHandle: "bam",
    });
    const after = useProjectStore
      .getState()
      .getActiveWorkflow()!
      .edges.filter((e) => e.target === markdup.id && e.targetHandle === "bam").length;
    expect(after).toBe(before); // not duplicated
  });
});
