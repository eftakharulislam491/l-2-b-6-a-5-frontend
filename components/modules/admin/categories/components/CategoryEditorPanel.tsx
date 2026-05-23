import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type {
  CategoryNode,
  CategoryParentOption,
  CategoryPayload,
  EditorMode,
  EditorTab,
} from "../category-types";
import { CategoryGeneralTab } from "./CategoryGeneralTab";
import { CategoryImageTab } from "./CategoryImageTab";
import { CategorySeoTab } from "./CategorySeoTab";

type CategoryEditorPanelProps = {
  activeTab: EditorTab;
  editorMode: EditorMode;
  editorTitle: string;
  editorDescription: string;
  selectedPathLabel: string;
  focusedCategory: CategoryNode | null;
  parentOptions: CategoryParentOption[];
  form: CategoryPayload;
  canSave: boolean;
  isBusy?: boolean;
  onTabChange: (tab: EditorTab) => void;
  onUpdateField: <Key extends keyof CategoryPayload>(
    key: Key,
    value: CategoryPayload[Key],
  ) => void;
  onGenerateSlug: () => void;
  onSave: () => void;
  onDelete: () => void;
  onReset: () => void;
  savedAt: string;
};

export function CategoryEditorPanel({
  activeTab,
  editorMode,
  editorTitle,
  editorDescription,
  selectedPathLabel,
  focusedCategory,
  parentOptions,
  form,
  canSave,
  isBusy,
  onTabChange,
  onUpdateField,
  onGenerateSlug,
  onSave,
  onDelete,
  onReset,
  savedAt,
}: CategoryEditorPanelProps) {
  return (
    <Card className="overflow-hidden rounded-3xl border-slate-200 bg-white shadow-sm">
      <Tabs
        value={activeTab}
        onValueChange={(value) => onTabChange(value as EditorTab)}
        className="gap-0"
      >
        <CardHeader className="border-b border-slate-200 pb-0">
          <div className="flex flex-col gap-4 pb-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-xl text-slate-900">
                  {editorTitle}
                </CardTitle>
                <Badge
                  variant="outline"
                  className="rounded-full border-slate-300 bg-slate-50 px-3 py-1 text-slate-700"
                >
                  {editorMode === "edit" ? "Editing" : "New"}
                </Badge>
              </div>
              <CardDescription className="max-w-2xl text-slate-500">
                {editorDescription}
              </CardDescription>
              <p className="text-sm text-slate-500">{selectedPathLabel}</p>
            </div>

            {editorMode === "edit" && focusedCategory ? (
              <Badge
                className={cn(
                  "rounded-full px-3 py-1",
                  focusedCategory.isActive
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                    : "bg-slate-200 text-slate-600 hover:bg-slate-200",
                )}
              >
                {focusedCategory.isActive ? "Active" : "Inactive"}
              </Badge>
            ) : null}
          </div>

          <TabsList className="h-auto w-full justify-start rounded-none bg-transparent p-0">
            <TabsTrigger
              value="general"
              className="rounded-none border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 text-sm text-slate-600 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:shadow-none"
            >
              General
            </TabsTrigger>
            <TabsTrigger
              value="image"
              className="rounded-none border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 text-sm text-slate-600 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:shadow-none"
            >
              Image
            </TabsTrigger>
            <TabsTrigger
              value="seo"
              className="rounded-none border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 text-sm text-slate-600 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:shadow-none"
            >
              SEO
            </TabsTrigger>
          </TabsList>
        </CardHeader>

        <CardContent className="pt-6">
          <TabsContent value="general" className="mt-0">
            <CategoryGeneralTab
              form={form}
              parentOptions={parentOptions}
              canSave={canSave}
              isBusy={isBusy}
              isEditing={editorMode === "edit"}
              onUpdateField={onUpdateField}
              onGenerateSlug={onGenerateSlug}
              onSave={onSave}
              onDelete={onDelete}
              onReset={onReset}
            />
          </TabsContent>

          <TabsContent value="image" className="mt-0">
            <CategoryImageTab
              form={form}
              canSave={canSave}
              isBusy={isBusy}
              isEditing={editorMode === "edit"}
              onUpdateField={onUpdateField}
              onSave={onSave}
              onDelete={onDelete}
              onReset={onReset}
            />
          </TabsContent>

          <TabsContent value="seo" className="mt-0">
            <CategorySeoTab
              form={form}
              canSave={canSave}
              isBusy={isBusy}
              isEditing={editorMode === "edit"}
              onUpdateField={onUpdateField}
              onSave={onSave}
              onDelete={onDelete}
              onReset={onReset}
            />
          </TabsContent>
        </CardContent>
      </Tabs>

      <div className="border-t border-slate-100 px-6 py-4 text-sm text-slate-500">
        Last action: {savedAt}
      </div>
    </Card>
  );
}
