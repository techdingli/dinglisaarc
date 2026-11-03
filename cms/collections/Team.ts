import type { CollectionConfig } from "payload";
import { isEditor } from "../access";
import { refresh } from "../revalidate";

export const Team: CollectionConfig = {
  slug: "team",
  labels: { singular: "Team member", plural: "Team" },
  admin: {
    group: "Content",
    useAsTitle: "name",
    defaultColumns: ["name", "role", "sortOrder"],
    description: "Shown in the Our Team section of the About page.",
  },
  access: {
    read: () => true,
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  defaultSort: "sortOrder",
  fields: [
    { name: "name", type: "text", required: true },
    { name: "role", type: "text", required: true, admin: { description: "e.g. CEO - SAARC" } },
    { name: "focus", type: "textarea", required: true, admin: { description: "One sentence on what they do." } },
    {
      name: "photo",
      type: "upload",
      relationTo: "media",
      admin: { description: "Square photo. Initials are shown until one is added." },
    },
    { name: "linkedin", label: "LinkedIn URL", type: "text" },
    {
      name: "sortOrder",
      type: "number",
      defaultValue: 100,
      admin: { position: "sidebar", description: "Lower numbers show first." },
    },
  ],
  hooks: {
    afterChange: [() => refresh("/about")],
    afterDelete: [() => refresh("/about")],
  },
};
