import { createSupabaseServerClient } from "@/lib/supabase-server";
import { QrisManager } from "./QrisManager";

export default async function AdminQrisPage() {
  let currentUrl = "";
  let waNumber = "";

  try {
    const supabase = await createSupabaseServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: setting } = await (supabase.from("settings") as any)
      .select("value")
      .eq("key", "qris_image_url")
      .single();

    if (setting && setting.value) {
      currentUrl = String(setting.value);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: waSetting } = await (supabase.from("settings") as any)
      .select("value")
      .eq("key", "wa_number")
      .single();

    if (waSetting && waSetting.value) {
      waNumber = String(waSetting.value);
    }
  } catch (e) {
    console.error("QRIS fetch error:", e);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="display text-xl font-extrabold text-ink">Kelola QRIS & Konfirmasi</h1>
        <p className="mt-1 text-sm text-muted">Atur gambar QRIS dan nomor WhatsApp untuk konfirmasi pembayaran</p>
      </div>

      <div className="max-w-lg">
        <QrisManager currentUrl={currentUrl} waNumber={waNumber} />
      </div>
    </div>
  );
}
