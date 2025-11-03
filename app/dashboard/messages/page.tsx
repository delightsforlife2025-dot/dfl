"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { ContactMessage } from "@/lib/types";
import DashboardSidebar from "@/app/components/DashboardSidebar";

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  async function fetchMessages() {
    setLoading(true);
    try {
      let query = supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (filter === "unread") {
        query = query.eq("handled", false);
      } else if (filter === "read") {
        query = query.eq("handled", true);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        setMessages(data || []);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function markAsHandled(id: string, handled: boolean) {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ handled })
        .eq("id", id);

      if (error) {
        console.error("Error updating message:", error);
      } else {
        // Refresh messages
        fetchMessages();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function deleteMessage(id: string) {
    if (!confirm("Bu mesajı silmek istediğinizden emin misiniz?")) return;

    try {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting message:", error);
      } else {
        fetchMessages();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const unreadCount = messages.filter((m) => !m.handled).length;

  return (
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen">
      <div className="flex">
        <DashboardSidebar activePage="messages" unreadCount={unreadCount} />

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 lg:p-10">
          <div className="mx-auto max-w-6xl">
            {/* Page Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
              <div>
                <h1 className="text-text-light dark:text-text-dark text-4xl font-black leading-tight tracking-[-0.033em]">
                  Mesajlar
                </h1>
                <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2">
                  İletişim formundan gelen mesajları görüntüleyin
                </p>
              </div>
              <button
                onClick={fetchMessages}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary/90"
              >
                <span className="material-symbols-outlined">refresh</span>
                Yenile
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 border-b border-border-light dark:border-border-dark">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  filter === "all"
                    ? "border-primary text-primary"
                    : "border-transparent text-text-secondary-light dark:text-text-secondary-dark hover:text-text-light dark:hover:text-text-dark"
                }`}
              >
                Tümü ({messages.length})
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  filter === "unread"
                    ? "border-primary text-primary"
                    : "border-transparent text-text-secondary-light dark:text-text-secondary-dark hover:text-text-light dark:hover:text-text-dark"
                }`}
              >
                Okunmamış ({unreadCount})
              </button>
              <button
                onClick={() => setFilter("read")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  filter === "read"
                    ? "border-primary text-primary"
                    : "border-transparent text-text-secondary-light dark:text-text-secondary-dark hover:text-text-light dark:hover:text-text-dark"
                }`}
              >
                Okundu ({messages.filter((m) => m.handled).length})
              </button>
            </div>

            {/* Messages List */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-text-secondary-light dark:text-text-secondary-dark">Yükleniyor...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark">
                <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark text-5xl mb-4">
                  inbox
                </span>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">Henüz mesaj yok</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6 transition-all ${
                      !message.handled ? "border-l-4 border-l-primary" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-text-light dark:text-text-dark text-lg font-bold">
                            {message.name || "İsimsiz"}
                          </h3>
                          {!message.handled && (
                            <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">YENİ</span>
                          )}
                        </div>
                        <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
                          {message.email}
                        </p>
                        {message.subject && (
                          <p className="text-text-light dark:text-text-dark text-sm font-medium mt-1">
                            Konu: {message.subject}
                          </p>
                        )}
                        <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs mt-2">
                          {new Date(message.created_at).toLocaleString("tr-TR")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {!message.handled ? (
                          <button
                            onClick={() => markAsHandled(message.id, true)}
                            className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors"
                            title="Okundu olarak işaretle"
                          >
                            <span className="material-symbols-outlined">check_circle</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => markAsHandled(message.id, false)}
                            className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors"
                            title="Okunmadı olarak işaretle"
                          >
                            <span className="material-symbols-outlined">cancel</span>
                          </button>
                        )}
                        <button
                          onClick={() => deleteMessage(message.id)}
                          className="text-text-secondary-light dark:text-text-secondary-dark hover:text-red-500 transition-colors"
                          title="Sil"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </div>
                    <div className="bg-background-light dark:bg-background-dark rounded-lg p-4">
                      <p className="text-text-light dark:text-text-dark whitespace-pre-wrap">{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
