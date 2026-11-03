import type { CollectionConfig } from "payload";
import { isEditor } from "../access";

/**
 * Every image on the site. Payload makes resized WebP copies on upload, so
 * pages can serve a size that fits the screen without an image optimizer.
 */
export const Media: CollectionConfig = {
  slug: "media",
  admin: { group: "Content", defaultColumns: ["filename", "alt", "updatedAt"] },
  access: {
    read: () => true,
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: { description: "Describe the image for screen readers and search engines." },
    },
  ],
  upload: {
    mimeTypes: ["image/*"],
    formatOptions: { format: "webp", options: { quality: 82 } },
    imageSizes: [
      { name: "thumb", width: 480, formatOptions: { format: "webp", options: { quality: 80 } } },
      { name: "card", width: 960, formatOptions: { format: "webp", options: { quality: 80 } } },
      { name: "hero", width: 1600, formatOptions: { format: "webp", options: { quality: 82 } } },
    ],
    adminThumbnail: "thumb",
  },
};
