import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Save, Trash2 } from "lucide-react";

export function FieldLabel({
  label,
  required,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <div className="pt-2">
      <Label className="text-base font-medium text-slate-900">
        {label}
        {required ? <span className="ml-1 text-rose-500">*</span> : null}
      </Label>
    </div>
  );
}

export function CategoryTextarea({
  className,
  ...props
}: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-[128px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70",
        className,
      )}
      {...props}
    />
  );
}

export function StatsPill({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export function EditorFooter({
  canSave,
  isEditing,
  isBusy,
  onSave,
  onDelete,
  onReset,
}: {
  canSave: boolean;
  isEditing: boolean;
  isBusy?: boolean;
  onSave: () => void;
  onDelete: () => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        type="button"
        className="rounded-xl bg-blue-600 px-5 text-white hover:bg-blue-700"
        onClick={onSave}
        disabled={!canSave || isBusy}
      >
        <Save className="h-4 w-4" />
        Save
      </Button>
      <Button
        type="button"
        variant="outline"
        className="rounded-xl border-slate-300 bg-white text-slate-700"
        onClick={onReset}
        disabled={isBusy}
      >
        Reset
      </Button>
      {isEditing ? (
        <Button
          type="button"
          variant="ghost"
          className="rounded-xl px-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
          onClick={onDelete}
          disabled={isBusy}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      ) : null}
    </div>
  );
}
