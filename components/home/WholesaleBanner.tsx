"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

type Props = {
  title?: string;
  description?: string;
  buttonText?: string;
  imageSrc?: string;
};

export default function WholesaleBanner({
  title = "Wholesale Made Simple\nPremium Beauty Ingredients at Scale",
  description = `We support beauty businesses, resellers, and bulk buyers with premium makeup and skincare raw materials at wholesale-friendly pricing. From pigments, waxes, oils, and cosmetic bases to active ingredients, our ordering process is built for smooth restocking, flexible quantities, and dependable supply for growing brands.`,
  buttonText = "Request Bulk Pricing",
  imageSrc = "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200&q=80&auto=format&fit=crop",
}: Props) {
  return (
    <section className="container mx-auto py-10 sm:py-14">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-10">
        <div className="space-y-5">
          <h2 className="whitespace-pre-line text-3xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h2>

          <p className="max-w-prose text-sm leading-6 text-slate-600 sm:text-base">
            {description}
          </p>

          <Button
            className="h-11 rounded-full bg-slate-900 px-6 text-white hover:bg-slate-800"
            type="button"
          >
            {buttonText}
          </Button>
        </div>

        <div className="lg:justify-self-end">
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="relative aspect-16/10 w-full lg:w-130">
              <Image
                src={imageSrc}
                alt="Wholesale beauty ingredients and cosmetic raw materials"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 520px"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
