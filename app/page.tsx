import Link from "next/link";
import Image from "next/image";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeSlider from "./components/HomeSlider";
import CustomerComments from "./components/CustomerComments";
import { getPageBySlug, getSiteSetting, getFeaturedMenuItems, getApprovedComments } from "@/lib/api";
import type { SliderItem } from "./components/HomeSlider";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  // Fetch page content, site settings, featured menu items, and comments from Supabase
  const [pageData, contactInfo, featuredItems, homeContentSetting, comments] = await Promise.all([
    getPageBySlug('home'),
    getSiteSetting('contact_info'),
    getFeaturedMenuItems(),
    getSiteSetting('home_content'),
    getApprovedComments(),
  ]);

  // Use featured items from database, fallback to static content
  const displayDishes = featuredItems.length > 0 
    ? featuredItems.map(item => ({
        image: item.images && item.images.length > 0 ? item.images[0] : item.image_url || 'https://placehold.co/600x400?text=No+Image',
        title: item.title,
        description: item.description || '',
        price: item.price
      }))
    : (pageData?.content?.featured_dishes || [
        {
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsBAdfd5emfCtiAJNxluc7m1dPbU-E3QTXGy-nOtxVH2VAFeZaWPuFQTQtVqguRBPhJStsn5gnGZQlJ2aNkP7CrwtP9qtajqw-74Av0flEbbZBrdWefEgQqbF-y9z4nolN0xAvXentBnMKMFDPoEV21hYLiEDUrfhevukx8W5lvsqhul7bx_B8katfJSoPNuu2XIi5NANScxxmiaX2Qmpcw9atCy6e_l5nfz3jqBvO08-c0Kp_HePIiq7CQvOUT-uarfGWqMiBgiDg',
          title: 'Izgara Somon',
          description: 'Taze sebzeler ve limon dilimleri eşliğinde.'
        },
        {
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkllhwFewInX1zrPAb_P0EU1dlJJ98xiN3kxpUp8GRCIWF1jCDoK6TejVKImLPLAXSh3jOSOXkpuTJWYPoGnT190x8XfmqaCHTbo5PJsOazfcr9pMuiHgRpXzKdWiHE-k0eVbUKu-r831FDQ7ToJ3VPEXEIcIojKJKGG33uwuY6Lf5Hah2MCW9cqWeKZ7UlrbFpx9BnCk8B4upXiZkmtcKTJmhZUpKdW6t2Znexb_rHK9PmpdCnlRKZEyM7aRO5kpJKCU6hC0hx6WT',
          title: 'Klasik Beef Bourguignon',
          description: 'Yavaş pişirilmiş et, kırmızı şarap ve mantarlarla.'
        },
        {
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeP5t7qpOG-QTpb_7smXpM9jy848iTp35eyzasu0m1FuOQ2h-e_TZW8o4VAtMZbyJRJVgk9z-H55bPBoCcsmIautYZeY6BkslTgYuqEl_fdqZOVXOUz8hHrky45NAOBhLbaCaE1GW98lr_IG9SedWF47I8i-XMk_Ld5zlZnku2txn6vMoUPPJb9nwIVYsfQFZPiz8DGbFYkUAmGkZteqyvTwghZVFzBj5KPke3c8FNb2h2JI8Zt1tl7xAwAUH0Ole4GcEWHPWNqDeg',
          title: 'Trüf Mantarlı Risotto',
          description: 'Arborio pilavı, yabani mantarlar ve siyah trüf yağı ile.'
        }
      ]);


  const homeContent = (homeContentSetting as any) || {};

  const sliderItems = Array.isArray(homeContent?.slider)
    ? (homeContent.slider as SliderItem[])
    : undefined;

  const aboutSection = {
    title: homeContent?.about_title || "Delights for Life'a Hoş Geldiniz",
    subtitle: homeContent?.about_subtitle || "Geleneksel tatları modern dokunuşlarla buluşturuyoruz.",
    description:
      homeContent?.about_description ||
      "Ailemizin nesilden nesile aktardığı tarifleri, taze malzemelerle ve şeflerimizin uzmanlığıyla yeniden yorumluyoruz. Samimi atmosferimizde, her tabak evinizdeymiş gibi hissettirmek için hazırlanır.",
    image:
      homeContent?.about_image ||
      "https://images.unsplash.com/photo-1604908177225-055f99402ea2?auto=format&fit=crop&w=1600&q=80",
    highlights:
      Array.isArray(homeContent?.about_highlights) && homeContent.about_highlights.length
        ? homeContent.about_highlights
        : [
            "Günlük taze malzemelerle hazırlanan menü",
            "Şef imzalı yöresel ve dünya lezzetleri",
            "Sıcak ve samimi servis anlayışı",
          ],
  };

  const highlightStats = [
    {
      icon: "restaurant_menu",
      title: "30+ Özel Lezzet",
      description: "Şeflerimizin özenle hazırladığı mevsimlik tarifler",
    },
    {
      icon: "local_florist",
      title: "Yerel Malzemeler",
      description: "En taze ürünleri doğrudan yerel üreticilerden temin ediyoruz",
    },
    {
      icon: "event_available",
      title: "Rezervasyon Kolaylığı",
      description: "Hızlıca yer ayırtın, size özel masanızı hazırlayalım",
    },
  ];

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <Header />
          <HomeSlider slides={sliderItems} className="bg-background-light dark:bg-background-dark" />
          <main className="relative flex flex-1 justify-center px-4 sm:px-6 lg:px-8 pb-16">
            <div className="w-full mt-6 sm:mt-10 lg:mt-12">
              <div className="mx-auto max-w-6xl space-y-12">
                <section className="grid grid-cols-1 gap-8 rounded-3xl border border-white/60 dark:border-border-dark bg-white/95 dark:bg-surface-dark/90 shadow-2xl backdrop-blur px-6 py-8 sm:px-10 sm:py-12 lg:grid-cols-[1.05fr_0.95fr]">
                  <div className="space-y-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-dark">
                      {aboutSection.subtitle}
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-black leading-tight text-text-light dark:text-text-dark">
                      {aboutSection.title}
                    </h2>
                    <p className="text-base text-subtle-light dark:text-subtle-dark leading-relaxed">
                      {aboutSection.description}
                    </p>
                    <div className="pt-2">
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark shadow-lg shadow-primary/30"
                      >
                        <span className="material-symbols-outlined text-base">event</span>
                        Rezervasyon Talep Et
                      </Link>
                    </div>
                  </div>
                  <div className="relative h-64 w-full overflow-hidden rounded-3xl bg-border-light/40 dark:bg-border-dark/40">
                    <Image
                      src={aboutSection.image}
                      alt={aboutSection.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-transparent" />
                  </div>
                </section>

                <div className="rounded-3xl border border-white/60 dark:border-border-dark bg-white/95 dark:bg-surface-dark/90 shadow-2xl backdrop-blur-sm px-6 py-8 sm:px-10 sm:py-12 space-y-12">
                  <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {highlightStats.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-2xl bg-surface-light/80 dark:bg-background-dark/50 border border-border-light/60 dark:border-border-dark px-5 py-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition duration-300"
                      >
                        <span className="material-symbols-outlined text-primary text-3xl mb-3 block">
                          {item.icon}
                        </span>
                        <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">{item.title}</h3>
                        <p className="mt-2 text-sm text-subtle-light dark:text-subtle-dark leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </section>

                  <section className="text-center space-y-3">
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-text-light">Öne Çıkan Lezzetlerimiz</h2>
                    <p className="max-w-2xl mx-auto text-subtle-light dark:text-subtle-dark text-base">
                      Şeflerimizin gururla hazırladığı imza yemeklerimizle sofranızı şenlendirin. Her biri taze malzemelerle ve ince detaylarla hazırlanır.
                    </p>
                  </section>

                  <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayDishes.map((dish: any, index: number) => (
                      <div
                        key={index}
                        className="group flex flex-col overflow-hidden rounded-2xl border border-border-light/70 dark:border-border-dark bg-white dark:bg-background-dark shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
                      >
                        <div className="relative h-48 w-full overflow-hidden">
                          <Image
                            src={dish.image}
                            alt={dish.title}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          <span className="absolute bottom-3 left-3 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-white shadow">
                            Şefin Önerisi
                          </span>
                        </div>
                        <div className="flex flex-1 flex-col gap-3 px-5 py-5">
                          <div>
                            <p className="text-lg font-semibold text-text-light dark:text-text-dark">{dish.title}</p>
                            <p className="text-sm text-subtle-light dark:text-subtle-dark mt-1 line-clamp-2">
                              {dish.description}
                            </p>
                          </div>
                          {dish.price && (
                            <p className="text-xl font-bold text-primary-dark">
                              ₺{dish.price.toFixed(2)}
                            </p>
                          )}
                          <div className="mt-auto">
                            <a
                              href={contactInfo?.phone
                                ? `https://wa.me/${contactInfo.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Merhaba! ${dish.title} hakkında bilgi almak istiyorum. Fiyat: ₺${dish.price ? dish.price.toFixed(2) : 'Bilgi için iletişime geçin'}`)}`
                                : `https://wa.me/?text=${encodeURIComponent(`Merhaba! ${dish.title} hakkında bilgi almak istiyorum. Fiyat: ₺${dish.price ? dish.price.toFixed(2) : 'Bilgi için iletişime geçin'}`)}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
                            >
                              <span className="material-symbols-outlined text-base">chat</span>
                              WhatsApp ile Sipariş
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </section>

                  <section className="flex flex-col items-center gap-4 rounded-2xl border border-primary/20 bg-primary/10 px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold text-primary-dark">Tüm Menüyü Keşfedin</h3>
                      <p className="text-sm text-primary-dark/80">
                        Gelenekselden moderne, her damak tadına uygun lezzetlerimiz sizi bekliyor.
                      </p>
                    </div>
                    <Link
                      href="/menu"
                      className="inline-flex min-w-[180px] items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-primary-dark"
                    >
                      <span className="material-symbols-outlined text-base">local_dining</span>
                      Tam Menüyü Gör
                    </Link>
                  </section>

                  <section className="rounded-2xl border border-border-light/70 dark:border-border-dark bg-surface-light/80 dark:bg-background-dark/60 px-6 py-6 space-y-4">
                    <h3 className="text-2xl font-bold text-text-light dark:text-text-dark">Bizi Ziyaret Edin</h3>
                    <div className="space-y-3 text-subtle-light dark:text-subtle-dark">
                      {contactInfo && (
                        <>
                          {contactInfo.address && (
                            <p className="flex items-start gap-3">
                              <span className="material-symbols-outlined text-primary mt-1" data-icon="location_on">location_on</span>
                              <span>{contactInfo.address}</span>
                            </p>
                          )}
                          {contactInfo.phone && (
                            <p className="flex items-start gap-3">
                              <span className="material-symbols-outlined text-primary mt-1" data-icon="call">call</span>
                              <span>{contactInfo.phone}</span>
                            </p>
                          )}
                          {contactInfo.email && (
                            <p className="flex items-start gap-3">
                              <span className="material-symbols-outlined text-primary mt-1" data-icon="mail">mail</span>
                              <span>{contactInfo.email}</span>
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </section>
                </div>

                {/* Customer Comments Section */}
                <div className="rounded-3xl border border-white/60 dark:border-border-dark bg-white/95 dark:bg-surface-dark/90 shadow-2xl backdrop-blur-sm overflow-hidden">
                  <CustomerComments comments={comments} />
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
