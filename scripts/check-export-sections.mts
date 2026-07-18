import { singleWesDemo } from "../src/data/demo/single-wes.ts";
import { exportSingleFileWdl } from "../src/features/wdl/printer.ts";

const t = exportSingleFileWdl(singleWesDemo);
const lines = t.split(/\n/).filter((l) => /# Section/.test(l));
console.log(lines.join("\n"));
console.log("count", lines.length);
// show a small body sample
const wi = t.indexOf("workflow SingleWES");
console.log(t.slice(wi, wi + 900));
