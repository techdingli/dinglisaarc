import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Building2, MapPin } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";
import { dealerConnectUrl } from "@/lib/dealer-connect";

export const metadata: Metadata = {
  title: "Dealers",
  description:
    "Find an authorised Dingli dealer across India, or apply to join the dealer network.",
};

const cities = [
  "Gurgaon", "Chandigarh", "New Delhi", "Noida", "Bhopal", "Ahmedabad",
  "Mumbai", "Pune", "Bangalore", "Cochin", "Chennai", "Coimbatore", "Hyderabad",
];

export default function DealersPage() {
  const portalUrl = dealerConnectUrl();

  return (
    <>
      <section className="border-b border-line bg-band py-14">
        <div className="container-x">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand">
            Network
          </p>
          <h1 className="text-5xl sm:text-6xl">Authorised Dealers</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Sales, parts and service delivered through a dealer network spanning{" "}
            {cities.length} cities.
          </p>
        </div>
      </section>

      {/* Dealer Connect */}
      <section className="py-16">
        <div className="container-x">
          <Reveal className="overflow-hidden rounded-2xl bg-ink">
            <div className="hatch grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand">
                  For Partners
                </p>
                <h2 className="text-4xl text-white sm:text-5xl">Dealer Connect</h2>
                <p className="mt-4 max-w-xl leading-relaxed text-white/70">
                  The partner portal for order tracking, parts requisition, service
                  tickets and claim status. Existing dealers can sign in with the
                  credentials issued by your account manager.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {portalUrl && (
                  <a
                    href={portalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
                  >
                    Open Dealer Connect <ArrowUpRight className="size-4" />
                  </a>
                )}
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-ink"
                >
                  Enquire about dealership
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Coverage */}
      <section className="pb-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Coverage"
            title="Where You&apos;ll"
            accent="Find Us"
            align="left"
          />

          <Stagger className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {cities.map((city) => (
              <StaggerItem
                key={city}
                className="flex items-center gap-3 rounded-lg border border-line px-5 py-4 transition-colors hover:border-brand/40 hover:bg-brand-tint/40"
              >
                <MapPin className="size-4 shrink-0 text-brand" />
                <span className="font-semibold">{city}</span>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mt-12 rounded-xl border border-line bg-band p-8">
            <Building2 className="mb-4 size-6 text-brand" />
            <h3 className="text-2xl">Become a dealer</h3>
            <p className="mt-2 max-w-2xl leading-relaxed text-muted">
              We&apos;re expanding coverage across India and the SAARC region. If you
              have an established equipment business and service capability, get in
              touch about territory availability.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-brand px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Talk to us <ArrowUpRight className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
