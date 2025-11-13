"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import DashboardSidebar from "../components/DashboardSidebar";

export default function DashboardPage() {
  const [messageCount, setMessageCount] = useState(0);
  const [menuItemsCount, setMenuItemsCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    setLoading(true);
    try {
      // Fetch message count
      const { count: messagesCount } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true })
        .eq("handled", false);

      setMessageCount(messagesCount || 0);

      // Fetch menu items count
      const { count: itemsCount } = await supabase
        .from("menu_items")
        .select("*", { count: "exact", head: true });

      setMenuItemsCount(itemsCount || 0);

      // Fetch categories count
      const { count: catsCount } = await supabase
        .from("menu_categories")
        .select("*", { count: "exact", head: true });

      setCategoriesCount(catsCount || 0);

      // Fetch recent messages
      const { data: messages } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      setRecentMessages(messages || []);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen">
      <div className="flex">
        <DashboardSidebar activePage="dashboard" unreadCount={messageCount} />

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 lg:p-10">
          <div className="mx-auto max-w-5xl">
            {/* Page Heading */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
              <p className="text-text-light dark:text-text-dark text-4xl font-black leading-tight tracking-[-0.033em]">
                Hoş Geldiniz
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
              <div className="flex flex-col gap-2 rounded-xl p-6 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-base font-medium leading-normal">
                  Toplam Menü Öğesi
                </p>
                {loading ? (
                  <div className="h-9 w-16 bg-border-light dark:bg-border-dark rounded animate-pulse"></div>
                ) : (
                  <p className="text-text-light dark:text-text-dark tracking-light text-3xl font-bold leading-tight">
                    {menuItemsCount}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2 rounded-xl p-6 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-base font-medium leading-normal">
                  Kategoriler
                </p>
                {loading ? (
                  <div className="h-9 w-16 bg-border-light dark:bg-border-dark rounded animate-pulse"></div>
                ) : (
                  <p className="text-text-light dark:text-text-dark tracking-light text-3xl font-bold leading-tight">
                    {categoriesCount}
                  </p>
                )}
              </div>
              <Link
                href="/dashboard/messages"
                className="flex flex-col gap-2 rounded-xl p-6 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:shadow-lg transition-shadow cursor-pointer"
              >
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-base font-medium leading-normal">
                  Yeni Mesajlar
                </p>
                {loading ? (
                  <div className="h-9 w-16 bg-primary/20 rounded animate-pulse"></div>
                ) : (
                  <p className="text-text-light dark:text-text-dark tracking-light text-3xl font-bold leading-tight text-primary">
                    {messageCount}
                  </p>
                )}
              </Link>
            </div>

            {/* Quick Actions */}
            <h2 className="text-text-light dark:text-text-dark text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
              Hızlı Eylemler
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <Link
                href="/dashboard/menu"
                className="flex flex-col gap-3 pb-3 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 transition-shadow hover:shadow-lg"
              >
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDDOCLz8n3AooB-z_yNc13ir9kpPWY1W1c6a1jSP2LwRGQgmZaQ6hMJTpFhQqyMYCM1Vrab7ZcvOOfPkOSFeDbabfv-9h5fjRjKB2iUHusDtKsA8WBV03ZowqdiHKZ32WMKmu4POuDrlCnhAk6cnippRKbUu0a5EUyjZWaqVLrCaPgIhNG8r77WHXbEELRqhu-j9UGGvG12_BgPww25AoPwa7IwGMJIl10RnWoWHOn8xIxEJCErw4TXlUcntGJBhLhZy1AflcgRbEj2")',
                  }}
                ></div>
                <div>
                  <p className="text-text-light dark:text-text-dark text-base font-semibold leading-normal">
                    Menüyü Yönet
                  </p>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal mt-1">
                    Yeni yemekler ekleyin veya mevcutları güncelleyin.
                  </p>
                </div>
              </Link>

              <Link
                href="/dashboard/settings"
                className="flex flex-col gap-3 pb-3 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 transition-shadow hover:shadow-lg"
              >
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDlroQXKIDvIDtETXyO4LyO11YpOrx2LtiyADWhFKKKz4PboaYahQW7xCwP0ban4uTlMOuI6BoYDQqistt0XFZ6vYmQlsA_UT9r23E7aiSfDXS6fBheEjr6TL4zVM0eh89Y_fBl_XOshmgFvI1MnNMFvrn7kYGuVtuFFSqRSSrxBs7LOvFQSJGej8QwDI5Nxfu3sPYqd297r5pLipmo_kBId5AkUjfIV2llb1w534OyCpUws0yp-ZUopHM_fBuGNpANdLVWUNvEHHF3")',
                  }}
                ></div>
                <div>
                  <p className="text-text-light dark:text-text-dark text-base font-semibold leading-normal">
                    Site Bilgilerini Düzenle
                  </p>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal mt-1">
                    Hakkımızda veya iletişim bilgilerinizi güncelleyin.
                  </p>
                </div>
              </Link>
            </div>

            {/* Recent Messages */}
            <div className="w-full">
              <h2 className="text-text-light dark:text-text-dark text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
                Son Mesajlar
              </h2>
              <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs text-text-secondary-light dark:text-text-secondary-dark uppercase bg-background-light dark:bg-background-dark border-b border-border-light dark:border-border-dark">
                      <tr>
                        <th className="px-6 py-3 font-medium" scope="col">
                          İsim
                        </th>
                        <th className="px-6 py-3 font-medium" scope="col">
                          E-posta
                        </th>
                        <th className="px-6 py-3 font-medium" scope="col">
                          Tarih
                        </th>
                        <th className="px-6 py-3 font-medium text-right" scope="col">
                          Eylem
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-8">
                            <div className="flex justify-center">
                              <div className="w-8 h-8 border-4 border-primary/20 rounded-full animate-spin border-t-primary"></div>
                            </div>
                          </td>
                        </tr>
                      ) : recentMessages.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
                            Henüz mesaj yok
                          </td>
                        </tr>
                      ) : (
                        recentMessages.map((message) => (
                          <tr key={message.id} className="border-b border-border-light dark:border-border-dark last:border-0">
                            <td className="px-6 py-4 font-medium text-text-light dark:text-text-dark">
                              {message.name}
                            </td>
                            <td className="px-6 py-4 text-text-secondary-light dark:text-text-secondary-dark">
                              {message.email}
                            </td>
                            <td className="px-6 py-4 text-text-secondary-light dark:text-text-secondary-dark">
                              {new Date(message.created_at).toLocaleDateString('tr-TR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Link
                                href="/dashboard/messages"
                                className="text-primary hover:underline font-medium"
                              >
                                Görüntüle
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
