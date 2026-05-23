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
  formatOrderDate,
  formatOrderMoney,
  formatOrderStatus,
  getOrderStatusBadgeClass,
} from "./order-utils";

type RecentOrdersProps = {
  initialOrders?: OrderSummary[];
  initialError?: string | null;
};

export default function RecentOrders({
  initialOrders = [],
  initialError = null,
}: RecentOrdersProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
          <p className="mt-1 text-sm text-gray-500">
            Your latest order activity from the storefront.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/orders">View All</Link>
        </Button>
      </div>

      {initialError ? (
        <div className="border-b border-amber-200 bg-amber-50 px-6 py-3 text-sm text-amber-800">
          {initialError}
        </div>
      ) : null}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Items</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialOrders.length ? (
            initialOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium text-slate-900">
                  {order.orderNumber}
                </TableCell>
                <TableCell>{formatOrderDate(order.placedAt || order.createdAt)}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getOrderStatusBadgeClass(
                      order.status,
                    )}`}
                  >
                    {formatOrderStatus(order.status)}
                  </span>
                </TableCell>
                <TableCell>{order.itemCount}</TableCell>
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
                No orders yet. Your recent purchases will appear here after checkout.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
