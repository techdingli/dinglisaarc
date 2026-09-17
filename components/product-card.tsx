import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/catalog";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const height = product.specs["Working Height"];
  const capacity = product.specs["Capacity"];

  return (
    <Link
      href={`/equipment/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.25)]"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-band">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
            className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-muted">No image</div>
        )}
        <span className="absolute left-3 top-3 rounded bg-white/90 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink-soft backdrop-blur">
          {product.power}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">
          {product.category}
        </p>
        <h3 className="mt-1 text-2xl text-ink">{product.name}</h3>

        <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4 text-sm">
          <div>
            <dt className="text-xs text-muted">Working height</dt>
            <dd className="font-semibold text-ink">{height ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Capacity</dt>
            <dd className="font-semibold text-ink">{capacity ?? "-"}</dd>
          </div>
        </dl>

        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors group-hover:text-brand">
          View specifications
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
