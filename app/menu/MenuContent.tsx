"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import type { MenuItem, MenuCategory } from "@/lib/types";

interface MenuContentProps {
  categories: MenuCategory[];
  allItems: MenuItem[];
  contactInfo?: any;
}

export default function MenuContent({ categories, allItems, contactInfo }: MenuContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedItem(null);
    };
    if (selectedItem) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [selectedItem]);

  // Filter items based on selected category and search
  const filteredItems = useMemo(() => {
    let items = allItems;

    // Filter by category
    if (selectedCategory) {
      items = items.filter(item => item.category_id === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.ingredients?.some(ing => ing.toLowerCase().includes(query))
      );
    }

    return items;
  }, [allItems, selectedCategory, searchQuery]);

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return "Tümü";
    const category = categories.find(c => c.id === categoryId);
    return category?.name || "Bilinmeyen";
  };

  return (
    <>
      {/* Mobile: compact horizontal categories */}
      <div className="block lg:hidden border-b border-surface-light dark:border-surface-dark bg-background-light/50">
        <div className="overflow-x-auto px-4 py-3">
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === null
                  ? 'bg-primary text-white'
                  : 'bg-transparent hover:bg-surface-light dark:hover:bg-surface-dark'
              }`}
            >
              Tümü
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-transparent hover:bg-surface-light dark:hover:bg-surface-dark'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="container mx-auto grow p-4 bg-[#FED301] text-black">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:w-64 xl:w-72">
            <div className="lg:sticky lg:top-24 flex flex-col gap-4">
              <div className="flex h-full lg:min-h-[700px] flex-col justify-between">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col">
                    <h1 className="text-base font-bold">Kategoriler</h1>
                    <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                      Bir kategori seçin
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left ${
                        selectedCategory === null
                          ? 'bg-surface-light dark:bg-surface-dark font-bold text-primary'
                          : 'hover:bg-surface-light dark:hover:bg-surface-dark'
                      }`}
                    >
                      <span className={`material-symbols-outlined ${selectedCategory === null ? 'fill text-primary' : ''}`}>
                        apps
                      </span>
                      <p className="text-sm font-medium">Tüm Ürünler</p>
                      <span className="ml-auto text-xs text-text-light-secondary dark:text-text-dark-secondary">
                        ({allItems.length})
                      </span>
                    </button>
                    {categories.map((category) => {
                      const itemCount = allItems.filter(item => item.category_id === category.id).length;
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left ${
                            selectedCategory === category.id
                              ? 'bg-surface-light dark:bg-surface-dark font-bold text-primary'
                              : 'hover:bg-surface-light dark:hover:bg-surface-dark'
                          }`}
                        >
                          <span className={`material-symbols-outlined ${selectedCategory === category.id ? 'fill text-primary' : ''}`}>
                            restaurant_menu
                          </span>
                          <p className="text-sm font-medium">{category.name}</p>
                          <span className="ml-auto text-xs text-text-light-secondary dark:text-text-dark-secondary">
                            ({itemCount})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col gap-6">
              {/* Header with search */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-4xl font-black tracking-tighter">
                    {selectedCategory ? getCategoryName(selectedCategory) : 'Menümüz'}
                  </p>
                  <p className="text-base text-text-light-secondary dark:text-text-dark-secondary">
                    {filteredItems.length} ürün gösteriliyor
                    {searchQuery && ` "${searchQuery}" için`}
                  </p>
                </div>
                <div className="w-full sm:w-auto sm:min-w-72">
                  <label className="flex h-12 w-full flex-col">
                    <div className="flex h-full w-full flex-1 items-stretch rounded-lg">
                      <div className="flex items-center justify-center rounded-l-lg border-y border-l border-surface-light bg-background-light pl-4 text-text-light-secondary dark:border-surface-dark dark:bg-background-dark dark:text-text-dark-secondary">
                        <span className="material-symbols-outlined">search</span>
                      </div>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="form-input h-full w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg border-y border-r border-surface-light bg-background-light px-4 text-base font-normal placeholder:text-text-light-secondary focus:border-primary focus:outline-0 focus:ring-0 dark:border-surface-dark dark:bg-background-dark placeholder:dark:text-text-dark-secondary"
                        placeholder="Belirli bir yemeği arayın"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light-secondary hover:text-text-light dark:text-text-dark-secondary dark:hover:text-text-dark"
                        >
                          <span className="material-symbols-outlined text-xl">close</span>
                        </button>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Menu Items Grid */}
              {filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <span className="material-symbols-outlined text-6xl text-text-light-secondary dark:text-text-dark-secondary mb-4">
                    {searchQuery ? 'search_off' : 'restaurant_menu'}
                  </span>
                  <p className="text-xl font-bold mb-2">
                    {searchQuery ? 'Sonuç bulunamadı' : 'Henüz ürün eklenmemiş'}
                  </p>
                  <p className="text-text-light-secondary dark:text-text-dark-secondary">
                    {searchQuery
                      ? 'Farklı bir arama terimi deneyin'
                      : "Dashboard'dan menü öğelerini ekleyebilirsiniz."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                  {filteredItems.map((item) => {
                    const displayImage =
                      item.images && item.images.length > 0
                        ? item.images[0]
                        : item.image_url || 'https://placehold.co/600x400?text=No+Image';

                    return (
                      <div
                        key={item.id}
                        className="flex flex-col gap-3 rounded-lg bg-background-light pb-3 shadow-sm transition-all hover:shadow-lg dark:bg-surface-dark"
                      >
                        <div className="relative aspect-video w-full rounded-t-lg overflow-hidden">
                          <Image
                            src={displayImage}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          {item.is_featured && (
                            <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-xs font-bold">
                              Öne Çıkan
                            </div>
                          )}
                        </div>
                        <div className="px-4">
                          <p className="text-lg font-bold">{item.title}</p>
                          {item.description && (
                            <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          <p className="mt-2 text-base font-semibold text-primary">
                            ₺{item.price.toFixed(2)}
                          </p>
                          {item.ingredients && item.ingredients.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.ingredients.slice(0, 3).map((ingredient, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-surface-light dark:bg-surface-dark px-2 py-1 rounded"
                                >
                                  {ingredient}
                                </span>
                              ))}
                              {item.ingredients.length > 3 && (
                                <span className="text-xs text-text-light-secondary dark:text-text-dark-secondary px-2 py-1">
                                  +{item.ingredients.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                          
                          {/* Action Buttons */}
                          <div className="flex gap-2 mt-4">
                            <a
                              href={contactInfo?.phone 
                                ? `https://wa.me/${contactInfo.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Merhaba! ${item.title} hakkında bilgi almak istiyorum. Fiyat: ₺${item.price.toFixed(2)}`)}`
                                : `https://wa.me/?text=${encodeURIComponent(`Merhaba! ${item.title} hakkında bilgi almak istiyorum. Fiyat: ₺${item.price.toFixed(2)}`)}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                              </svg>
                              <span>Sipariş Ver</span>
                            </a>
                            <button
                              onClick={() => setSelectedItem(item)}
                              className="px-3 py-2 bg-surface-light dark:bg-surface-dark hover:bg-border-light dark:hover:bg-border-dark text-text-light dark:text-text-dark rounded-lg text-sm font-medium transition-colors"
                              title="Ürün Detayları"
                            >
                              <span className="material-symbols-outlined text-lg">info</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Product Details Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="relative bg-background-light dark:bg-surface-dark rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
              aria-label="Kapat"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            {/* Modal Content */}
            <div className="relative">
              {/* Image Section */}
              {selectedItem.images && selectedItem.images.length > 0 ? (
                <div className="relative w-full aspect-video rounded-t-2xl overflow-hidden">
                  <Image
                    src={selectedItem.images[0]}
                    alt={selectedItem.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {selectedItem.is_featured && (
                    <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                      ⭐ Öne Çıkan
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full aspect-video rounded-t-2xl bg-gradient-to-br from-surface-light to-border-light dark:from-surface-dark dark:to-border-dark flex items-center justify-center">
                  <span className="material-symbols-outlined text-6xl text-subtle-light dark:text-subtle-dark">restaurant</span>
                </div>
              )}

              {/* Content Section */}
              <div className="p-6 sm:p-8">
                {/* Title and Price */}
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-text-light dark:text-text-dark mb-2">
                    {selectedItem.title}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-primary">
                      ₺{selectedItem.price.toFixed(2)}
                    </span>
                    {selectedItem.is_available ? (
                      <span className="text-sm px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full font-medium">
                        Mevcut
                      </span>
                    ) : (
                      <span className="text-sm px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full font-medium">
                        Tükendi
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                {selectedItem.description && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-subtle-light dark:text-subtle-dark uppercase tracking-wide mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">description</span>
                      Açıklama
                    </h3>
                    <p className="text-text-light dark:text-text-dark leading-relaxed">
                      {selectedItem.description}
                    </p>
                  </div>
                )}

                {/* Ingredients */}
                {selectedItem.ingredients && selectedItem.ingredients.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-subtle-light dark:text-subtle-dark uppercase tracking-wide mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">nutrition</span>
                      İçerikler
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.ingredients.map((ingredient, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-surface-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg text-sm font-medium text-text-light dark:text-text-dark"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Allergens */}
                {selectedItem.allergens && selectedItem.allergens.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-subtle-light dark:text-subtle-dark uppercase tracking-wide mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">warning</span>
                      Alerjenler
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.allergens.map((allergen, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg text-sm font-medium"
                        >
                          {allergen}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {selectedItem.tags && selectedItem.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-subtle-light dark:text-subtle-dark uppercase tracking-wide mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">label</span>
                      Etiketler
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* YouTube Video */}
                {selectedItem.youtube_url && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-subtle-light dark:text-subtle-dark uppercase tracking-wide mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">play_circle</span>
                      Video
                    </h3>
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                      <iframe
                        src={selectedItem.youtube_url.replace('watch?v=', 'embed/')}
                        title="Ürün videosu"
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="pt-4 border-t border-border-light dark:border-border-dark">
                  <a
                    href={contactInfo?.phone 
                      ? `https://wa.me/${contactInfo.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Merhaba! ${selectedItem.title} hakkında bilgi almak istiyorum. Fiyat: ₺${selectedItem.price.toFixed(2)}`)}`
                      : `https://wa.me/?text=${encodeURIComponent(`Merhaba! ${selectedItem.title} hakkında bilgi almak istiyorum. Fiyat: ₺${selectedItem.price.toFixed(2)}`)}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl text-base font-semibold transition-colors shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    <span>WhatsApp ile Sipariş Ver</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
