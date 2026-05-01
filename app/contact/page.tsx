"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getSiteSetting } from "@/lib/api";
import { asContactInfo, type ContactInfo } from "@/lib/types";

const MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3060.246954169622!2d32.85447377580115!3d39.91348937152496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d34f002fa84ac7%3A0x7d8304e3a9977519!2sDelights%20for%20Life!5e0!3m2!1sen!2str!4v1777669339824!5m2!1sen!2str";

/** Same coordinates as the embedded map (Delights for Life). */
const MAP_DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=39.91348937152496%2C32.85447377580115";

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [openingHours, setOpeningHours] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const contact = asContactInfo(await getSiteSetting("contact_info"));
      setContactInfo(contact);
      if (contact?.hours && typeof contact.hours === "string") {
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
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject") || "İletişim Formu",
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.",
        });
        (e.target as HTMLFormElement).reset();
      } else {
        throw new Error("Failed to submit");
      }
    } catch {
      setMessage({ type: "error", text: "Bir hata oluştu. Lütfen tekrar deneyin." });
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-[#e8c44a]/80 bg-white px-4 py-3 text-sm text-[#2a1a00] shadow-sm outline-none transition placeholder:text-subtle-light/60 focus:border-primary focus:ring-2 focus:ring-primary/25";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5bf00] font-display text-text-light">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex flex-1 items-center justify-center px-4 py-16">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/25 border-t-primary" />
              <p className="font-medium text-[#2a1a00]">Yükleniyor...</p>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5bf00] font-display">
      <Header />

      <main className="pb-16 pt-6 sm:pb-20 sm:pt-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Intro */}
          <div className="mb-10 text-center sm:mb-14">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary-dark">Bize ulaşın</p>
            <h1 className="text-4xl font-black tracking-tight text-[#2a1a00] sm:text-5xl">İletişim</h1>
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-[#5c3d00]">
              Rezervasyon, catering ve sorularınız için yazın veya doğrudan restoranımızı haritadan bulun.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-10 lg:items-start">
            {/* Contact cards + quick actions */}
            <div className="flex flex-col gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {contactInfo?.address ? (
                  <div className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-md backdrop-blur-sm">
                    <span className="material-symbols-outlined mb-2 block text-2xl text-primary">location_on</span>
                    <p className="text-xs font-semibold uppercase tracking-wide text-subtle-light">Adres</p>
                    <p className="mt-1 text-sm font-medium leading-snug text-[#2a1a00]">{contactInfo.address}</p>
                  </div>
                ) : null}

                {contactInfo?.phone ? (
                  <a
                    href={`tel:${String(contactInfo.phone).replace(/\s/g, "")}`}
                    className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-md backdrop-blur-sm transition hover:border-primary/40 hover:shadow-lg"
                  >
                    <span className="material-symbols-outlined mb-2 block text-2xl text-primary">call</span>
                    <p className="text-xs font-semibold uppercase tracking-wide text-subtle-light">Telefon</p>
                    <p className="mt-1 text-sm font-semibold text-primary">{contactInfo.phone}</p>
                  </a>
                ) : null}

                {contactInfo?.email ? (
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-md backdrop-blur-sm transition hover:border-primary/40 hover:shadow-lg sm:col-span-2"
                  >
                    <span className="material-symbols-outlined mb-2 block text-2xl text-primary">mail</span>
                    <p className="text-xs font-semibold uppercase tracking-wide text-subtle-light">E-posta</p>
                    <p className="mt-1 text-sm font-semibold text-primary">{contactInfo.email}</p>
                  </a>
                ) : null}

                {openingHours ? (
                  <div className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-md backdrop-blur-sm sm:col-span-2">
                    <span className="material-symbols-outlined mb-2 block text-2xl text-primary">schedule</span>
                    <p className="text-xs font-semibold uppercase tracking-wide text-subtle-light">Çalışma saatleri</p>
                    <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-[#2a1a00]">{openingHours}</p>
                  </div>
                ) : null}
              </div>

              <a
                href={MAP_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#8f4800] bg-white px-5 py-3 text-sm font-bold text-[#8f4800] shadow-sm transition hover:bg-primary hover:text-white"
              >
                <span className="material-symbols-outlined text-xl">directions</span>
                Google Haritalar’da yol tarifi
              </a>
            </div>

            {/* Form */}
            <div className="rounded-2xl border border-white/60 bg-white p-6 shadow-xl sm:p-8">
              <div className="mb-6 flex items-start gap-3">
                <span className="material-symbols-outlined mt-0.5 text-3xl text-primary">edit_square</span>
                <div>
                  <h2 className="text-xl font-bold text-[#2a1a00] sm:text-2xl">Mesaj gönderin</h2>
                  <p className="mt-1 text-sm text-subtle-light">
                    Catering teklifi, rezervasyon veya genel sorularınız için formu doldurun.
                  </p>
                </div>
              </div>

              {message ? (
                <div
                  className={`mb-6 rounded-xl px-4 py-3 text-sm font-medium ${
                    message.type === "success"
                      ? "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200"
                      : "bg-red-50 text-red-900 ring-1 ring-red-200"
                  }`}
                >
                  {message.text}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#2a1a00]" htmlFor="name">
                    Ad Soyad <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Adınız ve soyadınız"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#2a1a00]" htmlFor="email">
                    E-posta <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="ornek@email.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#2a1a00]" htmlFor="subject">
                    Konu
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="Örn. Catering teklifi"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#2a1a00]" htmlFor="message">
                    Mesajınız <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Mesajınızı buraya yazın..."
                    className={`${inputClass} resize-y min-h-[120px]`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary text-base font-bold text-white shadow-lg transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-55"
                >
                  <span className="material-symbols-outlined text-xl">send</span>
                  {submitting ? "Gönderiliyor..." : "Mesajı gönder"}
                </button>
              </form>
            </div>
          </div>

          {/* Map */}
          <section className="mt-12 sm:mt-16" aria-labelledby="map-heading">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 id="map-heading" className="text-xl font-bold text-[#2a1a00] sm:text-2xl">
                  Konumumuz
                </h2>
                <p className="mt-1 text-sm text-[#5c3d00]">Delights for Life — haritada bizi bulun.</p>
              </div>
              <a
                href={MAP_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-primary hover:text-primary-dark"
              >
                Büyük haritada aç →
              </a>
            </div>
            <div className="overflow-hidden rounded-2xl border-4 border-white/80 bg-white shadow-xl ring-1 ring-black/5">
              <div className="relative aspect-[16/10] w-full min-h-[280px] sm:min-h-[360px] lg:aspect-[21/9] lg:min-h-[400px]">
                <iframe
                  title="Delights for Life — Google Haritalar"
                  src={MAP_EMBED_SRC}
                  className="absolute inset-0 h-full w-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
