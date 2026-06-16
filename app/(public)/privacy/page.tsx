import Link from "next/link";
import { Database, LockKeyhole, Mail, ShieldCheck, UserCheck } from "lucide-react";

const privacySections = [
  {
    title: "Information We Collect",
    description:
      "We may collect your name, phone number, email address, delivery address, account details, order history, payment status, and messages you send to our support team.",
  },
  {
    title: "How We Use Information",
    description:
      "Your information helps us process orders, arrange delivery, provide customer support, manage accounts, improve our catalog, and communicate important service updates.",
  },
  {
    title: "Payments and Security",
    description:
      "Payment details are handled through secure payment providers. We do not intentionally store full card or sensitive payment credentials on our website.",
  },
  {
    title: "Sharing Information",
    description:
      "We only share information when needed for order fulfillment, delivery, payment processing, legal compliance, fraud prevention, or trusted service operations.",
  },
  {
    title: "Cookies and Analytics",
    description:
      "We may use cookies and analytics tools to keep the site working, remember preferences, understand traffic, and improve the shopping experience.",
  },
  {
    title: "Your Choices",
    description:
      "You can contact us to update account details, ask questions about stored information, or request support with privacy-related concerns.",
  },
];

const trustItems = [
  {
    title: "Order-focused use",
    icon: Database,
  },
  {
    title: "Secure payment flow",
    icon: LockKeyhole,
  },
  {
    title: "Customer control",
    icon: UserCheck,
  },
];

export default function PrivacyPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="container mx-auto px-4 py-12 sm:px-0 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.55fr)] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Privacy Policy
            </p>
            <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
              How Metro handles customer information.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
              This policy explains what information we collect, why we use it,
              and how we protect it while supporting your beauty raw material
              purchases.
            </p>
            <p className="mt-4 text-sm font-medium text-muted-foreground">
              Last updated: June 16, 2026
            </p>
          </div>

          <aside className="rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <h2 className="text-xl font-semibold">Privacy Principles</h2>
            </div>
            <div className="mt-6 space-y-4">
              {trustItems.map((item) => {
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
          {privacySections.map((section) => (
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

        <div className="mt-8 rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm lg:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Privacy Questions
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Contact us if you need help with your account data or privacy
                request.
              </p>
            </div>
            <Link
              href="mailto:contact@labyshop.com"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              <Mail className="h-4 w-4" />
              contact@labyshop.com
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
