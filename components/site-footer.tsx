import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/lib/site";
import { dealerConnectUrl } from "@/lib/dealer-connect";
import { families } from "@/lib/catalog";

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "AC+ Series", href: "/ac-plus-series" },
  { label: "Industries", href: "/industries" },
  { label: "Dealers", href: "/dealers" },
  { label: "Categories", href: "/categories" },
];

const supportLinks = [
  { label: "Services", href: "/services" },
  { label: "Warranty Registration", href: "/warranty" },
  { label: "Contact", href: "/contact" },
];

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white/70">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image
            src="/logo-white.svg"
            alt={site.name}
            width={277}
            height={100}
            className="mb-5 h-9 w-auto"
          />
          <p className="max-w-xs text-sm leading-relaxed">{site.tagline}.</p>
          <div className="mt-6 space-y-3 text-sm">
            <p className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
              <span>
                {site.address.line1}, {site.address.line2}, {site.address.city}{" "}
                {site.address.pin}
              </span>
            </p>
            <p className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-brand" />
              <span>
                <a href={`tel:${site.phone.tollFree}`} className="hover:text-white">
                  {site.phone.tollFree}
                </a>{" "}
                (toll free)
                <br />
                <a href={`tel:${site.phone.sales}`} className="hover:text-white">
                  {site.phone.sales}
                </a>
              </span>
            </p>
            <p className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-brand" />
              <a href={`mailto:${site.email.sales}`} className="hover:text-white">
                {site.email.sales}
              </a>
            </p>
          </div>
        </div>

        <FooterCol title="Equipment">
          {families.map((f) => (
            <FooterLink
              key={f}
              href={`/equipment?family=${encodeURIComponent(f)}`}
              label={f}
            />
          ))}
        </FooterCol>

        <FooterCol title="Company">
          {companyLinks.map((l) => (
            <FooterLink key={l.href} {...l} />
          ))}
        </FooterCol>

        <FooterCol title="Support">
          {supportLinks.map((l) => (
            <FooterLink key={l.href} {...l} />
          ))}
          {dealerConnectUrl() && (
            <li>
              <a
                href={dealerConnectUrl()!}
                target="_blank"
                rel="noreferrer"
                className="text-sm transition-colors hover:text-brand"
              >
                Dealer Connect
              </a>
            </li>
          )}
        </FooterCol>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <p>{site.hours} &middot; 24/7 emergency hotline</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">
        {title}
      </h4>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link href={href} className="text-sm transition-colors hover:text-brand">
        {label}
      </Link>
    </li>
  );
}
