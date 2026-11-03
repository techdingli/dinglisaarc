import type { Metadata } from "next";
import Link from "next/link";
import { BatteryCharging, Droplets, Gauge, Leaf, Volume2, Wrench } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";
import { productsInFamily } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "AC+ Series",
  description:
    "The AC+ all-electric, oil-free range - built for zero-emission and indoor sites with lower running costs and less maintenance.",
};

const benefits = [
  {
    icon: Leaf,
    title: "Zero emissions at the point of work",
    blurb: "Fully electric drive makes these machines suitable for indoor and enclosed sites.",
  },
  {
    icon: Droplets,
    title: "Oil-free operation",
    blurb: "No hydraulic oil in the drive system means no leaks onto finished floors.",
  },
  {
    icon: Gauge,
    title: "More work per charge",
    blurb: "Efficient AC drive motors extend duty cycles between charges.",
  },
  {
    icon: Wrench,
    title: "Less to maintain",
    blurb: "Fewer wear parts than hydraulic equivalents lowers scheduled servicing.",
  },
  {
    icon: Volume2,
    title: "Quieter on site",
    blurb: "Low noise output suits hospitals, retail and occupied buildings.",
  },
  {
    icon: BatteryCharging,
    title: "Lower cost per hour",
    blurb: "Electricity instead of diesel, with reduced consumable spend.",
  },
];

export default function AcPlusPage() {
  const range = productsInFamily("AC+ Series").slice(0, 6);

  return (
    <>
      <section className="hatch border-b border-line bg-ink py-20">
        <div className="container-x">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand">
            AC+ Series
          </p>
          <h1 className="max-w-3xl text-5xl text-white sm:text-6xl lg:text-7xl">
            Zero Compromise. <span className="text-brand">Zero Emission.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70">
            All-electric, oil-free platforms designed for indoor work, occupied
            buildings and sites where diesel isn&apos;t an option.
          </p>
          <Link
            href="/equipment?family=AC%2B%20Series"
            className="mt-8 inline-block rounded-md bg-brand px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            See the range
          </Link>
        </div>
      </section>

      <section className="py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Why AC+"
            title="Built for Sites That"
            accent="Can&apos;t Take Diesel"
          />

          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map(({ icon: Icon, title, blurb }) => (
              <StaggerItem
                key={title}
                className="rounded-xl border border-line p-7"
              >
                <div className="mb-4 grid size-11 place-items-center rounded-lg bg-brand-tint">
                  <Icon className="size-5 text-brand" />
                </div>
                <h3 className="text-xl">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{blurb}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {range.length > 0 && (
        <section className="bg-band py-20">
          <div className="container-x">
            <SectionHeading eyebrow="Models" title="In the" accent="AC+ Range" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {range.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
            <Reveal className="mt-12 text-center">
              <Link
                href="/equipment?family=AC%2B%20Series"
                className="inline-block rounded-md border border-ink px-7 py-3.5 text-sm font-semibold transition-colors hover:bg-ink hover:text-white"
              >
                View all AC+ models
              </Link>
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
