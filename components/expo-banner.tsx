"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, MapPin, X } from "lucide-react";
import { dateRange, daysUntil, expoLink, type Expo } from "@/lib/expo";

/** Days to go, computed in the browser so statically built pages stay current. */
function useCountdown(expo: Expo) {
  const [days, setDays] = useState<number | null | undefined>(undefined);
  useEffect(() => {
    const tick = () => setDays(daysUntil(expo));
    tick();
    const id = setInterval(tick, 60 * 60_000);
    return () => clearInterval(id);
  }, [expo]);
  return days;
}

function useDismissed(key: string) {
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-off read of a stored preference
      setDismissed(sessionStorage.getItem(key) === "1");
    } catch {}
  }, [key]);
  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(key, "1");
    } catch {}
  };
  return [dismissed, dismiss] as const;
}

function countdownLabel(days: number | null | undefined) {
  if (days === undefined || days === null) return null;
  if (days === 0) return "On now";
  return `${days} day${days === 1 ? "" : "s"} to go`;
}

/* ------------------------------------------------------------------ A: strip */

/** Slim announcement bar above the header on every page. */
export function ExpoStrip({ expo }: { expo: Expo }) {
  const days = useCountdown(expo);
  const [dismissed, dismiss] = useDismissed(`expo-strip:${expo.name}`);
  if (dismissed || days === null) return null;

  return (
    <div className="relative overflow-hidden bg-brand text-white">
      <div className="hatch pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <Link
        href={expoLink(expo)}
        className="group container-x relative flex min-h-11 flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2 pr-10 text-center text-xs sm:gap-x-4 sm:text-sm"
      >
        <span className="hidden items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.14em] sm:inline-flex">
          <span className="size-1.5 animate-pulse rounded-full bg-white" />
          {countdownLabel(days) ?? "Upcoming"}
        </span>
        <p>
          <span className="whitespace-nowrap font-semibold">
            <span className="hidden sm:inline">Dingli at </span>
            {expo.name}
          </span>
          <span className="mx-2 text-white/50">&middot;</span>
          <span className="whitespace-nowrap">{dateRange(expo)}</span>
          <span className="hidden sm:inline">
            , {expo.city.split(",")[0]}
            <span className="mx-2 text-white/50">&middot;</span>Booth {expo.booth}
          </span>
        </p>
        <span className="inline-flex items-center gap-1 whitespace-nowrap font-semibold underline underline-offset-4 sm:no-underline sm:group-hover:underline">
          Find out more <ArrowRight className="hidden size-3.5 sm:block" />
        </span>
      </Link>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss expo announcement"
        className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-white/70 hover:bg-white/10 hover:text-white"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------- B: feature */

/** Full-width feature section for the home page. */
export function ExpoFeature({ expo }: { expo: Expo }) {
  const days = useCountdown(expo);
  if (days === null) return null;
  const start = new Date(`${expo.start}T00:00:00`);
  const end = new Date(`${expo.end}T00:00:00`);

  return (
    <section className="relative overflow-hidden bg-ink py-16 text-white sm:py-20">
      <div className="hatch pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute -left-32 top-1/2 size-[520px] -translate-y-1/2 rounded-full bg-brand/25 blur-3xl"
        aria-hidden
      />
      <div className="container-x relative grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/50 bg-brand/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-light">
            <span className="size-1.5 animate-pulse rounded-full bg-brand" />
            {countdownLabel(days) ?? "Upcoming expo"}
          </p>

          <h2 className="text-5xl leading-[0.95] sm:text-6xl">
            Meet Dingli at <span className="text-brand">{expo.name}</span>
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">{expo.blurb}</p>

          <div className="mt-8 grid max-w-xl grid-cols-3 divide-x divide-white/15 rounded-xl border border-white/15 bg-white/5">
            <div className="p-4">
              <p className="font-display text-4xl leading-none text-white">
                {start.getDate()}-{end.getDate()}
              </p>
              <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-white/50">
                {end.toLocaleString("en-GB", { month: "short" })} {end.getFullYear()}
              </p>
            </div>
            <div className="p-4">
              <p className="font-display text-4xl leading-none text-white">{expo.booth}</p>
              <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-white/50">
                Booth
              </p>
            </div>
            <div className="p-4">
              <p className="font-display text-4xl leading-none text-brand">
                {days === undefined ? "-" : days}
              </p>
              <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-white/50">
                {days === 0 ? "On now" : "Days to go"}
              </p>
            </div>
          </div>

          <p className="mt-5 flex items-center gap-2 text-sm text-white/60">
            <MapPin className="size-4 shrink-0 text-brand" />
            {expo.venue}, {expo.city}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={expo.cta.href}
              className="inline-flex items-center gap-2 rounded-md bg-brand px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              {expo.cta.label} <ArrowRight className="size-4" />
            </Link>
            {expo.url && (
              <a
                href={expo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-ink"
              >
                Event website
              </a>
            )}
          </div>
        </div>

        <Link
          href={expoLink(expo)}
          aria-label={`Read about Dingli at ${expo.name}`}
          className="group relative block aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl shadow-black/50 ring-1 ring-white/10"
        >
          <Image
            src={expo.image}
            alt={expo.imageAlt}
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </Link>
      </div>
    </section>
  );
}
