import { Client } from "pg";

const url = process.env.DATABASE_URL;
if (!url) { console.error("DATABASE_URL belum diset"); process.exit(1); }

const client = new Client({ connectionString: url });
await client.connect();
try {
  await client.query(
    `alter table public.pricing add column if not exists category text not null default 'nominal'`
  );
  console.log("Kolom category ditambahkan.");

  await client.query(`
    update public.pricing p set category = 'pass'
    from public.games g
    where p.game_id = g.id
      and g.slug = 'mobile-legends'
      and p.nominal_label in ('Weekly Diamond Pass', 'Twilight Pass', 'Starlight Member')
  `);
  await client.query(`
    update public.pricing p set category = 'pass'
    from public.games g
    where p.game_id = g.id
      and g.slug = 'magic-chess-go-go'
      and p.nominal_label in ('Weekly Pass', 'Season Pass', 'Premium Pass')
  `);
  console.log("Paket spesial ditandai category='pass'.");

  const { rows } = await client.query(`
    select g.slug, p.category, count(*)::int as n
    from pricing p join games g on g.id = p.game_id
    group by g.slug, p.category order by g.slug, p.category
  `);
  console.log(rows.map((r) => `  ${r.slug} ${r.category}: ${r.n}`).join("\n"));
} finally {
  await client.end();
}
