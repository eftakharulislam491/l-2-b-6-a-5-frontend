import Link from "next/link";
import {
  BadgeCheck,
  ClipboardCheck,
  FileText,
  PackageCheck,
  RotateCcw,
  Truck,
} from "lucide-react";

const termsSections = [
  {
    title: "Use of Our Website",
    description:
      "You agree to use this website for lawful shopping, account, and inquiry purposes. Do not misuse the site, interfere with service operation, or submit false information.",
  },
  {
    title: "Product Information",
    description:
      "We aim to present product names, prices, images, descriptions, stock status, and raw material details accurately. Minor differences may occur because of packaging, batches, or display settings.",
  },
  {
    title: "Orders and Availability",
    description:
      "Orders depend on product availability, correct pricing, payment confirmation, and delivery coverage. We may contact you to confirm details before processing an order.",
  },
  {
    title: "Payments",
    description:
      "Payment must be completed through the available checkout methods. If a payment fails, is reversed, or cannot be verified, the order may be delayed or cancelled.",
  },
  {
    title: "Delivery",
    description:
      "Delivery times can vary based on address, courier service, product availability, holidays, and operational conditions. Please provide accurate contact and delivery details.",
  },
  {
    title: "Returns and Support",
    description:
      "If you receive the wrong item, damaged packaging, or have an order concern, contact us quickly with your order details so our team can review and support you.",
  },
];

const summaryItems = [
  {
    title: "Order confirmation",
    icon: ClipboardCheck,
  },
  {
    title: "Secure payment",
    icon: BadgeCheck,
  },
  {
    title: "Delivery support",
    icon: Truck,
  },
  {
    title: "Issue review",
    icon: RotateCcw,
  },
];

export default function TermsPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="container mx-auto px-4 py-12 sm:px-0 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.55fr)] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Terms and Conditions
            </p>
            <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
              Clear terms for shopping with Metro.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
              These terms describe how orders, payments, delivery, product
              information, and customer support work when you use our website.
            </p>
            <p className="mt-4 text-sm font-medium text-muted-foreground">
              Last updated: June 16, 2026
            </p>
          </div>

          <aside className="rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </span>
              <h2 className="text-xl font-semibold">At a Glance</h2>
            </div>
            <div className="mt-6 grid gap-4">
              {summaryItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                      <Icon className="h-4 w-4" />
                    </span>
                    <p className="text-sm font-medium text-foreground">
                      {item.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-12 sm:px-0 lg:pb-16">
        <div className="grid gap-5 md:grid-cols-2">
          {termsSections.map((section) => (
            <article
              key={section.title}
              className="rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm"
            >
              <h2 className="text-xl font-semibold tracking-tight">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {section.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-border bg-primary p-6 text-primary-foreground shadow-sm lg:p-8">
          <div className="grid gap-5 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
              <PackageCheck className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Need help with an order?
              </h2>
              <p className="mt-2 text-sm leading-6 opacity-90">
                Our support team can help with order details, delivery questions,
                and wholesale purchase guidance.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center justify-center rounded-full bg-secondary px-5 text-sm font-semibold text-secondary-foreground transition hover:bg-secondary/90"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
