# ShowMeWDL

> **中文** · [English](./README.en.md)

类 ComfyUI 的 **WDL 可视化工作流编辑器**（Next.js 纯客户端）。

## 功能

- **Task 库**：按 Docker 镜像分组管理 task（input/output/command/runtime）
- **Workflow 库**：画布拖放 Call 节点、端口连线
- **Import / Export**
  - **导出 WDL**：单文件完整脚本
  - **结构 ZIP**：`tasks/<分组>.wdl` + 根目录 `Workflow.wdl`（自动 `import`）
  - 含 `# SectionNN` 分节注释
- **本地工作区**：浏览器 localStorage 按虚拟路径保存多份工程，标签切换
  - `demo/` · `imports/` · `workspace/`
- **Runtime 覆盖**：Call 级覆盖导出为 task 变体
- **静态类型连线校验**、深浅色主题
- **i18n**：中文 / English 切换（顶栏语言按钮，localStorage 记忆）
- 内置 **Demo**（来自 `schema-germline/single.wdl` 全流程）

## 开发

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)

```bash
npm test
npm run build
```

## 使用

1. 启动后默认加载 Demo
2. 左侧 **Task 库** 拖拽 task 到中间画布
3. 单击节点在底部面板编辑；双击空白编辑 Workflow
4. 顶栏 **导入 WDL** / **导出 WDL**

## 技术栈

Next.js · React Flow · Zustand · Tailwind · TypeScript 自研 WDL 子集 parser/printer
