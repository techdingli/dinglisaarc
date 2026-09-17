import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion";
import { categories, familyBlurb, familySummary } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Equipment Categories",
  description:
    "Every Dingli aerial work platform category - telescopic and articulated booms, slab and rough terrain scissors, vertical masts, stock pickers and spider lifts.",
};

export default function CategoriesPage() {
  const families = familySummary();

  return (
    <>
      <section className="border-b border-line bg-band py-14">
        <div className="container-x">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand">
            Categories
          </p>
          <h1 className="text-5xl sm:text-6xl">Browse by Category</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Start with the machine family, then narrow by power source and working
            height.
          </p>
        </div>
      </section>

      {/* Families */}
      <section className="py-16">
        <div className="container-x">
          <h2 className="mb-10 text-3xl">Machine families</h2>
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {families.map((f) => (
              <StaggerItem key={f.family}>
                <Link
                  href={`/equipment?family=${encodeURIComponent(f.family)}`}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.22)]"
                >
                  <div className="relative aspect-video bg-band">
                    {f.image && (
                      <Image
                        src={f.image}
                        alt={f.family}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col border-t border-line p-6">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-2xl">{f.family}</h3>
                      <span className="text-xs font-semibold uppercase text-brand">
                        {f.count}
                      </span>
                    </div>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                      {f.blurb}
                    </p>
                    {f.range && (
                      <p className="mt-4 border-t border-line pt-4 text-sm font-semibold">
                        Working height {f.range}
                      </p>
                    )}
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Sub-categories */}
      <section className="bg-band py-16">
        <div className="container-x">
          <h2 className="mb-10 text-3xl">All categories</h2>
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <StaggerItem key={c.slug}>
                <Link
                  href={`/equipment?family=${encodeURIComponent(c.family)}`}
                  className="group flex items-center justify-between gap-4 rounded-xl border border-line bg-white p-5 transition-colors hover:border-brand/40"
                >
                  <div>
                    <h3 className="text-xl">{c.name}</h3>
                    <p className="mt-0.5 text-sm text-muted">
                      {c.count} models &middot; {c.family}
                    </p>
                  </div>
                  <ArrowUpRight className="size-5 shrink-0 text-muted transition-colors group-hover:text-brand" />
                </Link>
              </StaggerItem>
            ))}
          </Stagger>

          <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted">
            {familyBlurb["AC+ Series"]} Looking for something specific? Use the{" "}
            <Link href="/equipment" className="font-semibold text-brand hover:underline">
              full catalogue
            </Link>{" "}
            to filter by height and power source.
          </p>
        </div>
      </section>
    </>
  );
}
