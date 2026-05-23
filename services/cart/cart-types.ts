export type AddToCartPayload = {
  productId: string;
  variantOptionIds?: string[];
  quantity: number;
};

export type CartItemSummary = {
  id: string;
  productId: string;
  title: string;
  variant?: string;
  image: string;
  price: number;
  quantity: number;
  variantOptionIds: string[];
};
