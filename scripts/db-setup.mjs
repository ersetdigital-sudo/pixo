import { readFile } from "node:fs/promises";
import { Client } from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL belum diset. Contoh: postgresql://postgres.drxzgtjsmtfdchnmagfr:PASSWORD@HOST:5432/postgres");
  process.exit(1);
}

const client = new Client({ connectionString: url });
await client.connect();
try {
  for (const file of ["schema.sql", "seed.sql"]) {
    const sql = await readFile(new URL(`../supabase/${file}`, import.meta.url), "utf8");
    console.log(`>> Menjalankan ${file} ...`);
    await client.query(sql);
    console.log(`   ${file} selesai.`);
  }

  const { rows: games } = await client.query("SELECT slug, name, is_active FROM games ORDER BY sort_order");
  console.log("\n>> Verifikasi games:");
  for (const g of games) console.log(`   - ${g.slug} (${g.name}) is_active=${g.is_active}`);
  const { rows: pricing } = await client.query("SELECT COUNT(*)::int AS n FROM pricing");
  console.log(`>> Total nominal pricing: ${pricing[0].n}`);
  const { rows: rls } = await client.query(
    `SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename, policyname`
  );
  console.log("\n>> RLS policies:");
  for (const p of rls) console.log(`   - ${p.tablename}: ${p.policyname}`);
} finally {
  await client.end();
}
