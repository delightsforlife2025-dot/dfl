import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

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

function normalizeItemData(raw: any, existingId?: string) {
  if (!raw?.title) {
    throw new Error("Ürün adı gereklidir");
  }

  if (!raw?.price && raw?.price !== 0) {
    throw new Error("Fiyat gereklidir");
  }

  const priceNumber = Number(raw.price);
  if (Number.isNaN(priceNumber) || priceNumber < 0) {
    throw new Error("Geçerli bir fiyat giriniz");
  }

  const baseSlug = raw.slug ? raw.slug : generateSlug(raw.title);

  return {
    title: raw.title,
    slug: baseSlug,
    category_id: raw.category_id || null,
    description: raw.description || null,
    price: priceNumber,
    image_url: raw.image_url || null,
    images: raw.images && Array.isArray(raw.images) && raw.images.length > 0 ? raw.images : null,
    youtube_url: raw.youtube_url || null,
    ingredients:
      raw.ingredients && Array.isArray(raw.ingredients)
        ? raw.ingredients
        : raw.ingredients
        ? String(raw.ingredients)
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [],
    allergens:
      raw.allergens && Array.isArray(raw.allergens)
        ? raw.allergens
        : raw.allergens
        ? String(raw.allergens)
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [],
    tags:
      raw.tags && Array.isArray(raw.tags)
        ? raw.tags
        : raw.tags
        ? String(raw.tags)
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [],
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
  } catch (error: any) {
    console.error("POST /api/dashboard/menu error:", error);
    return NextResponse.json({ error: error.message || "Bir hata oluştu" }, { status: 400 });
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
  } catch (error: any) {
    console.error("PUT /api/dashboard/menu error:", error);
    return NextResponse.json({ error: error.message || "Bir hata oluştu" }, { status: 400 });
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
  } catch (error: any) {
    console.error("PATCH /api/dashboard/menu error:", error);
    return NextResponse.json({ error: error.message || "Bir hata oluştu" }, { status: 400 });
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
  } catch (error: any) {
    console.error("DELETE /api/dashboard/menu error:", error);
    return NextResponse.json({ error: error.message || "Bir hata oluştu" }, { status: 400 });
  }
}

