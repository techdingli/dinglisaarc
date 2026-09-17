import type { Metadata } from "next";
import Link from "next/link";
import { Wrench } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { services, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Installation, operator training, inspection, genuine parts, AMC packages, refurbishment and 24/7 support for Dingli aerial work platforms.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="border-b border-line bg-band py-14">
        <div className="container-x">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand">
            Services
          </p>
          <h1 className="text-5xl sm:text-6xl">Support That Keeps Machines Working</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            From commissioning to end-of-life refurbishment, delivered by
            factory-trained engineers across India and SAARC.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-x">
          <Stagger className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <StaggerItem key={s.name} className="bg-white p-7">
                <Wrench className="mb-4 size-6 text-brand" />
                <h2 className="text-xl">{s.name}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.blurb}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-x">
          <Reveal className="grid gap-8 rounded-2xl border border-line bg-band p-8 sm:p-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <h2 className="text-4xl">Need a machine looked at?</h2>
              <p className="mt-3 max-w-xl leading-relaxed text-muted">
                Our emergency hotline runs around the clock. For planned work, raise a
                service request and we&apos;ll schedule the nearest engineer.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <a
                href={`tel:${site.phone.tollFree}`}
                className="rounded-md bg-brand px-7 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                Call {site.phone.tollFree}
              </a>
              <Link
                href="/contact"
                className="rounded-md border border-ink px-7 py-3.5 text-center text-sm font-semibold transition-colors hover:bg-ink hover:text-white"
              >
                Raise a service request
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
