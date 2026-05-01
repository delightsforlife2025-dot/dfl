import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";
import { errorMessage } from "@/lib/errorMessage";

function isAuthenticated(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  return token === "authenticated";
}

/** ASCII slug; handles Turkish letters; never returns empty */
function slugify(name: string): string {
  const map: Record<string, string> = {
    ç: "c",
    Ç: "c",
    ğ: "g",
    Ğ: "g",
    ı: "i",
    İ: "i",
    i: "i",
    ö: "o",
    Ö: "o",
    ş: "s",
    Ş: "s",
    ü: "u",
    Ü: "u",
  };
  let s = name.trim();
  for (const [k, v] of Object.entries(map)) {
    s = s.split(k).join(v);
  }
  const base = s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return base || `kategori-${Date.now()}`;
}

/** Reserve `slug` for optional row `exceptId` (used on update so the same row can keep its slug). */
async function uniqueSlugExcept(preferred: string, exceptId?: string): Promise<string> {
  let slug = preferred;
  let n = 0;
  for (;;) {
    const { data } = await supabaseAdmin.from("menu_categories").select("id").eq("slug", slug).maybeSingle();
    if (!data) return slug;
    if (exceptId && data.id === exceptId) return slug;
    n += 1;
    slug = `${preferred}-${n}`;
  }
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("menu_categories")
      .select("*")
      .order("position", { ascending: true });

    if (error) throw new Error(error.message);
    return NextResponse.json({ categories: data ?? [] });
  } catch (e: unknown) {
    console.error("GET /api/dashboard/categories:", e);
    return NextResponse.json({ error: errorMessage(e) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = String(body.name ?? "").trim();
    if (!name) {
      return NextResponse.json({ error: "Kategori adı gereklidir" }, { status: 400 });
    }

    const rawSlug = typeof body.slug === "string" && body.slug.trim() ? body.slug.trim() : name;
    const slug = await uniqueSlugExcept(slugify(rawSlug));

    const { data: maxRow } = await supabaseAdmin
      .from("menu_categories")
      .select("position")
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();
    const position = typeof maxRow?.position === "number" ? maxRow.position + 10 : 0;

    const row = {
      name,
      slug,
      description: body.description != null && String(body.description).trim() ? String(body.description) : null,
      image_url: body.image_url != null && String(body.image_url).trim() ? String(body.image_url) : null,
      visible: body.visible !== false,
      position,
    };

    const { data, error } = await supabaseAdmin.from("menu_categories").insert([row]).select().single();

    if (error) throw new Error(error.message);
    return NextResponse.json({ category: data }, { status: 201 });
  } catch (e: unknown) {
    console.error("POST /api/dashboard/categories:", e);
    return NextResponse.json({ error: errorMessage(e) }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const id = String(body.id ?? "").trim();
    if (!id) {
      return NextResponse.json({ error: "Kategori id gerekli" }, { status: 400 });
    }

    const name = String(body.name ?? "").trim();
    if (!name) {
      return NextResponse.json({ error: "Kategori adı gereklidir" }, { status: 400 });
    }

    const rawSlug = typeof body.slug === "string" && body.slug.trim() ? body.slug.trim() : name;
    const slug = await uniqueSlugExcept(slugify(rawSlug), id);

    const update = {
      name,
      slug,
      description: body.description != null && String(body.description).trim() ? String(body.description) : null,
      image_url: body.image_url != null && String(body.image_url).trim() ? String(body.image_url) : null,
      visible: body.visible !== false,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin.from("menu_categories").update(update).eq("id", id).select().single();

    if (error) throw new Error(error.message);
    return NextResponse.json({ category: data });
  } catch (e: unknown) {
    console.error("PUT /api/dashboard/categories:", e);
    return NextResponse.json({ error: errorMessage(e) }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const id = String(body.id ?? "").trim();
    if (!id) {
      return NextResponse.json({ error: "Kategori id gerekli" }, { status: 400 });
    }

    if (body.visible === undefined) {
      return NextResponse.json({ error: "visible alanı gerekli" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("menu_categories")
      .update({ visible: Boolean(body.visible), updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return NextResponse.json({ category: data });
  } catch (e: unknown) {
    console.error("PATCH /api/dashboard/categories:", e);
    return NextResponse.json({ error: errorMessage(e) }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const id = request.nextUrl.searchParams.get("id")?.trim();
    if (!id) {
      return NextResponse.json({ error: "id gerekli" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("menu_categories").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    console.error("DELETE /api/dashboard/categories:", e);
    return NextResponse.json({ error: errorMessage(e) }, { status: 400 });
  }
}
