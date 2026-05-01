"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import DashboardSidebar from "../../components/DashboardSidebar";
import type { Comment } from "@/lib/types";

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "approved" | "pending">("all");
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, []);

  async function fetchComments() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredComments = comments.filter((comment) => {
    if (filter === "approved") return comment.is_approved;
    if (filter === "pending") return !comment.is_approved;
    return true;
  });

  async function toggleApproval(id: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from("comments")
        .update({ is_approved: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      setComments((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, is_approved: !currentStatus } : c
        )
      );

      if (selectedComment?.id === id) {
        setSelectedComment((prev) =>
          prev ? { ...prev, is_approved: !currentStatus } : null
        );
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  }

  async function deleteComment(id: string) {
    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setComments((prev) => prev.filter((c) => c.id !== id));
      setSelectedComment(null);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  }

  return (
    <div className="font-display bg-background-light min-h-screen">
      <div className="flex">
        <DashboardSidebar activePage="comments" />

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 lg:p-10">
          <div className="mx-auto max-w-5xl">
            {/* Page Heading */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
              <div>
                <p className="text-text-light text-4xl font-black leading-tight tracking-[-0.033em]">
                  Müşteri Yorumları
                </p>
                <p className="text-subtle-light text-base mt-2">
                  Müşteri yorumlarını yönetin ve onaylayın
                </p>
              </div>
              <Link
                href="/dashboard/comments/add"
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                <span className="material-symbols-outlined text-base">add</span>
                Yorum Ekle
              </Link>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
              {(["all", "approved", "pending"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                    filter === f
                      ? "bg-primary text-white"
                      : "bg-white/95 text-text-light hover:bg-border-light"
                  }`}
                >
                  {f === "all" && "Tüm Yorumlar"}
                  {f === "approved" && "Onaylı"}
                  {f === "pending" && "Beklemede"}
                </button>
              ))}
            </div>

            {/* Comments Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Comments List */}
              <div className="lg:col-span-2 space-y-4">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-4 border-primary/20 rounded-full animate-spin border-t-primary"></div>
                  </div>
                ) : filteredComments.length === 0 ? (
                  <div className="rounded-xl border border-border-light bg-white/95 p-8 text-center">
                    <span className="material-symbols-outlined text-4xl text-subtle-light mb-3 block">
                      comment
                    </span>
                    <p className="text-subtle-light">
                      {filter === "pending"
                        ? "Beklemede yorum yok"
                        : filter === "approved"
                        ? "Onaylı yorum yok"
                        : "Yorum yok"}
                    </p>
                  </div>
                ) : (
                  filteredComments.map((comment) => (
                    <div
                      key={comment.id}
                      onClick={() => setSelectedComment(comment)}
                      className={`p-4 rounded-lg border cursor-pointer transition ${
                        selectedComment?.id === comment.id
                          ? "border-primary bg-primary/5"
                          : "border-border-light bg-white/95 hover:border-primary"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-text-light truncate">
                            {comment.customer_name}
                          </h3>
                          <p className="text-xs text-subtle-light">
                            {new Date(comment.created_at).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={`material-symbols-outlined text-sm ${
                                i < comment.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-border-light"
                              }`}
                            >
                              star
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-text-light line-clamp-2">
                        {comment.comment_text}
                      </p>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border-light/50">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded ${
                            comment.is_approved
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {comment.is_approved ? "Onaylı" : "Beklemede"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Comment Details */}
              <div className="lg:col-span-1">
                {selectedComment ? (
                  <div className="rounded-xl border border-border-light bg-white/95 p-6 space-y-4 sticky top-6">
                    <div>
                      <h3 className="font-semibold text-text-light mb-1">
                        {selectedComment.customer_name}
                      </h3>
                      {selectedComment.customer_email && (
                        <p className="text-sm text-subtle-light break-all">
                          {selectedComment.customer_email}
                        </p>
                      )}
                      <p className="text-xs text-subtle-light mt-2">
                        {new Date(selectedComment.created_at).toLocaleDateString('tr-TR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    {/* Rating */}
                    <div>
                      <p className="text-xs font-medium text-subtle-light mb-2">
                        Puanı
                      </p>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`material-symbols-outlined ${
                              i < selectedComment.rating
                                ? "text-yellow-400 fill-current"
                                : "text-border-light"
                            }`}
                          >
                            star
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Comment Text */}
                    <div>
                      <p className="text-xs font-medium text-subtle-light mb-2">
                        Yorum
                      </p>
                      <p className="text-sm text-text-light leading-relaxed">
                        {selectedComment.comment_text}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="pt-4 border-t border-border-light/50 space-y-3">
                      <button
                        onClick={() => toggleApproval(selectedComment.id, selectedComment.is_approved)}
                        className={`w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-sm transition ${
                          selectedComment.is_approved
                            ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">
                          {selectedComment.is_approved ? "close" : "check"}
                        </span>
                        {selectedComment.is_approved ? "Onayla Kaldır" : "Onayla"}
                      </button>

                      <button
                        onClick={() => setShowDeleteConfirm(selectedComment.id)}
                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 font-medium text-sm transition"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                        Sil
                      </button>
                    </div>

                    {/* Delete Confirmation */}
                    {showDeleteConfirm === selectedComment.id && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700 mb-3">
                          Bu yorumu silmek istediğinizden emin misiniz?
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => deleteComment(selectedComment.id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm font-medium transition"
                          >
                            Evet, Sil
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1.5 rounded text-sm font-medium transition"
                          >
                            İptal
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl border border-border-light bg-white/95 p-6 text-center sticky top-6">
                    <span className="material-symbols-outlined text-4xl text-subtle-light mb-3 block">
                      comment
                    </span>
                    <p className="text-subtle-light">
                      Ayrıntıları görmek için bir yorum seçin
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

