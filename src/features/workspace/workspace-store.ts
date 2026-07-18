"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { singleWesDemo } from "@/data/demo/single-wes";
import { uid } from "@/lib/utils";
import type { ShowMeProject } from "@/features/project/types";
import { useProjectStore } from "@/features/project/store";
import { createEmptyProject } from "./empty-project";
import {
  emptyIndex,
  pathToTabName,
  readDoc,
  readIndex,
  uniquePath,
  writeDoc,
  writeIndex,
  type WorkspaceDocMeta,
  type WorkspaceIndex,
} from "./storage";

type WorkspaceState = {
  index: WorkspaceIndex;
  hydrated: boolean;

  hydrate: () => void;
  /** Persist current project into active doc + index timestamps */
  persistActive: () => void;
  switchTab: (docId: string) => boolean;
  closeTab: (docId: string) => void;
  /** Open project as a new tab (import / demo / new) */
  openProject: (
    project: ShowMeProject,
    opts: { pathFolder: "imports" | "workspace" | "demo"; fileName: string; source: WorkspaceDocMeta["source"] },
  ) => string;
  openDemo: () => void;
  openNew: () => void;
  renameActive: (name: string) => void;
};

function applyProject(project: ShowMeProject) {
  useProjectStore.getState().loadProject(project);
}

function syncActiveToStore(index: WorkspaceIndex) {
  writeIndex(index);
  if (!index.activeDocId) {
    applyProject(structuredClone(singleWesDemo));
    return;
  }
  const doc = readDoc(index.activeDocId);
  if (doc) applyProject(doc);
  else {
    // broken doc — drop it
    index.docs = index.docs.filter((d) => d.id !== index.activeDocId);
    index.openTabIds = index.openTabIds.filter((id) => id !== index.activeDocId);
    index.activeDocId = index.openTabIds[0] ?? index.docs[0]?.id ?? null;
    writeIndex(index);
    if (index.activeDocId) {
      const next = readDoc(index.activeDocId);
      if (next) applyProject(next);
      else applyProject(structuredClone(singleWesDemo));
    } else {
      applyProject(structuredClone(singleWesDemo));
    }
  }
}

export const useWorkspaceStore = create<WorkspaceState>()(
  immer((set, get) => ({
    index: emptyIndex(),
    hydrated: false,

    hydrate: () => {
      if (typeof window === "undefined") return;
      const index = readIndex();
      if (!index.docs.length) {
        // seed demo as first tab
        const id = uid("doc");
        const project = structuredClone(singleWesDemo);
        const meta: WorkspaceDocMeta = {
          id,
          path: "demo/Demo.wdl",
          name: "Demo",
          source: "demo",
          updatedAt: Date.now(),
        };
        writeDoc(id, project);
        const next: WorkspaceIndex = {
          version: 1,
          activeDocId: id,
          openTabIds: [id],
          docs: [meta],
        };
        writeIndex(next);
        applyProject(project);
        set((s) => {
          s.index = next;
          s.hydrated = true;
        });
        return;
      }

      // ensure open tabs still exist
      index.openTabIds = index.openTabIds.filter((id) => index.docs.some((d) => d.id === id));
      if (!index.openTabIds.length && index.docs[0]) {
        index.openTabIds = [index.docs[0].id];
      }
      if (!index.activeDocId || !index.openTabIds.includes(index.activeDocId)) {
        index.activeDocId = index.openTabIds[0] ?? null;
      }
      writeIndex(index);
      syncActiveToStore(index);
      set((s) => {
        s.index = index;
        s.hydrated = true;
      });
    },

    persistActive: () => {
      const { index } = get();
      if (!index.activeDocId) return;
      const project = useProjectStore.getState().project;
      writeDoc(index.activeDocId, project);
      set((s) => {
        const doc = s.index.docs.find((d) => d.id === s.index.activeDocId);
        if (doc) {
          doc.updatedAt = Date.now();
          // keep path; update display name from project if user renamed
          if (project.name?.trim()) {
            doc.name = project.name.trim();
          }
        }
        writeIndex(s.index);
      });
    },

    switchTab: (docId) => {
      const { index } = get();
      if (docId === index.activeDocId) return true;
      const meta = index.docs.find((d) => d.id === docId);
      if (!meta) return false;

      // save current first
      get().persistActive();

      const project = readDoc(docId);
      if (!project) return false;

      set((s) => {
        if (!s.index.openTabIds.includes(docId)) s.index.openTabIds.push(docId);
        s.index.activeDocId = docId;
        writeIndex(s.index);
      });
      applyProject(project);
      return true;
    },

    closeTab: (docId) => {
      const { index } = get();
      if (index.openTabIds.length <= 1 && index.activeDocId === docId) {
        // keep at least one tab — switch to new empty instead of empty workspace
        get().persistActive();
        get().openNew();
        // remove the closed one if still present and not the only new one
        set((s) => {
          if (s.index.openTabIds.length > 1) {
            s.index.openTabIds = s.index.openTabIds.filter((id) => id !== docId);
            // keep doc in library (docs list) unless user wants delete — keep for history
            writeIndex(s.index);
          }
        });
        return;
      }

      if (index.activeDocId === docId) get().persistActive();

      set((s) => {
        s.index.openTabIds = s.index.openTabIds.filter((id) => id !== docId);
        if (s.index.activeDocId === docId) {
          s.index.activeDocId = s.index.openTabIds[0] ?? null;
        }
        writeIndex(s.index);
      });

      const nextId = get().index.activeDocId;
      if (nextId) {
        const project = readDoc(nextId);
        if (project) applyProject(project);
      }
    },

    openProject: (project, opts) => {
      get().persistActive();
      const index = get().index;
      const path = uniquePath(index, opts.pathFolder, opts.fileName);
      const id = uid("doc");
      const meta: WorkspaceDocMeta = {
        id,
        path,
        name: pathToTabName(path),
        source: opts.source,
        updatedAt: Date.now(),
      };
      // ensure project name mirrors tab
      const proj = {
        ...project,
        name: project.name || meta.name,
      };
      writeDoc(id, proj);

      set((s) => {
        s.index.docs.push(meta);
        if (!s.index.openTabIds.includes(id)) s.index.openTabIds.push(id);
        s.index.activeDocId = id;
        writeIndex(s.index);
      });
      applyProject(proj);
      return id;
    },

    openDemo: () => {
      get().openProject(structuredClone(singleWesDemo), {
        pathFolder: "demo",
        fileName: "Demo",
        source: "demo",
      });
    },

    openNew: () => {
      get().openProject(createEmptyProject("未命名工程"), {
        pathFolder: "workspace",
        fileName: "Untitled",
        source: "new",
      });
    },

    renameActive: (name) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      useProjectStore.getState().setProjectName(trimmed);
      set((s) => {
        const doc = s.index.docs.find((d) => d.id === s.index.activeDocId);
        if (doc) {
          doc.name = trimmed;
          // update path leaf while keeping folder
          const folder = doc.path.includes("/") ? doc.path.split("/").slice(0, -1).join("/") : "workspace";
          const safe = trimmed.replace(/[\\/:*?"<>|]+/g, "_").replace(/\s+/g, "_").slice(0, 80);
          doc.path = `${folder}/${safe}.wdl`;
          doc.updatedAt = Date.now();
        }
        writeIndex(s.index);
      });
      get().persistActive();
    },
  })),
);
