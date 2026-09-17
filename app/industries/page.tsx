import type { Metadata } from "next";
import Link from "next/link";
import { Stagger, StaggerItem, Reveal } from "@/components/motion";
import { industries } from "@/lib/site";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Aerial work platforms for construction, maintenance, warehousing, aviation, railways, facility management, logistics and events.",
};

export default function IndustriesPage() {
  return (
    <>
      <section className="border-b border-line bg-band py-14">
        <div className="container-x">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand">
            Industries
          </p>
          <h1 className="text-5xl sm:text-6xl">Working at Height, Everywhere</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            The right platform depends on the floor, the reach and what&apos;s overhead.
            Here&apos;s where our machines earn their keep.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-x">
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((i) => (
              <StaggerItem
                key={i.name}
                className="flex h-full flex-col rounded-xl border border-line p-7 transition-colors hover:border-brand/40 hover:bg-brand-tint/30"
              >
                <h2 className="text-2xl">{i.name}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {i.blurb}
                </p>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mt-14 rounded-2xl border border-line bg-band p-8 text-center sm:p-12">
            <h2 className="text-3xl">Not sure which machine suits your site?</h2>
            <p className="mx-auto mt-3 max-w-xl leading-relaxed text-muted">
              Send us the working height, floor conditions and access restrictions.
              We&apos;ll shortlist the models that fit.
            </p>
            <Link
              href="/contact"
              className="mt-7 inline-block rounded-md bg-brand px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Get a recommendation
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
