"use client";

import { useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Star, X } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  deleteAdminReview,
  moderateAdminReview,
  replyAdminReview,
} from "@/services/review/manageReviews";
import type { AdminReview } from "@/services/review/review-types";
import { toast } from "sonner";

type AdminReviewsListProps = {
  initialReviews?: AdminReview[];
  initialError?: string | null;
};

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

function getApprovalBadgeVariant(review: AdminReview) {
  return review.isApproved ? "default" : "secondary";
}

function getVerificationBadgeVariant(review: AdminReview) {
  return review.isVerifiedPurchase ? "default" : "outline";
}

function renderRatingStars(rating: number) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={`h-3.5 w-3.5 ${
            index < rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
          }`}
        />
      ))}
    </div>
  );
}

export default function AdminReviewsList({
  initialReviews = [],
  initialError = null,
}: AdminReviewsListProps) {
  const [reviews, setReviews] = useState<AdminReview[]>(initialReviews);
  const [searchQuery, setSearchQuery] = useState("");
  const [approvalFilter, setApprovalFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [isMutating, setIsMutating] = useState(false);

  const selectedReview = useMemo(
    () => reviews.find((review) => review.id === selectedReviewId) ?? null,
    [reviews, selectedReviewId],
  );

  function openReviewManager(reviewId: string) {
    const review = reviews.find((item) => item.id === reviewId) ?? null;
    setSelectedReviewId(reviewId);
    setReplyDraft(review?.adminReply ?? "");
  }

  function closeReviewManager() {
    setSelectedReviewId(null);
    setReplyDraft("");
  }

  const filteredReviews = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return reviews.filter((review) => {
      const matchesSearch =
        !query ||
        review.product.title.toLowerCase().includes(query) ||
        review.product.slug.toLowerCase().includes(query) ||
        review.user.name.toLowerCase().includes(query) ||
        (review.user.email ?? "").toLowerCase().includes(query) ||
        (review.title ?? "").toLowerCase().includes(query) ||
        (review.comment ?? "").toLowerCase().includes(query);

      const matchesApproval =
        approvalFilter === "all" ||
        (approvalFilter === "approved" && review.isApproved) ||
        (approvalFilter === "pending" && !review.isApproved);

      const matchesRating =
        ratingFilter === "all" || String(review.rating) === ratingFilter;

      return matchesSearch && matchesApproval && matchesRating;
    });
  }, [approvalFilter, ratingFilter, reviews, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * perPage;
  const pageReviews = filteredReviews.slice(pageStart, pageStart + perPage);
  const showingFrom = filteredReviews.length ? pageStart + 1 : 0;
  const showingTo = Math.min(pageStart + perPage, filteredReviews.length);

  function goToPage(nextPage: number) {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  }

  function updateReviewInState(nextReview: AdminReview) {
    setReviews((currentReviews) =>
      currentReviews.map((review) =>
        review.id === nextReview.id ? nextReview : review,
      ),
    );
  }

  async function handleToggleApproval() {
    if (!selectedReview) {
      return;
    }

    setIsMutating(true);
    const result = await moderateAdminReview(selectedReview.id, {
      isApproved: !selectedReview.isApproved,
    });
    setIsMutating(false);

    if (!result.success || !result.review) {
      toast.error(result.message);
      return;
    }

    updateReviewInState(result.review);
    toast.success(result.message);
  }

  async function handleToggleVerification() {
    if (!selectedReview) {
      return;
    }

    setIsMutating(true);
    const result = await moderateAdminReview(selectedReview.id, {
      isVerifiedPurchase: !selectedReview.isVerifiedPurchase,
    });
    setIsMutating(false);

    if (!result.success || !result.review) {
      toast.error(result.message);
      return;
    }

    updateReviewInState(result.review);
    toast.success(result.message);
  }

  async function handleSaveReply() {
    if (!selectedReview) {
      return;
    }

    setIsMutating(true);
    const result = await replyAdminReview(selectedReview.id, replyDraft || null);
    setIsMutating(false);

    if (!result.success || !result.review) {
      toast.error(result.message);
      return;
    }

    updateReviewInState(result.review);
    setReplyDraft(result.review.adminReply ?? "");
    toast.success(result.message);
  }

  async function handleDeleteReview() {
    if (!selectedReview) {
      return;
    }

    const shouldDelete = window.confirm(
      "Are you sure you want to permanently delete this review?",
    );

    if (!shouldDelete) {
      return;
    }

    setIsMutating(true);
    const result = await deleteAdminReview(selectedReview.id);
    setIsMutating(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    setReviews((currentReviews) =>
      currentReviews.filter((review) => review.id !== selectedReview.id),
    );
    closeReviewManager();
    toast.success(result.message);
  }

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
          placeholder="Search by product, customer, email, or review text..."
          className="lg:max-w-sm"
        />

        <div className="flex w-full flex-wrap gap-3 lg:w-auto">
          <Select
            value={approvalFilter}
            onValueChange={(value) => {
              setApprovalFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Approval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={ratingFilter}
            onValueChange={(value) => {
              setRatingFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={String(perPage)}
            onValueChange={(value) => {
              setPerPage(Number(value));
              setPage(1);
            }}
          >
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
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Approval</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {pageReviews.length ? (
              pageReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{review.product.title}</p>
                      <p className="text-xs text-muted-foreground">{review.product.slug}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{review.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {review.user.email || "-"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{review.rating} / 5</p>
                      {renderRatingStars(review.rating)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getApprovalBadgeVariant(review)}>
                      {review.isApproved ? "Approved" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getVerificationBadgeVariant(review)}>
                      {review.isVerifiedPurchase ? "Verified" : "Unverified"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="max-w-[260px] truncate text-sm text-muted-foreground">
                      {review.comment || review.title || "No text provided"}
                    </p>
                  </TableCell>
                  <TableCell>{formatDate(review.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openReviewManager(review.id)}
                    >
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-28 text-center text-sm text-muted-foreground"
                >
                  No reviews found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog.Root
        open={Boolean(selectedReview)}
        onOpenChange={(open) => {
          if (!open) {
            closeReviewManager();
          }
        }}
      >
        {selectedReview ? (
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
            <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[88vh] w-[calc(100vw-2rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl">
              <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Dialog.Title className="text-lg font-semibold">
                    Review for {selectedReview.product.title}
                  </Dialog.Title>
                  <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                    Submitted {formatDate(selectedReview.createdAt)} by{" "}
                    {selectedReview.user.name}
                  </Dialog.Description>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={getApprovalBadgeVariant(selectedReview)}>
                    {selectedReview.isApproved ? "Approved" : "Pending"}
                  </Badge>
                  <Badge variant={getVerificationBadgeVariant(selectedReview)}>
                    {selectedReview.isVerifiedPurchase
                      ? "Verified purchase"
                      : "Not verified"}
                  </Badge>
                  <Dialog.Close asChild>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label="Close review details"
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
                      <p className="font-medium text-foreground">{selectedReview.user.name}</p>
                      <p>{selectedReview.user.email || "-"}</p>
                      <p>ID: {selectedReview.user.id}</p>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <p className="text-sm font-semibold">Product</p>
                    <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">
                        {selectedReview.product.title}
                      </p>
                      <p>{selectedReview.product.slug || "-"}</p>
                      <p>ID: {selectedReview.product.id}</p>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <p className="text-sm font-semibold">Rating</p>
                    <div className="mt-3 space-y-1">
                      <p className="text-sm font-medium">
                        {selectedReview.rating} / 5
                      </p>
                      {renderRatingStars(selectedReview.rating)}
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-lg border p-4">
                  <p className="text-sm font-semibold">Customer review</p>
                  {selectedReview.title ? (
                    <p className="mt-2 text-sm font-medium">{selectedReview.title}</p>
                  ) : null}
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {selectedReview.comment || "No written review provided."}
                  </p>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Button
                    type="button"
                    variant={selectedReview.isApproved ? "outline" : "default"}
                    onClick={() => void handleToggleApproval()}
                    disabled={isMutating}
                  >
                    {selectedReview.isApproved ? "Unapprove" : "Approve"}
                  </Button>
                  <Button
                    type="button"
                    variant={selectedReview.isVerifiedPurchase ? "outline" : "default"}
                    onClick={() => void handleToggleVerification()}
                    disabled={isMutating}
                  >
                    {selectedReview.isVerifiedPurchase
                      ? "Mark unverified"
                      : "Mark verified"}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => void handleDeleteReview()}
                    disabled={isMutating}
                  >
                    Delete review
                  </Button>
                </div>

                <div className="mt-5 rounded-lg border p-4">
                  <p className="text-sm font-semibold">Admin reply</p>
                  <textarea
                    value={replyDraft}
                    onChange={(event) => setReplyDraft(event.target.value)}
                    rows={5}
                    className="mt-3 min-h-[120px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200/60"
                    placeholder="Write an admin reply for this review..."
                    disabled={isMutating}
                  />
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <Button
                      type="button"
                      onClick={() => void handleSaveReply()}
                      disabled={isMutating}
                    >
                      Save reply
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setReplyDraft("")}
                      disabled={isMutating}
                    >
                      Clear draft
                    </Button>
                  </div>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </Dialog.Root>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {showingFrom} to {showingTo} of {filteredReviews.length} entries
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
}
