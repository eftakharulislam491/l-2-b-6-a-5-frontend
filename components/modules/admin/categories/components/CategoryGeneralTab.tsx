import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { RefreshCw } from "lucide-react";
import type { CategoryParentOption, CategoryPayload } from "../category-types";
import {
  CategoryTextarea,
  EditorFooter,
  FieldLabel,
} from "./CategoryFormPrimitives";

type CategoryGeneralTabProps = {
  form: CategoryPayload;
  parentOptions: CategoryParentOption[];
  canSave: boolean;
  isBusy?: boolean;
  isEditing: boolean;
  onUpdateField: <Key extends keyof CategoryPayload>(
    key: Key,
    value: CategoryPayload[Key],
  ) => void;
  onGenerateSlug: () => void;
  onSave: () => void;
  onDelete: () => void;
  onReset: () => void;
};

export function CategoryGeneralTab({
  form,
  parentOptions,
  canSave,
  isBusy,
  isEditing,
  onUpdateField,
  onGenerateSlug,
  onSave,
  onDelete,
  onReset,
}: CategoryGeneralTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 xl:grid-cols-[160px_minmax(0,1fr)] xl:items-start">
        <FieldLabel label="Name" required />
        <Input
          value={form.name}
          onChange={(event) => onUpdateField("name", event.target.value)}
          className="h-11 rounded-xl border-slate-200 bg-white"
          placeholder="Category name"
          disabled={isBusy}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[160px_minmax(0,1fr)] xl:items-start">
        <FieldLabel label="Slug" required />
        <div className="space-y-3">
          <div className="flex flex-col gap-3 md:flex-row">
            <Input
              value={form.slug}
              onChange={(event) => onUpdateField("slug", event.target.value)}
              className="h-11 rounded-xl border-slate-200 bg-white"
              placeholder="category-slug"
              disabled={isBusy}
            />
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl border-slate-300 bg-white text-slate-700"
              onClick={onGenerateSlug}
              disabled={isBusy}
            >
              <RefreshCw className="h-4 w-4" />
              Generate
            </Button>
          </div>
          <p className="text-sm text-slate-500">
            Use a lowercase URL slug for this category.
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[160px_minmax(0,1fr)] xl:items-start">
        <FieldLabel label="Description" />
        <div className="space-y-3">
          <CategoryTextarea
            value={form.description}
            onChange={(event) => onUpdateField("description", event.target.value)}
            rows={6}
            placeholder="Describe the category"
            disabled={isBusy}
          />
          <p className="text-sm text-slate-500">{form.description.length} characters</p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[160px_minmax(0,1fr)] xl:items-start">
        <FieldLabel label="Parent Category" />
        <div className="space-y-3">
          <Select
            value={form.parentId ?? "none"}
            onValueChange={(value) =>
              onUpdateField("parentId", value === "none" ? null : value)
            }
            disabled={isEditing || isBusy}
          >
            <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
              <SelectValue placeholder="Select parent category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No parent category</SelectItem>
              {parentOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-slate-500">
            {isEditing
              ? "Parent changes are kept read-only here until update API wiring is added."
              : "Leave empty for a root category, or choose a parent category for nesting."}
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[160px_minmax(0,1fr)] xl:items-start">
        <FieldLabel label="Sort Order" />
        <div className="space-y-3">
          <Input
            type="number"
            min="0"
            value={form.sortOrder}
            onChange={(event) =>
              onUpdateField("sortOrder", Math.max(0, Number(event.target.value) || 0))
            }
            className="h-11 rounded-xl border-slate-200 bg-white"
            placeholder="0"
            disabled={isBusy}
          />
          <p className="text-sm text-slate-500">
            Lower values usually appear earlier in admin and storefront lists.
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[160px_minmax(0,1fr)] xl:items-start">
        <FieldLabel label="Status" />
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-900">
              Enable the category
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Switch this on if the category should stay active.
            </p>
          </div>
          <Switch
            checked={form.isActive}
            onCheckedChange={(checked) => onUpdateField("isActive", checked)}
            disabled={isBusy}
          />
        </div>
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
