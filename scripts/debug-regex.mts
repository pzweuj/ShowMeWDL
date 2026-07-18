import fs from "fs";

const src = fs.readFileSync("D:/Github/schema-germline/single.wdl", "utf8");
const injected = src.replace(/\bString\s+ref_fasta_name\s*=/, "# Section01 · Params\n    $&");
const line = injected
  .split(/\r?\n/)
  .map((l) => l.trim())
  .find((l) => l.includes("Section01"))!;
console.log("line", JSON.stringify(line));
console.log(
  "codes",
  [...line].map((c) => c + ":" + c.charCodeAt(0).toString(16)),
);

const re = /^#\s*[Ss]ection\s*(?:0*(\d+))?\s*(?:[:·\-|–—]\s*(.+))?$/;
console.log("match", re.exec(line));

// simpler re
const re2 = /^#\s*[Ss]ection\s*0*(\d+)\s*(?:[:\-·|]\s*(.+))?$/u;
console.log("match2", re2.exec(line));
