"use client";

import { useState } from "react";
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
}: GameOrderFormProps) {
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

  return (
    <>
      {/* KONTEN */}
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

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {displayNominals.map((n) => {
                const badge = badgeFor(n.label);
                return (
                  <button
                    key={n.label}
                    type="button"
                    className={`pkg relative rounded-2xl p-4 text-left ${item === n.label ? "is-active" : ""}`}
                    onClick={() => selectItem(n.label, n.price)}
                  >
                    {badge && (
                      <span className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-bold ${badge === "Terlaris" ? "bg-[#ff6a2c]/25 text-[#ffc24b]" : "bg-[#4c8dff]/25 text-[#9dc0ff]"}`}>{badge}</span>
                    )}
                    <p className="display text-lg font-bold">{n.label}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{formatRupiah(n.price)}</p>
                  </button>
                );
              })}
            </div>

            {passes.length > 0 && (
              <>
                <h3 className="mt-8 text-sm font-bold uppercase tracking-[.18em] text-[var(--muted)]">Paket Spesial</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {passes.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      className={`pkg rounded-2xl p-4 text-left ${item === p.label ? "is-active" : ""}`}
                      onClick={() => selectItem(p.label, p.price)}
                    >
                      <p className="display text-base font-bold">{p.label}</p>
                      <p className="mt-1 text-sm text-[var(--muted)]">{formatRupiah(p.price)}</p>
                    </button>
                  ))}
                </div>
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
