import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

/**
 * Create the first admin from INITIAL_ADMIN_EMAIL / INITIAL_ADMIN_PASSWORD.
 *
 * Without any users, Payload lets whoever opens /admin first create an admin
 * account. Creating one during the deploy closes that gap, so the deploy
 * stops if the variables are missing. Once this has run, the variables can
 * be removed from Vercel and the password changed in /admin.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const users = await payload.count({ collection: "users", req });
  if (users.totalDocs > 0) return;

  const email = process.env.INITIAL_ADMIN_EMAIL;
  const password = process.env.INITIAL_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "Set INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD so the first admin account is created during deploy.",
    );
  }

  await payload.create({
    collection: "users",
    data: { email, password, name: "Admin", role: "admin" },
    req,
  });
  payload.logger.info(`first_admin: created admin ${email}`);
}

export async function down(_args: MigrateDownArgs): Promise<void> {}
