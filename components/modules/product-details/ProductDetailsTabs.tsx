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
    <Tabs defaultValue="description" className="mt-12 w-full sm:mt-14 lg:mt-16">
      <TabsList className="h-auto w-full justify-start gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-2 scrollbar-none">
        <TabsTrigger
          value="description"
          className="rounded-xl border border-transparent px-4 py-2.5 text-sm font-medium text-slate-600 transition data-[state=active]:border-slate-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-none"
        >
          Description
        </TabsTrigger>
        <TabsTrigger
          value="summary"
          className="rounded-xl border border-transparent px-4 py-2.5 text-sm font-medium text-slate-600 transition data-[state=active]:border-slate-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-none"
        >
          Summary
        </TabsTrigger>
        <TabsTrigger
          value="info"
          className="rounded-xl border border-transparent px-4 py-2.5 text-sm font-medium text-slate-600 transition data-[state=active]:border-slate-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-none"
        >
          Additional Info
        </TabsTrigger>
        <TabsTrigger
          value="variants"
          className="rounded-xl border border-transparent px-4 py-2.5 text-sm font-medium text-slate-600 transition data-[state=active]:border-slate-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-none"
        >
          Variants
        </TabsTrigger>
        <TabsTrigger
          value="related"
          className="rounded-xl border border-transparent px-4 py-2.5 text-sm font-medium text-slate-600 transition data-[state=active]:border-slate-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-none"
        >
          Related Products
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="description"
        className="mt-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:mt-5 sm:p-6 lg:p-8"
      >
        <div className="prose max-w-none leading-7 text-slate-700">
          {description || "No product description available."}
        </div>
      </TabsContent>

      <TabsContent
        value="summary"
        className="mt-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:mt-5 sm:p-6 lg:p-8"
      >
        {shortDescription ? (
          <div className="prose max-w-none leading-7 text-slate-700">{shortDescription}</div>
        ) : (
          <p className="text-slate-500">No short summary available.</p>
        )}
      </TabsContent>

      <TabsContent
        value="info"
        className="mt-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:mt-5 sm:p-6 lg:p-8"
      >
        {Object.keys(additionalInfo).length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(additionalInfo).map(([key, value]) => (
              <div
                key={key}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-sm font-medium text-slate-600">{key}</p>
                <p className="mt-1 text-sm text-slate-800">{value}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500">No additional information available.</p>
        )}
      </TabsContent>

      <TabsContent
        value="variants"
        className="mt-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:mt-5 sm:p-6 lg:p-8"
      >
        {variantGroups.length ? (
          <div className="space-y-5">
            {variantGroups.map((group) => (
              <div key={group.id} className="rounded-2xl border border-slate-200 p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h4 className="text-slate-800 font-medium">{group.title}</h4>
                  <span className="text-xs text-slate-500">
                    {group.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="space-y-3">
                  {group.options.map((option) => (
                    <div
                      key={option.id}
                      className="rounded-xl border border-slate-100 bg-slate-50 p-3"
                    >
                      <p className="text-sm font-medium text-slate-800">
                        {option.label}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        Price: {formatCurrency(option.price)}
                      </p>
                      {option.compareAtPrice ? (
                        <p className="text-sm text-slate-600">
                          Compare Price: {formatCurrency(option.compareAtPrice)}
                        </p>
                      ) : null}
                      <p className="text-sm text-slate-600">
                        SKU: {option.sku || "Not set"}
                      </p>
                      <p className="text-sm text-slate-600">
                        Barcode: {option.barcode || "Not set"}
                      </p>
                      <p className="text-sm text-slate-600">
                        Stock: {option.stock ?? 0}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500">No variant information available.</p>
        )}
      </TabsContent>

      <TabsContent
        value="related"
        className="mt-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:mt-5 sm:p-6 lg:p-8"
      >
        <p className="text-slate-500">
          Related products will be rendered here later. The slider section below
          is still kept in place.
        </p>
      </TabsContent>
    </Tabs>
  );
}
