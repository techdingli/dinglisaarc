import type { CollectionConfig } from "payload";
import { isEditor, publishedOrEditor } from "../access";
import { refresh } from "../revalidate";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "Blog post", plural: "Blog posts" },
  admin: {
    group: "Content",
    useAsTitle: "title",
    defaultColumns: ["title", "tag", "publishedAt", "_status"],
    preview: (doc) => (doc?.slug ? `/blog/${doc.slug}` : null),
  },
  versions: { drafts: true, maxPerDoc: 25 },
  access: {
    read: publishedOrEditor,
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  defaultSort: "-publishedAt",
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "excerpt",
      type: "textarea",
      required: true,
      maxLength: 300,
      admin: { description: "One or two sentences. Shown on the blog page and in link previews." },
    },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: { description: "4:3 works best, e.g. 1200 x 900." },
    },
    { name: "body", type: "richText", required: true },
    {
      name: "slug",
      type: "text",
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        description: "The web address, e.g. /blog/bauma-china-2026. Filled in from the title if left empty.",
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => (value ? slugify(value) : data?.title ? slugify(data.title) : value),
        ],
      },
    },
    {
      name: "tag",
      type: "select",
      required: true,
      defaultValue: "News",
      options: ["News", "Events", "Products", "Guides"],
      admin: { position: "sidebar" },
    },
    {
      name: "publishedAt",
      label: "Publish date",
      type: "date",
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: "sidebar", date: { pickerAppearance: "dayOnly" } },
    },
    {
      name: "updatedNote",
      label: "Last updated",
      type: "date",
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayOnly" },
        description: "Optional. Set when you make a meaningful update to the article.",
      },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc, previousDoc }) => {
        refresh("/blog", `/blog/${doc.slug}`);
        if (previousDoc?.slug && previousDoc.slug !== doc.slug) refresh(`/blog/${previousDoc.slug}`);
      },
    ],
    afterDelete: [({ doc }) => refresh("/blog", `/blog/${doc.slug}`)],
  },
};
