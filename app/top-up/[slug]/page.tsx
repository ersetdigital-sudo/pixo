import Link from "next/link";
import { Nav } from "@/components/Nav";
import { FooterCompact } from "@/components/Footer";
import { getGameBySlug, getQrisUrl } from "@/lib/db";
import { GAMES, getGame as getStaticGame } from "@/lib/games";
import { GameOrderForm } from "@/components/GameOrderForm";

export default async function TopUpPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const staticGame = getStaticGame(slug);

  let game: Awaited<ReturnType<typeof getGameBySlug>> = null;
  try {
    game = await getGameBySlug(slug);
  } catch {
    game = null;
  }

  const g = game ?? staticGame;
  if (!g) {
    return (
      <>
        <Nav />
        <div className="mx-auto max-w-7xl px-5 py-32 text-center">
          <h1 className="text-3xl font-extrabold">Game tidak ditemukan</h1>
          <p className="mt-3 text-[var(--muted)]">Coba lihat katalog game lain.</p>
          <Link href="/" className="btn-primary mt-8 inline-block rounded-full px-7 py-3.5 text-sm font-bold text-[#0a1024]">
            Kembali ke Beranda
          </Link>
        </div>
        <FooterCompact />
      </>
    );
  }

  const gameName = g.name;
  const cur = staticGame?.cur ?? "";
  const server = staticGame?.server ?? (game ? game.server_id_required : false);
  const serverLabel = staticGame?.serverLabel ?? game?.server_id_label ?? "Server ID";
  const userIdLabel = staticGame?.user_id_label ?? game?.user_id_label ?? "User ID";
  const userIdPlaceholder = staticGame?.user_id_placeholder ?? game?.user_id_placeholder ?? "12345678";
  const hint = staticGame?.hint ?? "";

  const nominals =
    game && game.nominals.length > 0
      ? game.nominals.map((n) => ({ label: n.nominal_label, price: n.price }))
      : (staticGame?.nominals ?? []);
  const passes = staticGame?.passes ?? [];
  const qrisUrl = await getQrisUrl().catch(() => "");

  const otherGames = GAMES.filter((x) => x.slug !== slug);

  return (
    <>
      <Nav />

      {/* BREADCRUMB */}
      <nav aria-label="Breadcrumb" className="border-b border-white/[.07]">
        <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-5 py-4 text-sm text-[var(--muted)]">
          <li><Link href="/" className="transition hover:text-white">Beranda</Link></li>
          <li aria-hidden="true" className="text-white/25">/</li>
          <li><Link href="/#game" className="transition hover:text-white">Top Up</Link></li>
          <li aria-hidden="true" className="text-white/25">/</li>
          <li aria-current="page" className="font-semibold text-[var(--cyan)]">{gameName}</li>
        </ol>
      </nav>

      {/* HEADER PRODUK */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="glow -left-20 top-0 h-72 w-72 bg-[#ff6a2c]"></div>
        <div className="glow right-0 top-10 h-80 w-80 bg-[#4c8dff]"></div>
        <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 md:flex-row md:items-center md:py-16">
          <div className="grid h-28 w-28 shrink-0 place-items-center rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_50%_40%,rgba(255,138,46,.22),rgba(255,255,255,.03))]">
            {staticGame && staticGame.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={staticGame.logo} alt={staticGame.alt} className="h-20 w-20 rounded-2xl object-contain" />
            ) : (
              <span className="display text-2xl font-extrabold text-[var(--cyan)]">{gameName.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-[var(--muted)]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span> Stok tersedia · Proses otomatis 24 jam
            </span>
            <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">
              Top Up <span className="grad">{gameName}</span>
            </h1>
            <p className="mt-4 max-w-2xl text-[var(--muted)]">
              {staticGame?.copy ?? `Top up ${gameName} ke User ID kamu, tanpa login akun.`}
            </p>
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm text-[var(--muted)]">
              <span className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-[var(--cyan)]" fill="currentColor"><path d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13z"></path></svg> Rata-rata <strong className="text-white">&lt; 60 detik</strong>
              </span>
              <span className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-[var(--cyan)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M12 2.5 20 6v6c0 5-3.4 8.4-8 9.5C7.4 20.4 4 17 4 12V6z"></path><path d="m8.8 12 2.2 2.2 4.2-4.4" strokeLinecap="round"></path></svg> Tanpa password &amp; OTP
              </span>
              <span className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-[var(--cyan)]" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2.5" y="5" width="19" height="14" rx="3"></rect><path d="M2.5 10h19"></path></svg> QRIS · E-wallet · Bank
              </span>
            </div>
          </div>
        </div>
      </section>

      <GameOrderForm
        slug={slug}
        gameName={gameName}
        cur={cur}
        server={server}
        serverLabel={serverLabel}
        userIdLabel={userIdLabel}
        userIdPlaceholder={userIdPlaceholder}
        hint={hint}
        nominals={nominals}
        passes={passes}
        qrisUrl={qrisUrl}
      />

      {/* GAME LAIN */}
      <section className="border-t border-white/10 bg-white/[.02]">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Top Up Game Lain</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {otherGames.map((og) => (
              <Link key={og.slug} href={`/top-up/${og.slug}`} className="card group rounded-2xl p-5 transition hover:border-[#ffc24b]/50">
                <p className="font-bold">{og.name}</p>
                <p className="mt-1 text-xs text-[var(--cyan)]">{og.cur}{og.nominals.length > 0 ? ` · mulai Rp${Math.min(...og.nominals.map((n) => n.price)).toLocaleString("id-ID")}` : ""}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FooterCompact />
    </>
  );
}
