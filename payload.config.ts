import { postgresAdapter } from "@payloadcms/db-postgres";
import { resendAdapter } from "@payloadcms/email-resend";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { Media } from "./cms/collections/Media";
import { Posts } from "./cms/collections/Posts";
import { Team } from "./cms/collections/Team";
import { UsedMachines } from "./cms/collections/UsedMachines";
import { Users } from "./cms/collections/Users";
import { Expo } from "./cms/globals/Expo";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Images go to Supabase Storage (S3-compatible) when its keys are set, and
 * are served straight from the bucket's public URL. Without the keys (local
 * development) they are stored on disk under /media.
 */
const s3 = {
  bucket: process.env.S3_BUCKET,
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || "ap-south-1",
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  publicUrl: process.env.S3_PUBLIC_URL,
};
const useS3 = Boolean(s3.bucket && s3.endpoint && s3.accessKeyId && s3.secretAccessKey);

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
  routes: {
    admin: "/admin",
    // Keep Payload's REST API clear of the site's own /api/leads and /api/chat.
    api: "/cms-api",
  },
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: " - Dingli AWP India", icons: [{ rel: "icon", url: "/favicon.ico" }] },
    components: {
      graphics: {
        Logo: "/components/admin/brand#Logo",
        Icon: "/components/admin/brand#Icon",
      },
    },
  },
  collections: [Posts, UsedMachines, Team, Media, Users],
  globals: [Expo],
  editor: lexicalEditor(),
  // Password resets and invites go out through Resend, like the lead emails.
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        apiKey: process.env.RESEND_API_KEY,
        defaultFromAddress: process.env.LEAD_NOTIFY_FROM || "website@dinglisaarc.com",
        defaultFromName: "Dingli AWP India",
      })
    : undefined,
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: { outputFile: path.resolve(dirname, "cms/payload-types.ts") },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || "", max: 5 },
    // Own schema, so Payload's tables never mix with Dealer Connect's or the
    // leads table in the shared Supabase database.
    schemaName: "payload",
    // Migrations run once per deploy in the build step (`payload migrate`, see
    // package.json), not on server start, where parallel instances would race.
    migrationDir: path.resolve(dirname, "cms/migrations"),
  }),
  sharp,
  plugins: [
    s3Storage({
      enabled: useS3,
      alwaysInsertFields: true,
      bucket: s3.bucket || "",
      collections: {
        media: {
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) =>
            `${s3.publicUrl}/${[prefix, filename].filter(Boolean).join("/")}`,
        },
      },
      config: {
        endpoint: s3.endpoint,
        region: s3.region,
        forcePathStyle: true,
        credentials: {
          accessKeyId: s3.accessKeyId || "",
          secretAccessKey: s3.secretAccessKey || "",
        },
      },
    }),
  ],
});
