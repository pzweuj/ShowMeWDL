import { parseWdl } from "../src/features/wdl/parser.ts";
import { importWdlFiles } from "../src/features/wdl/import-export.ts";
import fs from "fs";

const mini = `version 1.2
workflow W {
  input { String x }
  # Section01 · BAM
  call Fastp as Fastp { input: x = x }
  # Section02 · QC
  call Qc as Qc { input: x = Fastp.y }
}
task Fastp {
  input { String x }
  command <<< echo ~{x} >>>
  output { String y = "a" }
  runtime { docker: "ubuntu:22.04" }
}
task Qc {
  input { String x }
  command <<< echo ~{x} >>>
  output { String y = "b" }
  runtime { docker: "ubuntu:22.04" }
}
`;

const doc = parseWdl(mini);
console.log("body sections", doc.workflows[0].body.map((b) => ("section" in b ? b.section : null)));

const proj = importWdlFiles([{ path: "t.wdl", content: mini }]);
console.log(
  "project sections",
  proj.workflows[0].sections,
  proj.workflows[0].nodes
    .filter((n) => n.kind === "call")
    .map((n) => ({ a: n.alias, s: n.sectionId })),
);

// check injected single
const single = fs.readFileSync("D:/Github/schema-germline/single.wdl", "utf8");
const injected = single.replace(
  /\bcall\s+FASTP\.Fastp\b/,
  "# Section03 · BAM\n    $&",
);
const idx = injected.indexOf("# Section03");
console.log("injected snippet", JSON.stringify(injected.slice(idx, idx + 80)));
const d2 = parseWdl(injected);
const secs = d2.workflows[0].body
  .map((b) => ("section" in b ? b.section : undefined))
  .filter(Boolean);
console.log("unique sections from single", [...new Set(secs)]);
