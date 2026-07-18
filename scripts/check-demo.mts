import { singleWesDemo } from "../src/data/demo/single-wes.ts";
import { exportSingleFileWdl } from "../src/features/wdl/printer.ts";

const wf = singleWesDemo.workflows[0];
const t = singleWesDemo.tasks.find((x) => x.name === "Fastp");
console.log(
  JSON.stringify(
    {
      name: singleWesDemo.name,
      tasks: singleWesDemo.tasks.length,
      groups: singleWesDemo.dockerGroups.length,
      inputs: wf.inputs.map((i) => i.name),
      outputNames: wf.outputs.map((o) => o.name),
      fastpRuntime: t?.runtime,
      fastpCmdHead: t?.command?.slice(0, 100),
      calls: wf.nodes.filter((n) => n.kind === "call").length,
      edges: wf.edges.length,
      emptyTaskId: wf.nodes.filter((n) => n.kind === "call" && !n.taskId).length,
    },
    null,
    2,
  ),
);
const text = exportSingleFileWdl(singleWesDemo);
console.log("export bytes", text.length);
console.log("has workflow", text.includes("workflow SingleWES"));
console.log("has task Fastp", text.includes("task Fastp"));
