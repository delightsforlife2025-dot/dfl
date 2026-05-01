"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import SingleImageUpload from "@/app/components/SingleImageUpload";
import DashboardSidebar from "@/app/components/DashboardSidebar";
import { errorMessage } from "@/lib/errorMessage";

const MAX_SLIDER_ITEMS = 5;

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

interface SiteSettingRow {
  key: string;
  value: unknown;
  updated_at: string;
}

type HomeSliderItem = {
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  buttonUrl: string;
};

interface HomeContentState {
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  slider: HomeSliderItem[];
  about_title: string;
  about_subtitle: string;
  about_description: string;
  about_image: string;
  about_highlights: string[];
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "contact" | "social" | "home">("general");

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    site_name: "",
    site_tagline: "",
    logo_url: "",
    favicon_url: "",
    primary_color: "#ff6b35",
  });

  // Contact Info
  const [contactInfo, setContactInfo] = useState({
    address: "",
    phone: "",
    email: "",
    hours: "",
  });

  // Social Links
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
  });

  // Home Page
  const [homeContent, setHomeContent] = useState<HomeContentState>({
    hero_title: "",
    hero_subtitle: "",
    hero_image: "",
    slider: [],
    about_title: "",
    about_subtitle: "",
    about_description: "",
    about_image: "",
    about_highlights: [],
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings(options?: { showLoading?: boolean }) {
    const showLoading = options?.showLoading !== false;
    if (showLoading) setLoading(true);
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*");

      if (error) throw error;

      data?.forEach((setting: SiteSettingRow) => {
        if (setting.key === "general_settings" && isRecord(setting.value)) {
          setGeneralSettings((prev) => ({ ...prev, ...(setting.value as Partial<typeof prev>) }));
        } else if (setting.key === "contact_info" && isRecord(setting.value)) {
          setContactInfo((prev) => ({ ...prev, ...(setting.value as Partial<typeof prev>) }));
        } else if (setting.key === "social_links" && isRecord(setting.value)) {
          setSocialLinks((prev) => ({ ...prev, ...(setting.value as Partial<typeof prev>) }));
        } else if (setting.key === "home_content" && isRecord(setting.value)) {
          const v = setting.value;
          const rawSlider = Array.isArray(v.slider) ? v.slider : [];
          const highlights = Array.isArray(v.about_highlights)
            ? (v.about_highlights as unknown[]).filter((x): x is string => typeof x === "string")
            : [];
          setHomeContent({
            hero_title: typeof v.hero_title === "string" ? v.hero_title : "",
            hero_subtitle: typeof v.hero_subtitle === "string" ? v.hero_subtitle : "",
            hero_image: typeof v.hero_image === "string" ? v.hero_image : "",
            slider: rawSlider.map((item: unknown) => {
              const o = isRecord(item) ? item : {};
              return {
                title: typeof o.title === "string" ? o.title : "",
                subtitle: typeof o.subtitle === "string" ? o.subtitle : "",
                image: typeof o.image === "string" ? o.image : "",
                buttonText: typeof o.buttonText === "string" ? o.buttonText : "",
                buttonUrl: typeof o.buttonUrl === "string" ? o.buttonUrl : "",
              };
            }),
            about_title: typeof v.about_title === "string" ? v.about_title : "",
            about_subtitle: typeof v.about_subtitle === "string" ? v.about_subtitle : "",
            about_description: typeof v.about_description === "string" ? v.about_description : "",
            about_image: typeof v.about_image === "string" ? v.about_image : "",
            about_highlights: highlights,
          });
        }
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      if (showLoading) setLoading(false);
    }
  }

  async function saveSetting(key: string, value: unknown) {
    setSaving(true);
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ key, value }),
      });

      if (!response.ok) {
        let message = response.statusText;
        try {
          const errorData = (await response.json()) as { error?: string };
          if (errorData.error) message = errorData.error;
        } catch {
          /* ignore */
        }
        throw new Error(message || "Failed to save settings");
      }

      await fetchSettings({ showLoading: false });

      try {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("site-settings-updated", { detail: { key, value } }));
        }
      } catch {
        // ignore dispatch errors
      }
      alert("Ayarlar kaydedildi! Değişikliklerin yansıması için diğer pencereler veya sayfalar otomatik olarak güncellenecektir.");
    } catch (error: unknown) {
      console.error("Error saving settings:", error);
      alert("Hata: " + errorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function handleGeneralSubmit(e: React.FormEvent) {
    e.preventDefault();
    await saveSetting("general_settings", generalSettings);
  }

  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    await saveSetting("contact_info", contactInfo);
  }

  async function handleSocialSubmit(e: React.FormEvent) {
    e.preventDefault();
    await saveSetting("social_links", socialLinks);
  }

  async function handleHomeSubmit(e: React.FormEvent) {
    e.preventDefault();

    const cleanedSlider = (homeContent.slider || [])
      .map((item) => ({
        title: item.title?.trim() || "",
        subtitle: item.subtitle?.trim() || "",
        image: item.image?.trim() || "",
        buttonText: item.buttonText?.trim() || "",
        buttonUrl: item.buttonUrl?.trim() || "",
      }))
      .filter((item) => item.image);

    const cleanedHighlights = (homeContent.about_highlights || [])
      .map((item) => item.trim())
      .filter(Boolean);

    const payload: HomeContentState = {
      hero_title: homeContent.hero_title.trim(),
      hero_subtitle: homeContent.hero_subtitle.trim(),
      hero_image: homeContent.hero_image.trim(),
      slider: cleanedSlider,
      about_title: homeContent.about_title.trim(),
      about_subtitle: homeContent.about_subtitle.trim(),
      about_description: homeContent.about_description.trim(),
      about_image: homeContent.about_image.trim(),
      about_highlights: cleanedHighlights,
    };

    await saveSetting("home_content", payload);
    setHomeContent(payload);
  }

  function addSliderItem() {
    setHomeContent((prev) => {
      if (prev.slider.length >= MAX_SLIDER_ITEMS) return prev;
      return {
        ...prev,
        slider: [
          ...prev.slider,
          { title: "", subtitle: "", image: "", buttonText: "", buttonUrl: "" },
        ],
      };
    });
  }

  function updateSliderItem(index: number, key: keyof HomeSliderItem, value: string) {
    setHomeContent((prev) => {
      const slider = [...prev.slider];
      slider[index] = {
        ...slider[index],
        [key]: value,
      };
      return { ...prev, slider };
    });
  }

  function removeSliderItem(index: number) {
    setHomeContent((prev) => ({
      ...prev,
      slider: prev.slider.filter((_, i) => i !== index),
    }));
  }

  return (
    <div className="font-display bg-background-light min-h-screen">
      <div className="flex">
        <DashboardSidebar activePage="settings" />

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 lg:p-10">
          <div className="mx-auto max-w-4xl">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-text-light text-4xl font-black leading-tight tracking-[-0.033em]">
                Site Ayarları
              </h1>
              <p className="text-subtle-light mt-2">
                Sitenizin genel ayarlarını yönetin
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-border-light overflow-x-auto">
              <button
                onClick={() => setActiveTab("general")}
                className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
                  activeTab === "general"
                    ? "text-primary border-b-2 border-primary"
                    : "text-subtle-light hover:text-text-light"
                }`}
              >
                Genel Ayarlar
              </button>
              <button
                onClick={() => setActiveTab("contact")}
                className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
                  activeTab === "contact"
                    ? "text-primary border-b-2 border-primary"
                    : "text-subtle-light hover:text-text-light"
                }`}
              >
                İletişim Bilgileri
              </button>
              <button
                onClick={() => setActiveTab("social")}
                className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
                  activeTab === "social"
                    ? "text-primary border-b-2 border-primary"
                    : "text-subtle-light hover:text-text-light"
                }`}
              >
                Sosyal Medya
              </button>
              <button
                onClick={() => setActiveTab("home")}
                className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
                  activeTab === "home"
                    ? "text-primary border-b-2 border-primary"
                    : "text-subtle-light hover:text-text-light"
                }`}
              >
                Ana Sayfa
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {/* General Settings Tab */}
                {activeTab === "general" && (
                  <form onSubmit={handleGeneralSubmit} className="space-y-6">
                    <div className="rounded-xl border border-border-light bg-white/95 p-6 shadow-sm ring-1 ring-black/[0.04]">
                      <h2 className="text-xl font-bold text-text-light mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">settings</span>
                        Genel Site Ayarları
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-text-light mb-2">
                            <span className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-base">title</span>
                              Site Adı
                            </span>
                          </label>
                                                    <input
                            type="text"
                            value={generalSettings.site_name}
                            onChange={(e) => setGeneralSettings({ ...generalSettings, site_name: e.target.value })}
                            className="w-full rounded-lg border border-border-light bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Restoran Adı"
                          />
                          <p className="text-xs text-subtle-light mt-1">
                            Header, footer ve sayfa başlıklarında görünür
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text-light mb-2">
                            <span className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-base">description</span>
                              Site Sloganı
                            </span>
                          </label>
                          <input
                            type="text"
                            value={generalSettings.site_tagline}
                            onChange={(e) => setGeneralSettings({ ...generalSettings, site_tagline: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-border-light bg-white text-text-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="Lezzet ve kalite bir arada"
                          />
                          <p className="text-xs text-subtle-light mt-1">
                            SEO için önemli, meta açıklamalarında kullanılır
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text-light mb-2">
                            <span className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-base">image</span>
                              Logo
                            </span>
                          </label>
                          <SingleImageUpload
                            imageUrl={generalSettings.logo_url}
                            onImageChange={(url) => setGeneralSettings({ ...generalSettings, logo_url: url })}
                            label="Logo"
                            aspectRatio="aspect-[3/1]"
                          />
                          <p className="text-xs text-subtle-light mt-2">
                            Header&apos;da gösterilecek logo (tercihen transparan PNG, önerilen boyut: 300x100px).
                            Yükleme sonrası alttaki <strong>Ayarları Kaydet</strong> düğmesine basın.
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text-light mb-2">
                            <span className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-base">bookmark</span>
                              Favicon
                            </span>
                          </label>
                          <SingleImageUpload
                            imageUrl={generalSettings.favicon_url}
                            onImageChange={(url) => setGeneralSettings({ ...generalSettings, favicon_url: url })}
                            label="Favicon"
                            aspectRatio="aspect-square"
                          />
                          <p className="text-xs text-subtle-light mt-2">
                            PNG veya ICO (32×32 / 64×64 önerilir). ICO dosyaları desteklenir.
                            Kaydetmeden siteye yansımaz — <strong>Ayarları Kaydet</strong> kullanın.
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text-light mb-2">
                            <span className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-base">palette</span>
                              Ana Renk (Primary Color)
                            </span>
                          </label>
                          <div className="flex gap-3 items-center">
                            <input
                              type="color"
                              value={generalSettings.primary_color}
                              onChange={(e) => setGeneralSettings({ ...generalSettings, primary_color: e.target.value })}
                              className="h-12 w-20 rounded-lg border border-border-light cursor-pointer"
                            />
                            <input
                              type="text"
                              value={generalSettings.primary_color}
                              onChange={(e) => setGeneralSettings({ ...generalSettings, primary_color: e.target.value })}
                              className="flex-1 px-4 py-3 rounded-xl border border-border-light bg-white text-text-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                              placeholder="#ff6b35"
                              pattern="^#[0-9A-Fa-f]{6}$"
                            />
                          </div>
                          <p className="text-xs text-subtle-light mt-1">
                            Butonlar, linkler ve vurgular için kullanılır (CSS değişkenlerini güncellemeniz gerekebilir)
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex gap-3">
                        <span className="material-symbols-outlined text-blue-600">info</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-blue-900 mb-1">
                            Önemli Notlar
                          </h3>
                          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                            <li>Logo ve favicon değişiklikleri tarayıcı önbelleğinden dolayı hemen görünmeyebilir</li>
                            <li>Primary color değişikliği için CSS variables güncellenmeli</li>
                            <li>Değişiklikler site genelinde etkili olacaktır</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Kaydediliyor...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined">save</span>
                          Ayarları Kaydet
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Contact Info Tab */}
                {activeTab === "contact" && (
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="rounded-xl border border-border-light bg-white/95 p-6 shadow-sm ring-1 ring-black/[0.04]">
                      <h2 className="text-xl font-bold text-text-light mb-4">
                        İletişim Bilgileri
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-text-light mb-2">
                            <span className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-base">location_on</span>
                              Adres
                            </span>
                          </label>
                          <textarea
                            value={contactInfo.address}
                            onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-border-light bg-white text-text-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                            rows={2}
                            placeholder="Restoran adresiniz"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text-light mb-2">
                            <span className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-base">call</span>
                              Telefon
                            </span>
                          </label>
                          <input
                            type="tel"
                            value={contactInfo.phone}
                            onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-border-light bg-white text-text-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="+90 555 123 45 67"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text-light mb-2">
                            <span className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-base">mail</span>
                              E-posta
                            </span>
                          </label>
                          <input
                            type="email"
                            value={contactInfo.email}
                            onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-border-light bg-white text-text-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="info@lezzetduragi.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text-light mb-2">
                            <span className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-base">schedule</span>
                              Çalışma Saatleri
                            </span>
                          </label>
                          <textarea
                            value={contactInfo.hours}
                            onChange={(e) => setContactInfo({ ...contactInfo, hours: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-border-light bg-white text-text-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                            rows={3}
                            placeholder="Pazartesi - Pazar: 10:00 - 23:00"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border-light bg-white/95 p-6 shadow-sm ring-1 ring-black/[0.04]">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-text-light flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary">slideshow</span>
                          Ana Sayfa Slider Bannerları
                        </h3>
                        <button
                          type="button"
                          onClick={addSliderItem}
                          disabled={homeContent.slider.length >= MAX_SLIDER_ITEMS}
                          className="inline-flex items-center gap-2 rounded-lg border border-border-light px-4 py-2 text-sm font-medium text-text-light hover:bg-border-light transition disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined text-base">add</span>
                          Yeni Banner Ekle
                        </button>
                      </div>

                      {homeContent.slider.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-border-light bg-white/80 p-6 text-center text-sm text-subtle-light">
                          Henüz slider banner eklenmemiş. “Yeni Banner Ekle” butonuna tıklayarak ilk bannerınızı oluşturabilirsiniz.
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {homeContent.slider.map((slide, index) => (
                            <div
                              key={index}
                              className="overflow-hidden rounded-2xl border border-border-light bg-white shadow-sm"
                            >
                              <div className="flex items-center justify-between border-b border-border-light bg-[#fff9e6] px-4 py-3">
                                <div className="flex items-center gap-2 text-text-light">
                                  <span className="material-symbols-outlined text-primary">image</span>
                                  <p className="font-semibold">Banner {index + 1}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeSliderItem(index)}
                                  className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-200 transition"
                                >
                                  <span className="material-symbols-outlined text-sm">delete</span>
                                  Kaldır
                                </button>
                              </div>
                              <div className="p-4 space-y-4">
                                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                                  <div className="lg:col-span-2 space-y-4">
                                    <div>
                                      <label className="block text-sm font-medium text-text-light mb-2">
                                        Banner Başlığı
                                      </label>
                                      <input
                                        type="text"
                                        value={slide.title}
                                        onChange={(e) => updateSliderItem(index, "title", e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-lg border border-border-light bg-white text-text-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                        placeholder="Örn: Yeni Menüde %20 İndirim"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-text-light mb-2">
                                        Banner Alt Başlığı
                                      </label>
                                      <textarea
                                        value={slide.subtitle}
                                        onChange={(e) => updateSliderItem(index, "subtitle", e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-lg border border-border-light bg-white text-text-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
                                        rows={3}
                                        placeholder="Kısa açıklama giriniz..."
                                      />
                                    </div>
                                  </div>
                                  <div className="lg:col-span-3">
                                    <SingleImageUpload
                                      imageUrl={slide.image}
                                      onImageChange={(url) => updateSliderItem(index, "image", url)}
                                      label="Banner Görseli"
                                      aspectRatio="aspect-[16/9]"
                                      bucketName="menu-images"
                                    />
                                    <p className="text-xs text-subtle-light mt-2">
                                      Önerilen boyut: 1600x900 px. En iyi sonuç için yüksek kaliteli görseller kullanın.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="rounded-xl border border-border-light bg-white/95 p-6 shadow-sm ring-1 ring-black/[0.04]">
                      <h3 className="text-lg font-semibold text-text-light mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">info</span>
                        Hakkımızda Bölümü
                      </h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-text-light mb-2">
                              Başlık
                            </label>
                            <input
                              type="text"
                              value={homeContent.about_title}
                              onChange={(e) => setHomeContent({ ...homeContent, about_title: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-lg border border-border-light bg-white text-text-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                              placeholder="Örn: Delights for Life'a Hoş Geldiniz"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-text-light mb-2">
                              Alt Başlık
                            </label>
                            <input
                              type="text"
                              value={homeContent.about_subtitle}
                              onChange={(e) => setHomeContent({ ...homeContent, about_subtitle: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-lg border border-border-light bg-white text-text-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                              placeholder="Örn: Geleneksel tatları modern dokunuşlarla sunuyoruz"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text-light mb-2">
                            Açıklama
                          </label>
                          <textarea
                            value={homeContent.about_description}
                            onChange={(e) => setHomeContent({ ...homeContent, about_description: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-border-light bg-white text-text-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
                            rows={4}
                            placeholder="Restoranınızın hikayesi, değerleri ve misyonunu anlatan kısa metin."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text-light mb-2">
                            Hakkımızda Görseli
                          </label>
                          <SingleImageUpload
                            imageUrl={homeContent.about_image}
                            onImageChange={(url) => setHomeContent({ ...homeContent, about_image: url })}
                            label="About Görseli"
                            aspectRatio="aspect-[4/3]"
                            bucketName="menu-images"
                          />
                          <p className="text-xs text-subtle-light mt-2">
                            Önerilen boyut: 1200x900 px. Görsel, Hakkımızda kartında kullanılacaktır.
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg disabled:opacity-50"
                    >
                      {saving ? "Kaydediliyor..." : "Kaydet"}
                    </button>
                  </form>
                )}

                {/* Social Media Tab */}
                {activeTab === "social" && (
                  <form onSubmit={handleSocialSubmit} className="space-y-6">
                    <div className="rounded-xl border border-border-light bg-white/95 p-6 shadow-sm ring-1 ring-black/[0.04]">
                      <h2 className="text-xl font-bold text-text-light mb-4">
                        Sosyal Medya Hesapları
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-text-light mb-2">
                            Facebook URL
                          </label>
                          <input
                            type="url"
                            value={socialLinks.facebook}
                            onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-border-light bg-white text-text-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="https://facebook.com/lezzetduragi"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text-light mb-2">
                            Instagram URL
                          </label>
                          <input
                            type="url"
                            value={socialLinks.instagram}
                            onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-border-light bg-white text-text-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="https://instagram.com/lezzetduragi"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text-light mb-2">
                            Twitter URL
                          </label>
                          <input
                            type="url"
                            value={socialLinks.twitter}
                            onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-border-light bg-white text-text-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="https://twitter.com/lezzetduragi"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text-light mb-2">
                            YouTube URL
                          </label>
                          <input
                            type="url"
                            value={socialLinks.youtube}
                            onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-border-light bg-white text-text-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="https://youtube.com/@lezzetduragi"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg disabled:opacity-50"
                    >
                      {saving ? "Kaydediliyor..." : "Kaydet"}
                    </button>
                  </form>
                )}

                {/* Home Page Tab */}
                {activeTab === "home" && (
                  <form onSubmit={handleHomeSubmit} className="space-y-6">
                    <div className="rounded-xl border border-border-light bg-white/95 p-6 shadow-sm ring-1 ring-black/[0.04]">
                      <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-text-light">
                          Ana Sayfa İçeriği
                        </h2>
                        <button
                          type="submit"
                          disabled={saving}
                          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition disabled:opacity-50"
                          title="Ayarları Kaydet"
                        >
                          <span className="material-symbols-outlined text-base">save</span>
                          {saving ? "Kaydediliyor..." : "Kaydet"}
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-text-light mb-2">
                            Hero Başlık
                          </label>
                                                    <input
                            type="text"
                            value={homeContent.hero_title}
                            onChange={(e) => setHomeContent({ ...homeContent, hero_title: e.target.value })}
                            className="w-full rounded-lg border border-border-light bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Hoş Geldiniz"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text-light mb-2">
                            Hero Alt Başlık
                          </label>
                          <input
                            type="text"
                            value={homeContent.hero_subtitle}
                            onChange={(e) => setHomeContent({ ...homeContent, hero_subtitle: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-border-light bg-white text-text-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="Geleneksel lezzetlerin modern yorumlarıyla..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text-light mb-2">
                            Hero Arka Plan Resmi
                          </label>
                          <SingleImageUpload
                            imageUrl={homeContent.hero_image}
                            onImageChange={(url: string) => setHomeContent({ ...homeContent, hero_image: url })}
                            bucketName="menu-images"
                            label="Hero Resmi"
                            aspectRatio="aspect-[21/9]"
                          />
                        </div>

                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg disabled:opacity-50"
                    >
                      {saving ? "Kaydediliyor..." : "Kaydet"}
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
