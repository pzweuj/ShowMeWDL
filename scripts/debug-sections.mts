import fs from "fs";
import path from "path";
import { parseWdl } from "../src/features/wdl/parser.ts";

function injectSections(src: string): string {
  const markers: Array<{ before: RegExp; section: string }> = [
    { before: /\bString\s+ref_fasta_name\s*=/, section: "# Section01 · Params" },
    { before: /\bcall\s+GERMLINE\.FixBed\b/, section: "# Section02 · BED" },
    { before: /\bcall\s+FASTP\.Fastp\b/, section: "# Section03 · BAM" },
    { before: /\bcall\s+SAMTOOLS\.SamtoolsSexCheck\b/, section: "# Section04 · QC" },
    { before: /\bcall\s+DEEPVARIANT\.DeepVariant\b/, section: "# Section05 · SNP/InDel" },
    { before: /\bcall\s+GERMLINE\.SplitVcf\s+as\s+SplitVcfHap\b/, section: "# Section06 · Phasing" },
    { before: /\bcall\s+GERMLINE\.SplitVcf\s+as\s+SplitVcf\b/, section: "# Section07 · VEP" },
    { before: /\bcall\s+GERMLINE\.SNPInDelReport\b/, section: "# Section08 · SNP Report" },
    { before: /\bcall\s+GATK\.MitochondrialMutect2\b/, section: "# Section09 · Mitochondria" },
    { before: /\bcall\s+CNVKIT\.CNVKitAntitarget\b/, section: "# Section10 · CNV" },
    { before: /\bcall\s+AUTOMAP\.AutoMap\b/, section: "# Section11 · ROH" },
    { before: /\bcall\s+TIEAWES\.TIEA_WES\b/, section: "# Section12 · MEI" },
    { before: /\bcall\s+EXPANSIONHUNTER\.ExpansionHunter\b/, section: "# Section13 · STR" },
  ];
  let out = src;
  for (const { before, section } of markers) {
    if (out.includes(section)) continue;
    out = out.replace(before, `${section}\n    $&`);
  }
  return out;
}

const root = "D:/Github/schema-germline";
const singleRaw = fs.readFileSync(path.join(root, "single.wdl"), "utf8");
const injected = injectSections(singleRaw);

// show lines with Section
const lines = injected.split(/\r?\n/);
const secLines = lines
  .map((l, i) => ({ i: i + 1, l: l.trim() }))
  .filter((x) => /Section\d+/i.test(x.l));
console.log("section lines", secLines);

// extract just workflow body region
const wfStart = injected.indexOf("workflow SingleWES");
const wf = injected.slice(wfStart, wfStart + 8000);
fs.writeFileSync("C:/Users/pzweu/AppData/Local/Temp/opencode/injected-wf-head.txt", wf);

const doc = parseWdl(injected);
const body = doc.workflows[0].body;
const bySec = new Map<string, number>();
for (const el of body) {
  const s = ("section" in el && el.section) || "(none)";
  bySec.set(s, (bySec.get(s) ?? 0) + 1);
}
console.log("body by section", Object.fromEntries(bySec));
console.log(
  "first 10 body",
  body.slice(0, 10).map((b) => ({
    kind: b.kind,
    name: "alias" in b ? b.alias ?? b.taskName : "name" in b ? b.name : "?",
    section: "section" in b ? b.section : null,
  })),
);
