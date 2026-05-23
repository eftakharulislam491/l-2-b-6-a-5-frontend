import MyOrders from "@/components/modules/user/order/MyOrders";
import { getOrders } from "@/services/order/getOrders";

export default async function page() {
  const { orders, error } = await getOrders({
    page: 1,
    limit: 50,
    sort: "-placedAt,-createdAt",
  });

  return (
    <div>
      <MyOrders initialOrders={orders} initialError={error} />
    </div>
  );
}
