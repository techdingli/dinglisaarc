import type { Metadata } from "next";
import { EquipmentBrowser } from "@/components/equipment-browser";
import { families, products } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Equipment Catalogue",
  description:
    "Browse the full Dingli aerial work platform range - boom lifts, scissor lifts, vertical masts and spider lifts, filterable by type, power source and working height.",
};

export default async function EquipmentPage({
  searchParams,
}: {
  searchParams: Promise<{ family?: string }>;
}) {
  const { family } = await searchParams;

  // Trim the payload sent to the client - gallery images aren't used in cards.
  const list = products.map(({ gallery, categories, ...rest }) => ({
    ...rest,
    gallery: [],
    categories: [],
  }));

  const available: string[] = families.filter((f) =>
    products.some((p) => p.family === f),
  );

  return (
    <>
      <section className="border-b border-line bg-band py-14">
        <div className="container-x">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand">
            Equipment
          </p>
          <h1 className="text-5xl sm:text-6xl">The Full Range</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            {products.length} models across boom lifts, scissor lifts, vertical masts
            and spider lifts - from compact indoor units to a 44 m telescopic boom.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container-x">
          <EquipmentBrowser
            products={list}
            families={available}
            initialFamily={family && available.includes(family) ? family : ""}
          />
        </div>
      </section>
    </>
  );
}
