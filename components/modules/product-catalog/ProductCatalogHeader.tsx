import type { ReactNode } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type ProductCatalogHeaderProps = {
  query: string;
  productCount: number;
  filtersTrigger?: ReactNode;
  onQueryChange: (value: string) => void;
};

export default function ProductCatalogHeader({
  query,
  productCount,
  filtersTrigger,
  onQueryChange,
}: ProductCatalogHeaderProps) {
  return (
    <>
      <Card className="overflow-hidden rounded-[2rem] border-0 bg-white shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
          <div className="p-8 sm:p-10 lg:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
              Product Collection
            </p>
            <h1 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Browse your full catalog with live product data
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Explore every product from your backend in one place, then narrow
              things down with category, stock, featured, and price filters.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Badge
                variant="secondary"
                className="rounded-full px-4 py-1.5 text-xs font-medium"
              >
                {productCount} products loaded
              </Badge>
              <Badge
                variant="outline"
                className="rounded-full border-slate-200 px-4 py-1.5 text-xs font-medium text-slate-600"
              >
                Real API results
              </Badge>
            </div>
          </div>

          <div className="relative min-h-[260px]">
            <Image
              src="/banner.png"
              alt="Product catalog banner"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/5 via-transparent to-slate-900/20" />
          </div>
        </div>
      </Card>

      <div className="mt-8 rounded-[2rem] border-0 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search by title, brand, category, or slug"
              className="h-11 rounded-full border-slate-200 pl-10"
            />
          </div>

          {filtersTrigger}
        </div>
      </div>
    </>
  );
}
