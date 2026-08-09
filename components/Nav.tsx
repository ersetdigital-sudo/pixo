import Link from "next/link";
import { LogoMark } from "@/components/ui/LogoMark";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a1024]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark className="h-9 w-9" />
          <span className="display text-lg font-extrabold tracking-tight">PIXOGAMEONLINE</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-[var(--muted)] md:flex">
          <Link href="/" className="transition hover:text-white">Home</Link>
          <Link href="/#game" className="transition hover:text-white">Game</Link>
          <Link href="/#cara" className="transition hover:text-white">Cara Top Up</Link>
          <Link href="/#aman" className="transition hover:text-white">Keamanan</Link>
          <Link href="/#faq" className="transition hover:text-white">FAQ</Link>
        </nav>
        <Link href="/top-up/mobile-legends" className="btn-primary rounded-full px-5 py-2.5 text-sm font-bold text-[#0a1024] transition">
          Top Up
        </Link>
      </div>
    </header>
  );
}
