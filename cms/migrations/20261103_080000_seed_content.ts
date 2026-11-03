import { convertMarkdownToLexical, editorConfigFactory } from "@payloadcms/richtext-lexical";
import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { seedExpo, seedPost, seedTeam } from "../seed/data";
import usedMachines from "../seed/used-machines.json";

/**
 * One-off import of the content the site had before the CMS: the bauma CHINA
 * article, used machines, team and expo banner. Images are uploaded through
 * Payload, so they get resized copies and land in Supabase Storage in
 * production. Runs once; Payload records it in payload_migrations.
 */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const seedDir = path.join(root, "cms/seed");
const publicDir = path.join(root, "public");

type UsedSeed = {
  model: string;
  brand?: string;
  category?: string;
  workingHeight?: string;
  capacity?: string;
  status?: "available" | "reserved" | "sold";
  images?: string[];
  notes?: string;
};

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  // Never import twice, e.g. into a database that already has content.
  const existing = await payload.count({ collection: "posts", req });
  if (existing.totalDocs > 0) {
    payload.logger.info("seed_content: posts already exist, skipping import");
    return;
  }

  const upload = async (file: string, alt: string) =>
    payload.create({ collection: "media", data: { alt }, filePath: path.join(publicDir, file), req });

  // Article
  const editorConfig = await editorConfigFactory.default({ config: payload.config });
  const markdown = await readFile(path.join(seedDir, seedPost.bodyMarkdownFile), "utf8");
  const cover = await upload(seedPost.cover.file, seedPost.cover.alt);
  const post = await payload.create({
    collection: "posts",
    data: {
      title: seedPost.title,
      slug: seedPost.slug,
      excerpt: seedPost.excerpt,
      tag: seedPost.tag,
      publishedAt: seedPost.publishedAt,
      cover: cover.id,
      body: convertMarkdownToLexical({ editorConfig, markdown }),
      _status: "published",
    },
    req,
  });

  // Expo banner, linked to the article
  await payload.updateGlobal({
    slug: "expo",
    data: { ...seedExpo, image: cover.id, post: post.id },
    req,
  });

  // Used machines, in the order they were listed
  for (const [i, m] of (usedMachines as UsedSeed[]).entries()) {
    const photos = [];
    for (const img of m.images ?? []) {
      const media = await upload(img.replace(/^\//, ""), `${m.brand ?? ""} ${m.model}`.trim());
      photos.push(media.id);
    }
    await payload.create({
      collection: "used-machines",
      data: {
        model: m.model,
        brand: m.brand,
        category: m.category,
        workingHeight: m.workingHeight,
        capacity: m.capacity,
        status: m.status ?? "available",
        notes: m.notes,
        photos,
        sortOrder: (i + 1) * 10,
      },
      req,
    });
  }

  // Team
  for (const [i, t] of seedTeam.entries()) {
    await payload.create({ collection: "team", data: { ...t, sortOrder: (i + 1) * 10 }, req });
  }

  payload.logger.info(
    `seed_content: imported 1 post, ${usedMachines.length} used machines, ${seedTeam.length} team members and the expo banner`,
  );
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // Content may have been edited since the import; removing it is a manual call.
  payload.logger.info("seed_content: nothing to undo automatically");
}
