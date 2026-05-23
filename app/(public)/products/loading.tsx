import { Skeleton } from "@/components/ui/skeleton";

function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg bg-white p-3 shadow-sm">
        <Skeleton className="aspect-square w-full rounded-lg" />
      </div>
      <Skeleton className="h-4 w-3/4 rounded-full" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-4 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-28 rounded-full" />
    </div>
  );
}

function FilterBlockSkeleton({
  titleWidth,
  rowCount,
}: {
  titleWidth: string;
  rowCount: number;
}) {
  return (
    <div className="space-y-3">
      <Skeleton className={`h-3 ${titleWidth} rounded-full`} />
      <div className="space-y-2">
        {Array.from({ length: rowCount }).map((_, index) => (
          <Skeleton key={index} className="h-11 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#F4F6F8]">
      <div className="container mx-auto px-4 py-8 sm:py-10">
        <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
            <div className="space-y-5 p-8 sm:p-10 lg:p-12">
              <Skeleton className="h-3 w-36 rounded-full" />
              <Skeleton className="h-11 w-full max-w-lg rounded-full" />
              <Skeleton className="h-5 w-full max-w-2xl rounded-full" />
              <Skeleton className="h-5 w-5/6 max-w-xl rounded-full" />
              <div className="flex flex-wrap gap-3 pt-1">
                <Skeleton className="h-8 w-36 rounded-full" />
                <Skeleton className="h-8 w-28 rounded-full" />
              </div>
            </div>

            <div className="hidden min-h-[260px] lg:block">
              <Skeleton className="h-full min-h-[260px] w-full rounded-none" />
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Skeleton className="h-11 flex-1 rounded-full" />
            <Skeleton className="h-11 w-32 rounded-full lg:hidden" />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <div className="rounded-[2rem] bg-white p-5 shadow-sm">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20 rounded-full" />
                    <Skeleton className="h-3 w-28 rounded-full" />
                  </div>
                  <Skeleton className="h-8 w-16 rounded-full" />
                </div>

                <FilterBlockSkeleton titleWidth="w-24" rowCount={4} />

                <div className="space-y-3">
                  <Skeleton className="h-3 w-24 rounded-full" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-8 w-16 rounded-full" />
                    <Skeleton className="h-8 w-20 rounded-full" />
                    <Skeleton className="h-8 w-24 rounded-full" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Skeleton className="h-3 w-24 rounded-full" />
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <Skeleton className="h-3 w-16 rounded-full" />
                      <Skeleton className="h-3 w-16 rounded-full" />
                    </div>
                    <Skeleton className="mt-4 h-6 w-full rounded-full" />
                  </div>
                </div>

                <FilterBlockSkeleton titleWidth="w-28" rowCount={1} />
              </div>
            </div>
          </aside>

          <section>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-52 rounded-full" />
                <Skeleton className="h-3 w-64 rounded-full" />
              </div>
              <Skeleton className="h-10 w-full rounded-full sm:w-[220px]" />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 9 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>

            <div className="mt-10 flex items-center justify-center gap-3">
              <Skeleton className="h-10 w-24 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-24 rounded-full" />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
