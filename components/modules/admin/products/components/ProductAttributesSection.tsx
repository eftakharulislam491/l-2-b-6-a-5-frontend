import { Badge } from "@/components/ui/badge";
import type { ProductAttributeGroup } from "../product-editor-types";
import { SectionCard } from "./ProductEditorPrimitives";

type ProductAttributesSectionProps = {
  attributeGroups: ProductAttributeGroup[];
};

export function ProductAttributesSection({
  attributeGroups,
}: ProductAttributesSectionProps) {
  return (
    <SectionCard
      title="Attributes"
      description="A data-wise summary so the UI still feels like the reference even though your model stores variants and options differently."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {attributeGroups.map((group) => (
          <div
            key={group.name}
            className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{group.name}</p>
                <p className="mt-1 text-sm text-slate-500">
                  Derived from variant titles
                </p>
              </div>
              <Badge
                variant="outline"
                className="rounded-full border-slate-300 bg-white px-3 py-1 text-slate-700"
              >
                {group.values.length} values
              </Badge>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {group.values.map((value) => (
                <Badge
                  key={value}
                  variant="outline"
                  className="rounded-full border-slate-300 bg-white px-3 py-1 text-slate-700"
                >
                  {value}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
        <p className="text-sm font-medium text-slate-900">How this maps</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          In your API, each variant group holds a label like{" "}
          <span className="font-medium text-slate-900">Color: Black</span>, and
          the sellable rows live inside{" "}
          <span className="font-medium text-slate-900">options</span>. This
          section keeps the admin editor easy to scan without forcing a different
          data model.
        </p>
      </div>
    </SectionCard>
  );
}
