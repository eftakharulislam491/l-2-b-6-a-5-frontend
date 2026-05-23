import type { CategoryPayload } from "./category-types";

export const createEmptyCategory = (): CategoryPayload => ({
  name: "",
  slug: "",
  description: "",
  isActive: true,
  sortOrder: 0,
  image: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  parentId: null,
});
