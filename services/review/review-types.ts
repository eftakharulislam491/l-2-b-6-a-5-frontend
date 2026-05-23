export type ReviewMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type ReviewRatingBreakdown = {
  rating: number;
  count: number;
};

export type ProductReviewSummary = {
  totalReviews: number;
  averageRating: number;
  ratingBreakdown: ReviewRatingBreakdown[];
};

export type ReviewUser = {
  id: string;
  name: string;
  email: string | null;
  image: string | null;
};

export type ReviewProduct = {
  id: string;
  title: string;
  slug: string;
};

export type ReviewAdmin = {
  id: string;
  name: string;
  email: string | null;
};

export type ProductReview = {
  id: string;
  productId: string;
  rating: number;
  title: string | null;
  comment: string | null;
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  notHelpfulVotes: number;
  adminReply: string | null;
  adminRepliedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: ReviewUser;
};

export type AdminReview = ProductReview & {
  userId: string;
  isApproved: boolean;
  adminRepliedBy: string | null;
  product: ReviewProduct;
  admin: ReviewAdmin | null;
};

export type GetProductReviewsResult = {
  reviews: ProductReview[];
  summary: ProductReviewSummary;
  meta: ReviewMeta | null;
  error: string | null;
};

export type GetAdminReviewsResult = {
  reviews: AdminReview[];
  meta: ReviewMeta | null;
  error: string | null;
};

export type ReviewMutationResult = {
  success: boolean;
  message: string;
  review: AdminReview | null;
};
