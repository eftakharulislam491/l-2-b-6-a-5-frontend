"use client";

import { useRef, useState } from "react";
import { ImageIcon, Loader2, RefreshCcw, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { getAdminMedia } from "@/services/media/getAdminMedia";
import {
  MEDIA_STORAGE_OPTIONS,
  uploadAdminMedia,
  type MediaStorageType,
  type UploadedMediaItem,
} from "@/services/media/uploadAdminMedia";

type MediaUploadControlProps = {
  onUploaded: (items: UploadedMediaItem[]) => void;
  disabled?: boolean;
  multiple?: boolean;
  className?: string;
};

const VIDEO_PATTERN = /\.(mp4|webm|mov|avi|mkv|m4v)(\?|#|$)/i;

function formatId(value: string) {
  if (value.length <= 18) {
    return value;
  }

  return `${value.slice(0, 10)}...${value.slice(-4)}`;
}

export function MediaUploadControl({
  onUploaded,
  disabled = false,
  multiple = true,
  className,
}: MediaUploadControlProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [storageType, setStorageType] = useState<MediaStorageType>("cloudinary");
  const [files, setFiles] = useState<File[]>([]);
  const [altText, setAltText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [recentUploads, setRecentUploads] = useState<UploadedMediaItem[]>([]);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isLibraryLoading, setIsLibraryLoading] = useState(false);
  const [libraryError, setLibraryError] = useState<string | null>(null);
  const [libraryItems, setLibraryItems] = useState<UploadedMediaItem[]>([]);
  const [selectedLibraryIds, setSelectedLibraryIds] = useState<string[]>([]);

  const uploadDisabled = disabled || isUploading || files.length === 0;
  const libraryDisabled = disabled || isUploading;

  const handleUpload = async () => {
    if (uploadDisabled) {
      return;
    }

    setIsUploading(true);
    const result = await uploadAdminMedia({
      files,
      storageType,
      altText,
    });
    setIsUploading(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    onUploaded(result.items);
    setRecentUploads(result.items);
    setFiles([]);
    setAltText("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    toast.success(result.message);
  };

  const loadLibrary = async () => {
    setIsLibraryLoading(true);
    const result = await getAdminMedia({
      storageType,
      limit: 80,
      sort: "-createdAt",
    });
    setIsLibraryLoading(false);

    if (!result.success) {
      setLibraryError(result.message);
      setLibraryItems([]);
      return;
    }

    setLibraryError(null);
    setLibraryItems(result.items);
  };

  const toggleLibraryItem = (id: string) => {
    setSelectedLibraryIds((current) => {
      if (multiple) {
        return current.includes(id)
          ? current.filter((currentId) => currentId !== id)
          : [...current, id];
      }

      return current.includes(id) ? [] : [id];
    });
  };

  const handleApplyLibrarySelection = () => {
    const selectedItems = libraryItems.filter((item) =>
      selectedLibraryIds.includes(item.id),
    );

    if (!selectedItems.length) {
      return;
    }

    onUploaded(selectedItems);
    setRecentUploads(selectedItems);
    setSelectedLibraryIds([]);
    setIsLibraryOpen(false);

    toast.success(
      multiple
        ? `${selectedItems.length} existing media selected.`
        : "Existing media selected.",
    );
  };

  const handleLibraryOpenChange = (open: boolean) => {
    setIsLibraryOpen(open);

    if (!open) {
      setSelectedLibraryIds([]);
      return;
    }

    void loadLibrary();
  };

  return (
    <div
      className={cn(
        "space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4",
        className,
      )}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-900">Storage provider</p>
          <Select
            value={storageType}
            onValueChange={(value) => setStorageType(value as MediaStorageType)}
            disabled={disabled || isUploading}
          >
            <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
              <SelectValue placeholder="Select storage" />
            </SelectTrigger>
            <SelectContent>
              {MEDIA_STORAGE_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={!option.enabled}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500">
            Cloudinary is enabled now. Other providers are disabled temporarily.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-900">Alt text (optional)</p>
          <Input
            value={altText}
            onChange={(event) => setAltText(event.target.value)}
            className="h-11 rounded-xl border-slate-200 bg-white"
            placeholder="Example: Product gallery image"
            disabled={disabled || isUploading}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-900">Select file</p>
          <Input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept="image/*,video/*"
            onChange={(event) => {
              const selectedFiles = Array.from(event.target.files ?? []);
              setFiles(multiple ? selectedFiles : selectedFiles.slice(0, 1));
            }}
            className="h-11 rounded-xl border-slate-200 bg-white file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-700 hover:file:bg-slate-200"
            disabled={disabled || isUploading}
          />
          <p className="text-xs text-slate-500">
            {files.length
              ? `${files.length} file selected`
              : "Supports image and video files."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={() => void handleUpload()}
            disabled={uploadDisabled}
            className="h-11 rounded-xl"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <UploadCloud className="h-4 w-4" />
                Upload media
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl border-slate-300 bg-white text-slate-700"
            onClick={() => handleLibraryOpenChange(true)}
            disabled={libraryDisabled}
          >
            Use existing media
          </Button>
        </div>
      </div>

      {recentUploads.length ? (
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Recent upload
          </p>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {recentUploads.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
              >
                {VIDEO_PATTERN.test(item.src.toLowerCase()) ? (
                  <div className="grid h-24 place-items-center text-slate-500">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                ) : (
                  <img
                    src={item.src}
                    alt={item.altText || "Uploaded media"}
                    className="h-24 w-full object-cover"
                  />
                )}
                <div className="space-y-1 px-3 py-2">
                  <p className="truncate text-xs font-medium text-slate-700">{item.id}</p>
                  <p className="truncate text-xs text-slate-500">
                    {item.fileName || "Uploaded file"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <Sheet open={isLibraryOpen} onOpenChange={handleLibraryOpenChange}>
        <SheetContent side="right" className="w-full p-0 sm:max-w-3xl">
          <SheetHeader className="border-b border-slate-200">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <SheetTitle>Select Existing Media</SheetTitle>
                <SheetDescription>
                  Pick already uploaded media from your database and attach it by image ID.
                </SheetDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-xl border-slate-300 bg-white text-slate-700"
                onClick={() => void loadLibrary()}
                disabled={isLibraryLoading}
              >
                {isLibraryLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCcw className="h-4 w-4" />
                )}
                Refresh
              </Button>
            </div>
          </SheetHeader>

          <div className="max-h-[calc(100vh-190px)] overflow-y-auto p-4">
            {libraryError ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                {libraryError}
              </div>
            ) : null}

            {isLibraryLoading ? (
              <div className="grid h-48 place-items-center text-sm text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading media...
                </span>
              </div>
            ) : libraryItems.length ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {libraryItems.map((item) => {
                  const isSelected = selectedLibraryIds.includes(item.id);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleLibraryItem(item.id)}
                      className={cn(
                        "overflow-hidden rounded-xl border bg-white text-left transition",
                        isSelected
                          ? "border-blue-500 ring-2 ring-blue-100"
                          : "border-slate-200 hover:border-slate-300",
                      )}
                    >
                      {VIDEO_PATTERN.test(item.src.toLowerCase()) ? (
                        <div className="grid h-28 place-items-center bg-slate-50 text-slate-500">
                          <ImageIcon className="h-7 w-7" />
                        </div>
                      ) : (
                        <img
                          src={item.src}
                          alt={item.altText || "Stored media"}
                          className="h-28 w-full object-cover"
                        />
                      )}
                      <div className="space-y-1 px-3 py-2">
                        <p className="truncate text-xs font-medium text-slate-800">
                          {formatId(item.id)}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {item.fileName || "Stored media"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600">
                No media found for this storage type yet.
              </div>
            )}
          </div>

          <SheetFooter className="border-t border-slate-200">
            <SheetClose asChild>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-slate-300 bg-white text-slate-700"
              >
                Cancel
              </Button>
            </SheetClose>
            <Button
              type="button"
              className="rounded-xl"
              onClick={handleApplyLibrarySelection}
              disabled={!selectedLibraryIds.length}
            >
              {multiple
                ? `Use selected (${selectedLibraryIds.length})`
                : "Use selected image"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
