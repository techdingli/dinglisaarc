import type { Access, FieldAccess } from "payload";

/**
 * Two roles:
 *   admin     - everything, including managing users
 *   marketing - edit content (blog, used machines, team, expo, media)
 */
export type Role = "admin" | "marketing";

type MaybeUser = { role?: Role | null } | null | undefined;

const roleOf = (user: unknown) => (user as MaybeUser)?.role;

export const isAdmin: Access = ({ req }) => roleOf(req.user) === "admin";

export const isEditor: Access = ({ req }) => {
  const role = roleOf(req.user);
  return role === "admin" || role === "marketing";
};

export const isAdminField: FieldAccess = ({ req }) => roleOf(req.user) === "admin";

/** Anyone can read published content; editors also see drafts. */
export const publishedOrEditor: Access = ({ req }) => {
  const role = roleOf(req.user);
  if (role === "admin" || role === "marketing") return true;
  return { _status: { equals: "published" } };
};
