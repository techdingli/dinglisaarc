import type { CollectionConfig } from "payload";
import { isAdmin, isAdminField } from "../access";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email", "role"],
    group: "Settings",
  },
  auth: true,
  access: {
    // Admins manage everyone; others can only see and update themselves.
    read: ({ req }) => {
      if (!req.user) return false;
      if ((req.user as { role?: string }).role === "admin") return true;
      return { id: { equals: req.user.id } };
    },
    create: isAdmin,
    delete: isAdmin,
    update: ({ req }) => {
      if (!req.user) return false;
      if ((req.user as { role?: string }).role === "admin") return true;
      return { id: { equals: req.user.id } };
    },
  },
  fields: [
    { name: "name", type: "text" },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "marketing",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Marketing", value: "marketing" },
      ],
      access: { update: isAdminField },
      admin: {
        description: "Admins can manage users. Marketing can edit all website content.",
      },
    },
  ],
};
