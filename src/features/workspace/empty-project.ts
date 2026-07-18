import { uid } from "@/lib/utils";
import type { ShowMeProject } from "@/features/project/types";

export function createEmptyProject(name = "未命名工程"): ShowMeProject {
  const wfId = uid("wf");
  return {
    version: 1,
    name,
    wdlVersion: "1.2",
    dockerGroups: [],
    tasks: [],
    structs: [],
    workflows: [
      {
        id: wfId,
        name: "Main",
        inputs: [],
        outputs: [],
        nodes: [],
        edges: [],
        layout: {},
      },
    ],
    activeWorkflowId: wfId,
  };
}
