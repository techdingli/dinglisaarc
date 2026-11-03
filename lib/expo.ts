/**
 * Shape of the expo promoted in the top bar and the home page showcase. The
 * content is edited in the CMS (/admin, "Expo banner") and read by getExpo()
 * in lib/cms.ts; this file only holds the type and display helpers, so the
 * client-side banner can import it.
 */
export type Expo = {
  name: string;
  /** Short label for tight spaces, e.g. the announcement strip. */
  shortName: string;
  start: string; // YYYY-MM-DD, local to the venue
  end: string;
  city: string;
  venue: string;
  booth: string;
  blurb: string;
  /** 4:3 banner artwork for the home page showcase. */
  image: string;
  imageAlt: string;
  cta: { label: string; href: string };
  /** Blog post about the show; the bar and the showcase image link to it. */
  post?: string;
  /** Official event site. */
  url?: string;
};

/** Where the bar and the showcase image go: the article, else the button link. */
export const expoLink = (e: Expo) => e.post ?? e.cta.href;

const DAY = 86_400_000;

/** Whole days until the show opens (0 while it's on), or null once it's over. */
export function daysUntil(e: Expo, now = new Date()) {
  const start = new Date(`${e.start}T00:00:00+08:00`).getTime();
  const end = new Date(`${e.end}T23:59:59+08:00`).getTime();
  const t = now.getTime();
  if (t > end) return null;
  return Math.max(0, Math.ceil((start - t) / DAY));
}

/** "24-27 Nov 2026" */
export function dateRange(e: Expo) {
  const s = new Date(`${e.start}T00:00:00`);
  const f = new Date(`${e.end}T00:00:00`);
  const month = (d: Date) => d.toLocaleString("en-GB", { month: "short" });
  return s.getMonth() === f.getMonth()
    ? `${s.getDate()}-${f.getDate()} ${month(f)} ${f.getFullYear()}`
    : `${s.getDate()} ${month(s)} - ${f.getDate()} ${month(f)} ${f.getFullYear()}`;
}
