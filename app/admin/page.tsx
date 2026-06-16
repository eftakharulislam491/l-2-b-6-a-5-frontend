import BreadCrumb from "@/components/modules/admin/dashboard/BreadCrumb";
import DashboardStatsOverview from "@/components/modules/admin/dashboard/DashboardStatsOverview";
import { RecentOrders } from "@/components/modules/admin/dashboard/RecentOrders";
import { TopProducts } from "@/components/modules/admin/dashboard/TopProducts";
import { getAdminOrders } from "@/services/order/getOrders";
import { getAllProducts } from "@/services/products/getAllProducts";
import { getAdminReviews } from "@/services/review/manageReviews";
import { getAdminUsersCount } from "@/services/user/getAdminUsersCount";

function getOrderTimestamp(value: string) {
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function isRevenueOrder(status: string) {
  return !["CANCELLED", "REFUNDED"].includes(status.toUpperCase());
}

export default async function AdminDashboardPage() {
  const [
    { orders, error: ordersError },
    { products, error: productsError },
    { count: totalCustomers, error: customersError },
    { meta: pendingReviewsMeta, error: reviewsError },
  ] = await Promise.all([
    getAdminOrders({
      page: 1,
      limit: 100,
      sort: "-placedAt,-createdAt",
    }),
    getAllProducts(),
    getAdminUsersCount(),
    getAdminReviews({
      page: 1,
      limit: 1,
      isApproved: false,
      sort: "-createdAt",
    }),
  ]);

  const revenueOrders = orders.filter((order) => isRevenueOrder(order.status));
  const totalSales = revenueOrders.reduce((sum, order) => sum + order.total, 0);
  const activeOrders = orders.filter((order) =>
    ["PENDING", "PROCESSING", "CONFIRMED", "SHIPPED"].includes(
      order.status.toUpperCase(),
    ),
  ).length;
  const deliveredOrders = orders.filter((order) =>
    ["DELIVERED", "COMPLETED"].includes(order.status.toUpperCase()),
  ).length;
  const featuredProducts = products.filter((product) => product.isFeatured).length;
  const pendingReviews = pendingReviewsMeta?.total ?? 0;
  const recentOrders = [...orders]
    .sort(
      (left, right) =>
        getOrderTimestamp(right.placedAt || right.createdAt) -
        getOrderTimestamp(left.placedAt || left.createdAt),
    );

  const topProducts = Array.from(
    revenueOrders.reduce<
      Map<
        string,
        {
          id: string;
          name: string;
          sold: number;
          revenue: number;
          orderCount: number;
        }
      >
    >((accumulator, order) => {
      const productIdsSeenInOrder = new Set<string>();

      for (const item of order.items) {
        const existing = accumulator.get(item.productId) ?? {
          id: item.productId,
          name: item.productName || "Product",
          sold: 0,
          revenue: 0,
          orderCount: 0,
        };

        existing.sold += item.quantity;
        existing.revenue += item.total;

        if (!productIdsSeenInOrder.has(item.productId)) {
          existing.orderCount += 1;
          productIdsSeenInOrder.add(item.productId);
        }

        accumulator.set(item.productId, existing);
      }

      return accumulator;
    }, new Map()),
  )
    .map(([, product]) => product)
    .sort((left, right) => right.revenue - left.revenue)
    .slice(0, 5);

  const dashboardErrors = [
    ordersError,
    productsError,
    customersError,
    reviewsError,
  ].filter(Boolean);

  return (
    <>
      <BreadCrumb />

      {dashboardErrors.length ? (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {dashboardErrors.join(" ")}
        </div>
      ) : null}

      <DashboardStatsOverview
        stats={{
          totalSales,
          totalOrders: orders.length,
          totalProducts: products.length,
          totalCustomers,
          activeOrders,
          deliveredOrders,
          featuredProducts,
          pendingReviews,
        }}
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentOrders orders={recentOrders} />
        </div>

        <TopProducts products={topProducts} />
      </div>
    </>
  );
}
