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
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-transparent via-primary/5 to-transparent py-8 sm:py-14 lg:py-16">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-10 top-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 space-y-4 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <div className="h-1 w-8 rounded-full bg-gradient-to-r from-transparent to-primary" />
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">Müşteri Deneyimleri</span>
            <div className="h-1 w-8 rounded-full bg-gradient-to-l from-transparent to-primary" />
          </div>
          <h2 className="bg-clip-text text-4xl font-black tracking-tight text-text-light sm:text-5xl">
            Müşteri Yorumları
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-subtle-light sm:text-lg">
            Ziyaretçilerimizin deneyimleri bizim için en önemli geribildirim. Sizin de görüşleriniz bizim için çok değerli!
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {comments.map((comment, index) => (
            <div
              key={comment.id}
              className="group relative h-full"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative flex h-full flex-col gap-5 rounded-2xl border border-border-light/40 bg-gradient-to-br from-white/80 to-white/50 p-6 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-primary/30 hover:shadow-2xl sm:p-7">
                <div className="absolute right-6 top-4 font-serif text-5xl text-primary/10">&quot;</div>

                <div className="space-y-3">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`material-symbols-outlined text-xl transition-transform duration-300 ${
                          i < comment.rating
                            ? "scale-100 fill-current text-yellow-400"
                            : "text-border-light/30"
                        }`}
                      >
                        star
                      </span>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-text-light">{comment.customer_name}</h3>
                    <p className="text-xs font-medium uppercase tracking-wider text-subtle-light">
                      {new Date(comment.created_at).toLocaleDateString("tr-TR", {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <p className="flex-1 text-base font-light italic leading-relaxed text-text-light">
                  {comment.comment_text}
                </p>

                <div className="h-1 w-12 rounded-full bg-gradient-to-r from-primary to-primary/30" />

                {comment.customer_image_url ? (
                  <div className="flex items-center gap-3 pt-2">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/20">
                      <Image
                        src={comment.customer_image_url}
                        alt={comment.customer_name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-text-light">{comment.customer_name}</p>
                      {comment.customer_email ? (
                        <p className="truncate text-xs text-subtle-light">{comment.customer_email}</p>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 pt-2">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                      <span className="material-symbols-outlined text-xl text-primary">account_circle</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-text-light">{comment.customer_name}</p>
                      {comment.customer_email ? (
                        <p className="truncate text-xs text-subtle-light">{comment.customer_email}</p>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 mt-12">
          <div className="overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 px-6 py-8 backdrop-blur-xl sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            <div className="absolute left-0 top-0 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-2xl" />
            <div className="absolute bottom-0 right-0 h-40 w-40 translate-x-1/2 translate-y-1/2 rounded-full bg-primary/10 blur-2xl" />

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-2xl font-black text-text-light sm:text-3xl">Deneyiminizi Paylaşın</h3>
                <p className="max-w-xl text-base text-text-light/80">
                  Restoranımızdaki deneyiminizi diğer müşterilerle paylaş ve bize değerli geri bildirim ver.
                </p>
              </div>
              <a
                href="/contact"
                className="group/btn inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-r from-primary to-primary-dark px-8 py-4 text-base font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
              >
                <span className="material-symbols-outlined text-xl transition-transform group-hover/btn:rotate-12">edit</span>
                <span>Yorum Yaz</span>
              </a>
            </div>
          </div>
        </div>
      </div>

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
