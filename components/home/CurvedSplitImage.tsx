"use client";

import Image from "next/image";
import * as React from "react";
import { CheckCircle2 } from "lucide-react";

type Feature = {
  title: string;
  desc: string;
};

const features: Feature[] = [
  {
    title: "Premium beauty-grade sourcing",
    desc: "We offer curated makeup and skincare raw materials selected for better consistency, finish, and formula performance.",
  },
  {
    title: "Single and bulk order support",
    desc: "You can buy for testing, small-batch launches, or wholesale restocking from one reliable source.",
  },
  {
    title: "Smooth ordering experience",
    desc: "Clear product options and flexible pack sizes make ingredient selection and checkout simple.",
  },
  {
    title: "Careful packing and delivery",
    desc: "Your beauty ingredients are prepared and dispatched with care so production stays on schedule.",
  },
];

export default function WhyChooseUsSection() {

  return (
    <section className="w-full bg-[#F4F6F8]">
      <div className="container mx-auto px-4 py-10 sm:py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Why Choose Us
            </h2>

            <p className="mt-3 max-w-prose text-sm leading-6 text-slate-600 sm:text-base">
              Source premium makeup and skincare raw materials with confidence.
              We help beauty brands, resellers, and makers find dependable
              ingredients with a smoother buying experience.
            </p>

            <div className="mt-6 space-y-4">
              {features.map((f) => (
                <div key={f.title} className="flex gap-3">
                  <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                    <CheckCircle2 className="h-5 w-5 text-slate-700" />
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {f.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

{/* right part */}
          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[32px] bg-white shadow-sm">
            <Image
              src="/splitImg.png"
              alt="Curved beauty ingredients collage"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="scale-[1.05] object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
