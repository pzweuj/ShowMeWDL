import fs from "fs";
import { importWdlFiles } from "../src/features/wdl/import-export.ts";
import { singleWesDemo } from "../src/data/demo/single-wes.ts";

const content = fs.readFileSync("D:/Github/schema-germline/tasks/fastp.wdl", "utf8");
const p = importWdlFiles([{ path: "fastp.wdl", content }]);
console.log("parsed runtime", p.tasks[0].runtime);
console.log("parsed keys", Object.keys(p.tasks[0].runtime), Object.getOwnPropertyNames(p.tasks[0].runtime));
const t = singleWesDemo.tasks.find((x) => x.name === "Fastp")!;
console.log("demo runtime", t.runtime);
console.log("demo keys", Object.keys(t.runtime));
console.log("JSON demo", JSON.stringify(t.runtime));
