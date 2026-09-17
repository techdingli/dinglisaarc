import raw from "@/data/catalog.json";

export type Product = {
  id: string;
  name: string;
  slug: string;
  categories: string[];
  category: string;
  categorySlug: string;
  family: string;
  power: string;
  image: string;
  gallery: string[];
  specs: Record<string, string>;
  workingHeightM: number | null;
};

export type Category = {
  name: string;
  slug: string;
  family: string;
  count: number;
  image: string;
};

const data = raw as unknown as { products: Product[]; categories: Category[] };

export const products: Product[] = data.products;
export const categories: Category[] = data.categories;

export const families = [
  "Boom Lifts",
  "Scissor Lifts",
  "Vertical Lifts",
  "Spider Lifts",
  "AC+ Series",
  "Differentiated Range",
] as const;

/** Short human blurb per family, used on category cards. */
export const familyBlurb: Record<string, string> = {
  "Boom Lifts": "Telescopic and articulated reach for high-rise and long-span access.",
  "Scissor Lifts": "Stable platforms for slab and rough terrain work.",
  "Vertical Lifts": "Compact masts and stock pickers for indoor access.",
  "Spider Lifts": "Tracked Teupen Leo units for confined and delicate sites.",
  "AC+ Series": "All-electric, oil-free machines for zero-emission sites.",
  "Differentiated Range": "Specialist machines built for uncommon jobs.",
};

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function productsInCategory(slug: string): Product[] {
  return products.filter((p) => p.categorySlug === slug);
}

export function productsInFamily(family: string): Product[] {
  return products.filter((p) => p.family === family);
}

/** Highest-reach machines, for the homepage feature grid. */
export function featuredProducts(limit = 6): Product[] {
  const wanted = ["bt44rt", "ba28rt", "bt34rt", "jcpt1218rt", "ba20crt2", "s1612ac"];
  const picked = wanted
    .map((s) => products.find((p) => p.slug === s))
    .filter((p): p is Product => Boolean(p));

  if (picked.length >= limit) return picked.slice(0, limit);

  const rest = products
    .filter((p) => p.image && !picked.includes(p))
    .sort((a, b) => (b.workingHeightM ?? 0) - (a.workingHeightM ?? 0));

  return [...picked, ...rest].slice(0, limit);
}

/** Families with a representative image and model count, for the range section. */
export function familySummary() {
  return families
    .map((family) => {
      const items = productsInFamily(family);
      if (!items.length) return null;
      const heights = items
        .map((i) => i.workingHeightM)
        .filter((h): h is number => typeof h === "number" && h > 0 && h < 60);
      return {
        family,
        count: items.length,
        blurb: familyBlurb[family] ?? "",
        image: items.find((i) => i.image)?.image ?? "",
        range:
          heights.length > 1
            ? `${Math.min(...heights).toFixed(1)}-${Math.max(...heights).toFixed(1)} m`
            : heights.length === 1
              ? `${heights[0].toFixed(1)} m`
              : "",
      };
    })
    .filter((f): f is NonNullable<typeof f> => Boolean(f));
}
