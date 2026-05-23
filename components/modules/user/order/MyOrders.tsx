"use client";

import { useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Eye, Search, X } from "lucide-react";
import type { OrderSummary } from "@/services/order/order-types";
import AppPagination from "@/components/shared/AppPagination";
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
  formatOrderAddress,
  formatOrderDate,
  formatOrderDateTime,
  formatOrderMoney,
  formatOrderStatus,
  getOrderStatusBadgeClass,
} from "./order-utils";

type MyOrdersProps = {
  initialOrders?: OrderSummary[];
  initialError?: string | null;
};

function OrderDetailsDialog({
  order,
  onClose,
}: {
  order: OrderSummary;
  onClose: () => void;
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
      <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[88vh] w-[calc(100vw-2rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-3xl border bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b px-6 py-5">
          <div>
            <Dialog.Title className="text-lg font-semibold text-slate-900">
              {order.orderNumber}
            </Dialog.Title>
            <Dialog.Description className="mt-1 text-sm text-slate-500">
              Placed {formatOrderDateTime(order.placedAt || order.createdAt)}
            </Dialog.Description>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close order details"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Status</p>
              <span
                className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getOrderStatusBadgeClass(
                  order.status,
                )}`}
              >
                {formatOrderStatus(order.status)}
              </span>
              <p className="mt-3 text-sm text-slate-600">
                Payment: {formatOrderStatus(order.paymentStatus)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Shipping</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {formatOrderAddress(order)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Summary</p>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Items</span>
                  <span>{order.itemCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatOrderMoney(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatOrderMoney(order.shippingCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatOrderMoney(order.tax)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-semibold text-slate-900">
                  <span>Total</span>
                  <span>{formatOrderMoney(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200">
            <div className="border-b px-4 py-3">
              <p className="text-sm font-semibold text-slate-900">Order items</p>
            </div>
            <div className="divide-y divide-slate-100">
              {order.items.length ? (
                order.items.map((item) => (
                  <div
                    key={item.id}
                    className="grid gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_80px_110px]"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{item.productName}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.productSku || "No SKU"}
                      </p>
                      {item.variantLabel ? (
                        <p className="mt-1 text-xs text-slate-500">
                          {item.variantLabel}
                        </p>
                      ) : null}
                    </div>
                    <p className="text-sm text-slate-500">Qty {item.quantity}</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {formatOrderMoney(item.total)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="px-4 py-8 text-sm text-slate-500">
                  No item details were returned for this order.
                </p>
              )}
            </div>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

export default function MyOrders({
  initialOrders = [],
  initialError = null,
}: MyOrdersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return initialOrders;
    }

    return initialOrders.filter((order) =>
      [
        order.orderNumber,
        order.status,
        order.paymentStatus,
        order.customerName,
        order.customerEmail,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query)),
    );
  }, [initialOrders, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / 8));
  const page = Math.min(currentPage, totalPages);
  const startIndex = (page - 1) * 8;
  const visibleOrders = filteredOrders.slice(startIndex, startIndex + 8);
  const selectedOrder =
    initialOrders.find((order) => order.id === selectedOrderId) ?? null;

  return (
    <div>
      <div className="rounded-lg bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">My Orders</h2>
            <p className="mt-1 text-sm text-gray-500">
              Track every order you placed from your dashboard.
            </p>
          </div>

          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by order, status, or email"
              className="pl-9"
            />
          </div>
        </div>

        {initialError ? (
          <div className="border-b border-amber-200 bg-amber-50 px-6 py-3 text-sm text-amber-800">
            {initialError}
          </div>
        ) : null}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleOrders.length ? (
              visibleOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
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
                  <TableCell className="text-sm text-slate-600">
                    {formatOrderStatus(order.paymentStatus)}
                  </TableCell>
                  <TableCell>{order.itemCount}</TableCell>
                  <TableCell className="font-medium">
                    {formatOrderMoney(order.total)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setSelectedOrderId(order.id)}
                    >
                      <Eye className="h-4 w-4 text-gray-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-28 text-center text-sm text-slate-500"
                >
                  {initialOrders.length
                    ? "No orders matched your search."
                    : "You have not placed any orders yet."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-8">
        <AppPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <Dialog.Root
        open={Boolean(selectedOrder)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedOrderId(null);
          }
        }}
      >
        {selectedOrder ? (
          <OrderDetailsDialog
            order={selectedOrder}
            onClose={() => setSelectedOrderId(null)}
          />
        ) : null}
      </Dialog.Root>
    </div>
  );
}
