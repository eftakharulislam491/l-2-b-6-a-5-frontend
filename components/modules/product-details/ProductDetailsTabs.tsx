"use client";

import { formatCurrency } from "@/components/modules/product-catalog/catalog-utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProductDetailVariantGroup } from "./product-detail-types";

type ProductDetailsTabsProps = {
  description: string;
  shortDescription?: string;
  additionalInfo?: Record<string, string>;
  variantGroups?: ProductDetailVariantGroup[];
};

export default function ProductDetailsTabs({
  description,
  shortDescription = "",
  additionalInfo = {},
  variantGroups = [],
}: ProductDetailsTabsProps) {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="h-auto w-full justify-start gap-2 overflow-x-auto rounded-lg border border-border bg-muted p-1.5 scrollbar-none">
        <TabsTrigger
          value="description"
          className="rounded-xl border border-transparent px-4 py-2.5 text-sm font-medium text-muted-foreground transition data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:text-card-foreground data-[state=active]:shadow-none"
        >
          Description
        </TabsTrigger>
        <TabsTrigger
          value="summary"
          className="rounded-xl border border-transparent px-4 py-2.5 text-sm font-medium text-muted-foreground transition data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:text-card-foreground data-[state=active]:shadow-none"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger
          value="info"
          className="rounded-xl border border-transparent px-4 py-2.5 text-sm font-medium text-muted-foreground transition data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:text-card-foreground data-[state=active]:shadow-none"
        >
          Specifications
        </TabsTrigger>
        <TabsTrigger
          value="variants"
          className="rounded-xl border border-transparent px-4 py-2.5 text-sm font-medium text-muted-foreground transition data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:text-card-foreground data-[state=active]:shadow-none"
        >
          Variants
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="description"
        className="mt-4 rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm sm:mt-5 sm:p-6 lg:p-8"
      >
        <div className="prose max-w-none leading-7 text-card-foreground">
          {description || "No product description available."}
        </div>
      </TabsContent>

      <TabsContent
        value="summary"
        className="mt-4 rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm sm:mt-5 sm:p-6 lg:p-8"
      >
        {shortDescription ? (
          <div className="prose max-w-none leading-7 text-card-foreground">{shortDescription}</div>
        ) : (
          <p className="text-muted-foreground">No short summary available.</p>
        )}
      </TabsContent>

      <TabsContent
        value="info"
        className="mt-4 rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm sm:mt-5 sm:p-6 lg:p-8"
      >
        {Object.keys(additionalInfo).length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(additionalInfo).map(([key, value]) => (
              <div
                key={key}
                className="rounded-lg border border-border bg-muted p-4"
              >
                <p className="text-sm font-medium text-muted-foreground">{key}</p>
                <p className="mt-1 text-sm text-foreground">{value}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No additional information available.</p>
        )}
      </TabsContent>

      <TabsContent
        value="variants"
        className="mt-4 rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm sm:mt-5 sm:p-6 lg:p-8"
      >
        {variantGroups.length ? (
          <div className="space-y-5">
            {variantGroups.map((group) => (
              <div key={group.id} className="rounded-lg border border-border p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h4 className="font-medium text-card-foreground">{group.title}</h4>
                  <span className="text-xs text-muted-foreground">
                    {group.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="space-y-3">
                  {group.options.map((option) => (
                    <div
                      key={option.id}
                      className="rounded-lg border border-border bg-muted p-3"
                    >
                      <p className="text-sm font-medium text-foreground">
                        {option.label}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Price: {formatCurrency(option.price)}
                      </p>
                      {option.compareAtPrice ? (
                        <p className="text-sm text-muted-foreground">
                          Compare Price: {formatCurrency(option.compareAtPrice)}
                        </p>
                      ) : null}
                      <p className="text-sm text-muted-foreground">
                        SKU: {option.sku || "Not set"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Barcode: {option.barcode || "Not set"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Stock: {option.stock ?? 0}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No variant information available.</p>
        )}
      </TabsContent>

    </Tabs>
  );
}
