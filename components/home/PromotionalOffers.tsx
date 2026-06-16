import React from "react";
import {
  BadgePercent,
  Truck,
  Tag,
  ArrowUpRight,
  Sofa,
  Star,
} from "lucide-react";

export default function PromotionalOffers() {
  return (
    <section className="container mx-auto bg-muted/45 py-12 text-foreground sm:py-16">
      <div className="">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* LEFT VISUAL */}
          <div className="relative">
            {/* big ring */}
            <div className="relative mx-auto aspect-square w-full max-w-[520px]">
              <div className="absolute inset-0 rounded-full bg-secondary" />
              <div className="absolute inset-[10%] rounded-full bg-card" />
              <div className="absolute inset-[18%] rounded-full border-[18px] border-muted" />

              {/* dark arc */}
              <div className="absolute -left-3 top-10 h-10 w-64 rotate-[-18deg] rounded-full bg-primary" />

              {/* chair image */}
              <img
                src="https://images.unsplash.com/photo-1549187774-b4e9b0445b41?q=80&w=900&auto=format&fit=crop"
                alt="Chair"
                className="absolute left-1/2 top-1/2 w-[58%] -translate-x-1/2 -translate-y-[45%] drop-shadow-[0_30px_45px_rgba(0,0,0,0.18)]"
              />

              {/* callout: comfortable */}
              <div className="absolute left-0 top-8 w-[210px] rounded-xl border border-border bg-card px-3 py-2 shadow-sm">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                    <Sofa className="h-4 w-4 text-secondary-foreground" />
                  </span>
                  <div className="text-[12px] leading-4 text-muted-foreground">
                    <span className="font-semibold text-card-foreground">
                      Beauty-grade quality
                    </span>{" "}
                     & more formula-ready essentials
                  </div>
                </div>
              </div>

              {/* pin line (simple) */}
              <div className="absolute left-[34%] top-[18%] h-24 w-px bg-border" />
              <div className="absolute left-[34%] top-[41%] h-2 w-2 rounded-full bg-card ring-2 ring-border" />

              {/* 30% off tag */}
              <div className="absolute right-4 top-[38%] rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
                <div className="flex items-end gap-2">
                  <div className="text-2xl font-semibold text-card-foreground">
                    30%
                  </div>
                  <div className="pb-1 text-[11px] font-semibold text-amber-600">
                    OFF
                  </div>
                </div>
              </div>

              {/* curly arrow (svg) */}
              <div className="absolute right-[18%] top-[58%] rotate-[-8deg]">
                <svg
                  width="150"
                  height="110"
                  viewBox="0 0 150 110"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M115 15
                       C140 40, 140 70, 112 80
                       C86 89, 83 63, 100 57
                       C116 52, 126 66, 115 78
                       C95 98, 50 95, 25 78"
                    stroke="#0f172a"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M30 77 L18 78 L25 89"
                    stroke="#0f172a"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* client review pill */}
              <div className="absolute bottom-3 left-6 flex items-center gap-3 rounded-full border border-border bg-card px-3 py-2 shadow-sm">
                <div className="flex -space-x-2">
                  <img
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-card"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
                    alt="client 1"
                  />
                  <img
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-card"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
                    alt="client 2"
                  />
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground ring-2 ring-card">
                    +2
                  </span>
                </div>
                <div className="leading-4">
                  <div className="text-xs font-semibold text-card-foreground">
                    Client
                  </div>
                  <div className="text-xs text-muted-foreground">Review</div>
                </div>
                <Star className="h-4 w-4 text-amber-500" />
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div>
            <h2 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl">
              Promotional Offersg
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Upgrade your beauty inventory with exclusive savings on premium makeup raw materials, cosmetic bases, essential oils, and active ingredients.
            </p>

            <div className="mt-6 space-y-4">
              <FeatureRow
                icon={<BadgePercent className="h-5 w-5" />}
                title="Beauty Launch Sale"
                text="Get up to 30% OFF selected pigments, oils, waxes, and cosmetic base essentials."
              />
              <FeatureRow
                icon={<Truck className="h-5 w-5" />}
                title="Free Shipping"
                text="Get free shipping on orders above BDT 20,000."
              />
              <FeatureRow
                icon={<Tag className="h-5 w-5" />}
                title="Save 10% Extra"
                text="Save 10% extra when you buy 10+ packs for restocking or bulk production."
              />
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <button className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90">
                Shop Now
              </button>

              <button className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-7 py-3 text-sm font-semibold text-card-foreground shadow-sm transition hover:bg-secondary">
                View Collection
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type FeatureRowProps = {
  icon: React.ReactNode;
  title: string;
  text: string;
};

function FeatureRow({ icon, title, text }: FeatureRowProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 grid h-10 w-10 place-items-center rounded-full bg-secondary text-secondary-foreground">
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <div className="mt-1 text-sm text-muted-foreground">{text}</div>
      </div>
    </div>
  );
}
