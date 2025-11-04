import Link from "next/link";
import Image from "next/image";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { getPageBySlug, getSiteSetting, getFeaturedMenuItems } from "@/lib/api";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  // Fetch page content, site settings, and featured menu items from Supabase
  const [pageData, contactInfo, featuredItems] = await Promise.all([
    getPageBySlug('home'),
    getSiteSetting('contact_info'),
    getFeaturedMenuItems()
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

  const philosophy = {
    text: pageData?.content?.philosophy?.text || 'Restoranımızda, sade ve yüksek kaliteli malzemelerin gücüne inanıyoruz. Her tabak, taze yerel ürünlerle ve tutku ile hazırlanır.'
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <Header />
          <main className="flex flex-1 justify-center py-5 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8 bg-[#FED301] text-black">
            <div className="layout-content-container flex flex-col max-w-7xl flex-1 gap-8 md:gap-12">
              {/* SectionHeader Component */}
              <section>
                <h2 className="text-2xl md:text-3xl font-bold leading-tight tracking-[-0.015em] text-center">Öne Çıkan Yemeklerimiz</h2>
                <p className="text-center text-subtle-light dark:text-subtle-dark mt-2 max-w-xl mx-auto">Şeflerimizin en gurur duyduğu kreasyonları keşfedin, en sevilen ve imza yemeklerimizin bir seçkisi.</p>
              </section>
              {/* ImageGrid Component */}
              <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayDishes.map((dish: any, index: number) => (
                    <div
                      key={index}
                      className="flex flex-col gap-3 rounded-lg bg-background-light pb-3 shadow-sm transition-all hover:shadow-lg dark:bg-surface-dark"
                    >
                      <div className="relative aspect-video w-full rounded-t-lg overflow-hidden">
                        <Image
                          src={dish.image}
                          alt={dish.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      <div className="px-4">
                        <p className="text-lg font-bold">{dish.title}</p>
                        <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary line-clamp-2 mt-1">
                          {dish.description}
                        </p>
                        {dish.price && (
                          <p className="mt-2 text-base font-semibold text-primary">
                            ₺{dish.price.toFixed(2)}
                          </p>
                        )}

                        {/* WhatsApp Order Button */}
                        <div className="flex gap-2 mt-4">
                          <a
                            href={contactInfo?.phone
                              ? `https://wa.me/${contactInfo.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Merhaba! ${dish.title} hakkında bilgi almak istiyorum. Fiyat: ₺${dish.price ? dish.price.toFixed(2) : 'Bilgi için iletişime geçin'}`)}`
                              : `https://wa.me/?text=${encodeURIComponent(`Merhaba! ${dish.title} hakkında bilgi almak istiyorum. Fiyat: ₺${dish.price ? dish.price.toFixed(2) : 'Bilgi için iletişime geçin'}`)}`
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
                        </div>
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
