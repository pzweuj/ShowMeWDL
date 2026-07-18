"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { RuntimeSpec } from "@/features/project/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/context";

function parseRuntimeValue(raw: string): string | number | boolean {
  const t = raw.trim();
  if (t === "true") return true;
  if (t === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(t) && t.length < 20) return Number(t);
  return raw;
}

function valueToInput(v: string | number | boolean | undefined): string {
  if (v === undefined) return "";
  return String(v);
}

export function RuntimeFields({
  runtime,
  onChange,
}: {
  runtime: RuntimeSpec;
  onChange: (r: RuntimeSpec) => void;
}) {
  const { t } = useI18n();
  const entries = Object.entries(runtime).filter(([, v]) => v !== undefined && v !== "");
  const [draftKey, setDraftKey] = useState("");
  const [draftValue, setDraftValue] = useState("");

  const setKeyValue = (key: string, value: string | number | boolean | undefined) => {
    const next: RuntimeSpec = { ...runtime };
    if (value === undefined || value === "") {
      delete next[key];
    } else {
      next[key] = value;
    }
    onChange(next);
  };

  const renameKey = (oldKey: string, newKey: string) => {
    const k = newKey.trim();
    if (!k || k === oldKey) return;
    if (k in runtime && k !== oldKey) return;
    const next: RuntimeSpec = {};
    for (const [key, val] of Object.entries(runtime)) {
      if (key === oldKey) next[k] = val;
      else next[key] = val;
    }
    onChange(next);
  };

  const addRow = () => {
    const k = draftKey.trim();
    if (!k) return;
    if (k in runtime && runtime[k] !== undefined && runtime[k] !== "") return;
    onChange({ ...runtime, [k]: parseRuntimeValue(draftValue) });
    setDraftKey("");
    setDraftValue("");
  };

  return (
    <div className="space-y-2">
      <p className="text-[11px] text-[var(--muted)]">{t("runtime.hint")}</p>
      <div className="space-y-1.5">
        {entries.map(([key, val]) => (
          <div key={key} className="grid grid-cols-[1fr_1.2fr_auto] gap-1.5">
            <Input
              className="h-7 font-mono text-xs"
              defaultValue={key}
              onBlur={(e) => renameKey(key, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              }}
            />
            <Input
              className="h-7 font-mono text-xs"
              value={valueToInput(val)}
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === "") setKeyValue(key, undefined);
                else setKeyValue(key, parseRuntimeValue(raw));
              }}
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              aria-label={t("runtime.delete", { key })}
              onClick={() => setKeyValue(key, undefined)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-[1fr_1.2fr_auto] gap-1.5">
        <Input
          className="h-7 font-mono text-xs"
          placeholder={t("runtime.keyPh")}
          value={draftKey}
          onChange={(e) => setDraftKey(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addRow();
          }}
        />
        <Input
          className="h-7 font-mono text-xs"
          placeholder={t("runtime.valuePh")}
          value={draftValue}
          onChange={(e) => setDraftValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addRow();
          }}
        />
        <Button size="icon" variant="outline" className="h-7 w-7" onClick={addRow} aria-label={t("runtime.add")}>
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

/** Diff full runtime against base; only keys that differ become override. */
export function runtimeDiff(base: RuntimeSpec, next: RuntimeSpec): RuntimeSpec | undefined {
  const out: RuntimeSpec = {};
  const keys = new Set([...Object.keys(base), ...Object.keys(next)]);
  for (const k of keys) {
    const a = base[k];
    const b = next[k];
    if (b === undefined || b === "") continue;
    if (a !== b) out[k] = b;
  }
  return Object.keys(out).length ? out : undefined;
}

/** Shallow merge for display: base + override. */
export function mergeRuntime(base: RuntimeSpec = {}, override: RuntimeSpec = {}): RuntimeSpec {
  return { ...base, ...override };
}
