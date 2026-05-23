import { FileText, Package, Star, TrendingUp, Users } from "lucide-react";

type DashboardStatsOverviewProps = {
  stats: {
    totalSales: number;
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
    activeOrders: number;
    deliveredOrders: number;
    featuredProducts: number;
    pendingReviews: number;
  };
};

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: value >= 1000 ? 1 : 0,
  }).format(value);
}

function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export default function DashboardStatsOverview({
  stats,
}: DashboardStatsOverviewProps) {
  const items = [
    {
      value: formatCompactCurrency(stats.totalSales),
      label: "Total Sales",
      helper: `${formatCompactNumber(stats.deliveredOrders)} delivered orders`,
      icon: TrendingUp,
      bgColor: "from-sky-500 via-blue-500 to-indigo-600",
      iconColor: "text-sky-600",
      helperIcon: null,
    },
    {
      value: formatCompactNumber(stats.totalOrders),
      label: "Total Orders",
      helper: `${formatCompactNumber(stats.activeOrders)} active in pipeline`,
      icon: FileText,
      bgColor: "from-fuchsia-500 via-pink-500 to-rose-500",
      iconColor: "text-pink-600",
      helperIcon: null,
    },
    {
      value: formatCompactNumber(stats.totalProducts),
      label: "Total Products",
      helper: `${formatCompactNumber(stats.featuredProducts)} featured products`,
      icon: Package,
      bgColor: "from-amber-500 via-orange-500 to-red-500",
      iconColor: "text-orange-600",
      helperIcon: null,
    },
    {
      value: formatCompactNumber(stats.totalCustomers),
      label: "Total Customers",
      helper: `${formatCompactNumber(stats.pendingReviews)} reviews need attention`,
      icon: Users,
      bgColor: "from-emerald-500 via-green-500 to-teal-600",
      iconColor: "text-emerald-600",
      helperIcon: Star,
    },
  ];

  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-4">
      {items.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-3xl bg-gradient-to-br ${stat.bgColor} p-6 text-white shadow-lg shadow-slate-200/60 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl`}
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-3xl font-bold sm:text-4xl">{stat.value}</span>
              <span className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/85">
                {stat.label}
              </span>
              <span className="mt-4 inline-flex items-center gap-2 text-xs text-white/80">
                {stat.helperIcon ? <stat.helperIcon className="h-3.5 w-3.5" /> : null}
                {stat.helper}
              </span>
            </div>

            <div className="rounded-2xl bg-white/95 p-4 shadow-md">
              <stat.icon className={`h-6 w-6 ${stat.iconColor}`} strokeWidth={2} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
