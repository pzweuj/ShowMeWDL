"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/i18n/context";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (docker: string | undefined, label: string) => void;
};

function imageLabel(docker: string) {
  return docker.split("/").pop()?.split(":")[0] || "";
}

export function AddDockerGroupDialog({ open, onOpenChange, onSubmit }: Props) {
  const { t } = useI18n();
  const [docker, setDocker] = useState("");
  const [label, setLabel] = useState("");
  const [labelTouched, setLabelTouched] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDocker("");
    setLabel("");
    setLabelTouched(false);
  }, [open]);

  const canSubmit = label.trim().length > 0 || docker.trim().length > 0;

  const submit = () => {
    if (!canSubmit) return;
    const d = docker.trim() || undefined;
    const l = label.trim() || (d ? imageLabel(d) : "group");
    onSubmit(d, l);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("library.addGroupTitle")}
      description={t("library.addGroupDesc")}
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button variant="accent" size="sm" disabled={!canSubmit} onClick={submit}>
            {t("common.create")}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="group-label">{t("library.groupName")}</Label>
          <Input
            id="group-label"
            autoFocus
            value={label}
            placeholder={t("library.groupNamePh")}
            onChange={(e) => {
              setLabelTouched(true);
              setLabel(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="docker-image">
            {t("library.defaultDocker")}{" "}
            <span className="font-normal text-[var(--muted)]">({t("common.optional")})</span>
          </Label>
          <Input
            id="docker-image"
            value={docker}
            placeholder={t("library.dockerPh")}
            onChange={(e) => {
              const next = e.target.value;
              setDocker(next);
              if (!labelTouched) setLabel(imageLabel(next));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
          />
          <p className="text-[11px] text-[var(--muted)]">{t("library.dockerHint")}</p>
        </div>
      </div>
    </Dialog>
  );
}
