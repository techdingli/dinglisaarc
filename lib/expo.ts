/**
 * The expo currently promoted across the site. Dingli exhibits every couple
 * of months - update this object (and drop the new artwork in /public/expo)
 * for each show. Banners hide themselves automatically after `end`.
 */
export type Expo = {
  name: string;
  /** Short label for tight spaces, e.g. the announcement strip. */
  shortName: string;
  start: string; // ISO date, local to the venue
  end: string;
  city: string;
  venue: string;
  booth: string;
  blurb: string;
  /** 4:3 banner artwork for the home page showcase, under /public/expo. */
  image: string;
  cta: { label: string; href: string };
  /** Official event site. */
  url?: string;
};

export const expo: Expo | null = {
  name: "bauma CHINA 2026",
  shortName: "bauma CHINA",
  start: "2026-11-24",
  end: "2026-11-27",
  city: "Shanghai, China",
  venue: "Shanghai New International Expo Centre",
  booth: "TBA",
  blurb:
    "Asia's largest construction machinery show. See Dingli's boom lifts, scissor lifts and the AC+ all-electric range up close, and meet the team.",
  image: "/expo/bauma-china-2026.webp",
  cta: { label: "Book a meeting", href: "/contact" },
  url: "https://www.bauma-china.com/",
};

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
