import { getProduct, type Product } from "@/lib/catalog";

/**
 * Pre-owned stock shown on /used-equipment. Listings are edited in the CMS
 * (/admin, "Used machines") and read by getUsedMachines() in lib/cms.ts.
 * Each listing is matched to the catalogue by model, which fills in specs
 * and an image the listing doesn't have.
 */
export type UsedListing = {
  id: string;
  model: string;
  brand?: string;
  category?: string;
  workingHeight?: string;
  capacity?: string;
  year?: number;
  hours?: number;
  location?: string;
  price?: string;
  condition?: string;
  status?: "available" | "reserved" | "sold";
  images?: string[];
  notes?: string;
};

export type UsedMachine = UsedListing & {
  product?: Product;
  image?: string;
  /** Listing values first, then the catalogue's. */
  spec: { category?: string; workingHeight?: string; capacity?: string };
};

const slugify = (model: string) =>
  model.toLowerCase().replace(/\./g, "-").replace(/[^a-z0-9-]+/g, "");

export function toUsedMachine(l: UsedListing): UsedMachine {
  const product = getProduct(slugify(l.model));
  return {
    ...l,
    product,
    image: l.images?.[0] ?? product?.image,
    spec: {
      category: l.category ?? product?.category,
      workingHeight: l.workingHeight ?? product?.specs["Working Height"],
      capacity: l.capacity ?? product?.specs["Capacity"],
    },
  };
}
