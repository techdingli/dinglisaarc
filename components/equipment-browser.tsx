"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/catalog";

const POWER = ["Electric", "Hybrid", "Diesel"] as const;

export function EquipmentBrowser({
  products,
  families,
  initialFamily = "",
}: {
  products: Product[];
  families: string[];
  initialFamily?: string;
}) {
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState(initialFamily);
  const [power, setPower] = useState("");
  const [minHeight, setMinHeight] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const maxHeight = useMemo(
    () =>
      Math.ceil(
        products.reduce((m, p) => Math.max(m, p.workingHeightM ?? 0), 0) || 45,
      ),
    [products],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (family && p.family !== family) return false;
      if (power && p.power !== power) return false;
      if (minHeight > 0 && (p.workingHeightM ?? 0) < minHeight) return false;
      if (q && !`${p.name} ${p.category}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [products, query, family, power, minHeight]);

  const active = Boolean(query || family || power || minHeight > 0);

  const clear = () => {
    setQuery("");
    setFamily("");
    setPower("");
    setMinHeight(0);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
      {/* Filters */}
      <aside className="lg:sticky lg:top-32 lg:self-start">
        <div className="flex items-center justify-between lg:hidden">
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className="inline-flex items-center gap-2 rounded-md border border-line px-4 py-2.5 text-sm font-semibold"
          >
            <SlidersHorizontal className="size-4" />
            Filters
            {active && <span className="size-1.5 rounded-full bg-brand" />}
          </button>
          <p className="text-sm text-muted">{results.length} models</p>
        </div>

        <div
          className={`${showFilters ? "block" : "hidden"} mt-4 space-y-7 lg:mt-0 lg:block`}
        >
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Model or category"
                className="w-full rounded-md border border-line py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
          </div>

          <FilterGroup
            label="Equipment type"
            options={families}
            value={family}
            onChange={setFamily}
          />

          <FilterGroup
            label="Power source"
            options={[...POWER]}
            value={power}
            onChange={setPower}
          />

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink">
              Min working height
            </label>
            <input
              type="range"
              min={0}
              max={maxHeight}
              step={1}
              value={minHeight}
              onChange={(e) => setMinHeight(Number(e.target.value))}
              className="w-full accent-[var(--color-brand)]"
            />
            <p className="mt-1 text-sm text-muted">
              {minHeight > 0 ? `${minHeight} m and above` : "Any height"}
            </p>
          </div>

          {active && (
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
            >
              <X className="size-3.5" /> Clear all filters
            </button>
          )}
        </div>
      </aside>

      {/* Results */}
      <div>
        <p className="mb-6 hidden text-sm text-muted lg:block">
          Showing <strong className="text-ink">{results.length}</strong> of{" "}
          {products.length} models
        </p>

        {results.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line p-16 text-center">
            <p className="text-lg font-semibold">No machines match those filters.</p>
            <button
              type="button"
              onClick={clear}
              className="mt-3 text-sm font-semibold text-brand hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((p, i) => (
              <ProductCard key={p.slug} product={p} priority={i < 3} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-ink">{label}</p>
      <div className="flex flex-wrap gap-2">
        <Chip active={value === ""} onClick={() => onChange("")}>
          All
        </Chip>
        {options.map((o) => (
          <Chip key={o} active={value === o} onClick={() => onChange(o)}>
            {o}
          </Chip>
        ))}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "border-brand bg-brand text-white"
          : "border-line text-ink-soft hover:border-brand/50 hover:text-brand"
      }`}
    >
      {children}
    </button>
  );
}
