import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-md bg-[color-mix(in_oklch,var(--primary)_10%,var(--muted))]",
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
