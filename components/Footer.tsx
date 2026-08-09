import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <span className="display text-lg font-extrabold">PIXOGAMEONLINE</span>
          <p className="mt-3 max-w-xs text-sm text-[var(--muted)]">Top up game cepat, aman, dan transparan untuk gamer Indonesia. Cukup User ID, item langsung masuk.</p>
        </div>
        <div>
          <h4 className="text-sm font-bold">Game</h4>
          <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
            <li><a href="#game" className="transition hover:text-white">Mobile Legends</a></li>
            <li><a href="#game" className="transition hover:text-white">Free Fire</a></li>
            <li><a href="#game" className="transition hover:text-white">PUBG Mobile</a></li>
            <li><a href="#game" className="transition hover:text-white">Call of Duty: Mobile</a></li>
            <li><a href="#game" className="transition hover:text-white">Magic Chess: Go Go</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold">Halaman</h4>
          <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
            <li><a href="#game" className="transition hover:text-white">Semua Game</a></li>
            <li><a href="#cara" className="transition hover:text-white">Cara Top Up</a></li>
            <li><a href="#aman" className="transition hover:text-white">Keamanan</a></li>
            <li><a href="#faq" className="transition hover:text-white">FAQ</a></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-7xl border-t border-white/10 px-5 py-6 text-xs text-[var(--muted)]">
        <p>© 2026 PIXOGAMEONLINE. All rights reserved.</p>
        <p className="mt-2">Nama game dan mata uang dalam game adalah milik publisher masing-masing. PIXOGAMEONLINE tidak berafiliasi dengan publisher mana pun.</p>
      </div>
    </footer>
  );
}

export function FooterCompact() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <span className="display text-lg font-extrabold">PIXOGAMEONLINE</span>
          <p className="mt-3 max-w-xs text-sm text-[var(--muted)]">Top up game cepat, aman, dan transparan untuk gamer Indonesia.</p>
        </div>
        <div>
          <h4 className="text-sm font-bold">Game</h4>
          <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
            <li><Link href="/top-up/mobile-legends" className="transition hover:text-white">Mobile Legends</Link></li>
            <li><Link href="/top-up/free-fire" className="transition hover:text-white">Free Fire</Link></li>
            <li><Link href="/top-up/pubg-mobile" className="transition hover:text-white">PUBG Mobile</Link></li>
            <li><Link href="/top-up/call-of-duty-mobile" className="transition hover:text-white">Call of Duty: Mobile</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold">Halaman</h4>
          <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
            <li><Link href="/" className="transition hover:text-white">Beranda</Link></li>
            <li><Link href="/#cara" className="transition hover:text-white">Cara Top Up</Link></li>
            <li><Link href="/#aman" className="transition hover:text-white">Keamanan</Link></li>
            <li><Link href="/#faq" className="transition hover:text-white">FAQ</Link></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-7xl border-t border-white/10 px-5 py-6 text-xs text-[var(--muted)]">
        <p>© 2026 PIXOGAMEONLINE. All rights reserved.</p>
        <p className="mt-2">Nama game dan mata uang dalam game adalah milik publisher masing-masing. PIXOGAMEONLINE tidak berafiliasi dengan publisher mana pun.</p>
      </div>
    </footer>
  );
}
