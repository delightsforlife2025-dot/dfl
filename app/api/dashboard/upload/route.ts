import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";
import { errorMessage } from "@/lib/errorMessage";

const MAX_BYTES = 5 * 1024 * 1024;
const DEFAULT_BUCKET = "menu-images";

function isAuthenticated(request: NextRequest) {
  return request.cookies.get("admin_token")?.value === "authenticated";
}

function sanitizeBucket(raw: string | null): string {
  const b = (raw || DEFAULT_BUCKET).trim();
  if (!/^[a-z0-9-]+$/.test(b)) {
    return DEFAULT_BUCKET;
  }
  return b;
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const bucket = sanitizeBucket(typeof formData.get("bucket") === "string" ? (formData.get("bucket") as string) : null);

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "Geçerli bir dosya gerekli" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Sadece resim dosyaları yüklenebilir" }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Dosya en fazla 5 MB olabilir" }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeExt = /^[a-z0-9]+$/.test(ext) ? ext : "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 12)}.${safeExt}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabaseAdmin.storage.from(bucket).upload(path, buffer, {
      contentType: file.type || "application/octet-stream",
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      console.error("Storage upload error:", error);
      return NextResponse.json(
        {
          error:
            error.message ||
            "Yükleme başarısız. Supabase Storage’da bucket oluşturuldu mu? (ör. menu-images, herkese açık okuma)",
        },
        { status: 400 }
      );
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);

    return NextResponse.json({ url: publicUrl, path, bucket });
  } catch (e: unknown) {
    console.error("POST /api/dashboard/upload:", e);
    return NextResponse.json({ error: errorMessage(e) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const bucket = sanitizeBucket(request.nextUrl.searchParams.get("bucket"));
    const path = request.nextUrl.searchParams.get("path")?.trim();
    if (!path) {
      return NextResponse.json({ error: "path gerekli" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.storage.from(bucket).remove([path]);
    if (error) {
      console.error("Storage delete error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    console.error("DELETE /api/dashboard/upload:", e);
    return NextResponse.json({ error: errorMessage(e) }, { status: 500 });
  }
}
