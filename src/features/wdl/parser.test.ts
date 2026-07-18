import { describe, expect, it } from "vitest";
import { parseWdl } from "./parser";
import { exportProjectToWdl, exportSingleFileWdl } from "./printer";
import { importWdlSource } from "./import-export";
import { miniNgsDemo } from "@/data/demo/mini-ngs";

const sample = `version 1.2

task Fastp {
    input {
        String prefix
        File read_1
        File read_2
        Int threads = 8
    }

    command <<<
        fastp -i ~{read_1} -I ~{read_2} -o ~{prefix}_R1.clean.fq.gz
    >>>

    output {
        File clean_read_1 = "~{prefix}_R1.clean.fq.gz"
    }

    runtime {
        docker: "ubuntu:22.04"
        cpu: 4
        memory: "8G"
    }
}

workflow Mini {
    input {
        String prefix
        File read_1
        File read_2
    }

    call Fastp {
        input:
            prefix = prefix,
            read_1 = read_1,
            read_2 = read_2
    }

    output {
        File out = Fastp.clean_read_1
    }
}
`;

describe("wdl parser", () => {
  it("parses task and workflow", () => {
    const doc = parseWdl(sample);
    expect(doc.version).toBe("1.2");
    expect(doc.tasks).toHaveLength(1);
    expect(doc.tasks[0].name).toBe("Fastp");
    expect(doc.tasks[0].inputs.map((i) => i.name)).toEqual([
      "prefix",
      "read_1",
      "read_2",
      "threads",
    ]);
    expect(doc.workflows[0].name).toBe("Mini");
    expect(doc.workflows[0].body.filter((b) => b.kind === "call")).toHaveLength(1);
  });

  it("imports sample into project", () => {
    const project = importWdlSource(sample, "t");
    expect(project.tasks[0].name).toBe("Fastp");
    expect(project.workflows[0].nodes.some((n) => n.kind === "call")).toBe(true);
  });

  it("exports demo project", () => {
    const text = exportSingleFileWdl(miniNgsDemo);
    expect(text).toContain("version 1.2");
    expect(text).toContain("task Fastp");
    expect(text).toContain("workflow MiniGermline");
    expect(text).toContain("call Fastp");
  });

  it("structured export splits tasks by group with imports", () => {
    const files = exportProjectToWdl(miniNgsDemo);
    const paths = files.map((f) => f.path);
    expect(paths.some((p) => p.startsWith("tasks/"))).toBe(true);
    expect(paths.some((p) => p.endsWith(".wdl") && !p.startsWith("tasks/"))).toBe(true);
    const wfFile = files.find((f) => !f.path.startsWith("tasks/"));
    expect(wfFile?.content).toMatch(/import "tasks\//);
    expect(wfFile?.content).toMatch(/as [A-Z0-9_]+/);
    expect(wfFile?.content).toContain("workflow ");
    const taskFile = files.find((f) => f.path.startsWith("tasks/"));
    expect(taskFile?.content).toContain("task ");
    expect(taskFile?.content).toContain("version ");
  });

  it("parses and re-exports struct definitions", () => {
    const src = `version 1.2

struct SampleInfo {
    String sample_id
    File bam
}

task T {
    input {
        SampleInfo info
    }
    command <<< echo ~{info.sample_id} >>>
    output {
        String out = "ok"
    }
    runtime {
        docker: "ubuntu:22.04"
    }
}

workflow W {
    input {
        SampleInfo info
    }
    call T {
        input:
            info = info
    }
}
`;
    const doc = parseWdl(src);
    expect(doc.structs).toHaveLength(1);
    expect(doc.structs[0].name).toBe("SampleInfo");
    expect(doc.structs[0].members.map((m) => m.name)).toEqual(["sample_id", "bam"]);

    const project = importWdlSource(src, "struct-demo");
    expect(project.structs?.length).toBe(1);
    expect(project.structs?.[0].name).toBe("SampleInfo");
    const out = exportSingleFileWdl(project);
    expect(out).toContain("struct SampleInfo");
    expect(out).toContain("String sample_id");
    expect(out).toContain("File bam");
  });

  it("exports and re-imports section comments", () => {
    const src = `version 1.2

task T {
    input { String x }
    command <<< echo ~{x} >>>
    output { String y = "a" }
    runtime { docker: "ubuntu:22.04" }
}

workflow W {
    input { String x }

    # Section01 · Prep
    String name = x

    # Section02 · Run
    call T as Step {
        input:
            x = name
    }
}
`;
    const project = importWdlSource(src, "sec");
    const secs = project.workflows[0].sections ?? [];
    expect(secs.length).toBeGreaterThanOrEqual(2);
    const out = exportSingleFileWdl(project);
    expect(out).toMatch(/# Section0?1/);
    expect(out).toMatch(/# Section0?2/);
    // re-import preserves sections
    const again = importWdlSource(out, "sec2");
    expect((again.workflows[0].sections ?? []).length).toBeGreaterThanOrEqual(2);
  });
});
