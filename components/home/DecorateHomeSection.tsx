"use client";

import Image from "next/image";
import { CalendarDays, Ruler, FileText, Truck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Step = {
  icon: React.ElementType;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    icon: CalendarDays,
    title: "Choose Your Ingredients",
    description:
      "Browse our collection and select the makeup and skincare raw materials that match your formula needs.",
  },
  {
    icon: Ruler,
    title: "Pick Size & Quantity",
    description:
      "Choose the right pack size for testing, small-batch production, or larger wholesale restocking.",
  },
  {
    icon: FileText,
    title: "Review Order Details",
    description:
      "Check product details, pricing, and order quantities before placing your beauty supply order.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description:
      "We prepare and dispatch your raw materials carefully so your products and production plan stay on track.",
  },
];

type Props = {
  imageSrc?: string;
  title?: string;
  description?: string;
};

export default function DecorateHomeSection({
  imageSrc = "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1600&q=80&auto=format&fit=crop",
  title = "Create Premium Beauty Products\nWith the Right Ingredients.",
  description = "From cosmetic bases and essential oils to waxes, actives, and pigments, we make it easier to source the raw materials your beauty business needs.",
}: Props) {
  return (
    <section className="container mx-auto bg-background text-foreground">
      <div className="py-10 sm:py-14">
        {/* Equal columns */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-stretch">
          {/* LEFT: Image */}
          <div className="h-full">
            <div className="relative h-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="relative aspect-[4/3] w-full lg:h-full lg:aspect-auto">
                <Image
                  src={imageSrc}
                  alt="Beauty ingredients and cosmetic raw materials"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Content */}
          <div className="flex h-full flex-col">
            <div className="space-y-4">
              <h2 className="whitespace-pre-line text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
                {title}
              </h2>

              <p className="max-w-prose text-sm leading-6 text-muted-foreground sm:text-base">
                {description}
              </p>

              <p className="pt-2 text-sm font-semibold text-foreground">
                How It Works
              </p>
            </div>

            {/* Steps grid */}
            <div className="mt-6 grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">
              {steps.map((s, index) => {
                const Icon = s.icon;

                const roundedStyles = [
                  "rounded-br-4xl", // 1st → bottom-right
                  "rounded-bl-4xl", // 2nd → bottom-left
                  "rounded-tr-4xl", // 3rd → top-right
                  "rounded-tl-4xl", // 4th → top-left
                ];

                return (
                  <Card
                    key={s.title}
                    className={cn(
                      "rounded-none border-border bg-card p-5 text-card-foreground shadow-sm",
                      "transition-all duration-300 ease-out", // smooth animation
                      "hover:scale-[1.03] hover:shadow-md", // 👈 scale + shadow
                      roundedStyles[index % 4],
                    )}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                        <Icon className="h-5 w-5 text-secondary-foreground" />
                      </div>

                      <h3 className="text-sm font-semibold text-card-foreground">
                        {s.title}
                      </h3>

                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        {s.description}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
