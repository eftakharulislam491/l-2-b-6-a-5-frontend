import AdminOrdersList from "@/components/modules/admin/products/AdminOrdersList";
import { getAdminOrders } from "@/services/order/getOrders";

export default async function AdminOrdersPage() {
  const { orders, error } = await getAdminOrders();

  return (
    <div>
      <AdminOrdersList initialOrders={orders} initialError={error} />
    </div>
  );
}
