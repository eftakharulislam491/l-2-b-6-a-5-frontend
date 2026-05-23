import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ImageIcon } from "lucide-react";
import { MediaUploadControl } from "../../shared/MediaUploadControl";
import type { CategoryPayload } from "../category-types";
import { shortId } from "../category-utils";
import { EditorFooter, FieldLabel } from "./CategoryFormPrimitives";

type CategoryImageTabProps = {
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

export function CategoryImageTab({
  form,
  canSave,
  isBusy,
  isEditing,
  onUpdateField,
  onSave,
  onDelete,
  onReset,
}: CategoryImageTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 xl:grid-cols-[160px_minmax(0,1fr)] xl:items-start">
        <FieldLabel label="Image" />
        <div className="space-y-4">
          <MediaUploadControl
            multiple={false}
            disabled={isBusy}
            onUploaded={(items) => {
              const firstUpload = items[0];

              if (firstUpload) {
                onUpdateField("image", firstUpload.id);
              }
            }}
          />

          <Input
            value={form.image}
            onChange={(event) => onUpdateField("image", event.target.value)}
            className="h-11 rounded-xl border-slate-200 bg-white"
            placeholder="Image reference id"
            disabled={isBusy}
          />

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-900">Preview</p>
            <p className="mt-1 text-sm text-slate-500">
              Category uses a single image ID. Upload once and keep that ID here.
            </p>

            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start">
              <div className="grid h-40 w-40 place-items-center rounded-[22px] border border-dashed border-slate-300 bg-white text-slate-400 shadow-sm">
                <div className="space-y-3 text-center">
                  <ImageIcon className="mx-auto h-10 w-10" />
                  <p className="px-3 text-xs font-medium uppercase tracking-[0.14em]">
                    {form.image ? "Image linked" : "No image"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Badge
                  variant="outline"
                  className="rounded-full border-slate-300 bg-white px-3 py-1 text-slate-700"
                >
                  {form.image ? shortId(form.image) : "No image id"}
                </Badge>
                <p className="max-w-md text-sm leading-6 text-slate-600">
                  Keep the image as a single reference value. You can either
                  upload a new media file or pick an existing image from the
                  media library.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl border-slate-300 bg-white text-slate-700"
                  onClick={() => onUpdateField("image", "")}
                  disabled={isBusy}
                >
                  Clear image
                </Button>
              </div>
            </div>
          </div>
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
