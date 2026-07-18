import type { ShowMeProject } from "@/features/project/types";

export const miniNgsDemo: ShowMeProject = {
  version: 1,
  name: "迷你 NGS 三联",
  wdlVersion: "1.2",
  dockerGroups: [
    {
      id: "grp_mapping",
      docker: "docker.schema-bio.com/schemabio/mapping:v1.0.0",
      label: "mapping",
      defaults: { cpu: 8, memory: "16G" },
      taskIds: ["task_fastp", "task_bwa", "task_markdup"],
    },
    {
      id: "grp_qc",
      docker: "docker.schema-bio.com/schemabio/germline:v0.1.3",
      label: "qc",
      defaults: { cpu: 4, memory: "8G" },
      taskIds: ["task_qc"],
    },
  ],
  tasks: [
    {
      id: "task_fastp",
      name: "Fastp",
      groupId: "grp_mapping",
      inputs: [
        { name: "prefix", type: { kind: "primitive", name: "String" } },
        { name: "read_1", type: { kind: "primitive", name: "File" } },
        { name: "read_2", type: { kind: "primitive", name: "File" } },
        {
          name: "threads",
          type: { kind: "primitive", name: "Int" },
          default: { kind: "literal", value: 8, typeHint: "Int" },
        },
      ],
      outputs: [
        { name: "clean_read_1", type: { kind: "primitive", name: "File" } },
        { name: "clean_read_2", type: { kind: "primitive", name: "File" } },
        { name: "json_report", type: { kind: "primitive", name: "File" } },
      ],
      command: `fastp \\
    -i ~{read_1} \\
    -I ~{read_2} \\
    -o ~{prefix}_R1.clean.fq.gz \\
    -O ~{prefix}_R2.clean.fq.gz \\
    -w ~{threads} \\
    -j ~{prefix}.fastp_stats.json \\
    --detect_adapter_for_pe`,
      runtime: {
        docker: "docker.schema-bio.com/schemabio/mapping:v1.0.0",
        cpu: 8,
        memory: "16G",
      },
    },
    {
      id: "task_bwa",
      name: "BwaAlign",
      groupId: "grp_mapping",
      inputs: [
        { name: "prefix", type: { kind: "primitive", name: "String" } },
        { name: "read_1", type: { kind: "primitive", name: "File" } },
        { name: "read_2", type: { kind: "primitive", name: "File" } },
        { name: "ref_dir", type: { kind: "primitive", name: "Directory" } },
        { name: "ref_fasta_name", type: { kind: "primitive", name: "String" } },
        {
          name: "threads",
          type: { kind: "primitive", name: "Int" },
          default: { kind: "literal", value: 16, typeHint: "Int" },
        },
      ],
      outputs: [
        { name: "out_bam", type: { kind: "primitive", name: "File" } },
        { name: "out_bai", type: { kind: "primitive", name: "File" } },
      ],
      command: `bwa mem -t ~{threads} -M \\
    -R "@RG\\tID:~{prefix}\\tSM:~{prefix}\\tPL:ShowMeWDL" \\
    ~{ref_dir}/~{ref_fasta_name} \\
    ~{read_1} ~{read_2} | \\
samtools sort -@ 4 -m 2G -o ~{prefix}.sorted.bam -
samtools index ~{prefix}.sorted.bam`,
      runtime: {
        docker: "docker.schema-bio.com/schemabio/mapping:v1.0.0",
        cpu: 16,
        memory: "32G",
      },
    },
    {
      id: "task_markdup",
      name: "SambambaMarkdup",
      groupId: "grp_mapping",
      inputs: [
        { name: "prefix", type: { kind: "primitive", name: "String" } },
        { name: "bam", type: { kind: "primitive", name: "File" } },
        { name: "bai", type: { kind: "primitive", name: "File" } },
        {
          name: "threads",
          type: { kind: "primitive", name: "Int" },
          default: { kind: "literal", value: 8, typeHint: "Int" },
        },
      ],
      outputs: [
        { name: "markdup_bam", type: { kind: "primitive", name: "File" } },
        { name: "markdup_bai", type: { kind: "primitive", name: "File" } },
      ],
      command: `sambamba markdup -t ~{threads} ~{bam} ~{prefix}.markdup.bam
sambamba index -t ~{threads} ~{prefix}.markdup.bam`,
      runtime: {
        docker: "docker.schema-bio.com/schemabio/mapping:v1.0.0",
        cpu: 8,
        memory: "16G",
      },
    },
    {
      id: "task_qc",
      name: "SimpleQc",
      groupId: "grp_qc",
      inputs: [
        { name: "prefix", type: { kind: "primitive", name: "String" } },
        { name: "bam", type: { kind: "primitive", name: "File" } },
        { name: "bai", type: { kind: "primitive", name: "File" } },
      ],
      outputs: [
        { name: "qc_json", type: { kind: "primitive", name: "File" } },
      ],
      command: `samtools flagstat ~{bam} > ~{prefix}.flagstat.txt
echo '{"prefix":"~{prefix}"}' > ~{prefix}.qc.json`,
      runtime: {
        docker: "docker.schema-bio.com/schemabio/germline:v0.1.3",
        cpu: 4,
        memory: "8G",
      },
    },
  ],
  workflows: [
    {
      id: "wf_mini",
      name: "MiniGermline",
      inputs: [
        { name: "prefix", type: { kind: "primitive", name: "String" } },
        { name: "read_1", type: { kind: "primitive", name: "File" } },
        { name: "read_2", type: { kind: "primitive", name: "File" } },
        { name: "ref_dir", type: { kind: "primitive", name: "Directory" } },
        { name: "ref_fasta_name", type: { kind: "primitive", name: "String" } },
      ],
      outputs: [
        {
          name: "bam",
          type: { kind: "primitive", name: "File" },
          value: { kind: "member", object: { kind: "identifier", name: "Markdup" }, field: "markdup_bam" },
        },
        {
          name: "bai",
          type: { kind: "primitive", name: "File" },
          value: { kind: "member", object: { kind: "identifier", name: "Markdup" }, field: "markdup_bai" },
        },
        {
          name: "qc",
          type: { kind: "primitive", name: "File" },
          value: { kind: "member", object: { kind: "identifier", name: "Qc" }, field: "qc_json" },
        },
      ],
      nodes: [
        { kind: "workflow_input", id: "win_prefix", portName: "prefix" },
        { kind: "workflow_input", id: "win_r1", portName: "read_1" },
        { kind: "workflow_input", id: "win_r2", portName: "read_2" },
        { kind: "workflow_input", id: "win_refdir", portName: "ref_dir" },
        { kind: "workflow_input", id: "win_refname", portName: "ref_fasta_name" },
        {
          kind: "call",
          id: "call_fastp",
          taskId: "task_fastp",
          alias: "Fastp",
          inputBindings: {},
        },
        {
          kind: "call",
          id: "call_bwa",
          taskId: "task_bwa",
          alias: "BwaAlign",
          inputBindings: {},
        },
        {
          kind: "call",
          id: "call_markdup",
          taskId: "task_markdup",
          alias: "Markdup",
          inputBindings: {},
        },
        {
          kind: "call",
          id: "call_qc",
          taskId: "task_qc",
          alias: "Qc",
          inputBindings: {},
        },
      ],
      edges: [
        { id: "e1", source: "win_prefix", sourceHandle: "prefix", target: "call_fastp", targetHandle: "prefix" },
        { id: "e2", source: "win_r1", sourceHandle: "read_1", target: "call_fastp", targetHandle: "read_1" },
        { id: "e3", source: "win_r2", sourceHandle: "read_2", target: "call_fastp", targetHandle: "read_2" },
        { id: "e4", source: "win_prefix", sourceHandle: "prefix", target: "call_bwa", targetHandle: "prefix" },
        { id: "e5", source: "call_fastp", sourceHandle: "clean_read_1", target: "call_bwa", targetHandle: "read_1" },
        { id: "e6", source: "call_fastp", sourceHandle: "clean_read_2", target: "call_bwa", targetHandle: "read_2" },
        { id: "e7", source: "win_refdir", sourceHandle: "ref_dir", target: "call_bwa", targetHandle: "ref_dir" },
        { id: "e8", source: "win_refname", sourceHandle: "ref_fasta_name", target: "call_bwa", targetHandle: "ref_fasta_name" },
        { id: "e9", source: "win_prefix", sourceHandle: "prefix", target: "call_markdup", targetHandle: "prefix" },
        { id: "e10", source: "call_bwa", sourceHandle: "out_bam", target: "call_markdup", targetHandle: "bam" },
        { id: "e11", source: "call_bwa", sourceHandle: "out_bai", target: "call_markdup", targetHandle: "bai" },
        { id: "e12", source: "win_prefix", sourceHandle: "prefix", target: "call_qc", targetHandle: "prefix" },
        { id: "e13", source: "call_markdup", sourceHandle: "markdup_bam", target: "call_qc", targetHandle: "bam" },
        { id: "e14", source: "call_markdup", sourceHandle: "markdup_bai", target: "call_qc", targetHandle: "bai" },
      ],
      layout: {
        win_prefix: { x: 40, y: 40 },
        win_r1: { x: 40, y: 140 },
        win_r2: { x: 40, y: 240 },
        win_refdir: { x: 40, y: 340 },
        win_refname: { x: 40, y: 440 },
        call_fastp: { x: 320, y: 120 },
        call_bwa: { x: 620, y: 200 },
        call_markdup: { x: 920, y: 200 },
        call_qc: { x: 1220, y: 200 },
      },
    },
  ],
  activeWorkflowId: "wf_mini",
};
