"use client";

import Image from "next/image";
import type { Comment } from "@/lib/types";

interface CustomerCommentsProps {
  comments: Comment[];
}

export default function CustomerComments({ comments }: CustomerCommentsProps) {
  if (comments.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-8 sm:py-14 lg:py-16 bg-gradient-to-b from-transparent via-primary/5 to-transparent dark:via-primary/10">
      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl dark:bg-primary/10"></div>
          <div className="absolute bottom-0 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl dark:bg-primary/10"></div>
        </div>

        {/* Header */}
        <div className="text-center space-y-4 relative z-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-1 w-8 bg-gradient-to-r from-transparent to-primary rounded-full"></div>
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              Müşteri Deneyimleri
            </span>
            <div className="h-1 w-8 bg-gradient-to-l from-transparent to-primary rounded-full"></div>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-text-light dark:text-text-dark bg-clip-text">
            Müşteri Yorumları
          </h2>
          <p className="max-w-2xl mx-auto text-subtle-light dark:text-subtle-dark text-base sm:text-lg leading-relaxed">
            Ziyaretçilerimizin deneyimleri bizim için en önemli geribildirim. Sizin de görüşleriniz bizim için çok değerli!
          </p>
        </div>

        {/* Comments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 relative z-10">
          {comments.map((comment, index) => (
            <div
              key={comment.id}
              className="group relative h-full"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Card Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

              {/* Main Card */}
              <div className="relative h-full flex flex-col gap-5 rounded-2xl border border-border-light/40 dark:border-border-dark/40 bg-gradient-to-br from-white/80 to-white/50 dark:from-background-dark/80 dark:to-background-dark/50 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:border-primary/30 dark:hover:border-primary/40 transition-all duration-300 p-6 sm:p-7">
                
                {/* Quotation Mark */}
                <div className="absolute top-4 right-6 text-5xl text-primary/10 font-serif">
                  "
                </div>

                {/* Top Section: Stars and Name */}
                <div className="space-y-3">
                  {/* Rating Stars */}
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`material-symbols-outlined text-xl transition-transform duration-300 ${
                          i < comment.rating
                            ? 'text-yellow-400 fill-current scale-100'
                            : 'text-border-light/30 dark:text-border-dark/30'
                        }`}
                      >
                        star
                      </span>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-text-light dark:text-text-dark">
                      {comment.customer_name}
                    </h3>
                    <p className="text-xs font-medium text-subtle-light dark:text-subtle-dark uppercase tracking-wider">
                      {new Date(comment.created_at).toLocaleDateString('tr-TR', {
                        day: '2-digit',
                        month: 'short',
                        year: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Comment Text */}
                <p className="text-base leading-relaxed text-text-light dark:text-text-dark font-light flex-1 italic">
                  {comment.comment_text}
                </p>

                {/* Divider */}
                <div className="w-12 h-1 bg-gradient-to-r from-primary to-primary/30 rounded-full"></div>

                {/* Customer Info Section */}
                {comment.customer_image_url ? (
                  <div className="flex items-center gap-3 pt-2">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-primary/20">
                      <Image
                        src={comment.customer_image_url}
                        alt={comment.customer_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-light dark:text-text-dark">
                        {comment.customer_name}
                      </p>
                      {comment.customer_email && (
                        <p className="text-xs text-subtle-light dark:text-subtle-dark truncate">
                          {comment.customer_email}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-primary text-xl">
                        account_circle
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-text-light dark:text-text-dark">
                        {comment.customer_name}
                      </p>
                      {comment.customer_email && (
                        <p className="text-xs text-subtle-light dark:text-subtle-dark truncate">
                          {comment.customer_email}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section - Premium Style */}
        <div className="relative z-10 mt-12">
          <div className="rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 dark:from-primary/20 dark:via-primary/30 dark:to-primary/20 backdrop-blur-xl px-6 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-12 overflow-hidden">
            {/* Decorative Corner Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-primary/10 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl"></div>

            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-2xl sm:text-3xl font-black text-text-light dark:text-text-dark">
                  Deneyiminizi Paylaşın
                </h3>
                <p className="text-base text-text-light/80 dark:text-text-dark/80 max-w-xl">
                  Restoranımızdaki deneyiminizi diğer müşterilerle paylaş ve bize değerli geri bildirim ver.
                </p>
              </div>
              <a
                href="/contact"
                className="group/btn inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-dark px-8 py-4 text-base font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-xl group-hover/btn:rotate-12 transition-transform">
                  edit
                </span>
                <span>Yorum Yaz</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

