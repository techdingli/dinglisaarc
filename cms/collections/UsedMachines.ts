import type { CollectionConfig } from "payload";
import { isEditor } from "../access";
import { refresh } from "../revalidate";

export const UsedMachines: CollectionConfig = {
  slug: "used-machines",
  labels: { singular: "Used machine", plural: "Used machines" },
  admin: {
    group: "Content",
    useAsTitle: "model",
    defaultColumns: ["model", "brand", "category", "status", "sortOrder"],
    description: "Pre-owned stock shown on /used-equipment. Sold machines are hidden from the site.",
  },
  access: {
    read: () => true,
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  defaultSort: "sortOrder",
  fields: [
    {
      type: "row",
      fields: [
        { name: "model", type: "text", required: true },
        { name: "brand", type: "text", defaultValue: "Dingli" },
        {
          name: "category",
          type: "text",
          admin: { description: "e.g. Electric Slab Scissor, Telescopic Boom" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "workingHeight", type: "text", admin: { width: "25%", description: "e.g. 12.00 m" } },
        { name: "capacity", type: "text", admin: { width: "25%", description: "e.g. 320 kg" } },
        { name: "year", type: "number", admin: { width: "25%" } },
        { name: "hours", type: "number", admin: { width: "25%", description: "Hour meter reading" } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "location", type: "text" },
        { name: "condition", type: "text", admin: { description: "e.g. Good, Refurbished" } },
        {
          name: "price",
          type: "text",
          admin: { description: 'Leave empty to show "Price on request".' },
        },
      ],
    },
    {
      name: "photos",
      type: "upload",
      relationTo: "media",
      hasMany: true,
      admin: { description: "The first photo is the cover." },
    },
    { name: "notes", type: "textarea" },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "available",
      options: [
        { label: "Available", value: "available" },
        { label: "Reserved", value: "reserved" },
        { label: "Sold (hidden)", value: "sold" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "sortOrder",
      type: "number",
      defaultValue: 100,
      admin: { position: "sidebar", description: "Lower numbers show first." },
    },
  ],
  hooks: {
    afterChange: [() => refresh("/used-equipment")],
    afterDelete: [() => refresh("/used-equipment")],
  },
};
