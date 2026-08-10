"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatRupiah } from "@/lib/format";

export interface CheckoutOrder {
  game: string;
  userId: string;
  nominalLabel: string;
  price: number;
  total: number;
  orderId: string;
  qrisUrl?: string;
  waNumber?: string;
}

interface CheckoutOverlayProps {
  order: CheckoutOrder;
  onClose: () => void;
}

type Step = "pay" | "done";

const PAYMENT_SECONDS = 15 * 60;

export function CheckoutOverlay({ order, onClose }: CheckoutOverlayProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("pay");
  const [deliverMsg, setDeliverMsg] = useState("Mengirim item… estimasi < 60 detik");
  const [secondsLeft, setSecondsLeft] = useState(PAYMENT_SECONDS);

  useEffect(() => {
    if (step !== "pay") return;
    const t = window.setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => window.clearInterval(t);
  }, [step]);

  useEffect(() => {
    if (step === "pay" && secondsLeft <= 0) {
      setStep("done");
      setDeliverMsg("Mengirim item… estimasi < 60 detik");
      window.setTimeout(() => setDeliverMsg("Item sedang diproses. Cek game dalam beberapa detik."), 3200);
    }
  }, [secondsLeft, step]);

  useEffect(() => {
    if (step !== "pay") return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [step, onClose]);

  useEffect(() => {
    if (step === "pay") {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [step]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const fraction = secondsLeft / PAYMENT_SECONDS;
  const RADIUS = 30;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const timerColor = secondsLeft <= 60 ? "#f87171" : "#34d399";

  const waDigits = (order.waNumber ?? "").replace(/^0/, "62").replace(/[^0-9]/g, "");
  const waMessage = encodeURIComponent(
    `Halo, saya ingin konfirmasi pembayaran.\n\nOrder ID: ${order.orderId}\nGame: ${order.game}\nUser ID: ${order.userId}\nPaket: ${order.nominalLabel}\nTotal: ${formatRupiah(order.total)}`
  );
  const waUrl = waDigits ? `https://wa.me/${waDigits}?text=${waMessage}` : "";

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center p-5" style={{ background: "rgba(4,8,22,.7)" }}>
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative max-w-[400px] md:max-w-[440px] w-full max-h-[calc(100dvh-2.5rem)] overflow-y-auto overscroll-contain p-7 text-center border border-white/10 shadow-2xl rounded-[28px] card">
        {step === "pay" && (
          <div>
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="text-left">
                <p className="text-[11px] uppercase tracking-[.15em] text-[var(--muted)]">Pembayaran</p>
                <h3 className="display mt-1 text-xl font-extrabold">Scan QRIS</h3>
              </div>
              <button type="button" onClick={onClose} className="text-[var(--muted)] hover:text-white text-xl leading-none">&times;</button>
            </div>

            <div className="flex items-center gap-3 rounded-2xl px-4 py-3 bg-white/[.04] border border-white/10">
              <div className="flex-1 text-left">
                <p className="text-[11px] text-[var(--muted)] uppercase tracking-[.15em]">Scan dengan e-wallet / m-banking</p>
                <p className="display text-sm font-bold mt-0.5">Satu QR untuk semua pembayaran</p>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="relative grid h-[52px] w-[52px] place-items-center">
                  <svg width="52" height="52" viewBox="0 0 72 72" className="-rotate-90">
                    <circle cx="36" cy="36" r={RADIUS} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="5" />
                    <circle
                      cx="36"
                      cy="36"
                      r={RADIUS}
                      fill="none"
                      stroke={timerColor}
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray={CIRCUMFERENCE}
                      strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
                      style={{ transition: "stroke-dashoffset 1s linear, stroke .3s" }}
                    />
                  </svg>
                  <span className="absolute font-mono text-[13px] font-bold tabular-nums" style={{ color: timerColor }}>
                    {mm}:{ss}
                  </span>
                </div>
                <span className="flex items-center gap-2 text-[11px] text-emerald-400"><span className="pulse-dot" /> Menunggu</span>
              </div>
            </div>

            <div className="mt-5 qr-frame">
              <div className="flex items-center gap-2 self-start">
                <span className="display text-[13px] font-extrabold tracking-tight text-[#0b0b0c]">QRIS</span>
                <span className="text-[9px] text-[#0b0b0c]/50 uppercase tracking-[.18em]">PIXOGAMEONLINE</span>
              </div>
              {order.qrisUrl ? (
                <div className="flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={order.qrisUrl} alt="QRIS PIXOGAMEONLINE" width={190} height={190} style={{ width: "min(58vw, 190px)", height: "auto", borderRadius: 6, objectFit: "contain" }} />
                </div>
              ) : (
                <div className="grid h-[190px] w-[190px] place-items-center rounded-md bg-[#f4f4f2]">
                  <p className="text-xs font-semibold text-[#0b0b0c]/45 max-w-[120px]">QRIS belum diatur admin. Hubungi admin untuk pembayaran manual.</p>
                </div>
              )}
              <p className="text-[10px] text-[#0b0b0c]/55 pb-1 text-center">Satu QR untuk semua e-wallet &amp; m-banking</p>
            </div>

            <div className="mt-5 space-y-2.5 text-sm text-left">
              <div className="flex justify-between"><span className="text-[var(--muted)]">Game</span><span className="font-semibold text-white">{order.game}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted)]">User ID</span><span className="font-semibold text-white">{order.userId}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted)]">Paket</span><span className="font-semibold text-white">{order.nominalLabel} · {formatRupiah(order.price)}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted)]">Order ID</span><span className="text-xs font-mono text-[var(--muted)]">{order.orderId}</span></div>
              <div className="border-t border-white/10 pt-3 flex justify-between items-center"><span className="text-[var(--muted)]">Total</span><span className="display text-xl font-extrabold grad">{formatRupiah(order.total)}</span></div>
            </div>

            <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/[.06] p-4 text-left md:flex md:items-center md:gap-4">
              <div className="hidden md:block shrink-0">
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-emerald-400">Sudah bayar tapi item belum masuk?</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-[var(--muted)]">
                  Klik tombol di bawah untuk konfirmasi pembayaran via WhatsApp ke admin.
                </p>
              </div>
              {waUrl ? (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 md:mt-0 flex shrink-0 items-center justify-center gap-2 w-full md:w-auto rounded-xl bg-emerald-400/15 px-4 md:px-5 py-2.5 text-xs font-bold text-emerald-400 transition hover:bg-emerald-400/25"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                    <path d="M12 2a10 10 0 00-8.5 15.3L2 22l4.9-1.4A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-2.9.8.8-2.8-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.3-.4 0-.5.2-.7l.4-.5c.1-.2.1-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.5-.4h-.5a1 1 0 00-.7.3c-.2.2-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.7 4.3 3.8 1.6.7 2.2.8 3 .6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.5-.3z" />
                  </svg>
                  Konfirmasi Pembayaran
                </a>
              ) : (
                <p className="mt-2 md:mt-0 md:max-w-[190px] shrink-0 text-[11px] text-[var(--muted)]">Nomor WhatsApp belum diatur admin. Hubungi admin untuk bantuan.</p>
              )}
            </div>

            <button type="button" onClick={onClose} className="w-full text-xs text-[var(--muted)] hover:text-white transition mt-3">
              Batalkan pesanan
            </button>
          </div>
        )}

        {step === "done" && (
          <div className="py-2">
            <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center bg-emerald-400/10 border border-emerald-400/35">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            </div>
            <h3 className="display mt-6 text-2xl font-extrabold">Pembayaran berhasil</h3>
            <p className="text-[var(--muted)] text-sm mt-2">Terima kasih! Item sedang dikirim ke akunmu.</p>
            <div className="mt-6 rounded-2xl p-4 text-left space-y-2.5 text-sm bg-white/[.04] border border-white/10">
              <div className="flex justify-between"><span className="text-[var(--muted)]">Order ID</span><span className="text-xs font-mono text-[var(--muted)]">{order.orderId}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted)]">Game</span><span className="font-semibold text-white">{order.game}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted)]">User ID</span><span className="font-semibold text-white">{order.userId}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted)]">Paket</span><span className="font-semibold text-white">{order.nominalLabel}</span></div>
              <div className="border-t border-white/10 pt-2.5 flex justify-between"><span className="text-[var(--muted)]">Dibayar</span><span className="grad display font-extrabold">{formatRupiah(order.total)}</span></div>
            </div>
            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-emerald-400"><span className="pulse-dot" /> {deliverMsg}</div>
            <button type="button" onClick={() => router.push("/")} className="btn-primary w-full mt-5 rounded-full px-6 py-4 text-sm font-bold text-[#0a1024]">
              Kembali ke Beranda
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
