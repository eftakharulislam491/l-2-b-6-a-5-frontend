import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "../ui/button";

const stats = [
  {
    value: "Low MOQ",
    label: "Easy ordering for new beauty brands and small-batch launches.",
  },
  {
    value: "Bulk Ready",
    label: "Reliable supply for wholesale buyers and repeat restocking needs.",
  },
  {
    value: "Beauty Grade",
    label: "Curated raw materials for premium makeup and skincare formulas.",
  },
  {
    value: "Fast Support",
    label: "Helpful guidance while choosing ingredients, sizes, and order flow.",
  },
];

export default function AboutUs() {
  return (
    <section className="container mx-auto w-full bg-white px-4 sm:px-0">
      <div className="rounded-[28px]  px-5 py-8 sm:px-0 sm:py-10 lg:px-0 lg:py-12">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10">
          <div className="max-w-xl">
            <h2 className="font-serif text-3xl font-semibold leading-tight tracking-tight text-[#2d211d] sm:text-4xl">
              About Us
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#6c5953] sm:text-base">
              We supply premium ladies makeup and skincare raw materials for
              beauty businesses that want dependable quality, clean
              presentation, and a smoother buying experience.
            </p>

            <p className="mt-4 text-sm leading-7 text-[#6c5953] sm:text-base">
              From oils, waxes, and actives to cosmetic bases and pigments, our
              collection is designed to support boutique makers, resellers, and
              growing production teams with both retail and bulk-ready options.
            </p>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="mt-7 h-11 rounded-full border-[#dccbc2] bg-white px-6 text-sm font-semibold text-[#4d3933] shadow-[0_12px_28px_rgba(88,62,49,0.08)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#fff8f3] hover:text-[#2d211d]"
            >
              <Link href="/products">
                Learn More
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 border-t border-[#eadfd8] pt-8 sm:grid-cols-2 sm:gap-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            {stats.map((item) => (
              <div
                key={item.value}
                className="group min-h-[148px] rounded-[22px] border border-[#e9ddd6] bg-white px-5 py-5 shadow-[0_12px_32px_rgba(88,62,49,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(88,62,49,0.10)]"
              >
                <div className="h-1.5 w-10 rounded-full bg-[#e5c9bb] transition duration-300 group-hover:w-14 group-hover:bg-[#c98f78]" />
                <div className="mt-4 text-lg font-semibold tracking-tight text-[#2f231f] sm:text-xl">
                  {item.value}
                </div>
                <div className="mt-2 text-sm leading-6 text-[#6b5954]">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
    <div className="lg:hidden mt-10 h-px w-full bg-slate-200" />
    <div className="lg:hidden mt-10 h-px w-full bg-slate-200" />
      </div>
    </section>
  );
}
