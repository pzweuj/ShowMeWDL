"use client";

import { useRef } from "react";
import {
  AlertTriangle,
  Download,
  FileArchive,
  FilePlus2,
  FileUp,
  FlaskConical,
  Languages,
  Moon,
  PanelLeft,
  Sun,
  Workflow,
} from "lucide-react";
import { useTheme } from "next-themes";
import JSZip from "jszip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProjectStore } from "@/features/project/store";
import { useWorkspaceStore } from "@/features/workspace/workspace-store";
import {
  exportProjectToWdl,
  exportSingleFileWdl,
  importWdlFiles,
  importWdlSource,
} from "@/features/wdl/import-export";
import { downloadBlob, downloadText } from "@/lib/utils";
import { safeFileName } from "@/features/workspace/storage";
import { useI18n } from "@/i18n/context";

export function TopBar() {
  const { t, locale, setLocale } = useI18n();
  const project = useProjectStore((s) => s.project);
  const validate = useProjectStore((s) => s.validate);
  const issues = useProjectStore((s) => s.issues);
  const toggleLeftCollapsed = useProjectStore((s) => s.toggleLeftCollapsed);
  const showToast = useProjectStore((s) => s.showToast);

  const openProject = useWorkspaceStore((s) => s.openProject);
  const openDemo = useWorkspaceStore((s) => s.openDemo);
  const openNew = useWorkspaceStore((s) => s.openNew);
  const renameActive = useWorkspaceStore((s) => s.renameActive);
  const activePath = useWorkspaceStore((s) => {
    const id = s.index.activeDocId;
    return s.index.docs.find((d) => d.id === id)?.path ?? "";
  });

  const { theme, setTheme } = useTheme();
  const wdlRef = useRef<HTMLInputElement>(null);

  const onImportWdl = async (fileList: FileList) => {
    try {
      const files = await Promise.all(
        Array.from(fileList).map(async (f) => ({ path: f.name, content: await f.text() })),
      );
      if (files.length === 1) {
        const base = files[0].path.replace(/\.wdl$/i, "");
        const proj = importWdlSource(files[0].content, base);
        openProject(proj, {
          pathFolder: "imports",
          fileName: safeFileName(base),
          source: "import",
        });
      } else {
        const proj = importWdlFiles(files, "imported-wdl");
        openProject(proj, {
          pathFolder: "imports",
          fileName: safeFileName(files[0]?.path ?? "bundle"),
          source: "import",
        });
      }
      showToast(t("topbar.toastImportOk"), "success");
    } catch (e) {
      showToast(e instanceof Error ? e.message : t("topbar.toastImportFail"), "error");
    }
  };

  const onExportWdl = () => {
    const text = exportSingleFileWdl(project);
    const wf = project.workflows.find((w) => w.id === project.activeWorkflowId);
    downloadText(`${wf?.name ?? project.name ?? "workflow"}.wdl`, text);
    showToast(t("topbar.toastExportWdl"), "success");
  };

  const onExportStructuredZip = async () => {
    try {
      const files = exportProjectToWdl(project);
      if (!files.length) {
        showToast(t("topbar.toastExportEmpty"), "error");
        return;
      }
      const zip = new JSZip();
      for (const f of files) zip.file(f.path, f.content);
      const blob = await zip.generateAsync({ type: "blob" });
      const base = (project.name || "wdl-project").replace(/[\\/:*?"<>|]+/g, "_");
      downloadBlob(`${base}-structured.zip`, blob);
      showToast(t("topbar.toastExportZip", { count: files.length }), "success");
    } catch (e) {
      showToast(e instanceof Error ? e.message : t("topbar.toastZipFail"), "error");
    }
  };

  const onValidate = () => {
    const list = validate();
    if (!list.length) showToast(t("topbar.toastValidateOk"), "success");
    else showToast(t("topbar.toastValidateFail", { count: list.length }), "error");
  };

  return (
    <header className="flex h-12 shrink-0 items-center gap-1.5 border-b border-[var(--panel-border)] bg-[var(--panel)] px-2 sm:px-3">
      <div className="flex items-center gap-2 pr-1 sm:pr-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--accent)] text-white">
          <Workflow className="h-4 w-4" />
        </div>
        <div className="hidden leading-tight sm:block">
          <div className="text-sm font-bold tracking-tight">ShowMeWDL</div>
          <div className="max-w-[160px] truncate text-[10px] text-[var(--muted)]" title={activePath}>
            {activePath || t("topbar.brandSub")}
          </div>
        </div>
      </div>

      <div className="mx-1 hidden h-6 w-px bg-[var(--panel-border)] sm:block" />

      <Button size="icon" variant="ghost" title={t("topbar.collapseLeft")} onClick={toggleLeftCollapsed}>
        <PanelLeft className="h-4 w-4" />
      </Button>

      <Input
        className="h-8 max-w-[140px] sm:max-w-[200px]"
        value={project.name}
        onChange={(e) => renameActive(e.target.value)}
        title={t("topbar.projectName")}
      />

      <div className="mx-1 hidden h-6 w-px bg-[var(--panel-border)] sm:block" />

      <Button size="sm" variant="ghost" onClick={() => openNew()} title={t("common.new")}>
        <FilePlus2 className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{t("common.new")}</span>
      </Button>
      <Button size="sm" variant="ghost" className="hidden md:inline-flex" onClick={() => openDemo()} title={t("common.demo")}>
        <FlaskConical className="h-3.5 w-3.5" />
        {t("common.demo")}
      </Button>

      <div className="mx-1 hidden h-6 w-px bg-[var(--panel-border)] sm:block" />

      <Button size="sm" variant="ghost" onClick={() => wdlRef.current?.click()} title={t("topbar.importWdl")}>
        <FileUp className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{t("topbar.importWdl")}</span>
        <span className="sm:hidden">{t("topbar.importWdlShort")}</span>
      </Button>
      <Button size="sm" variant="ghost" onClick={onExportWdl} title={t("topbar.exportWdlHint")}>
        <Download className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{t("topbar.exportWdl")}</span>
        <span className="sm:hidden">{t("topbar.exportWdlShort")}</span>
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => void onExportStructuredZip()}
        title={t("topbar.exportZipHint")}
      >
        <FileArchive className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{t("topbar.exportZip")}</span>
        <span className="sm:hidden">{t("topbar.exportZipShort")}</span>
      </Button>

      <div className="mx-1 hidden h-6 w-px bg-[var(--panel-border)] sm:block" />

      <Button size="sm" variant="ghost" onClick={onValidate} title={t("topbar.validate")}>
        <AlertTriangle className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{t("topbar.validate")}</span>
        <span className="sm:hidden">{t("topbar.validateShort")}</span>
        {issues.length ? (
          <span className="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
            {issues.length}
          </span>
        ) : null}
      </Button>

      <div className="flex-1" />

      <a
        href="https://github.com/pzweuj/ShowMeWDL"
        target="_blank"
        rel="noopener noreferrer"
        title="GitHub"
        aria-label="GitHub"
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--muted)] transition-colors hover:bg-black/5 hover:text-[var(--text)] dark:hover:bg-white/5"
      >
        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
      </a>

      <Button
        size="icon"
        variant="ghost"
        title={t("topbar.lang")}
        onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
      >
        <Languages className="h-4 w-4" />
      </Button>
      <span className="hidden text-[10px] font-semibold uppercase text-[var(--muted)] sm:inline">
        {locale === "zh" ? "中" : "EN"}
      </span>

      <Button
        size="icon"
        variant="ghost"
        className="relative"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        title={t("topbar.theme")}
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>

      <input
        ref={wdlRef}
        type="file"
        accept=".wdl,text/plain"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) void onImportWdl(e.target.files);
          e.target.value = "";
        }}
      />
    </header>
  );
}
