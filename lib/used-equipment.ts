import raw from "@/data/used-equipment.json";
import { getProduct, type Product } from "@/lib/catalog";

/**
 * Pre-owned stock shown on /used-equipment. Add one object per machine to
 * data/used-equipment.json; drop photos in /public/used/.
 *
 * {
 *   "id": "U-1042",                 // your stock number, unique
 *   "model": "BT44RT",              // matched to the catalogue for specs and image
 *   "brand": "Dingli",              // optional; shown when it isn't Dingli
 *   "category": "Telescopic Boom",  // optional; else the catalogue category
 *   "workingHeight": "44.44 m",     // optional; overrides the catalogue spec
 *   "capacity": "300 kg",           // optional; overrides the catalogue spec
 *   "year": 2021,
 *   "hours": 1850,                  // hour meter reading
 *   "location": "Chennai",
 *   "price": "Rs 48,00,000",        // optional; omitted shows "Price on request"
 *   "condition": "Refurbished",     // free text, e.g. "Good", "Refurbished"
 *   "status": "available",          // "available" | "reserved" | "sold"
 *   "images": ["/used/u-1042-1.jpg"], // optional; falls back to the catalogue image
 *   "notes": "New tyres, fresh LOLER"  // optional
 * }
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

export const usedMachines: UsedMachine[] = (raw as UsedListing[])
  .filter((l) => l.status !== "sold")
  .map((l) => {
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
  });
