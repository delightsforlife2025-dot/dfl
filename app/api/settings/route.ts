import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";
import { errorMessage } from "@/lib/errorMessage";
import { normalizeSiteSettingValue } from "@/lib/normalizeSiteSettingValue";

export const runtime = "nodejs";

function isAdmin(request: NextRequest): boolean {
  return request.cookies.get("admin_token")?.value === "authenticated";
}

function serviceRoleNotConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return (
    !url.trim() ||
    !key.trim() ||
    url.includes("build-placeholder") ||
    key.includes("build-placeholder")
  );
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json({ error: "Oturum gerekli. Yeniden giriş yapın." }, { status: 401 });
    }

    if (serviceRoleNotConfigured()) {
      return NextResponse.json(
        {
          error:
            "Sunucu yapılandırması eksik: Vercel / .env içinde gerçek NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY (service_role) ayarlayın. Placeholder değerlerle kayıt yapılamaz.",
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { key, value } = body as { key?: string; value?: unknown };

    if (!key || typeof key !== "string" || value === undefined) {
      return NextResponse.json({ error: "key and value are required" }, { status: 400 });
    }

    const normalized = normalizeSiteSettingValue(key, value);

    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .upsert(
        { key, value: normalized, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      )
      .select("key")
      .maybeSingle();

    if (error) {
      console.error("Supabase settings upsert:", error);
      const hint =
        error.code === "42501" || /permission|rls|policy/i.test(error.message ?? "")
          ? " Tablo izinleri: Supabase’de site_settings için service_role ile yazma engelleniyor olabilir; RLS politikalarını ve SUPABASE_SERVICE_ROLE_KEY değerini kontrol edin."
          : "";
      return NextResponse.json(
        { error: (error.message || "Ayarlar kaydedilemedi.") + hint },
        { status: 500 }
      );
    }

    if (!data?.key) {
      return NextResponse.json(
        { error: "Kayıt doğrulanamadı. Supabase bağlantısını ve site_settings tablosunu kontrol edin." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Settings saved successfully" }, { status: 200 });
  } catch (error: unknown) {
    console.error("Settings API error:", error);
    return NextResponse.json(
      { error: errorMessage(error, "Internal server error") },
      { status: 500 }
    );
  }
}

