import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-10 w-48 rounded-full" />
      <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-3 rounded-[1.5rem] border border-slate-100 p-4">
                <Skeleton className="h-44 w-full rounded-[1.25rem]" />
                <Skeleton className="h-5 w-2/3 rounded-full" />
                <Skeleton className="h-4 w-1/2 rounded-full" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
