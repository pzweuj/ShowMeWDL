"use client";

import { FileCode2, X } from "lucide-react";
import { useWorkspaceStore } from "@/features/workspace/workspace-store";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/context";

function folderOf(path: string) {
  const i = path.lastIndexOf("/");
  return i >= 0 ? path.slice(0, i) : "";
}

export function WorkspaceTabs() {
  const { t } = useI18n();
  const index = useWorkspaceStore((s) => s.index);
  const hydrated = useWorkspaceStore((s) => s.hydrated);
  const switchTab = useWorkspaceStore((s) => s.switchTab);
  const closeTab = useWorkspaceStore((s) => s.closeTab);

  if (!hydrated) return null;

  const tabs = index.openTabIds
    .map((id) => index.docs.find((d) => d.id === id))
    .filter(Boolean) as typeof index.docs;

  if (!tabs.length) return null;

  return (
    <div className="flex h-9 shrink-0 items-stretch gap-0.5 overflow-x-auto border-b border-[var(--panel-border)] bg-[var(--node-header)] px-1">
      {tabs.map((tab) => {
        const active = tab.id === index.activeDocId;
        const folder = folderOf(tab.path);
        return (
          <div
            key={tab.id}
            className={cn(
              "group flex max-w-[200px] min-w-[100px] cursor-pointer items-center gap-1.5 rounded-t-md border border-b-0 px-2.5 text-xs transition-colors",
              active
                ? "border-[var(--panel-border)] bg-[var(--panel)] text-[var(--foreground)]"
                : "border-transparent text-[var(--muted)] hover:bg-black/5 dark:hover:bg-white/5",
            )}
            onClick={() => switchTab(tab.id)}
            title={tab.path}
          >
            <FileCode2
              className={cn("h-3.5 w-3.5 shrink-0", active ? "text-[var(--accent)]" : "opacity-60")}
            />
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{tab.name}</div>
              {folder && <div className="truncate text-[9px] opacity-60">{folder}/</div>}
            </div>
            <button
              type="button"
              className={cn(
                "rounded p-0.5 opacity-0 hover:bg-black/10 group-hover:opacity-100 dark:hover:bg-white/10",
                active && "opacity-70",
              )}
              title={t("tabs.close")}
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        );
      })}
      <div className="ml-auto hidden items-center px-2 text-[10px] text-[var(--muted)] sm:flex">
        {t("tabs.workspace")}
      </div>
    </div>
  );
}
