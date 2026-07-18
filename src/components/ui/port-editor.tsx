"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  parseTypeString,
  typeToString,
  typeColor,
  typeColorSoft,
  type IOPort,
  type WdlType,
} from "@/features/project/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TypeBadge } from "@/components/ui/type-badge";
import { useI18n } from "@/i18n/context";

const BASE_PRESETS = [
  "String",
  "Int",
  "Float",
  "Boolean",
  "File",
  "Directory",
  "Array[String]",
  "Array[File]",
  "Array[Int]",
  "File?",
  "String?",
] as const;

function TypeSelect({
  value,
  onChange,
  extraTypes = [],
}: {
  value: string;
  onChange: (type: WdlType) => void;
  extraTypes?: string[];
}) {
  const { t: tr } = useI18n();
  const options = useMemo(() => {
    const set = new Set<string>([...BASE_PRESETS, ...extraTypes]);
    return [...set];
  }, [extraTypes]);

  const known = options.includes(value);
  const isExtra = extraTypes.includes(value);
  const [custom, setCustom] = useState(!known && value.length > 0);
  const parsed = parseTypeString(value || "String");
  const color = typeColor(parsed);

  return (
    <div className="space-y-1">
      <select
        className="h-8 w-full rounded-md border border-[var(--panel-border)] bg-[var(--panel)] px-2 font-mono text-xs outline-none focus:border-[var(--accent)]"
        style={{
          borderColor: `${color}66`,
          background: typeColorSoft(parsed, 0.08),
          color,
        }}
        value={custom ? "__custom__" : known ? value : isExtra ? value : "String"}
        onChange={(e) => {
          if (e.target.value === "__custom__") {
            setCustom(true);
            return;
          }
          setCustom(false);
          onChange(parseTypeString(e.target.value));
        }}
      >
        {BASE_PRESETS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
        {extraTypes.length > 0 && (
          <optgroup label="Struct">
            {extraTypes.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </optgroup>
        )}
        <option value="__custom__">{tr("common.custom")}</option>
      </select>
      {custom && (
        <Input
          className="h-7 font-mono text-xs"
          value={value}
          placeholder="如 Map[String, File] 或 MyStruct"
          autoFocus
          onChange={(e) => onChange(parseTypeString(e.target.value || "String"))}
        />
      )}
    </div>
  );
}

export function PortEditor({
  ports,
  onChange,
  namePlaceholder,
  extraTypes = [],
}: {
  ports: IOPort[];
  onChange: (ports: IOPort[]) => void;
  namePlaceholder?: string;
  /** Additional type names (e.g. project structs) */
  extraTypes?: string[];
}) {
  const { t } = useI18n();
  const ph = namePlaceholder ?? t("port.name");
  const [draftName, setDraftName] = useState("");
  const [draftType, setDraftType] = useState("File");

  const addPort = () => {
    const base = draftName.trim() || `port_${ports.length + 1}`;
    let name = base;
    let i = 2;
    while (ports.some((p) => p.name === name)) {
      name = `${base}_${i++}`;
    }
    onChange([
      ...ports,
      {
        name,
        type: parseTypeString(draftType || "String"),
      },
    ]);
    setDraftName("");
  };

  return (
    <div className="space-y-2">
      {ports.map((p, idx) => (
        <div
          key={`${p.name}-${idx}`}
          className="rounded-lg border border-[var(--panel-border)] bg-[var(--node-header)] p-2"
        >
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <TypeBadge type={p.type} compact />
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              aria-label={t("port.delete")}
              onClick={() => onChange(ports.filter((_, i) => i !== idx))}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <Input
              className="h-8 text-xs"
              value={p.name}
              placeholder={ph}
              onChange={(e) => {
                const next = [...ports];
                next[idx] = { ...p, name: e.target.value };
                onChange(next);
              }}
            />
            <TypeSelect
              value={typeToString(p.type)}
              extraTypes={extraTypes}
              onChange={(type) => {
                const next = [...ports];
                next[idx] = { ...p, type };
                onChange(next);
              }}
            />
          </div>
        </div>
      ))}

      <div className="rounded-lg border border-dashed border-[var(--panel-border)] p-2">
        <div className="mb-1.5 text-[10px] font-medium text-[var(--muted)]">{t("port.addPort")}</div>
        <div className="grid grid-cols-2 gap-1.5">
          <Input
            className="h-8 text-xs"
            value={draftName}
            placeholder={ph}
            onChange={(e) => setDraftName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addPort();
            }}
          />
          <TypeSelect
            value={draftType}
            extraTypes={extraTypes}
            onChange={(type) => setDraftType(typeToString(type))}
          />
        </div>
        <Button size="sm" variant="outline" className="mt-1.5 w-full" onClick={addPort}>
          <Plus className="h-3.5 w-3.5" />
          {t("port.add", { type: draftType || "port" })}
        </Button>
      </div>
    </div>
  );
}
