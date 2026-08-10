"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckoutOverlay } from "@/components/CheckoutOverlay";
import { formatRupiah } from "@/lib/format";

export interface NominalItem {
  label: string;
  price: number;
}

interface GameOrderFormProps {
  slug: string;
  gameName: string;
  cur: string;
  server: boolean;
  serverLabel: string;
  userIdLabel: string;
  userIdPlaceholder: string;
  hint: string;
  nominals: NominalItem[];
  passes: NominalItem[];
  qrisUrl: string;
  gameLogo?: string;
  gameAlt?: string;
}

export function GameOrderForm({
  slug,
  gameName,
  cur,
  server,
  serverLabel,
  userIdLabel,
  userIdPlaceholder,
  hint,
  nominals,
  passes,
  qrisUrl,
  gameLogo,
  gameAlt,
}: GameOrderFormProps) {
  const router = useRouter();
  const [price, setPrice] = useState(0);
  const [item, setItem] = useState<string | null>(null);
  const [uid, setUid] = useState("");
  const [zid, setZid] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderId, setOrderId] = useState("");

  const uidOut = uid.trim();
  const uidDisplay = uidOut ? uidOut + (zid.trim() ? ` (${zid.trim()})` : "") : "—";

  const selectItem = (name: string, p: number) => {
    setItem(name);
    setPrice(p);
  };

  const handlePay = () => {
    if (!uid.trim() || !item) {
      alert("Lengkapi User ID dan nominal dulu ya.");
      return;
    }
    setOrderId("PIXO-" + Date.now().toString(36).toUpperCase());
    setCheckoutOpen(true);
  };

  const badgeFor = (label: string): string | null => {
    if (slug === "mobile-legends") {
      if (label === "86 Diamond") return "Terlaris";
      if (label === "706 Diamond") return "Best value";
    }
    return null;
  };

  const displayNominals = nominals.length > 0 ? nominals : [{ label: "5 Diamond", price: 1500 }];

  const nominalButtons = (list: NominalItem[], compact: boolean) => (
    <div className={`grid grid-cols-2 gap-3 ${compact ? "" : "lg:grid-cols-3"}`}>
      {list.map((n) => {
        const badge = badgeFor(n.label);
        return (
          <button
            key={n.label}
            type="button"
            className={`pkg relative overflow-hidden rounded-2xl text-left ${item === n.label ? "is-active" : ""}`}
            onClick={() => selectItem(n.label, n.price)}
          >
            {badge && (
              <span
                className={`flex items-center justify-center gap-1 py-1 text-[10px] font-extrabold uppercase tracking-[.14em] ${
                  badge === "Terlaris"
                    ? "bg-gradient-to-r from-[#ffc24b] to-[#ff8a2e] text-[#0a1024]"
                    : "bg-gradient-to-r from-[#6ea2ff] to-[#4c8dff] text-white"
                }`}
              >
                <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor">
                  <path d="M10 1.5 12.2 6l5 .6-3.7 3.4 1 4.9L10 12.2l-4.5 2.7 1-4.9L2.8 6.6l5-.6z" />
                </svg>
                {badge}
              </span>
            )}
            <div className={badge ? "p-3.5 pt-2.5" : "p-4"}>
              <p className={`display font-bold ${compact ? "text-base" : "text-lg"}`}>{n.label}</p>
              <p className={`mt-1 text-[var(--muted)] ${compact ? "text-xs" : "text-sm"}`}>{formatRupiah(n.price)}</p>
            </div>
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      {/* ============ DESKTOP (md+) ============ */}
      <div className="hidden md:block">
        <main className="mx-auto grid max-w-7xl gap-8 px-5 py-14 lg:grid-cols-[1.6fr_1fr]">
          <div>
            {/* STEP 1 */}
            <section className="card rounded-3xl p-7">
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#ffc24b] text-sm font-extrabold text-[#0a1024]">1</span>
                <h2 className="text-xl font-bold">Masukkan Data Akun</h2>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label htmlFor="uid" className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{userIdLabel}</label>
                  <input
                    id="uid"
                    type="text"
                    inputMode="numeric"
                    placeholder={userIdPlaceholder}
                    value={uid}
                    onChange={(e) => setUid(e.target.value)}
                    className="field mt-2 w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30"
                  />
                </div>
                {server && (
                  <div>
                    <label htmlFor="zid" className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{serverLabel}</label>
                    <input
                      id="zid"
                      type="text"
                      inputMode="numeric"
                      placeholder="contoh: 2001"
                      value={zid}
                      onChange={(e) => setZid(e.target.value)}
                      className="field mt-2 w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30"
                    />
                  </div>
                )}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-[var(--muted)]">{hint}</p>
            </section>

            {/* STEP 2 */}
            <section id="nominal" className="card mt-6 rounded-3xl p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[#ffc24b] text-sm font-extrabold text-[#0a1024]">2</span>
                  <h2 className="text-xl font-bold">Pilih Nominal {cur}</h2>
                </div>
                <span className="text-xs text-[var(--muted)]">Harga sudah final, tanpa biaya tambahan</span>
              </div>
              <div className="mt-6">{nominalButtons(displayNominals, false)}</div>

              {passes.length > 0 && (
                <>
                  <h3 className="mt-8 text-sm font-bold uppercase tracking-[.18em] text-[var(--muted)]">Paket Spesial</h3>
                  <div className="mt-4">{nominalButtons(passes, false)}</div>
                </>
              )}
            </section>
          </div>

          {/* RINGKASAN */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card rounded-3xl p-7">
              <h2 className="text-lg font-bold">Ringkasan Pesanan</h2>
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-[var(--muted)]">Produk</dt><dd className="text-right font-semibold">{gameName}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-[var(--muted)]">{userIdLabel}</dt><dd className={`text-right font-semibold ${uidOut ? "text-white" : "text-white/50"}`}>{uidDisplay}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-[var(--muted)]">Nominal</dt><dd className={`text-right font-semibold ${item ? "text-white" : "text-white/50"}`}>{item ?? "Belum dipilih"}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-[var(--muted)]">Pembayaran</dt><dd className="text-right font-semibold text-white">QRIS</dd></div>
              </dl>
              <div className="mt-6 border-t border-white/10 pt-5">
                <div className="flex items-end justify-between">
                  <span className="text-sm text-[var(--muted)]">Total bayar</span>
                  <span className="display text-3xl font-extrabold grad">{formatRupiah(price)}</span>
                </div>
                <p className="mt-2 text-xs text-[var(--muted)]">Sudah termasuk semua biaya. Tidak ada tambahan saat checkout.</p>
              </div>
              <button
                type="button"
                onClick={handlePay}
                className="btn-primary mt-6 block w-full rounded-full px-6 py-4 text-center text-sm font-bold text-[#0a1024]"
              >
                Lanjut ke Pembayaran
              </button>
              <p className="mt-4 text-center text-[11px] leading-relaxed text-[var(--muted)]">Pastikan {userIdLabel.toLowerCase()} sudah benar. Item yang terkirim ke ID lain tidak bisa ditarik kembali.</p>
            </div>

            <div className="card mt-5 rounded-3xl p-7">
              <h3 className="text-sm font-bold uppercase tracking-[.18em] text-[var(--muted)]">Jaminan Kami</h3>
              <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
                <li className="flex gap-3"><svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--cyan)]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m4 10.5 4 4 8-9"></path></svg> Tanpa password, OTP, atau login akun</li>
                <li className="flex gap-3"><svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--cyan)]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m4 10.5 4 4 8-9"></path></svg> Pengiriman otomatis rata-rata &lt; 60 detik</li>
                <li className="flex gap-3"><svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--cyan)]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m4 10.5 4 4 8-9"></path></svg> Harga final, tanpa biaya tersembunyi</li>
                <li className="flex gap-3"><svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--cyan)]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m4 10.5 4 4 8-9"></path></svg> Support siap bantu kalau ada kendala</li>
              </ul>
            </div>
          </aside>
        </main>
      </div>

      {/* ============ MOBILE (<md) — gaya orange-food-details ============ */}
      <div className="md:hidden pb-28">
        {/* HERO + FLOATING BACK */}
        <section className="relative overflow-hidden rounded-b-[40px] border-b border-white/10">
          <div className="glow -left-16 -top-10 h-56 w-56 bg-[#ff6a2c] opacity-40"></div>
          <div className="glow -right-20 top-24 h-64 w-64 bg-[#4c8dff] opacity-30"></div>
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 30%, rgba(255,138,46,.18), rgba(10,16,36,0) 70%)" }}></div>

          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Kembali"
            className="absolute left-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/10 text-white shadow-lg backdrop-blur-md transition active:scale-95"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5m6-7-7 7 7 7" /></svg>
          </button>

          <div className="relative px-5 pb-7 pt-16 text-center">
            <div className="relative mx-auto grid h-24 w-24 place-items-center overflow-hidden rounded-[24px] border-2 border-white/10 bg-[radial-gradient(circle_at_50%_35%,rgba(255,138,46,.25),rgba(255,255,255,.04))] shadow-2xl">
              {gameLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={gameLogo} alt={gameAlt ?? gameName} className="h-full w-full object-contain" />
              ) : (
                <span className="display text-3xl font-extrabold text-[var(--cyan)]">{gameName.charAt(0)}</span>
              )}
            </div>
            <h1 className="mt-4 text-2xl font-extrabold leading-tight">
              Top Up <span className="grad">{gameName}</span>
            </h1>
            <p className="mx-auto mt-2 max-w-[300px] text-xs leading-relaxed text-[var(--muted)]">
              {hint ? hint.split("—")[0].trim() : `Isi ${userIdLabel.toLowerCase()}, pilih nominal, bayar pakai QRIS.`}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span> Stok tersedia
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ffc24b]/25 bg-[#ffc24b]/10 px-3 py-1 text-[10px] font-bold text-[#ffc24b]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ffc24b]"></span> Proses otomatis
              </span>
            </div>
          </div>
        </section>

        {/* META BADGES */}
        <div className="mx-auto mt-5 flex max-w-md items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[.04] px-4 py-3">
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--muted)]">
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 text-[#ff6a2c]" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="10" cy="10" r="7.5"></circle><path d="M10 5.5V10l3 2" strokeLinecap="round"></path></svg>
            &lt; 60 detik
          </span>
          <span className="h-3 w-px bg-white/15"></span>
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--muted)]">
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 text-[#ff6a2c]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 2.5 16 5v4.5c0 4-2.6 6.6-6 7.5-3.4-.9-6-3.5-6-7.5V5z" strokeLinejoin="round"></path></svg>
            Tanpa password
          </span>
          <span className="h-3 w-px bg-white/15"></span>
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--muted)]">
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 text-[#ff6a2c]" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2.5" y="4.5" width="15" height="11" rx="2.5"></rect><path d="M2.5 8h15"></path></svg>
            QRIS
          </span>
        </div>

        {/* STEP 1 — DATA AKUN */}
        <section className="mx-auto mt-6 max-w-md px-5">
          <div className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#ffc24b] text-xs font-extrabold text-[#0a1024]">1</span>
            <h2 className="text-base font-bold">Masukkan {userIdLabel}</h2>
          </div>
          <div className="card mt-4 rounded-2xl p-4">
            <div className="grid gap-3">
              <div>
                <label htmlFor="uid-m" className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">{userIdLabel}</label>
                <input
                  id="uid-m"
                  type="text"
                  inputMode="numeric"
                  placeholder={userIdPlaceholder}
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  className="field mt-1.5 w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30"
                />
              </div>
              {server && (
                <div>
                  <label htmlFor="zid-m" className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">{serverLabel}</label>
                  <input
                    id="zid-m"
                    type="text"
                    inputMode="numeric"
                    placeholder="contoh: 2001"
                    value={zid}
                    onChange={(e) => setZid(e.target.value)}
                    className="field mt-1.5 w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30"
                  />
                </div>
              )}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-[var(--muted)]">{hint}</p>
          </div>
        </section>

        {/* STEP 2 — NOMINAL 2x2 */}
        <section id="nominal" className="mx-auto mt-6 max-w-md px-5">
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#ffc24b] text-xs font-extrabold text-[#0a1024]">2</span>
              <h2 className="text-base font-bold">Pilih Nominal {cur}</h2>
            </div>
            <span className="text-[10px] text-[var(--muted)]">Harga final</span>
          </div>
          <div className="mt-4">{nominalButtons(displayNominals, true)}</div>

          {passes.length > 0 && (
            <>
              <h3 className="mt-7 text-xs font-bold uppercase tracking-[.18em] text-[var(--muted)]">Paket Spesial</h3>
              <div className="mt-3">{nominalButtons(passes, true)}</div>
            </>
          )}
        </section>
      </div>

      {/* MOBILE STICKY CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0a1024]/92 px-5 py-3.5 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-md items-center gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Total bayar</p>
            <p className="display truncate text-xl font-extrabold grad">{price > 0 ? formatRupiah(price) : "—"}</p>
          </div>
          <button
            type="button"
            onClick={handlePay}
            className="btn-primary flex-1 rounded-full px-6 py-4 text-sm font-bold text-[#0a1024]"
          >
            Lanjut ke Pembayaran
          </button>
        </div>
      </div>

      {checkoutOpen && (
        <CheckoutOverlay
          order={{
            game: gameName,
            userId: uidDisplay,
            nominalLabel: item ?? "",
            price,
            total: price,
            orderId,
            qrisUrl,
          }}
          onClose={() => setCheckoutOpen(false)}
        />
      )}
    </>
  );
}
