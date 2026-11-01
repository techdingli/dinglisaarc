"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, MapPin, Ticket, X } from "lucide-react";
import { dateRange, daysUntil, type Expo } from "@/lib/expo";

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
      <div className="container-x relative flex min-h-11 flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2 pr-10 sm:gap-x-4 text-center text-xs sm:text-sm">
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
        <Link
          href={expo.cta.href}
          className="inline-flex items-center gap-1 whitespace-nowrap font-semibold underline underline-offset-4 sm:no-underline sm:hover:underline"
        >
          {expo.cta.label} <ArrowRight className="hidden size-3.5 sm:block" />
        </Link>
      </div>
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

        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/0">
            <Image
              src={expo.image}
              alt={`Dingli at ${expo.name}`}
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-contain p-8"
            />
            <div className="absolute left-4 top-4 rounded-md bg-brand px-3 py-1.5 font-display text-lg leading-none">
              {expo.shortName}
            </div>
          </div>
          <div className="absolute -bottom-5 left-6 right-6 flex flex-wrap justify-center gap-2">
            {expo.highlights.map((h) => (
              <span
                key={h}
                className="rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-ink shadow-lg"
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- C: ticket */

/** Floating "ticket" card in the bottom-left corner of every page. */
export function ExpoTicket({ expo }: { expo: Expo }) {
  const days = useCountdown(expo);
  const [dismissed, dismiss] = useDismissed(`expo-ticket:${expo.name}`);
  const [collapsed, setCollapsed] = useState(false);
  // On a phone the full card covers too much of the page, so start minimised.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- viewport is only known in the browser
    setCollapsed(!window.matchMedia("(min-width: 640px)").matches);
  }, []);
  if (dismissed || days === null) return null;

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        className="fixed bottom-5 left-5 z-[55] inline-flex items-center gap-2 rounded-full bg-ink px-4 py-3 text-sm font-semibold text-white shadow-lg sm:bottom-6 sm:left-6"
      >
        <Ticket className="size-4 text-brand" /> {expo.shortName}
        {days !== undefined && <span className="text-white/60">&middot; {countdownLabel(days)}</span>}
      </button>
    );
  }

  return (
    <aside
      aria-label={`Dingli at ${expo.name}`}
      className="fixed bottom-24 left-4 right-4 z-[55] flex overflow-hidden rounded-2xl bg-ink text-white shadow-2xl sm:bottom-6 sm:left-6 sm:right-auto sm:w-[380px]"
    >
      <div className="relative flex w-24 shrink-0 flex-col items-center justify-center bg-brand px-2 py-4 text-center">
        <p className="font-display text-4xl leading-none">
          {new Date(`${expo.start}T00:00:00`).getDate()}
        </p>
        <p className="text-[11px] font-bold uppercase tracking-widest text-white/80">
          {new Date(`${expo.start}T00:00:00`).toLocaleString("en-GB", { month: "short" })}
        </p>
        <div className="my-2 h-px w-8 bg-white/40" />
        <p className="font-display text-2xl leading-none">
          {days === undefined ? "-" : days === 0 ? "Now" : days}
        </p>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/80">
          {days === 0 ? "On" : "Days"}
        </p>
        {/* ticket notches */}
        <span className="absolute -right-2 top-3 size-4 rounded-full bg-ink" aria-hidden />
        <span className="absolute -right-2 bottom-3 size-4 rounded-full bg-ink" aria-hidden />
      </div>
      <div className="min-w-0 flex-1 border-l-2 border-dashed border-white/20 p-4 pr-9">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-light">
          Meet us at
        </p>
        <p className="font-display text-2xl leading-tight">{expo.name}</p>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-white/60">
          <CalendarDays className="size-3.5 shrink-0" /> {dateRange(expo)}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-white/60">
          <MapPin className="size-3.5 shrink-0" /> {expo.city} &middot; Booth {expo.booth}
        </p>
        <Link
          href={expo.cta.href}
          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-light hover:text-white"
        >
          {expo.cta.label} <ArrowRight className="size-3.5" />
        </Link>
      </div>
      <div className="absolute right-1.5 top-1.5 flex flex-col">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss expo card"
          className="grid size-7 place-items-center rounded-md text-white/50 hover:bg-white/10 hover:text-white"
        >
          <X className="size-4" />
        </button>
      </div>
      <button
        type="button"
        onClick={() => setCollapsed(true)}
        className="absolute bottom-2 right-3 text-[11px] text-white/40 hover:text-white"
      >
        Minimise
      </button>
    </aside>
  );
}
