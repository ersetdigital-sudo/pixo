import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { LogoHex } from "@/components/ui/LogoMark";
import { getActiveGames } from "@/lib/db";
import { GAMES, minPriceOf, type StaticGame } from "@/lib/games";
import { formatRupiah } from "@/lib/format";
import type { DbGameWithNominals } from "@/types/game";

interface CardGame {
  slug: string;
  name: string;
  range: string;
  logo: string;
  cur: string;
  tag?: string;
  copy?: string;
  startPrice: number;
  isMain: boolean;
}

async function resolveGames(): Promise<CardGame[]> {
  let db: DbGameWithNominals[] = [];
  try {
    db = await getActiveGames();
  } catch {
    /* fallback ke data statis */
  }
  const statics: StaticGame[] = GAMES;
  const staticBySlug = new Map(statics.map((s) => [s.slug, s]));
  return (db.length > 0 ? db : statics).map((g, i) => {
    const priceList = "nominals" in g ? g.nominals : [];
    const st = staticBySlug.get(g.slug);
    const passes = st?.passes ?? [];
    return {
      slug: g.slug,
      name: g.name,
      range: "range_label" in g ? g.range_label : (st?.range ?? ""),
      logo: "icon_url" in g ? (g.icon_url || st?.logo || "") : (st?.logo ?? ""),
      cur: st?.cur ?? "",
      tag: st?.tag,
      copy: st?.copy,
      startPrice: minPriceOf([...priceList, ...passes]),
      isMain: i === 0,
    };
  });
}

export default async function HomePage() {
  const games = await resolveGames();
  const main = games[0];
  const rest = games.slice(1);

  const heroCopy: Record<string, string> = {
    "mobile-legends": "Dari 5 sampai 2.195 Diamond plus Weekly & Twilight Pass. Masuk langsung ke User ID + Zone ID kamu, tanpa login akun.",
    "free-fire": "Diamond FF cair sebelum booyah. Cukup User ID, mulai Rp1.500.",
    "pubg-mobile": "UC resmi buat Royale Pass & crate. Kirim ke User ID kamu.",
    "call-of-duty-mobile": "CP buat skin legendaris & Battle Pass, proses otomatis.",
    "magic-chess-go-go": "Diamond & Pass buat push rank commander kamu.",
  };

  return (
    <>
      <Nav />

      {/* HERO */}
      <section className="noise relative overflow-hidden">
        <div className="glow -left-24 top-0 h-80 w-80 bg-[#ff6a2c]"></div>
        <div className="glow right-0 top-32 h-96 w-96 bg-[#4c8dff]"></div>
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 md:py-28 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-[var(--muted)]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span> Layanan top up game · Indonesia
            </span>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl">
              Top Up Game<br /><span className="grad">Tanpa Login Akun</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
              Beli Diamond Mobile Legends, Free Fire, UC PUBG Mobile, dan CP Call of Duty Mobile cukup dengan User ID. Pilih nominal, selesaikan pembayaran, dan item langsung masuk ke akun kamu.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/top-up/mobile-legends" className="btn-primary rounded-full px-7 py-3.5 text-sm font-bold text-[#0a1024] transition">
                Top Up Sekarang
              </Link>
              <a href="#game" className="rounded-full border border-white/15 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/10">
                Lihat Daftar Harga
              </a>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm text-[var(--muted)]">
              <span className="flex items-center gap-2">
                <svg viewBox="0 0 20 20" className="h-4 w-4 text-[var(--cyan)]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m4 10.5 4 4 8-9"></path></svg> Tanpa registrasi
              </span>
              <span className="flex items-center gap-2">
                <svg viewBox="0 0 20 20" className="h-4 w-4 text-[var(--cyan)]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m4 10.5 4 4 8-9"></path></svg> Harga transparan
              </span>
              <span className="flex items-center gap-2">
                <svg viewBox="0 0 20 20" className="h-4 w-4 text-[var(--cyan)]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m4 10.5 4 4 8-9"></path></svg> Proses otomatis 24 jam
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="relative grid place-items-center overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_50%_35%,rgba(255,138,46,.22),rgba(10,16,36,0)_65%)] px-6 py-16 shadow-2xl">
              <div className="pointer-events-none absolute inset-0 opacity-[.35]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px)", backgroundSize: "44px 44px", WebkitMaskImage: "radial-gradient(circle at 50% 45%,#000,transparent 70%)", maskImage: "radial-gradient(circle at 50% 45%,#000,transparent 70%)" }}></div>
              <LogoHex className="h-56 w-56 sm:h-64 sm:w-64" />
              <p className="display relative mt-6 text-center text-xl font-extrabold tracking-[.18em]">PIXOGAMEONLINE</p>
              <p className="relative mt-2 text-center text-xs uppercase tracking-[.28em] text-[var(--muted)]">Official Top Up Store</p>
            </div>
            <div className="card absolute -bottom-6 left-4 rounded-2xl px-5 py-4 sm:left-8">
              <p className="text-xs text-[var(--muted)]">Rata-rata pengiriman</p>
              <p className="display text-2xl font-bold">&lt; 60 detik</p>
            </div>
            <div className="card absolute -top-5 right-4 rounded-2xl px-5 py-4">
              <p className="text-xs text-[var(--muted)]">Pembayaran</p>
              <p className="display text-sm font-bold">QRIS · E-wallet · Bank</p>
            </div>
          </div>
        </div>
        {/* marquee */}
        <div className="relative overflow-hidden border-y border-white/10 py-4">
          <div className="marquee flex w-max gap-10 whitespace-nowrap text-sm font-semibold uppercase tracking-[.2em] text-white/25">
            <span>Mobile Legends • Free Fire • PUBG Mobile • COD Mobile • Magic Chess Go Go •&nbsp;</span>
            <span>Mobile Legends • Free Fire • PUBG Mobile • COD Mobile • Magic Chess Go Go •&nbsp;</span>
          </div>
        </div>
      </section>

      {/* GAMES */}
      <section id="game" className="mx-auto max-w-7xl px-5 py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[var(--cyan)]">Katalog</p>
            <h2 className="mt-3 text-4xl font-extrabold sm:text-5xl">Lima Game Favorit,<br className="hidden sm:block" /> Satu Alur Top Up</h2>
            <p className="mt-4 max-w-xl text-[var(--muted)]">Kami sengaja nggak jual ratusan judul. Fokus di lima game paling ramai supaya stok selalu aman dan pengiriman tetap instan.</p>
          </div>
          <Link href={`/top-up/${main?.slug ?? "mobile-legends"}`} className="text-sm font-semibold text-[var(--cyan)] transition hover:text-white">
            Lihat semua nominal →
          </Link>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {main && (
            <Link href={`/top-up/${main.slug}`} className="card group relative col-span-1 overflow-hidden rounded-3xl p-8 transition lg:row-span-2">
              {main.tag && (
                <span className="absolute right-6 top-6 rounded-full bg-[#ff6a2c]/20 px-3 py-1 text-[11px] font-bold text-[#ffc24b]">{main.tag}</span>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={main.logo} alt={main.name} className="h-20 w-20 rounded-2xl object-contain" />
              <h3 className="mt-6 text-2xl font-bold">{main.name}</h3>
              <p className="mt-1 text-sm font-semibold text-[var(--cyan)]">{main.cur}</p>
              <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">{main.copy ?? heroCopy[main.slug] ?? ""}</p>
              <p className="mt-4 text-xs text-[var(--muted)]">
                Mulai dari <span className="display text-base font-bold text-white">{main.startPrice > 0 ? formatRupiah(main.startPrice) : "Rp1.500"}</span>
              </p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-white">
                Top Up {main.name} <span className="transition group-hover:translate-x-1">→</span>
              </span>
            </Link>
          )}

          {rest.map((g) => (
            <Link key={g.slug} href={`/top-up/${g.slug}`} className="card group rounded-3xl p-7 transition">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold">{g.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-[var(--cyan)]">{g.cur}</p>
                  <p className="mt-3 text-sm text-[var(--muted)]">{g.copy ?? heroCopy[g.slug] ?? ""}</p>
                </div>
                <span className="text-xl text-[var(--muted)] transition group-hover:translate-x-1 group-hover:text-white">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section className="relative overflow-hidden border-y border-white/10 bg-white/[.02]">
        <div className="glow left-1/3 top-10 h-72 w-72 bg-[#4c8dff] opacity-25"></div>
        <div className="relative mx-auto max-w-7xl px-5 py-20 md:py-28">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[var(--cyan)]">Kenapa PIXOGAMEONLINE</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-extrabold sm:text-5xl">Empat Detik Berpikir,<br className="hidden sm:block" /> Sisanya Kami Urus</h2>
          <p className="mt-4 max-w-2xl text-[var(--muted)]">Nggak ada form panjang, nggak ada biaya kejutan. Empat langkah, semuanya transparan dari awal sampai item masuk.</p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card rounded-3xl p-7"><span className="display text-3xl font-extrabold text-white/15">01</span><h3 className="mt-3 text-lg font-bold">Katalog Fokus</h3><p className="mt-2 text-sm text-[var(--muted)]">Lima game paling ramai di Indonesia. Nggak perlu scroll ratusan menu buat nemu yang kamu main.</p></div>
            <div className="card rounded-3xl p-7"><span className="display text-3xl font-extrabold text-white/15">02</span><h3 className="mt-3 text-lg font-bold">Data Seminimal Mungkin</h3><p className="mt-2 text-sm text-[var(--muted)]">Cukup User ID. Nggak ada password, nggak ada OTP, nggak ada akses ke akun kamu.</p></div>
            <div className="card rounded-3xl p-7"><span className="display text-3xl font-extrabold text-white/15">03</span><h3 className="mt-3 text-lg font-bold">Harga Apa Adanya</h3><p className="mt-2 text-sm text-[var(--muted)]">Semua nominal tampil lengkap dengan harganya sejak awal. Yang kamu lihat, itu yang kamu bayar.</p></div>
            <div className="card rounded-3xl p-7"><span className="display text-3xl font-extrabold text-white/15">04</span><h3 className="mt-3 text-lg font-bold">Masuk Otomatis</h3><p className="mt-2 text-sm text-[var(--muted)]">Begitu pembayaran terkonfirmasi, item langsung dikirim. Rata-rata di bawah satu menit.</p></div>
          </div>
        </div>
      </section>

      {/* CARA */}
      <section id="cara" className="mx-auto max-w-7xl px-5 py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[var(--cyan)]">Cara Top Up</p>
            <h2 className="mt-3 text-4xl font-extrabold sm:text-5xl">Selesai Sebelum<br />Loading Screen Habis</h2>
            <p className="mt-4 text-[var(--muted)]">Alurnya sama di semua game. Sekali hafal, top up berikutnya tinggal ulang — nggak sampai satu menit.</p>
            <Link href="/top-up/mobile-legends" className="btn-primary mt-8 inline-block rounded-full px-7 py-3.5 text-sm font-bold text-[#0a1024]">
              Mulai Top Up →
            </Link>
          </div>
          <ol className="space-y-4">
            <li className="card flex gap-5 rounded-2xl p-6"><span className="display text-xl font-bold text-[var(--cyan)]">01</span><div><h3 className="font-bold">Pilih game</h3><p className="mt-1 text-sm text-[var(--muted)]">Klik game yang kamu main dari katalog.</p></div></li>
            <li className="card flex gap-5 rounded-2xl p-6"><span className="display text-xl font-bold text-[var(--cyan)]">02</span><div><h3 className="font-bold">Masukkan User ID</h3><p className="mt-1 text-sm text-[var(--muted)]">Masukkan User ID, dan Zone ID bila diperlukan.</p></div></li>
            <li className="card flex gap-5 rounded-2xl p-6"><span className="display text-xl font-bold text-[var(--cyan)]">03</span><div><h3 className="font-bold">Pilih nominal</h3><p className="mt-1 text-sm text-[var(--muted)]">Tentukan nominal Diamond, UC, CP, atau Pass.</p></div></li>
            <li className="card flex gap-5 rounded-2xl p-6"><span className="display text-xl font-bold text-[var(--cyan)]">04</span><div><h3 className="font-bold">Bayar</h3><p className="mt-1 text-sm text-[var(--muted)]">Selesaikan pembayaran, pesanan diproses otomatis.</p></div></li>
          </ol>
        </div>
      </section>

      {/* KEAMANAN */}
      <section id="aman" className="relative overflow-hidden border-y border-white/10 bg-white/[.02]">
        <div className="glow right-10 bottom-0 h-72 w-72 bg-[#4c8dff] opacity-25"></div>
        <div className="relative mx-auto max-w-7xl px-5 py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[var(--cyan)]">Keamanan</p>
            <h2 className="mt-3 text-4xl font-extrabold sm:text-5xl">Akun Kamu Tetap Milik Kamu</h2>
            <p className="mt-4 text-[var(--muted)]">Top up yang aman itu yang minta datanya sedikit. PIXOGAMEONLINE cuma butuh User ID — kami tidak pernah minta password, OTP, atau PIN akun game kamu. Titik.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <div className="card rounded-3xl p-7"><h3 className="text-lg font-bold">Cukup User ID</h3><p className="mt-2 text-sm text-[var(--muted)]">Satu-satunya data yang kami minta adalah tujuan pengiriman item. Selebihnya bukan urusan kami.</p></div>
            <div className="card rounded-3xl p-7"><h3 className="text-lg font-bold">Tanpa OTP</h3><p className="mt-2 text-sm text-[var(--muted)]">Kalau ada yang mengaku dari kami dan minta kode verifikasi, itu penipu. Kami tidak pernah melakukannya.</p></div>
            <div className="card rounded-3xl p-7"><h3 className="text-lg font-bold">Tanpa login akun</h3><p className="mt-2 text-sm text-[var(--muted)]">Kami tidak pernah masuk ke akun game kamu. Item dikirim langsung lewat sistem resmi.</p></div>
          </div>
        </div>
      </section>

      {/* TENTANG */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[var(--cyan)]">Tentang PIXOGAMEONLINE</p>
            <h2 className="mt-3 text-4xl font-extrabold sm:text-5xl">Dibangun Buat Gamer,<br className="hidden sm:block" /> Bukan Buat Ribet</h2>
            <p className="mt-5 text-[var(--muted)]">PIXOGAMEONLINE adalah layanan <strong className="text-white">top up game</strong> untuk gamer Indonesia. Kami memilih jalan sebaliknya dari toko lain: bukan menjual semua judul, tapi memastikan lima judul terpopuler selalu tersedia, cepat, dan harganya jelas.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="card rounded-3xl p-7"><h3 className="text-lg font-bold">Game yang tersedia</h3><p className="mt-2 text-sm text-[var(--muted)]"><strong className="text-white">Mobile Legends</strong> &amp; <strong className="text-white">Magic Chess Go Go</strong> untuk Diamond, <strong className="text-white">Free Fire</strong> untuk Diamond, <strong className="text-white">PUBG Mobile</strong> untuk UC, dan <strong className="text-white">COD Mobile</strong> untuk CP.</p></div>
            <div className="card rounded-3xl p-7"><h3 className="text-lg font-bold">Cara kerjanya</h3><p className="mt-2 text-sm text-[var(--muted)]">Pilih game, isi User ID, pilih nominal, bayar. Kami hanya butuh ID akun — tanpa password, tanpa OTP, tanpa login ke akun game kamu.</p></div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-4xl px-5 pb-20 md:pb-28">
        <p className="text-xs font-bold uppercase tracking-[.2em] text-[var(--cyan)]">FAQ</p>
        <h2 className="mt-3 text-4xl font-extrabold sm:text-5xl">Pertanyaan yang sering muncul.</h2>
        <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
          <details className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">Bagaimana cara top up game di PIXOGAMEONLINE?<span className="chev text-[var(--cyan)] transition">+</span></summary><p className="mt-3 text-sm text-[var(--muted)]">Pilih game, masukkan User ID (dan Zone ID bila diperlukan), pilih nominal, lalu lanjutkan ke pembayaran.</p></details>
          <details className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">Apakah top up membutuhkan password?<span className="chev text-[var(--cyan)] transition">+</span></summary><p className="mt-3 text-sm text-[var(--muted)]">Tidak. PIXOGAMEONLINE tidak meminta password, OTP, PIN, maupun akses login ke akun game.</p></details>
          <details className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">Di mana saya menemukan User ID?<span className="chev text-[var(--cyan)] transition">+</span></summary><p className="mt-3 text-sm text-[var(--muted)]">User ID ada di halaman profil dalam game. Buka menu profil atau akun, lalu salin angka ID yang tertera.</p></details>
          <details className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">Apakah Zone ID diperlukan?<span className="chev text-[var(--cyan)] transition">+</span></summary><p className="mt-3 text-sm text-[var(--muted)]">Hanya untuk Mobile Legends dan Magic Chess Go Go. Zone ID ditulis di dalam tanda kurung setelah User ID.</p></details>
          <details className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">Berapa lama proses top up?<span className="chev text-[var(--cyan)] transition">+</span></summary><p className="mt-3 text-sm text-[var(--muted)]">Pesanan diproses otomatis setelah pembayaran terkonfirmasi. Bila ada antrean dari sisi penyedia, prosesnya bisa lebih lama.</p></details>
          <details className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">Apa yang harus dilakukan jika salah memasukkan User ID?<span className="chev text-[var(--cyan)] transition">+</span></summary><p className="mt-3 text-sm text-[var(--muted)]">Hubungi support secepatnya dengan bukti pesanan. Item yang sudah masuk ke ID lain tidak bisa ditarik kembali, jadi pastikan ID benar sebelum bayar.</p></details>
          <details className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">Apakah pembayaran bisa menggunakan QRIS?<span className="chev text-[var(--cyan)] transition">+</span></summary><p className="mt-3 text-sm text-[var(--muted)]">Ya. QRIS termasuk metode yang didukung, bersama e-wallet dan transfer bank.</p></details>
          <details className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">Game apa saja yang tersedia di PIXOGAMEONLINE?<span className="chev text-[var(--cyan)] transition">+</span></summary><p className="mt-3 text-sm text-[var(--muted)]">Mobile Legends, Free Fire, PUBG Mobile, Call of Duty Mobile, dan Magic Chess Go Go.</p></details>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="noise relative overflow-hidden rounded-[32px] border border-white/10 px-8 py-16 text-center" style={{ background: "linear-gradient(120deg,rgba(255,106,44,.28),rgba(76,141,255,.22))" }}>
          <h2 className="text-4xl font-extrabold sm:text-5xl">Rank nggak nunggu kamu gajian.</h2>
          <p className="mx-auto mt-4 max-w-xl text-[var(--muted)]">Mulai dari Rp1.500, diamond kamu bisa masuk sebelum match berikutnya dimulai. Tanpa password, tanpa ribet.</p>
          <Link href="/top-up/mobile-legends" className="btn-primary mt-8 inline-block rounded-full px-8 py-4 text-sm font-bold text-[#0a1024]">
            Top Up Sekarang →
          </Link>
          <p className="mt-4 text-xs text-[var(--muted)]">QRIS · GoPay · OVO · DANA · ShopeePay · Transfer Bank</p>
        </div>
      </section>

      <Footer />
    </>
  );
}
