import Link from "next/link";
import type { OrderSummary } from "@/services/order/order-types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatOrderDateTime,
  formatOrderMoney,
  formatOrderStatus,
  getOrderStatusBadgeClass,
} from "@/components/modules/user/order/order-utils";

type RecentOrdersProps = {
  orders: OrderSummary[];
};

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Recent Orders</h3>
          <p className="text-sm text-slate-500">
            Latest customer activity across the storefront.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/orders">View all</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Placed</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.length ? (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium text-slate-900">
                  {order.orderNumber}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium text-slate-900">
                      {order.customerName || "Guest"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {order.customerEmail || "No email"}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getOrderStatusBadgeClass(
                      order.status,
                    )}`}
                  >
                    {formatOrderStatus(order.status)}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-slate-500">
                  {formatOrderDateTime(order.placedAt || order.createdAt)}
                </TableCell>
                <TableCell className="text-right font-semibold text-slate-900">
                  {formatOrderMoney(order.total)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-28 text-center text-sm text-slate-500"
              >
                No recent orders available yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
