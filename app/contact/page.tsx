"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getSiteSetting } from "@/lib/api";

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [openingHours, setOpeningHours] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const contact = await getSiteSetting('contact_info');
      setContactInfo(contact);
      // Working hours are now stored in contact_info.hours field
      if (contact?.hours) {
        setOpeningHours(contact.hours);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject') || 'İletişim Formu',
      message: formData.get('message')
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.' });
        (e.target as HTMLFormElement).reset();
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="font-display bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen">
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
          <div className="layout-container flex h-full grow flex-col">
            <Header />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 rounded-full animate-spin border-t-primary"></div>
                <p className="text-text-light dark:text-text-dark text-lg font-medium">Yükleniyor...</p>
              </div>
            </main>
            <Footer />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <Header />

          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
            <div className="flex flex-wrap justify-between gap-4 mb-10 md:mb-12">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-text-light dark:text-text-dark text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">İletişim</p>
                <p className="text-subtle-light dark:text-subtle-dark text-base font-normal leading-normal">Bize ulaşın, sorularınız ve önerileriniz için formu kullanabilirsiniz.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
              <div className="lg:col-span-2 flex flex-col gap-10">
                <div>
                  <h2 className="text-text-light dark:text-text-dark text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">İletişim Bilgilerimiz</h2>
                  <div className="grid grid-cols-1 border-t border-border-light dark:border-border-dark">
                    {contactInfo && (
                      <>
                        <div className="grid grid-cols-[auto_1fr] gap-x-4 py-5">
                          <span className="material-symbols-outlined text-primary mt-0.5">location_on</span>
                          <div>
                            <p className="text-subtle-light dark:text-subtle-dark text-sm font-normal leading-normal">Adres</p>
                            <p className="text-text-light dark:text-text-dark text-sm font-normal leading-normal">{contactInfo.address}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-[auto_1fr] gap-x-4 py-5 border-t border-border-light dark:border-border-dark">
                          <span className="material-symbols-outlined text-primary mt-0.5">phone</span>
                          <div>
                            <p className="text-subtle-light dark:text-subtle-dark text-sm font-normal leading-normal">Telefon</p>
                            <p className="text-text-light dark:text-text-dark text-sm font-normal leading-normal">{contactInfo.phone}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-[auto_1fr] gap-x-4 py-5 border-t border-border-light dark:border-border-dark">
                          <span className="material-symbols-outlined text-primary mt-0.5">mail</span>
                          <div>
                            <p className="text-subtle-light dark:text-subtle-dark text-sm font-normal leading-normal">E-posta</p>
                            <p className="text-text-light dark:text-text-dark text-sm font-normal leading-normal">{contactInfo.email}</p>
                          </div>
                        </div>
                      </>
                    )}
                    {openingHours && (
                      <div className="grid grid-cols-[auto_1fr] gap-x-4 py-5 border-t border-border-light dark:border-border-dark">
                        <span className="material-symbols-outlined text-primary mt-0.5">schedule</span>
                        <div>
                          <p className="text-subtle-light dark:text-subtle-dark text-sm font-normal leading-normal">Çalışma Saatleri</p>
                          <p className="text-text-light dark:text-text-dark text-sm font-normal leading-normal whitespace-pre-line">
                            {openingHours}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3">
                <div className="bg-white dark:bg-background-dark p-6 sm:p-8 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
                  <h3 className="text-2xl font-bold tracking-tight text-text-light dark:text-text-dark mb-6">Bize Mesaj Gönderin</h3>
                  
                  {message && (
                    <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'}`}>
                      {message.text}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-subtle-light dark:text-subtle-dark" htmlFor="name">
                        Ad Soyad <span className="text-red-500">*</span>
                      </label>
                      <input 
                        className="w-full rounded-md border border-border-light dark:border-border-dark bg-background-light dark:bg-black/20 focus:border-primary focus:ring-primary text-sm px-4 py-2 placeholder:text-subtle-light/70 dark:placeholder:text-subtle-dark/50" 
                        id="name" 
                        name="name"
                        placeholder="Adınız ve soyadınız" 
                        type="text"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-subtle-light dark:text-subtle-dark" htmlFor="email">
                        E-posta <span className="text-red-500">*</span>
                      </label>
                      <input 
                        className="w-full rounded-md border border-border-light dark:border-border-dark bg-background-light dark:bg-black/20 focus:border-primary focus:ring-primary text-sm px-4 py-2 placeholder:text-subtle-light/70 dark:placeholder:text-subtle-dark/50" 
                        id="email" 
                        name="email"
                        placeholder="ornek@email.com" 
                        type="email"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-subtle-light dark:text-subtle-dark" htmlFor="subject">
                        Konu
                      </label>
                      <input 
                        className="w-full rounded-md border border-border-light dark:border-border-dark bg-background-light dark:bg-black/20 focus:border-primary focus:ring-primary text-sm px-4 py-2 placeholder:text-subtle-light/70 dark:placeholder:text-subtle-dark/50" 
                        id="subject" 
                        name="subject"
                        placeholder="Mesajınızın konusu" 
                        type="text"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-subtle-light dark:text-subtle-dark" htmlFor="message">
                        Mesajınız <span className="text-red-500">*</span>
                      </label>
                      <textarea 
                        className="w-full rounded-md border border-border-light dark:border-border-dark bg-background-light dark:bg-black/20 focus:border-primary focus:ring-primary text-sm px-4 py-2 placeholder:text-subtle-light/70 dark:placeholder:text-subtle-dark/50" 
                        id="message" 
                        name="message"
                        placeholder="Mesajınızı buraya yazın..." 
                        rows={6}
                        required
                      />
                    </div>

                    <div>
                      <button 
                        disabled={submitting}
                        className="w-full flex items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-background-dark text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed" 
                        type="submit"
                      >
                        <span className="truncate">{submitting ? 'Gönderiliyor...' : 'Mesajı Gönder'}</span>
                      </button>
                    </div>
                  </form>
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
