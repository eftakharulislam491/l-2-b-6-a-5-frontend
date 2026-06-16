import Link from "next/link";
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import ContactForm from "@/components/modules/contact/ContactForm";

const contactMethods = [
  {
    title: "Customer Care",
    description: "Call for product, order, and wholesale support.",
    value: "01898-760021",
    href: "tel:01898760021",
    icon: Phone,
  },
  {
    title: "Email Support",
    description: "Send product questions or business inquiries.",
    value: "contact@labyshop.com",
    href: "mailto:contact@labyshop.com",
    icon: Mail,
  },
  {
    title: "Business Hours",
    description: "Support is available through regular shop hours.",
    value: "Sat - Thu, 10:00 AM - 8:00 PM",
    href: null,
    icon: Clock,
  },
];

const locations = [
  "AP Market 8/1 1, Armanian Street, Armanitola, Dhaka-1100",
  "Shop: #3, 3rd Floor, Kader Shopping Mall, Hatkhola Road, Tikatuli, Dhaka-1203",
];

export default function ContactPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="container mx-auto px-4 py-12 sm:px-0 lg:py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Contact Us
          </p>
          <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
            Need help choosing raw materials or placing an order?
          </h1>
          <p className="mt-5 text-base leading-8 text-muted-foreground">
            Reach out for retail orders, wholesale inquiries, ingredient
            guidance, delivery questions, or support with an existing purchase.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {contactMethods.map((method) => {
            const Icon = method.icon;
            const content = (
              <div className="rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-5 text-lg font-semibold">{method.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {method.description}
                </p>
                <p className="mt-4 text-sm font-semibold text-foreground">
                  {method.value}
                </p>
              </div>
            );

            return method.href ? (
              <Link key={method.title} href={method.href}>
                {content}
              </Link>
            ) : (
              <div key={method.title}>{content}</div>
            );
          })}
        </div>
      </section>

      <section className="container mx-auto grid gap-8 px-4 pb-12 sm:px-0 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.75fr)] lg:pb-16">
        <div className="rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm lg:p-8">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MessageCircle className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Send a Message
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Share what you need and our team will help you with the next
                best step.
              </p>
            </div>
          </div>

          <ContactForm />
        </div>

        <aside className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <MapPin className="h-5 w-5" />
              </span>
              <h2 className="text-xl font-semibold">Store Locations</h2>
            </div>
            <div className="mt-5 space-y-4">
              {locations.map((location) => (
                <p
                  key={location}
                  className="rounded-lg border border-border bg-background p-4 text-sm leading-7 text-muted-foreground"
                >
                  {location}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-primary p-6 text-primary-foreground shadow-sm">
            <h2 className="text-xl font-semibold">Wholesale Inquiry</h2>
            <p className="mt-3 text-sm leading-7 opacity-90">
              For bulk orders, reseller pricing, or recurring supply support,
              contact our team directly with the product list and expected
              quantity.
            </p>
            <Button asChild variant="secondary" className="mt-5 rounded-full">
              <Link href="tel:01840088998">Call 01840-088998</Link>
            </Button>
          </div>
        </aside>
      </section>
    </main>
  );
}
