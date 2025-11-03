"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { MenuCategory } from "@/lib/types";
import DashboardSidebar from "@/app/components/DashboardSidebar";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
    visible: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("menu_categories")
        .select("*")
        .order("position", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  }

  function openModal(category?: MenuCategory) {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || "",
        image_url: category.image_url || "",
        visible: category.visible,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        description: "",
        image_url: "",
        visible: true,
      });
    }
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const categoryData = {
      name: formData.name,
      slug: formData.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      description: formData.description || null,
      image_url: formData.image_url || null,
      visible: formData.visible,
    };

    try {
      if (editingCategory) {
        // Update
        const { error } = await supabase
          .from("menu_categories")
          .update(categoryData)
          .eq("id", editingCategory.id);

        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase.from("menu_categories").insert([categoryData]);
        if (error) throw error;
      }

      setShowModal(false);
      fetchCategories();
    } catch (error: any) {
      console.error("Error saving category:", error);
      alert("Hata: " + error.message);
    }
  }

  async function deleteCategory(id: string) {
    if (!confirm("Bu kategoriyi silmek istediğinizden emin misiniz? Bu kategoriye ait ürünlerin kategori bilgisi silinecek.")) return;

    try {
      const { error } = await supabase.from("menu_categories").delete().eq("id", id);
      if (error) throw error;
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  }

  async function toggleVisibility(id: string, visible: boolean) {
    try {
      const { error } = await supabase
        .from("menu_categories")
        .update({ visible: !visible })
        .eq("id", id);

      if (error) throw error;
      fetchCategories();
    } catch (error) {
      console.error("Error updating visibility:", error);
    }
  }

  return (
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen">
      <div className="flex">
        <DashboardSidebar activePage="categories" />

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 lg:p-10">
          <div className="mx-auto max-w-6xl">
            {/* Page Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
              <div>
                <h1 className="text-text-light dark:text-text-dark text-4xl font-black leading-tight tracking-[-0.033em]">
                  Kategoriler
                </h1>
                <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2">
                  Menü kategorilerinizi yönetin
                </p>
              </div>
              <button
                onClick={() => openModal()}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg"
              >
                <span className="material-symbols-outlined">add</span>
                Yeni Kategori
              </button>
            </div>

            {/* Categories List */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="material-symbols-outlined text-6xl text-text-secondary-light dark:text-text-secondary-dark mb-4">
                  category
                </span>
                <p className="text-xl font-bold mb-2">Henüz kategori eklenmemiş</p>
                <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
                  İlk kategorinizi ekleyerek başlayın.
                </p>
                <button
                  onClick={() => openModal()}
                  className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  İlk Kategoriyi Ekle
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border border-border-light dark:border-border-dark"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary text-2xl">category</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-text-light dark:text-text-dark">
                            {category.name}
                          </h3>
                          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                            {category.slug}
                          </p>
                        </div>
                      </div>
                      {!category.visible && (
                        <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded">
                          Gizli
                        </span>
                      )}
                    </div>

                    {category.description && (
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4 line-clamp-2">
                        {category.description}
                      </p>
                    )}

                    <div className="flex gap-2 pt-4 border-t border-border-light dark:border-border-dark">
                      <button
                        onClick={() => openModal(category)}
                        className="flex-1 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => toggleVisibility(category.id, category.visible)}
                        className="px-3 py-2 bg-background-light dark:bg-background-dark rounded-lg text-sm font-medium hover:bg-border-light dark:hover:bg-border-dark transition-colors"
                        title={category.visible ? "Gizle" : "Göster"}
                      >
                        <span className="material-symbols-outlined text-xl">
                          {category.visible ? "visibility" : "visibility_off"}
                        </span>
                      </button>
                      <button
                        onClick={() => deleteCategory(category.id)}
                        className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
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
          <div className="bg-white dark:bg-surface-dark rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-border-light dark:border-border-dark">
            {/* Modal Header */}
            <div className="p-6 border-b border-border-light dark:border-border-dark">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-2xl">
                      {editingCategory ? "edit" : "add_circle"}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-text-light dark:text-text-dark text-2xl font-bold">
                      {editingCategory ? "Kategori Düzenle" : "Yeni Kategori"}
                    </h2>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
                      Kategori bilgilerini girin
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-10 h-10 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center transition-colors"
                >
                  <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">
                    close
                  </span>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                  Kategori Adı <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Örn: Ana Yemekler"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                  Açıklama
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  rows={3}
                  placeholder="Kategori hakkında kısa açıklama..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                  Resim URL (Opsiyonel)
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="visible"
                  checked={formData.visible}
                  onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                  className="w-5 h-5 rounded border-border-light dark:border-border-dark text-primary focus:ring-primary"
                />
                <label htmlFor="visible" className="text-sm font-medium text-text-light dark:text-text-dark">
                  Kategoriyi sitede göster
                </label>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4 border-t border-border-light dark:border-border-dark">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-medium hover:bg-border-light dark:hover:bg-border-dark transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                  {editingCategory ? "Güncelle" : "Ekle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
