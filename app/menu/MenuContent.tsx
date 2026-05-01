"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import type { ContactInfo, MenuItem, MenuCategory } from "@/lib/types";

interface MenuContentProps {
  categories: MenuCategory[];
  allItems: MenuItem[];
  contactInfo?: ContactInfo | null;
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
      <div className="block border-b border-border-light bg-[#f5bf00]/90 backdrop-blur-sm lg:hidden">
        <div className="overflow-x-auto px-4 py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max min-w-full gap-2 pb-0.5">
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === null
                  ? "bg-primary text-white shadow-sm"
                  : "border border-border-light bg-white/90 text-[#2a1a00] hover:bg-white"
              }`}
            >
              Tümü
            </button>
            {categories.map((category) => (
              <button
                type="button"
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? "bg-primary text-white shadow-sm"
                    : "border border-border-light bg-white/90 text-[#2a1a00] hover:bg-white"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="container mx-auto grow bg-[#f5bf00] p-4 text-[#2a1a00]">
        {/* lg:items-start so sticky sidebar isn’t stretched to the full grid height */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Desktop Sidebar */}
          <aside className="hidden w-full shrink-0 lg:block lg:w-64 xl:w-72">
            {/* top below sticky header: large logo + padding ≈ 7–8rem */}
            <div className="flex flex-col gap-4 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-1">
              <div className="flex flex-col gap-4 rounded-xl border border-border-light bg-white/95 p-4 shadow-sm ring-1 ring-black/[0.04]">
                <div className="flex flex-col">
                  <h1 className="text-base font-bold text-[#2a1a00]">Kategoriler</h1>
                  <p className="text-sm text-subtle-light">Bir kategori seçin</p>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(null)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                      selectedCategory === null
                        ? "bg-primary/10 font-bold text-primary"
                        : "hover:bg-[#fff9e6]"
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[22px] ${selectedCategory === null ? "fill text-primary" : "text-subtle-light"}`}>
                      apps
                    </span>
                    <p className="text-sm font-medium">Tüm Ürünler</p>
                    <span className="ml-auto text-xs tabular-nums text-subtle-light">({allItems.length})</span>
                  </button>
                  {categories.map((category) => {
                    const itemCount = allItems.filter((item) => item.category_id === category.id).length;
                    return (
                      <button
                        type="button"
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                          selectedCategory === category.id
                            ? "bg-primary/10 font-bold text-primary"
                            : "hover:bg-[#fff9e6]"
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined text-[22px] ${selectedCategory === category.id ? "fill text-primary" : "text-subtle-light"}`}
                        >
                          restaurant_menu
                        </span>
                        <p className="min-w-0 flex-1 truncate text-sm font-medium">{category.name}</p>
                        <span className="shrink-0 text-xs tabular-nums text-subtle-light">({itemCount})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-6">
              {/* Header with search */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex flex-col gap-1">
                  <p className="text-3xl font-black tracking-tight sm:text-4xl sm:tracking-tighter">
                    {selectedCategory ? getCategoryName(selectedCategory) : "Menümüz"}
                  </p>
                  <p className="text-base text-subtle-light">
                    {filteredItems.length} ürün gösteriliyor
                    {searchQuery ? ` — “${searchQuery}”` : ""}
                  </p>
                </div>
                <div className="w-full shrink-0 sm:w-72 sm:max-w-md md:w-80">
                  <label className="sr-only" htmlFor="menu-search">
                    Menüde ara
                  </label>
                  <div className="relative flex h-12 w-full items-center rounded-xl border border-border-light bg-white shadow-sm ring-1 ring-black/[0.04]">
                    <span className="pointer-events-none flex shrink-0 items-center pl-3 text-subtle-light" aria-hidden>
                      <span className="material-symbols-outlined text-[22px]">search</span>
                    </span>
                    <input
                      id="menu-search"
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoComplete="off"
                      className="h-full min-w-0 flex-1 border-0 bg-transparent py-2 pr-10 pl-2 text-base text-[#2a1a00] placeholder:text-subtle-light focus:outline-none focus:ring-0"
                      placeholder="Yemek ara…"
                    />
                    {searchQuery ? (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-subtle-light transition hover:bg-[#fff9e6] hover:text-[#2a1a00]"
                        aria-label="Aramayı temizle"
                      >
                        <span className="material-symbols-outlined text-[22px]">close</span>
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Menu Items Grid */}
              {filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-border-light bg-white/95 py-12 text-center shadow-sm ring-1 ring-black/[0.04]">
                  <span className="material-symbols-outlined mb-4 text-6xl text-subtle-light">
                    {searchQuery ? "search_off" : "restaurant_menu"}
                  </span>
                  <p className="mb-2 text-xl font-bold text-[#2a1a00]">
                    {searchQuery ? "Sonuç bulunamadı" : "Henüz ürün eklenmemiş"}
                  </p>
                  <p className="max-w-sm px-4 text-subtle-light">
                    {searchQuery
                      ? "Farklı bir arama terimi deneyin veya filtreyi sıfırlayın."
                      : "Dashboard'dan menü öğelerini ekleyebilirsiniz."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                  {filteredItems.map((item) => {
                    const displayImage =
                      item.images && item.images.length > 0
                        ? item.images[0]
                        : item.image_url || "https://placehold.co/600x400?text=No+Image";

                    return (
                      <div
                        key={item.id}
                        className="flex flex-col gap-3 overflow-hidden rounded-xl border border-border-light bg-white/95 pb-3 shadow-sm ring-1 ring-black/[0.04] transition-all hover:shadow-md"
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
                          <p className="text-lg font-bold text-[#2a1a00]">{item.title}</p>
                          {item.description && (
                            <p className="line-clamp-2 text-sm text-subtle-light">
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
                                  className="rounded bg-[#fff9e6] px-2 py-1 text-xs ring-1 ring-border-light"
                                >
                                  {ingredient}
                                </span>
                              ))}
                              {item.ingredients.length > 3 && (
                                <span className="px-2 py-1 text-xs text-subtle-light">
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
                              type="button"
                              onClick={() => setSelectedItem(item)}
                              className="rounded-lg border border-border-light bg-[#fff9e6] px-3 py-2 text-sm font-medium text-[#2a1a00] transition-colors hover:bg-border-light"
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
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 animate-in zoom-in-95 duration-200"
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
                <div className="flex aspect-video w-full items-center justify-center rounded-t-2xl bg-gradient-to-br from-[#fff9e6] to-border-light">
                  <span className="material-symbols-outlined text-6xl text-subtle-light">restaurant</span>
                </div>
              )}

              {/* Content Section */}
              <div className="p-6 sm:p-8">
                {/* Title and Price */}
                <div className="mb-6">
                  <h2 className="mb-2 text-3xl font-bold text-[#2a1a00]">
                    {selectedItem.title}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-primary">
                      ₺{selectedItem.price.toFixed(2)}
                    </span>
                    {selectedItem.is_available ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                        Mevcut
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
                        Tükendi
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                {selectedItem.description && (
                  <div className="mb-6">
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-subtle-light">
                      <span className="material-symbols-outlined text-base">description</span>
                      Açıklama
                    </h3>
                    <p className="leading-relaxed text-[#2a1a00]">
                      {selectedItem.description}
                    </p>
                  </div>
                )}

                {/* Ingredients */}
                {selectedItem.ingredients && selectedItem.ingredients.length > 0 && (
                  <div className="mb-6">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-subtle-light">
                      <span className="material-symbols-outlined text-base">nutrition</span>
                      İçerikler
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.ingredients.map((ingredient, idx) => (
                        <span
                          key={idx}
                          className="rounded-lg border border-border-light bg-[#fff9e6] px-3 py-1.5 text-sm font-medium text-[#2a1a00]"
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
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-subtle-light">
                      <span className="material-symbols-outlined text-base">warning</span>
                      Alerjenler
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.allergens.map((allergen, idx) => (
                        <span
                          key={idx}
                          className="rounded-lg bg-orange-100 px-3 py-1.5 text-sm font-medium text-orange-800"
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
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-subtle-light">
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
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-subtle-light">
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
                <div className="border-t border-border-light pt-4">
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
