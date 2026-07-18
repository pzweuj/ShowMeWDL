# ShowMeWDL

> [中文](./README.md) · **English**

A ComfyUI-style **WDL visual workflow editor** (Next.js, fully client-side).

## Features

- **Task Library**: manage tasks grouped by Docker image (input/output/command/runtime)
- **Workflow Library**: drag-and-drop Call nodes on canvas, port-based connections
- **Import / Export**
  - **Export WDL**: single-file full script
  - **Structured ZIP**: `tasks/<group>.wdl` + root `Workflow.wdl` (auto `import`)
  - Includes `# SectionNN` section comments
- **Local Workspace**: browser localStorage saves multiple projects by virtual path, tabbed switching
  - `demo/` · `imports/` · `workspace/`
- **Runtime Overrides**: Call-level overrides exported as task variants
- **Static-typed connection validation**, light/dark themes
- **i18n**: Chinese / English toggle (top-bar language button, localStorage memory)
- Built-in **Demo** (from `schema-germline/single.wdl` full pipeline)

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

```bash
npm test
npm run build
```

## Usage

1. On startup, the Demo loads by default
2. Drag tasks from the left **Task Library** onto the canvas
3. Click a node to edit it in the bottom panel; double-click empty space to edit the Workflow
4. Top bar: **Import WDL** / **Export WDL**

## Tech Stack

Next.js · React Flow · Zustand · Tailwind · TypeScript with a self-built WDL-subset parser/printer
