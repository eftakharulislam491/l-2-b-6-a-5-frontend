import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-8 w-56 rounded-full" />
          <Skeleton className="h-4 w-80 max-w-full rounded-full" />
        </div>

        <div className="flex gap-3">
          <Skeleton className="h-11 w-28 rounded-xl" />
          <Skeleton className="h-11 w-28 rounded-xl" />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Skeleton className="h-72 w-full rounded-[2rem]" />
          <Skeleton className="h-56 w-full rounded-[2rem]" />
          <Skeleton className="h-96 w-full rounded-[2rem]" />
          <Skeleton className="h-52 w-full rounded-[2rem]" />
        </div>

        <div className="space-y-6">
          <Skeleton className="h-64 w-full rounded-[2rem]" />
          <Skeleton className="h-56 w-full rounded-[2rem]" />
        </div>
      </div>
    </div>
  );
}
