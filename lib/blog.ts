/**
 * Blog posts. Add a new object to `posts` (newest first is not required -
 * the list is sorted by date) and drop the cover image in /public.
 *
 * Body blocks support **bold** and [links](/path) inside any text.
 */
export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "facts"; items: { label: string; value: string }[] };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date the post was published. */
  date: string;
  /** ISO date of the last meaningful update, if any. */
  updated?: string;
  tag: string;
  cover: string;
  coverAlt: string;
  body: Block[];
};

const allPosts: Post[] = [
  {
    slug: "bauma-china-2026",
    title: "Meet Dingli at bauma CHINA 2026 in Shanghai",
    excerpt:
      "Dingli is exhibiting at bauma CHINA 2026, 24-27 November at the Shanghai New International Expo Centre. Here's what you need to know to plan a visit.",
    date: "2026-11-02",
    tag: "Events",
    cover: "/expo/bauma-china-2026.webp",
    coverAlt: "Dingli at bauma CHINA 2026, 24-27 November 2026, Shanghai New International Expo Centre",
    body: [
      {
        type: "p",
        text: "bauma CHINA, Asia's leading trade fair for construction machinery, building material machines, mining machines and construction vehicles, returns to Shanghai this November. Dingli is among the major Chinese manufacturers taking part.",
      },
      { type: "h2", text: "Key details" },
      {
        type: "facts",
        items: [
          { label: "Dates", value: "24-27 November 2026" },
          { label: "Venue", value: "Shanghai New International Expo Centre (SNIEC), Shanghai, China" },
          { label: "Dingli booth", value: "To be announced" },
          { label: "Official site", value: "[bauma-china.com](https://www.bauma-china.com/)" },
        ],
      },
      {
        type: "p",
        text: "New for 2026, the show runs across two venues. Alongside the main exhibition at SNIEC, the Shanghai World Expo Exhibition & Convention Center opens a day earlier, 23-26 November, with a focus on future technologies and industrial ecosystems, while SNIEC hosts the main machinery exhibition.",
      },
      { type: "h2", text: "What Dingli builds" },
      {
        type: "p",
        text: "Dingli is one of the world's largest manufacturers of aerial work platforms, with one of the broadest ranges in the industry:",
      },
      {
        type: "ul",
        items: [
          "**Boom lifts** - telescopic and articulated, up to the [BT44RT](/equipment/bt44rt) at 44.44 m working height",
          "**Scissor lifts** - electric slab scissors for indoor work and rough terrain models for site work",
          "**Vertical masts and stock pickers** - compact access for warehouses and facilities",
          "**[AC+ all-electric range](/ac-plus-series)** - oil-free machines for zero-emission and indoor sites",
        ],
      },
      {
        type: "p",
        text: "The machines on show at the stand will be confirmed closer to the event. We'll update this post with the booth number and highlights once they're announced.",
      },
      { type: "h2", text: "Visiting from India or the SAARC region?" },
      {
        type: "p",
        text: "If you're travelling to Shanghai for the show and would like to meet the Dingli team or see particular machines, [get in touch](/contact) and we'll help you plan your visit.",
      },
      {
        type: "p",
        text: "Can't make it to Shanghai? Our team in Chennai can take you through the same range, from specifications and site suitability to finance options and after-sales support. [Browse the full range](/equipment), [see used machines in stock](/used-equipment), or call us toll-free on **1800-572-5720**.",
      },
    ],
  },
];

export const posts: Post[] = [...allPosts].sort((a, b) => b.date.localeCompare(a.date));

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

/** "2 November 2026" */
export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
