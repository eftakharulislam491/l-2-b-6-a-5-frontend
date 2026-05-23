import RecentOrders from "@/components/modules/user/order/RecentOrders";
import { getOrders } from "@/services/order/getOrders";

export default async function page() {
  const { orders, error } = await getOrders({
    page: 1,
    limit: 5,
    sort: "-placedAt,-createdAt",
  });

  return (
    <div>
      <RecentOrders initialOrders={orders} initialError={error} />
    </div>
  );
}
