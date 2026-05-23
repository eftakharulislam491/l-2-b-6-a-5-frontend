import Link from "next/link";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Package,
  Phone,
  Youtube,
} from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "All Products", href: "/products" },
  { label: "Cart", href: "/cart" },
  { label: "Login", href: "/login" },
];

const rawMaterials = [
  "Mica pigments",
  "Essential oils",
  "Cosmetic waxes",
  "Active ingredients",
  "Cosmetic bases",
  "Botanical extracts",
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="container mx-auto px-4 py-10 sm:px-0 sm:py-12">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[1.25fr_0.8fr_0.9fr_1.05fr]">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Premium Beauty Raw Materials
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">
              We supply makeup and skincare raw materials for beauty brands,
              resellers, and wholesale buyers looking for dependable quality,
              clean presentation, and flexible order quantities.
            </p>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                  <Package className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Retail and wholesale support
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Order for testing, small-batch launches, or bulk restocking
                    from one trusted source.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white transition hover:bg-slate-700"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" fill="currentColor" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white transition hover:bg-slate-700"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white transition hover:bg-slate-700"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" fill="currentColor" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-900">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 transition hover:text-slate-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-900">
              Popular Raw Materials
            </h3>
            <ul className="mt-4 space-y-3">
              {rawMaterials.map((item) => (
                <li key={item} className="text-sm text-slate-600">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-900">
              Contact & Support
            </h3>

            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm">
                  <Phone className="h-4 w-4" />
                </span>
                <div className="text-sm text-slate-600">
                  <p className="font-medium text-slate-900">Customer Care</p>
                  <a href="tel:01898760021" className="block hover:text-slate-900">
                    01898-760021
                  </a>
                  <a href="tel:01840088998" className="block hover:text-slate-900">
                    01840-088998
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm">
                  <Mail className="h-4 w-4" />
                </span>
                <div className="text-sm text-slate-600">
                  <p className="font-medium text-slate-900">Email</p>
                  <a
                    href="mailto:contact@labyshop.com"
                    className="block hover:text-slate-900"
                  >
                    contact@labyshop.com
                  </a>
                  <a
                    href="mailto:labyshop.com@gmail.com"
                    className="block hover:text-slate-900"
                  >
                    labyshop.com@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm">
                  <MapPin className="h-4 w-4" />
                </span>
                <div className="text-sm leading-6 text-slate-600">
                  <p className="font-medium text-slate-900">Store Locations</p>
                  <p>AP Market 8/1 1, Armanian Street, Armanitola, Dhaka-1100</p>
                  <p className="mt-2">
                    Shop: #3, 3rd Floor, Kader Shopping Mall, Hatkhola Road,
                    Tikatuli, Dhaka-1203
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white">
        <div className="container mx-auto flex flex-col gap-2 px-4 py-4 text-sm text-slate-600 sm:px-0 md:flex-row md:items-center md:justify-between">
          <p>&copy; {year} LabyShop. All rights reserved.</p>
          <p>Wholesale and retail beauty ingredients for modern beauty businesses.</p>
        </div>
      </div>
    </footer>
  );
}
