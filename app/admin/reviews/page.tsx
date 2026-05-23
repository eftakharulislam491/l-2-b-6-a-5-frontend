import AdminReviewsList from "@/components/modules/admin/reviews/AdminReviewsList";
import { getAdminReviews } from "@/services/review/manageReviews";

export default async function AdminReviewsPage() {
  const { reviews, error } = await getAdminReviews({
    page: 1,
    limit: 100,
    sort: "-createdAt",
  });

  return <AdminReviewsList initialReviews={reviews} initialError={error} />;
}
