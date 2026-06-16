import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Handshake,
  PackageCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const highlights = [
  {
    title: "Beauty-grade materials",
    description:
      "Curated pigments, oils, waxes, actives, bases, and extracts for makeup and skincare production.",
    icon: Sparkles,
  },
  {
    title: "Retail to wholesale",
    description:
      "Flexible quantities for testing, small-batch launches, reseller orders, and bulk restocking.",
    icon: Boxes,
  },
  {
    title: "Reliable guidance",
    description:
      "Helpful support when choosing ingredient types, pack sizes, and the right materials for your workflow.",
    icon: Handshake,
  },
];

const values = [
  "Ingredient-focused product selection",
  "Clean presentation for confident buying",
  "Fast support for repeat customers",
  "Bulk-ready supply for growing brands",
];

export default function AboutPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="container mx-auto grid gap-10 px-4 py-12 sm:px-0 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.82fr)] lg:items-center lg:py-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            About Metro
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
            Premium raw materials for beauty makers, resellers, and growing
            cosmetic brands.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
            Metro supplies ladies makeup and skincare raw materials with a
            practical focus: dependable quality, flexible buying options, and a
            smoother sourcing experience for businesses at every stage.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/products">
                Shop Materials
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <div className="relative aspect-[4/3]">
            <Image
              src="/banner.png"
              alt="Beauty raw materials and cosmetic ingredients"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 42vw, 100vw"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/50">
        <div className="container mx-auto grid gap-4 px-4 py-8 sm:grid-cols-2 sm:px-0 lg:grid-cols-4">
          {values.map((value) => (
            <div key={value} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <BadgeCheck className="h-4 w-4" />
              </span>
              <p className="text-sm font-medium leading-6 text-foreground">
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 sm:px-0 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-5 text-xl font-semibold tracking-tight">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-10 grid gap-8 rounded-lg border border-border bg-card p-6 shadow-sm lg:grid-cols-[0.85fr_1.15fr] lg:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Our Promise
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Sourcing should feel clear, consistent, and business-ready.
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
            <p>
              We built Metro around the everyday needs of beauty businesses:
              accessible product information, practical pack options, and quick
              support for buyers who need to move from idea to production.
            </p>
            <p>
              Whether you are testing a formula, preparing a small launch, or
              restocking high-demand materials, our catalog is organized to help
              you buy with confidence.
            </p>
            <div className="flex items-center gap-3 pt-2 text-sm font-semibold text-foreground">
              <PackageCheck className="h-5 w-5 text-primary" />
              Retail and wholesale support from one trusted source.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
