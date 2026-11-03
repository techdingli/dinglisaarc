/** "2 November 2026" from a YYYY-MM-DD date. Blog posts live in the CMS (lib/cms.ts). */
export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
