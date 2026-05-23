"use client";

import { useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  ORDER_STATUS_VALUES,
  type OrderStatus,
  type OrderSummary,
} from "@/services/order/order-types";
import { updateAdminOrderStatus } from "@/services/order/manageOrders";
import { toast } from "sonner";

type AdminOrdersListProps = {
  initialOrders?: OrderSummary[];
  initialError?: string | null;
};

const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["PROCESSING", "CONFIRMED", "CANCELLED"],
  PROCESSING: ["CONFIRMED", "SHIPPED", "CANCELLED"],
  CONFIRMED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "RETURNED"],
  DELIVERED: ["RETURNED", "REFUNDED"],
  CANCELLED: [],
  RETURNED: ["REFUNDED"],
  REFUNDED: [],
};

function normalizeOrderStatus(value: string): OrderStatus | null {
  const normalizedValue = value.trim().toUpperCase() as OrderStatus;

  if (!ORDER_STATUS_VALUES.includes(normalizedValue)) {
    return null;
  }

  return normalizedValue;
}

function getAvailableTransitions(status: string): OrderStatus[] {
  const normalizedStatus = normalizeOrderStatus(status);

  if (!normalizedStatus) {
    return [];
  }

  return ORDER_STATUS_TRANSITIONS[normalizedStatus];
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatDate(value: string) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function getStatusVariant(status: string) {
  switch (status.toUpperCase()) {
    case "PENDING":
      return "secondary";
    case "CANCELLED":
    case "RETURNED":
      return "destructive";
    case "DELIVERED":
    case "COMPLETED":
      return "default";
    default:
      return "outline";
  }
}

function matchesDateFilter(order: OrderSummary, dateFilter: string) {
  if (dateFilter === "all") {
    return true;
  }

  const orderDate = new Date(order.placedAt || order.createdAt);

  if (Number.isNaN(orderDate.getTime())) {
    return false;
  }

  const now = Date.now();
  const ageInDays = (now - orderDate.getTime()) / (1000 * 60 * 60 * 24);

  if (dateFilter === "today") {
    return new Date(now).toDateString() === orderDate.toDateString();
  }

  if (dateFilter === "7days") {
    return ageInDays <= 7;
  }

  if (dateFilter === "30days") {
    return ageInDays <= 30;
  }

  return true;
}

function formatAddress(order: OrderSummary) {
  if (!order.address) {
    return "-";
  }

  return [
    order.address.recipient,
    order.address.phone,
    order.address.street,
    [order.address.city, order.address.state, order.address.zipCode]
      .filter(Boolean)
      .join(", "),
    order.address.country,
  ]
    .filter(Boolean)
    .join(" | ");
}

type OrderDetailsContentProps = {
  order: OrderSummary;
  statusChoices: OrderStatus[];
  nextStatus: string;
  onStatusChange: (value: string) => void;
  statusNote: string;
  onStatusNoteChange: (value: string) => void;
  onUpdateStatus: () => void;
  isMutating: boolean;
  onClose: () => void;
};

function OrderDetailsContent({
  order,
  statusChoices,
  nextStatus,
  onStatusChange,
  statusNote,
  onStatusNoteChange,
  onUpdateStatus,
  isMutating,
  onClose,
}: OrderDetailsContentProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
      <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[88vh] w-[calc(100vw-2rem)] max-w-5xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl">
        <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Dialog.Title className="text-lg font-semibold">
              {order.orderNumber}
            </Dialog.Title>
            <Dialog.Description className="mt-1 text-sm text-muted-foreground">
              Placed {formatDate(order.placedAt || order.createdAt)}
            </Dialog.Description>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={getStatusVariant(order.status)}>
              {formatStatus(order.status)}
            </Badge>
            <Badge variant="outline">{formatStatus(order.paymentStatus)}</Badge>
            <Dialog.Close asChild>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={onClose}
                aria-label="Close order details"
              >
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>
        </div>

        <div className="overflow-y-auto p-5">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-lg border p-4">
              <p className="text-sm font-semibold">Customer</p>
              <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">
                  {order.customerName || "Guest"}
                </p>
                <p>{order.customerEmail || "-"}</p>
                <p>{order.customerPhone || "-"}</p>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm font-semibold">Shipping address</p>
              <p className="mt-3 text-sm text-muted-foreground">
                {formatAddress(order)}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm font-semibold">Payment</p>
              <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                <p>Method: {formatStatus(order.paymentMethod)}</p>
                <p>Status: {formatStatus(order.paymentStatus)}</p>
                <p>Total: {formatMoney(order.total)}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="rounded-lg border">
              <div className="border-b px-4 py-3">
                <p className="text-sm font-semibold">Items</p>
              </div>
              <div className="divide-y">
                {order.items.length ? (
                  order.items.map((item) => (
                    <div
                      key={item.id}
                      className="grid gap-3 px-4 py-3 text-sm sm:grid-cols-[minmax(0,1fr)_80px_100px]"
                    >
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.productSku || "No SKU"}
                        </p>
                        {item.variantLabel ? (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {item.variantLabel}
                          </p>
                        ) : null}
                      </div>
                      <p className="text-muted-foreground">Qty {item.quantity}</p>
                      <p className="font-medium">{formatMoney(item.total)}</p>
                    </div>
                  ))
                ) : (
                  <p className="px-4 py-6 text-sm text-muted-foreground">
                    No item details returned for this order.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm font-semibold">Totals</p>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatMoney(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span>{formatMoney(order.discountTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatMoney(order.shippingCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatMoney(order.tax)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-semibold">
                  <span>Total</span>
                  <span>{formatMoney(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-lg border p-4">
            <p className="text-sm font-semibold">Update status</p>
            <div className="mt-3 grid gap-3 lg:grid-cols-[220px_minmax(0,1fr)]">
              <Select
                value={nextStatus}
                onValueChange={onStatusChange}
                disabled={isMutating || !statusChoices.length}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      statusChoices.length
                        ? "Select next status"
                        : "No available status change"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {statusChoices.map((status) => (
                    <SelectItem key={status} value={status}>
                      {formatStatus(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                value={statusNote}
                onChange={(event) => onStatusNoteChange(event.target.value)}
                placeholder="Optional note for this status update"
                maxLength={500}
                disabled={isMutating || !statusChoices.length}
              />
            </div>
            <div className="mt-3 flex items-center gap-3">
              <Button
                type="button"
                onClick={onUpdateStatus}
                disabled={isMutating || !statusChoices.length || !nextStatus}
              >
                {isMutating ? "Updating..." : "Update status"}
              </Button>
              {!statusChoices.length ? (
                <p className="text-xs text-muted-foreground">
                  This order is in a terminal state and cannot be changed further.
                </p>
              ) : null}
            </div>
          </div>

          {(order.notes || order.adminNotes) ? (
            <div className="mt-5 rounded-lg border p-4 text-sm">
              <p className="font-semibold">Notes</p>
              {order.notes ? (
                <p className="mt-2 text-muted-foreground">
                  Customer: {order.notes}
                </p>
              ) : null}
              {order.adminNotes ? (
                <p className="mt-2 text-muted-foreground">
                  Admin: {order.adminNotes}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

export default function AdminOrdersList({
  initialOrders = [],
  initialError = null,
}: AdminOrdersListProps) {
  const [orders, setOrders] = useState<OrderSummary[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [nextStatus, setNextStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [isMutating, setIsMutating] = useState(false);

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        order.orderNumber.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.customerEmail.toLowerCase().includes(query) ||
        order.id.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "all" ||
        order.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesDateFilter(order, dateFilter);
    });
  }, [dateFilter, orders, searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * perPage;
  const pageOrders = filteredOrders.slice(pageStart, pageStart + perPage);
  const showingFrom = filteredOrders.length ? pageStart + 1 : 0;
  const showingTo = Math.min(pageStart + perPage, filteredOrders.length);

  function updateStatusFilter(value: string) {
    setStatusFilter(value);
    setPage(1);
  }

  function updateDateFilter(value: string) {
    setDateFilter(value);
    setPage(1);
  }

  function updatePerPage(value: string) {
    setPerPage(Number(value));
    setPage(1);
  }

  function goToPage(nextPage: number) {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  }

  function openOrderDetails(orderId: string) {
    setSelectedOrderId(orderId);
    setNextStatus("");
    setStatusNote("");
  }

  function closeOrderDetails() {
    setSelectedOrderId(null);
    setNextStatus("");
    setStatusNote("");
  }

  async function handleUpdateOrderStatus() {
    if (!selectedOrderId) {
      return;
    }

    const order = orders.find((orderItem) => orderItem.id === selectedOrderId);

    if (!order) {
      toast.error("Order not found.");
      return;
    }

    const targetStatus = normalizeOrderStatus(nextStatus);

    if (!targetStatus) {
      toast.error("Please select a valid status.");
      return;
    }

    const allowedStatuses = getAvailableTransitions(order.status);

    if (!allowedStatuses.includes(targetStatus)) {
      toast.error("This status change is not allowed from current order state.");
      return;
    }

    setIsMutating(true);

    const result = await updateAdminOrderStatus(order.id, {
      status: targetStatus,
      note: statusNote,
    });

    setIsMutating(false);

    if (!result.success || !result.order) {
      toast.error(result.message);
      return;
    }

    const updatedOrder = result.order;

    setOrders((currentOrders) =>
      currentOrders.map((orderItem) =>
        orderItem.id === updatedOrder.id ? updatedOrder : orderItem,
      ),
    );
    setNextStatus("");
    setStatusNote("");
    toast.success(result.message);
  }

  const uniqueStatuses = Array.from(
    new Set(orders.map((order) => order.status).filter(Boolean)),
  );
  const selectedOrder =
    orders.find((order) => order.id === selectedOrderId) ?? null;
  const selectableStatuses = selectedOrder
    ? getAvailableTransitions(selectedOrder.status)
    : [];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {initialError ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {initialError}
        </div>
      ) : null}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Input
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value);
            setPage(1);
          }}
          placeholder="Search by order ID, name or email..."
          className="lg:max-w-sm"
        />

        <div className="flex w-full flex-wrap gap-3 lg:w-auto">
          <Select value={statusFilter} onValueChange={updateStatusFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {uniqueStatuses.map((status) => (
                <SelectItem key={status} value={status.toLowerCase()}>
                  {formatStatus(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={updateDateFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>

          <Select value={String(perPage)} onValueChange={updatePerPage}>
            <SelectTrigger className="w-full sm:w-[120px]">
              <SelectValue placeholder="Per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Placed</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {pageOrders.length ? (
              pageOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>{order.customerName || "Guest"}</TableCell>
                  <TableCell>{order.customerEmail || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.status)}>
                      {formatStatus(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {formatStatus(order.paymentStatus)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatStatus(order.paymentMethod)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{order.itemCount}</TableCell>
                  <TableCell>{formatMoney(order.total)}</TableCell>
                  <TableCell>{formatDate(order.placedAt || order.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openOrderDetails(order.id)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="h-28 text-center text-sm text-muted-foreground"
                >
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog.Root
        open={Boolean(selectedOrder)}
        onOpenChange={(open) => {
          if (!open) {
            closeOrderDetails();
          }
        }}
      >
        {selectedOrder ? (
          <OrderDetailsContent
            order={selectedOrder}
            statusChoices={selectableStatuses}
            nextStatus={nextStatus}
            onStatusChange={setNextStatus}
            statusNote={statusNote}
            onStatusNoteChange={setStatusNote}
            onUpdateStatus={() => void handleUpdateOrderStatus()}
            isMutating={isMutating}
            onClose={closeOrderDetails}
          />
        ) : null}
      </Dialog.Root>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {showingFrom} to {showingTo} of {filteredOrders.length} entries
        </p>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  goToPage(currentPage - 1);
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .slice(0, 5)
              .map((pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    isActive={pageNumber === currentPage}
                    onClick={(event) => {
                      event.preventDefault();
                      goToPage(pageNumber);
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  goToPage(currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
