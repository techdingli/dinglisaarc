/**
 * The site's content as it was before the CMS, imported once by the
 * seed_content migration. After that, edits happen in /admin.
 * Image paths are relative to /public.
 */

export const seedTeam = [
  {
    name: "Sagar Sawlani",
    role: "CEO - SAARC",
    focus: "Leads Dingli AWP India across India and the SAARC region.",
  },
  {
    name: "Ranjit",
    role: "Dealer Management",
    focus: "Builds and supports the authorised dealer network across India.",
  },
  {
    name: "Mutul",
    role: "Rental Sales",
    focus: "Works with rental companies on fleet supply and expansion.",
  },
];

export const seedPost = {
  slug: "bauma-china-2026",
  title: "Meet Dingli at bauma CHINA 2026 in Shanghai",
  excerpt:
    "Dingli is exhibiting at bauma CHINA 2026, 24-27 November at the Shanghai New International Expo Centre. Here's what you need to know to plan a visit.",
  tag: "Events" as const,
  publishedAt: "2026-11-02T12:00:00.000Z",
  bodyMarkdownFile: "bauma-china-2026.md",
  cover: {
    file: "expo/bauma-china-2026.webp",
    alt: "Dingli at bauma CHINA 2026, 24-27 November 2026, Shanghai New International Expo Centre",
  },
};

export const seedExpo = {
  enabled: true,
  name: "bauma CHINA 2026",
  shortName: "bauma CHINA",
  start: "2026-11-24T12:00:00.000Z",
  end: "2026-11-27T12:00:00.000Z",
  booth: "TBA",
  venue: "Shanghai New International Expo Centre",
  city: "Shanghai, China",
  blurb:
    "Asia's largest construction machinery show. See Dingli's boom lifts, scissor lifts and the AC+ all-electric range up close, and meet the team.",
  ctaLabel: "Book a meeting",
  ctaHref: "/contact",
  url: "https://www.bauma-china.com/",
};
