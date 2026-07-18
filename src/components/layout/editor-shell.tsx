"use client";

import { useEffect } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { WorkspaceTabs } from "@/components/layout/workspace-tabs";
import { SideLibrary } from "@/components/library/side-library";
import { WorkflowCanvas } from "@/components/canvas/workflow-canvas";
import { BottomEditor } from "@/components/center-editor/center-editor";
import { ToastHost } from "@/components/ui/toast";
import { useProjectStore } from "@/features/project/store";
import { useWorkspaceStore } from "@/features/workspace/workspace-store";

export function EditorShell() {
  const project = useProjectStore((s) => s.project);
  const hydrate = useWorkspaceStore((s) => s.hydrate);
  const persistActive = useWorkspaceStore((s) => s.persistActive);
  const hydrated = useWorkspaceStore((s) => s.hydrated);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated) return;
    const t = window.setTimeout(() => persistActive(), 500);
    return () => window.clearTimeout(t);
  }, [project, hydrated, persistActive]);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopBar />
      <WorkspaceTabs />
      <div className="flex min-h-0 flex-1">
        <SideLibrary />
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="relative min-h-0 flex-1">
            <WorkflowCanvas />
          </main>
          <BottomEditor />
        </div>
      </div>
      <ToastHost />
    </div>
  );
}
