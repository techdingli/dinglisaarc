import config from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";
import type { Media, Post as CmsPost } from "@/cms/payload-types";
import type { Expo } from "@/lib/expo";
import { toUsedMachine, type UsedMachine } from "@/lib/used-equipment";

/**
 * Read-side helpers for content edited in the CMS (/admin). Pages call these
 * at build time and again whenever an edit revalidates them.
 */

export const payloadClient = cache(() => getPayload({ config }));

type Size = "thumb" | "card" | "hero";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";

/**
 * URL of an uploaded image, preferring a resized copy when one exists. Files
 * served by this site itself (local storage) are made relative so next/image
 * treats them as local; Supabase Storage URLs stay absolute.
 */
export function mediaUrl(media: number | Media | null | undefined, size?: Size) {
  if (!media || typeof media === "number") return undefined;
  const url = (size && media.sizes?.[size]?.url) || media.url || undefined;
  return url && serverUrl && url.startsWith(serverUrl) ? url.slice(serverUrl.length) : url;
}

const day = (iso: string | null | undefined) => (iso ? iso.slice(0, 10) : "");

export const getExpo = cache(async (): Promise<Expo | null> => {
  const payload = await payloadClient();
  const e = await payload.findGlobal({ slug: "expo", depth: 1 });
  if (!e?.enabled || !e.name || !e.start || !e.end) return null;

  const post = e.post && typeof e.post === "object" && e.post._status === "published" ? e.post : null;

  return {
    name: e.name,
    shortName: e.shortName || e.name,
    start: day(e.start),
    end: day(e.end),
    city: e.city || "",
    venue: e.venue || "",
    booth: e.booth || "TBA",
    blurb: e.blurb || "",
    image: mediaUrl(e.image, "hero") || "",
    imageAlt: typeof e.image === "object" && e.image ? e.image.alt : e.name,
    cta: { label: e.ctaLabel || "Book a meeting", href: e.ctaHref || "/contact" },
    post: post?.slug ? `/blog/${post.slug}` : undefined,
    url: e.url || undefined,
  };
});

export const getUsedMachines = cache(async (): Promise<UsedMachine[]> => {
  const payload = await payloadClient();
  const { docs } = await payload.find({
    collection: "used-machines",
    where: { status: { not_equals: "sold" } },
    sort: "sortOrder",
    depth: 1,
    limit: 200,
  });

  return docs.map((d) =>
    toUsedMachine({
      id: String(d.id),
      model: d.model,
      brand: d.brand || undefined,
      category: d.category || undefined,
      workingHeight: d.workingHeight || undefined,
      capacity: d.capacity || undefined,
      year: d.year ?? undefined,
      hours: d.hours ?? undefined,
      location: d.location || undefined,
      price: d.price || undefined,
      condition: d.condition || undefined,
      status: d.status,
      notes: d.notes || undefined,
      images: (d.photos || []).map((m) => mediaUrl(m, "card")).filter((u): u is string => !!u),
    }),
  );
});

export type TeamMember = {
  name: string;
  role: string;
  focus: string;
  photo?: string;
  linkedin?: string;
};

export const getTeam = cache(async (): Promise<TeamMember[]> => {
  const payload = await payloadClient();
  const { docs } = await payload.find({ collection: "team", sort: "sortOrder", depth: 1, limit: 50 });
  return docs.map((t) => ({
    name: t.name,
    role: t.role,
    focus: t.focus,
    photo: mediaUrl(t.photo, "thumb"),
    linkedin: t.linkedin || undefined,
  }));
});

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  updated?: string;
  tag: string;
  cover: string;
  coverCard: string;
  coverAlt: string;
  body: CmsPost["body"];
};

const toPost = (p: CmsPost): Post => ({
  slug: p.slug || String(p.id),
  title: p.title,
  excerpt: p.excerpt,
  date: day(p.publishedAt),
  updated: p.updatedNote ? day(p.updatedNote) : undefined,
  tag: p.tag,
  cover: mediaUrl(p.cover, "hero") || "",
  coverCard: mediaUrl(p.cover, "card") || "",
  coverAlt: typeof p.cover === "object" && p.cover ? p.cover.alt : p.title,
  body: p.body,
});

export const getPosts = cache(async (): Promise<Post[]> => {
  const payload = await payloadClient();
  const { docs } = await payload.find({
    collection: "posts",
    where: { _status: { equals: "published" } },
    sort: "-publishedAt",
    depth: 1,
    limit: 100,
  });
  return docs.map(toPost);
});

export const getPost = cache(async (slug: string): Promise<Post | undefined> => {
  const payload = await payloadClient();
  const { docs } = await payload.find({
    collection: "posts",
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }] },
    depth: 1,
    limit: 1,
  });
  return docs[0] ? toPost(docs[0]) : undefined;
});
