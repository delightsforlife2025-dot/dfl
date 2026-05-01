"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import DashboardSidebar from "../../../components/DashboardSidebar";

export default function AddCommentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    comment_text: "",
    rating: 5,
    is_approved: true,
  });

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value, 10),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.customer_name.trim()) {
        throw new Error("Müşteri adı gereklidir");
      }
      if (!formData.comment_text.trim()) {
        throw new Error("Yorum metni gereklidir");
      }

      const { error: insertError } = await supabase
        .from("comments")
        .insert([
          {
            customer_name: formData.customer_name,
            customer_email: formData.customer_email || null,
            comment_text: formData.comment_text,
            rating: formData.rating,
            is_approved: formData.is_approved,
          },
        ]);

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/comments");
        router.refresh();
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Yorum eklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="font-display bg-background-light min-h-screen">
      <div className="flex">
        <DashboardSidebar activePage="comments" />

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 lg:p-10">
          <div className="mx-auto max-w-2xl">
            {/* Page Heading */}
            <div className="mb-8">
              <Link
                href="/dashboard/comments"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-4"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Geri Dön
              </Link>
              <p className="text-text-light text-4xl font-black leading-tight tracking-[-0.033em]">
                Yorum Ekle
              </p>
              <p className="text-subtle-light text-base mt-2">
                Yeni bir müşteri yorumu ekleyin
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 rounded-lg bg-green-100 border border-green-200 text-green-700">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  <span>Yorum başarıyla eklendi!</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-100 border border-red-200 text-red-700">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">error</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Name */}
              <div>
                <label className="block text-sm font-semibold text-text-light mb-2">
                  Müşteri Adı *
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  placeholder="örn: Ahmet Yılmaz"
                  className="w-full px-4 py-2 rounded-lg border border-border-light bg-white text-text-light placeholder-text-secondary-light focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {/* Customer Email */}
              <div>
                <label className="block text-sm font-semibold text-text-light mb-2">
                  E-posta (opsiyonel)
                </label>
                <input
                  type="email"
                  name="customer_email"
                  value={formData.customer_email}
                  onChange={handleInputChange}
                  placeholder="örn: ahmet@example.com"
                  className="w-full px-4 py-2 rounded-lg border border-border-light bg-white text-text-light placeholder-text-secondary-light focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-text-light mb-2">
                  Puan (1-5)
                </label>
                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-border-light bg-white text-text-light focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={5}>★★★★★ (5 Yıldız)</option>
                  <option value={4}>★★★★ (4 Yıldız)</option>
                  <option value={3}>★★★ (3 Yıldız)</option>
                  <option value={2}>★★ (2 Yıldız)</option>
                  <option value={1}>★ (1 Yıldız)</option>
                </select>
              </div>

              {/* Comment Text */}
              <div>
                <label className="block text-sm font-semibold text-text-light mb-2">
                  Yorum Metni *
                </label>
                <textarea
                  name="comment_text"
                  value={formData.comment_text}
                  onChange={handleInputChange}
                  placeholder="Müşterinin yorumunu girin..."
                  rows={6}
                  className="w-full px-4 py-2 rounded-lg border border-border-light bg-white text-text-light placeholder-text-secondary-light focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  required
                />
              </div>

              {/* Approval Status */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_approved"
                  name="is_approved"
                  checked={formData.is_approved}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-border-light focus:ring-2 focus:ring-primary cursor-pointer"
                />
                <label
                  htmlFor="is_approved"
                  className="text-sm font-medium text-text-light cursor-pointer"
                >
                  Bu yorumu hemen yayınla (onayla)
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6">
                <button
                  type="submit"
                  disabled={loading || success}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white px-4 py-3 font-semibold transition"
                >
                  <span className="material-symbols-outlined text-base">
                    {loading ? "schedule" : "add"}
                  </span>
                  {loading ? "Ekleniyor..." : "Yorum Ekle"}
                </button>
                <Link
                  href="/dashboard/comments"
                  className="flex items-center justify-center gap-2 rounded-lg border border-border-light bg-white px-4 py-3 font-semibold text-text-light transition hover:bg-border-light"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                  İptal
                </Link>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

