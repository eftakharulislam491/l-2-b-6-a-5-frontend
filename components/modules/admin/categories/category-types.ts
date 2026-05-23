export type CategoryPayload = {
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
  image: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  parentId: string | null;
};

export type CategoryNode = CategoryPayload & {
  id: string;
  children: CategoryNode[];
};

export type EditorMode = "edit" | "create-root" | "create-child";

export type EditorTab = "general" | "image" | "seo";

export type CategoryStats = {
  roots: number;
  nested: number;
  total: number;
};

export type CategoryParentOption = {
  id: string;
  label: string;
};
