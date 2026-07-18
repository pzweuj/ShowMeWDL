import type { ShowMeProject } from "@/features/project/types";

export const WORKSPACE_VERSION = 1;
const ROOT = "showme-wdl/v1";
const INDEX_KEY = `${ROOT}/index`;
const docKey = (id: string) => `${ROOT}/docs/${id}`;

export type WorkspaceDocMeta = {
  id: string;
  /** Virtual path, e.g. imports/Fastp.wdl or workspace/Main.wdl */
  path: string;
  /** Tab label */
  name: string;
  source: "import" | "demo" | "new";
  updatedAt: number;
};

export type WorkspaceIndex = {
  version: number;
  activeDocId: string | null;
  openTabIds: string[];
  docs: WorkspaceDocMeta[];
};

export function emptyIndex(): WorkspaceIndex {
  return { version: WORKSPACE_VERSION, activeDocId: null, openTabIds: [], docs: [] };
}

export function readIndex(): WorkspaceIndex {
  if (typeof window === "undefined") return emptyIndex();
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    if (!raw) return emptyIndex();
    const data = JSON.parse(raw) as WorkspaceIndex;
    if (data?.version !== WORKSPACE_VERSION || !Array.isArray(data.docs)) return emptyIndex();
    return {
      version: WORKSPACE_VERSION,
      activeDocId: data.activeDocId ?? null,
      openTabIds: Array.isArray(data.openTabIds) ? data.openTabIds : [],
      docs: data.docs,
    };
  } catch {
    return emptyIndex();
  }
}

export function writeIndex(index: WorkspaceIndex) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(INDEX_KEY, JSON.stringify(index));
  } catch {
    /* quota */
  }
}

export function readDoc(id: string): ShowMeProject | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(docKey(id));
    if (!raw) return null;
    const data = JSON.parse(raw) as ShowMeProject;
    if (data?.version !== 1 || !Array.isArray(data.workflows)) return null;
    return data;
  } catch {
    return null;
  }
}

export function writeDoc(id: string, project: ShowMeProject) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(docKey(id), JSON.stringify(project));
  } catch {
    /* quota */
  }
}

export function removeDoc(id: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(docKey(id));
  } catch {
    /* */
  }
}

/** Sanitize a filename into a virtual path segment */
export function safeFileName(name: string): string {
  const base = name.replace(/\.wdl$/i, "").trim() || "untitled";
  return base.replace(/[\\/:*?"<>|]+/g, "_").replace(/\s+/g, "_").slice(0, 80);
}

export function uniquePath(index: WorkspaceIndex, folder: string, fileName: string): string {
  const safe = safeFileName(fileName);
  let path = `${folder}/${safe}.wdl`;
  let i = 2;
  const used = new Set(index.docs.map((d) => d.path));
  while (used.has(path)) {
    path = `${folder}/${safe}_${i}.wdl`;
    i++;
  }
  return path;
}

export function pathToTabName(path: string): string {
  const seg = path.split("/").pop() ?? path;
  return seg.replace(/\.wdl$/i, "");
}
