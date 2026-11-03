import { revalidatePath } from "next/cache";

/**
 * Refresh the given pages after an edit so changes show without a redeploy.
 * Hooks also run outside a Next request (seed scripts, migrations), where
 * revalidatePath throws - nothing is cached there, so that is safe to ignore.
 */
export function refresh(...paths: (string | { path: string; type: "layout" | "page" })[]) {
  for (const p of paths) {
    try {
      if (typeof p === "string") revalidatePath(p);
      else revalidatePath(p.path, p.type);
    } catch {
      // Not inside a Next.js request.
    }
  }
}
