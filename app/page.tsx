import Link from "next/link";
import Image from "next/image";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { getPageBySlug, getSiteSetting, getFeaturedMenuItems } from "@/lib/api";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  // Fetch page content, site settings, and featured menu items from Supabase
  const [pageData, contactInfo, featuredItems, homeContent] = await Promise.all([
    getPageBySlug('home'),
    getSiteSetting('contact_info'),
    getFeaturedMenuItems(),
    getSiteSetting('home_content')
  ]);

  // Use home_content settings from database, with fallback to pageData or defaults
  const hero = {
    title: homeContent?.hero_title || pageData?.content?.hero?.title || 'Hoş Geldiniz',
    subtitle: homeContent?.hero_subtitle || pageData?.content?.hero?.subtitle || 'Geleneksel lezzetlerin modern yorumlarıyla buluştuğu bir deneyim.',
    backgroundImage: homeContent?.hero_image || pageData?.content?.hero?.backgroundImage || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUDkrTsFEKYuLNX8HnEMUSpoYtQflqJNzEbgqjryRXaSrQ4smsv8MynHcEyt2vchmxuOmoi0a9Pvr4Zf7Ozf42zzO2qf3j1H38lz0Pt9mLZbG0YGjQvyD3408jns1BAIoZhGoc8NV3jOr_q7qiSUwwGhLayA6V-H710Ww5qIRaAGuVcq0M6d6eg_1tlVZSHf6xtHOE_SVwK2JuFJGGVJGWhxeQdAoVTrvOy8gNFluo9C1zt3I_DdyHyb19HBDMT-BY0KFWawBc8scT'
  };

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

  const philosophy = {
    text: homeContent?.philosophy_text || pageData?.content?.philosophy?.text || 'Restoranımızda, sade ve yüksek kaliteli malzemelerin gücüne inanıyoruz. Her tabak, taze yerel ürünlerle ve tutku ile hazırlanır.'
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <Header />
          <main className="flex flex-1 justify-center py-5 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
            <div className="layout-content-container flex flex-col max-w-7xl flex-1 gap-8 md:gap-12">
              {/* HeroSection Component */}
              <section className="@container">
                <div className="@[480px]:p-0">
                  <div
                    className="flex min-h-[480px] md:min-h-[560px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 rounded-xl items-center justify-center p-4 text-center"
                    data-alt="Warm and inviting interior of a modern restaurant during evening service"
                    style={{
                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url("${hero.backgroundImage}")`,
                    }}
                  >
                    <div className="flex flex-col gap-2">
                      <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl lg:text-6xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                        {hero.title}
                      </h1>
                      <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base lg:text-lg @[480px]:font-normal @[480px]:leading-normal max-w-2xl mx-auto">
                        {hero.subtitle}
                      </h2>
                    </div>
                    <div className="flex flex-wrap gap-3 justify-center">
                      <Link href="/menu" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-primary text-text-light text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] hover:bg-primary/90 transition-colors">
                        <span className="truncate">Menüyü Görüntüle</span>
                      </Link>
                      <Link href="/contact" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-background-light dark:bg-border-dark text-text-light dark:text-text-dark text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] hover:bg-border-light dark:hover:bg-opacity-80 transition-colors">
                        <span className="truncate">Rezervasyon Yap</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
              {/* SectionHeader Component */}
              <section>
                <h2 className="text-2xl md:text-3xl font-bold leading-tight tracking-[-0.015em] text-center">Öne Çıkan Yemeklerimiz</h2>
                <p className="text-center text-subtle-light dark:text-subtle-dark mt-2 max-w-xl mx-auto">Şeflerimizin en gurur duyduğu kreasyonları keşfedin, en sevilen ve imza yemeklerimizin bir seçkisi.</p>
              </section>
              {/* ImageGrid Component */}
              <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayDishes.map((dish: any, index: number) => (
                    <div key={index} className="flex flex-col gap-3 bg-surface-light dark:bg-surface-dark rounded-lg p-4 hover:shadow-lg transition-shadow">
                      <div className="relative w-full aspect-4/3 rounded-lg overflow-hidden">
                        <Image
                          src={dish.image}
                          alt={dish.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      <div>
                        <p className="text-lg font-bold leading-normal">{dish.title}</p>
                        <p className="text-subtle-light dark:text-subtle-dark text-sm font-normal leading-normal mt-1">
                          {dish.description}
                        </p>
                        {dish.price && (
                          <p className="mt-2 text-base font-semibold text-primary">
                            ₺{dish.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              {/* SingleButton Component */}
              <section className="flex justify-center">
                <Link href="/menu" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-text-light text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
                  <span className="truncate">Tam Menüyü Keşfet</span>
                </Link>
              </section>
              {/* Information Section */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 py-8 border-t border-b border-border-light dark:border-border-dark">
                <div className="flex flex-col gap-4">
                  <h3 className="text-2xl font-bold">Felsefemiz</h3>
                  <p className="text-subtle-light dark:text-subtle-dark leading-relaxed">
                    {philosophy.text}
                  </p>
                </div>
                <div className="flex flex-col gap-4 rounded-lg bg-background-light dark:bg-border-dark p-6 border border-border-light dark:border-border-dark">
                  <h3 className="text-2xl font-bold">Bizi Ziyaret Edin</h3>
                  <div className="space-y-3 text-subtle-light dark:text-subtle-dark">
                    {contactInfo && (
                      <>
                        <p className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-primary mt-1" data-icon="location_on">location_on</span>
                          <span>{contactInfo.address}</span>
                        </p>
                        <p className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-primary mt-1" data-icon="call">call</span>
                          <span>{contactInfo.phone}</span>
                        </p>
                        {contactInfo.email && (
                          <p className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-primary mt-1" data-icon="mail">mail</span>
                            <span>{contactInfo.email}</span>
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </section>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
