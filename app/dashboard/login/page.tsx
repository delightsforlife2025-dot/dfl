"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Ensure Material Symbols stylesheet is loaded
    if (!document.querySelector('link[href*="Material+Symbols"]')) {
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Ensure cookies are sent/received
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Small delay to ensure cookie is set
        await new Promise(resolve => setTimeout(resolve, 100));
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(data.error || "Giriş başarısız");
      }
    } catch (err) {
      console.error('Login error:', err);
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="font-display bg-background-light min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-border-light bg-white/95 p-8 shadow-lg ring-1 ring-black/[0.05]">
          {/* Logo & Title */}
                      <div className="flex items-center gap-4 mb-6">
              <span className="material-symbols-outlined text-primary text-5xl">ramen_dining</span>
              <h1 className="text-text-light text-2xl font-bold">Dashboard</h1>
            </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-800 text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-light mb-2"
              >
                E-posta
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border-light bg-white px-4 py-3 text-text-light focus:border-transparent focus:ring-2 focus:ring-primary"
                placeholder="admin@restaurant.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-light mb-2"
              >
                Şifre
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border-light bg-white px-4 py-3 text-text-light focus:border-transparent focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>

          {/* Demo Credentials Info */}
          <div className="mt-6 p-4 rounded-lg bg-primary/10">
            <p className="text-xs text-subtle-light text-center">
              <strong>Demo:</strong> admin@restaurant.com / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
