import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";
import { errorMessage } from "@/lib/errorMessage";

function isAuthenticated(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  return token === "authenticated";
}

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function normalizeItemData(raw: unknown, existingId?: string) {
  if (!isRecord(raw)) {
    throw new Error("Geçersiz veri");
  }

  const titleVal = raw.title;
  if (titleVal == null || String(titleVal).trim() === "") {
    throw new Error("Ürün adı gereklidir");
  }

  const title = String(titleVal).trim();
  const priceVal = raw.price;
  if (priceVal === undefined || priceVal === null) {
    throw new Error("Fiyat gereklidir");
  }

  const priceNumber = Number(priceVal);
  if (Number.isNaN(priceNumber) || priceNumber < 0) {
    throw new Error("Geçerli bir fiyat giriniz");
  }

  const slugVal = raw.slug;
  const baseSlug = typeof slugVal === "string" && slugVal.trim() ? slugVal.trim() : generateSlug(title);

  const imagesVal = raw.images;
  const images =
    Array.isArray(imagesVal) && imagesVal.length > 0 ? (imagesVal as string[]) : null;

  const splitList = (v: unknown): string[] => {
    if (Array.isArray(v)) return v.map((s) => String(s).trim()).filter(Boolean);
    if (v != null && String(v).trim()) {
      return String(v)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  };

  return {
    title,
    slug: baseSlug,
    category_id: (raw.category_id as string | null | undefined) || null,
    description: raw.description != null ? String(raw.description) : null,
    price: priceNumber,
    image_url: raw.image_url != null ? String(raw.image_url) : null,
    images,
    youtube_url: raw.youtube_url != null ? String(raw.youtube_url) : null,
    ingredients: splitList(raw.ingredients),
    allergens: splitList(raw.allergens),
    tags: splitList(raw.tags),
    is_available: raw.is_available !== undefined ? Boolean(raw.is_available) : true,
    is_featured: raw.is_featured !== undefined ? Boolean(raw.is_featured) : false,
    updated_at: new Date().toISOString(),
    ...(existingId ? {} : { created_at: new Date().toISOString() }),
  };
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const itemData = normalizeItemData(body);

    const { data, error } = await supabaseAdmin.from("menu_items").insert([itemData]).select().single();

    if (error) {
      console.error("Menu insert error:", error);
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true, item: data }, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/dashboard/menu error:", error);
    return NextResponse.json({ error: errorMessage(error) }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...rest } = body || {};

    if (!id) {
      throw new Error("Ürün ID gereklidir");
    }

    const itemData = normalizeItemData(rest, id);

    const { data, error } = await supabaseAdmin
      .from("menu_items")
      .update(itemData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Menu update error:", error);
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true, item: data }, { status: 200 });
  } catch (error: unknown) {
    console.error("PUT /api/dashboard/menu error:", error);
    return NextResponse.json({ error: errorMessage(error) }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, data: updateData } = body || {};

    if (!id) {
      throw new Error("Ürün ID gereklidir");
    }

    if (!updateData || typeof updateData !== "object") {
      throw new Error("Geçersiz güncelleme verisi");
    }

    const { data, error } = await supabaseAdmin
      .from("menu_items")
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Menu patch error:", error);
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true, item: data }, { status: 200 });
  } catch (error: unknown) {
    console.error("PATCH /api/dashboard/menu error:", error);
    return NextResponse.json({ error: errorMessage(error) }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const { id } = (await request.json()) || {};

    if (!id) {
      throw new Error("Ürün ID gereklidir");
    }

    const { error } = await supabaseAdmin.from("menu_items").delete().eq("id", id);

    if (error) {
      console.error("Menu delete error:", error);
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    console.error("DELETE /api/dashboard/menu error:", error);
    return NextResponse.json({ error: errorMessage(error) }, { status: 400 });
  }
}

