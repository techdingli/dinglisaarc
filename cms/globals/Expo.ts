import type { GlobalConfig } from "payload";
import { isEditor } from "../access";
import { refresh } from "../revalidate";

/**
 * The expo promoted in the orange bar on every page and the showcase on the
 * home page. Both hide themselves after the end date, or when switched off.
 */
export const Expo: GlobalConfig = {
  slug: "expo",
  label: "Expo banner",
  admin: {
    group: "Content",
    description:
      "The orange bar on every page and the showcase on the home page. They disappear automatically after the end date.",
  },
  access: { read: () => true, update: isEditor },
  fields: [
    { name: "enabled", label: "Show on the website", type: "checkbox", defaultValue: true },
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true, admin: { description: "e.g. bauma CHINA 2026" } },
        { name: "shortName", type: "text", required: true, admin: { description: "e.g. bauma CHINA" } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "start", type: "date", required: true, admin: { date: { pickerAppearance: "dayOnly" } } },
        { name: "end", type: "date", required: true, admin: { date: { pickerAppearance: "dayOnly" } } },
        { name: "booth", type: "text", defaultValue: "TBA" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "venue", type: "text", required: true },
        { name: "city", type: "text", required: true, admin: { description: "e.g. Shanghai, China" } },
      ],
    },
    {
      name: "blurb",
      type: "textarea",
      required: true,
      admin: { description: "Shown under the heading in the home page showcase." },
    },
    {
      name: "image",
      label: "Showcase banner",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: { description: "4:3 banner artwork, e.g. 1200 x 900." },
    },
    {
      name: "post",
      label: "Blog post",
      type: "relationship",
      relationTo: "posts",
      admin: { description: "The bar and the banner image open this article." },
    },
    {
      type: "row",
      fields: [
        { name: "ctaLabel", label: "Button label", type: "text", defaultValue: "Book a meeting" },
        { name: "ctaHref", label: "Button link", type: "text", defaultValue: "/contact" },
        { name: "url", label: "Official event website", type: "text" },
      ],
    },
  ],
  hooks: {
    afterChange: [() => refresh({ path: "/", type: "layout" })],
  },
};
