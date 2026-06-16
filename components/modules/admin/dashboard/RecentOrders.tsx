"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { OrderSummary } from "@/services/order/order-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const PAGE_SIZE = 5;

export function RecentOrders({ orders }: RecentOrdersProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const statusOptions = useMemo(
    () =>
      Array.from(new Set(orders.map((order) => order.status).filter(Boolean))),
    [orders],
  );

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" ||
        order.status.toLowerCase() === statusFilter.toLowerCase();
      const searchableText = [
        order.orderNumber,
        order.customerName,
        order.customerEmail,
        order.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && searchableText.includes(normalizedQuery);
    });
  }, [orders, query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageOrders = filteredOrders.slice(pageStart, pageStart + PAGE_SIZE);
  const showingFrom = filteredOrders.length ? pageStart + 1 : 0;
  const showingTo = Math.min(pageStart + PAGE_SIZE, filteredOrders.length);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
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

      <div className="mb-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px]">
        <Input
          value={query}
          onChange={(event) => handleQueryChange(event.target.value)}
          placeholder="Filter by order, customer, email, or status"
          className="bg-background"
        />
        <select
          value={statusFilter}
          onChange={(event) => handleStatusChange(event.target.value)}
          className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
        >
          <option value="all">All statuses</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {formatOrderStatus(status)}
            </option>
          ))}
        </select>
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
          {pageOrders.length ? (
            pageOrders.map((order) => (
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

      <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>
          Showing {showingFrom} to {showingTo} of {filteredOrders.length} entries
        </span>
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Previous
          </Button>
          <span className="min-w-16 text-center text-xs font-semibold text-foreground">
            {currentPage} / {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() =>
              setPage((current) => Math.min(totalPages, current + 1))
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
