import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="relative mx-auto my-6 w-full max-w-[1480px] px-4 sm:my-8 sm:px-6 lg:my-12 lg:px-8">
      <div className="mb-5 flex items-center gap-2">
        <Skeleton className="h-4 w-12 rounded-full" />
        <Skeleton className="h-4 w-2 rounded-full" />
        <Skeleton className="h-4 w-16 rounded-full" />
        <Skeleton className="h-4 w-2 rounded-full" />
        <Skeleton className="h-4 w-44 rounded-full" />
      </div>

      <section className="rounded-[32px] border border-slate-200/80 bg-white/80 p-3 shadow-[0_18px_55px_-30px_rgba(15,23,42,0.35)] backdrop-blur sm:p-4 lg:p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-8 xl:gap-10">
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-[2rem]" />
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="aspect-square w-full rounded-2xl" />
              ))}
            </div>
          </div>

          <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:space-y-6 sm:p-6 xl:p-8">
            <div className="space-y-3">
              <div className="flex gap-2">
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-7 w-20 rounded-full" />
              </div>
              <Skeleton className="h-10 w-3/4 rounded-full" />
              <Skeleton className="h-5 w-full rounded-full" />
              <Skeleton className="h-5 w-4/5 rounded-full" />
            </div>

            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </section>

      <div className="mt-10 sm:mt-12 lg:mt-16">
        <Skeleton className="h-80 w-full rounded-[2rem]" />
      </div>
    </div>
  );
}
