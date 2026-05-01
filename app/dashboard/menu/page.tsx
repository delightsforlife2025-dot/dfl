"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { MenuItem, MenuCategory } from "@/lib/types";
import ImageUpload from "@/app/components/ImageUpload";
import DashboardSidebar from "@/app/components/DashboardSidebar";

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    description: "",
    price: "",
    image_url: "",
    images: [] as string[],
    youtube_url: "",
    ingredients: "",
    allergens: "",
    tags: "",
    is_available: true,
    is_featured: false,
  });

  useEffect(() => {
    fetchData();
  }, [filterCategory]);

  async function fetchData() {
    setLoading(true);
    try {
      const catRes = await fetch("/api/dashboard/categories", { credentials: "include" });
      const catJson = (await catRes.json()) as { categories?: MenuCategory[] };
      setCategories(catRes.ok ? catJson.categories ?? [] : []);

      // Fetch menu items
      let query = supabase
        .from("menu_items")
        .select("*")
        .order("position", { ascending: true });

      if (filterCategory !== "all") {
        query = query.eq("category_id", filterCategory);
      }

      const { data: itemsData } = await query;
      setMenuItems(itemsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  function openModal(item?: MenuItem) {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        category_id: item.category_id || "",
        description: item.description || "",
        price: item.price.toString(),
        image_url: item.image_url || "",
        images: item.images || [],
        youtube_url: item.youtube_url || "",
        ingredients: item.ingredients?.join(", ") || "",
        allergens: item.allergens?.join(", ") || "",
        tags: item.tags?.join(", ") || "",
        is_available: item.is_available,
        is_featured: item.is_featured,
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: "",
        category_id: "",
        description: "",
        price: "",
        image_url: "",
        images: [],
        youtube_url: "",
        ingredients: "",
        allergens: "",
        tags: "",
        is_available: true,
        is_featured: false,
      });
    }
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const itemData = {
      title: formData.title,
      slug: formData.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      category_id: formData.category_id || null,
      description: formData.description,
      price: parseFloat(formData.price),
      image_url: formData.image_url || null,
      images: formData.images.length > 0 ? formData.images : null,
      youtube_url: formData.youtube_url || null,
      ingredients: formData.ingredients ? formData.ingredients.split(",").map((s) => s.trim()) : [],
      allergens: formData.allergens ? formData.allergens.split(",").map((s) => s.trim()) : [],
      tags: formData.tags ? formData.tags.split(",").map((s) => s.trim()) : [],
      is_available: formData.is_available,
      is_featured: formData.is_featured,
    };

    try {
      const response = await fetch("/api/dashboard/menu", {
        method: editingItem ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          editingItem
            ? {
                id: editingItem.id,
                ...itemData,
              }
            : itemData
        ),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Bir hata oluştu");
      }

      setShowModal(false);
      fetchData();
    } catch (error: unknown) {
      console.error("Error saving item:", error);
      alert("Hata: " + (error instanceof Error ? error.message : "Bilinmeyen hata"));
    }
  }

  async function deleteItem(id: string) {
    if (!confirm("Bu ürünü silmek istediğinizden emin misiniz?")) return;

    try {
      const response = await fetch("/api/dashboard/menu", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Bir hata oluştu");
      }

      fetchData();
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Hata: Ürün silinemedi.");
    }
  }

  async function toggleAvailability(id: string, isAvailable: boolean) {
    try {
      const response = await fetch("/api/dashboard/menu", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          data: { is_available: !isAvailable },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Bir hata oluştu");
      }

      fetchData();
    } catch (error) {
      console.error("Error updating availability:", error);
      alert("Hata: Stok durumu güncellenemedi.");
    }
  }

  function getCategoryName(categoryId?: string) {
    if (!categoryId) return "Kategorisiz";
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "Kategorisiz";
  }

  return (
    <div className="font-display bg-background-light min-h-screen">
      <div className="flex">
        <DashboardSidebar activePage="menu" />

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 lg:p-10">
          <div className="mx-auto max-w-6xl">
            {/* Page Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
              <div>
                <h1 className="text-text-light text-4xl font-black leading-tight tracking-[-0.033em]">
                  Menü Yönetimi
                </h1>
                <p className="text-subtle-light mt-2">
                  Menü öğelerinizi ekleyin, düzenleyin veya silin
                </p>
              </div>
              <button
                onClick={() => openModal()}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary/90"
              >
                <span className="material-symbols-outlined">add</span>
                Yeni Ürün Ekle
              </button>
            </div>

            {/* Filter by Category */}
            <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setFilterCategory("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filterCategory === "all"
                    ? "bg-primary text-white"
                    : "border border-border-light bg-white/95 text-text-light hover:bg-primary/10"
                }`}
              >
                Tümü ({menuItems.length})
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setFilterCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    filterCategory === category.id
                      ? "bg-primary text-white"
                      : "border border-border-light bg-white/95 text-text-light hover:bg-primary/10"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Menu Items Grid */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-subtle-light">Yükleniyor...</p>
              </div>
            ) : menuItems.length === 0 ? (
              <div className="rounded-xl border border-border-light bg-white/95 py-12 text-center shadow-sm ring-1 ring-black/[0.04]">
                <span className="material-symbols-outlined text-subtle-light text-5xl mb-4">
                  restaurant_menu
                </span>
                <p className="text-subtle-light">Henüz ürün eklenmemiş</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-xl border border-border-light bg-white/95 shadow-sm ring-1 ring-black/[0.04]"
                  >
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-border-light flex items-center justify-center">
                        <span className="material-symbols-outlined text-subtle-light text-5xl">
                          restaurant
                        </span>
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-text-light text-lg font-bold">{item.title}</h3>
                          <p className="text-subtle-light text-sm">
                            {getCategoryName(item.category_id)}
                          </p>
                        </div>
                        <p className="text-primary text-xl font-bold">₺{item.price}</p>
                      </div>

                      {item.description && (
                        <p className="text-subtle-light text-sm mb-3 line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      {item.ingredients && item.ingredients.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-subtle-light mb-1">
                            Malzemeler:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {item.ingredients.slice(0, 3).map((ing, idx) => (
                              <span
                                key={idx}
                                className="rounded bg-white px-2 py-1 text-xs ring-1 ring-border-light"
                              >
                                {ing}
                              </span>
                            ))}
                            {item.ingredients.length > 3 && (
                              <span className="text-xs text-subtle-light px-2 py-1">
                                +{item.ingredients.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 mb-3">
                        {!item.is_available && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                            Stokta Yok
                          </span>
                        )}
                        {item.is_featured && (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Öne Çıkan</span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal(item)}
                          className="flex-1 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => toggleAvailability(item.id, item.is_available)}
                          className="rounded-lg border border-border-light bg-white px-3 py-2 text-sm font-medium transition-colors hover:bg-border-light"
                          title={item.is_available ? "Stokta yok olarak işaretle" : "Stokta var olarak işaretle"}
                        >
                          <span className="material-symbols-outlined text-xl">
                            {item.is_available ? "visibility" : "visibility_off"}
                          </span>
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="px-3 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                        >
                          <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-border-light"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-border-light bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-2xl">
                      {editingItem ? "edit" : "add_circle"}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-text-light text-2xl font-bold">
                      {editingItem ? "Ürün Düzenle" : "Yeni Ürün Ekle"}
                    </h2>
                    <p className="text-subtle-light text-sm">
                      {editingItem ? "Ürün bilgilerini güncelleyin" : "Menüye yeni bir ürün ekleyin"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-10 h-10 rounded-xl hover:bg-black/5 flex items-center justify-center transition-colors"
                >
                  <span className="material-symbols-outlined text-subtle-light">
                    close
                  </span>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="flex flex-col max-h-[calc(90vh-140px)]">
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Temel Bilgiler */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-light flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">info</span>
                      Temel Bilgiler
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-light mb-2">
                          <span className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">restaurant</span>
                            Ürün Adı <span className="text-red-500">*</span>
                          </span>
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border-light bg-white text-text-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          placeholder="Örn: İskender Kebap"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-light mb-2">
                          <span className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">category</span>
                            Kategori
                          </span>
                        </label>
                        <select
                          value={formData.category_id}
                          onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border-light bg-white text-text-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        >
                          <option value="">Kategori Seçiniz</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-light mb-2">
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-base">description</span>
                          Açıklama
                        </span>
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border-light bg-white text-text-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                        rows={4}
                        placeholder="Ürün hakkında detaylı bilgi..."
                      />
                    </div>
                  </div>

                  {/* Fiyat ve Medya */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-light flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">payments</span>
                      Fiyat ve Medya
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-light mb-2">
                          <span className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">currency_lira</span>
                            Fiyat (₺) <span className="text-red-500">*</span>
                          </span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border-light bg-white text-text-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          placeholder="0.00"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-text-light mb-2">
                          <span className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">image</span>
                            Resim URL (Opsiyonel)
                          </span>
                        </label>
                        <input
                          type="url"
                          value={formData.image_url}
                          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border-light bg-white text-text-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          placeholder="https://example.com/image.jpg"
                        />
                        <p className="text-xs text-subtle-light mt-1">
                          Dış bağlantılı resim ekleyebilirsiniz veya aşağıdan resim yükleyebilirsiniz
                        </p>
                      </div>
                    </div>

                    {/* Image Upload Component */}
                    <div>
                      <label className="block text-sm font-medium text-text-light mb-2">
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-base">photo_library</span>
                          Ürün Fotoğrafları
                        </span>
                      </label>
                      <ImageUpload
                        images={formData.images}
                        onImagesChange={(newImages) => setFormData({ ...formData, images: newImages })}
                        maxImages={5}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-light mb-2">
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-base">smart_display</span>
                          YouTube URL
                        </span>
                      </label>
                      <input
                        type="url"
                        value={formData.youtube_url}
                        onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border-light bg-white text-text-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="https://youtube.com/watch?v=..."
                      />
                      <p className="text-xs text-subtle-light mt-1">
                        Ürününüzün yapım videosunu ekleyebilirsiniz
                      </p>
                    </div>
                  </div>

                  {/* Malzemeler ve Özellikler */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-light flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">nutrition</span>
                      Malzemeler ve Özellikler
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-light mb-2">
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-base">grocery</span>
                          Malzemeler
                        </span>
                      </label>
                      <textarea
                        value={formData.ingredients}
                        onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border-light bg-white text-text-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                        rows={2}
                        placeholder="Domates, Peynir, Zeytin, Biber"
                      />
                      <p className="text-xs text-subtle-light mt-1">
                        Malzemeleri virgülle ayırarak yazın
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-light mb-2">
                          <span className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">warning</span>
                            Alerjenler
                          </span>
                        </label>
                        <input
                          type="text"
                          value={formData.allergens}
                          onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border-light bg-white text-text-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          placeholder="Gluten, Süt, Yumurta"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-light mb-2">
                          <span className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">local_offer</span>
                            Etiketler
                          </span>
                        </label>
                        <input
                          type="text"
                          value={formData.tags}
                          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border-light bg-white text-text-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          placeholder="Vejetaryen, Acılı, Özel"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Durum ve Özellikler */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-light flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">toggle_on</span>
                      Durum ve Özellikler
                    </h3>
                    <div className="flex flex-wrap gap-4 rounded-xl border border-border-light bg-[#fff9e6] p-4">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={formData.is_available}
                            onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-border-light rounded-full peer peer-checked:bg-primary transition-colors"></div>
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-subtle-light group-hover:text-primary transition-colors">
                            {formData.is_available ? "check_circle" : "cancel"}
                          </span>
                          <span className="text-sm font-medium text-text-light">
                            Stokta Var
                          </span>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={formData.is_featured}
                            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-border-light rounded-full peer peer-checked:bg-primary transition-colors"></div>
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-subtle-light group-hover:text-primary transition-colors">
                            {formData.is_featured ? "star" : "star_outline"}
                          </span>
                          <span className="text-sm font-medium text-text-light">
                            Öne Çıkan
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-border-light bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border-light bg-white px-6 py-3 font-medium text-text-light transition-colors hover:bg-border-light"
                  >
                    <span className="material-symbols-outlined">close</span>
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">
                      {editingItem ? "check" : "add"}
                    </span>
                    {editingItem ? "Güncelle" : "Ekle"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
