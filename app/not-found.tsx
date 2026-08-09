import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-32 text-center">
      <h1 className="text-6xl font-extrabold grad">404</h1>
      <p className="mt-4 text-[var(--muted)]">Halaman yang kamu cari nggak ketemu.</p>
      <Link href="/" className="btn-primary mt-8 inline-block rounded-full px-7 py-3.5 text-sm font-bold text-[#0a1024]">
        Kembali ke Beranda
      </Link>
    </main>
  );
}
