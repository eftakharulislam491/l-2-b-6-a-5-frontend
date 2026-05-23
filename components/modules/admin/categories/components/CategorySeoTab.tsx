import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { CategoryPayload } from "../category-types";
import {
  CategoryTextarea,
  EditorFooter,
  FieldLabel,
} from "./CategoryFormPrimitives";

type CategorySeoTabProps = {
  form: CategoryPayload;
  canSave: boolean;
  isBusy?: boolean;
  isEditing: boolean;
  onUpdateField: <Key extends keyof CategoryPayload>(
    key: Key,
    value: CategoryPayload[Key],
  ) => void;
  onSave: () => void;
  onDelete: () => void;
  onReset: () => void;
};

export function CategorySeoTab({
  form,
  canSave,
  isBusy,
  isEditing,
  onUpdateField,
  onSave,
  onDelete,
  onReset,
}: CategorySeoTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 xl:grid-cols-[160px_minmax(0,1fr)] xl:items-start">
        <FieldLabel label="Meta Title" />
        <Input
          value={form.metaTitle}
          onChange={(event) => onUpdateField("metaTitle", event.target.value)}
          className="h-11 rounded-xl border-slate-200 bg-white"
          placeholder="SEO title"
          disabled={isBusy}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[160px_minmax(0,1fr)] xl:items-start">
        <FieldLabel label="Meta Description" />
        <CategoryTextarea
          value={form.metaDescription}
          onChange={(event) => onUpdateField("metaDescription", event.target.value)}
          rows={5}
          placeholder="SEO description"
          disabled={isBusy}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[160px_minmax(0,1fr)] xl:items-start">
        <FieldLabel label="Meta Keywords" />
        <Input
          value={form.metaKeywords}
          onChange={(event) => onUpdateField("metaKeywords", event.target.value)}
          className="h-11 rounded-xl border-slate-200 bg-white"
          placeholder="keyword-one, keyword-two"
          disabled={isBusy}
        />
      </div>

      <Separator />

      <EditorFooter
        canSave={canSave}
        isEditing={isEditing}
        isBusy={isBusy}
        onSave={onSave}
        onDelete={onDelete}
        onReset={onReset}
      />
    </div>
  );
}
