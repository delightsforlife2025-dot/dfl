"use client";

import { useState, useRef, ChangeEvent } from "react";
import { supabasePublicObjectPath } from "@/lib/supabasePublicObjectPath";
import { isLikelyImageFile } from "@/lib/imageFileAccept";
interface SingleImageUploadProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
  bucketName?: string;
  label?: string;
  aspectRatio?: string;
}

export default function SingleImageUpload({
  imageUrl,
  onImageChange,
  bucketName = "menu-images",
  label = "Resim",
  aspectRatio = "aspect-video",
}: SingleImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      await handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!isLikelyImageFile(file)) {
      alert("Desteklenen format: PNG, JPG, GIF, WebP, SVG, ICO, AVIF, BMP.");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert("Dosya çok büyük. Maksimum dosya boyutu 5MB.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", bucketName);

      const res = await fetch("/api/dashboard/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const json = (await res.json()) as { url?: string; error?: string };

      if (!res.ok) {
        console.error("Upload error:", json.error);
        alert(`Yükleme hatası: ${json.error || res.statusText}`);
        return;
      }

      if (json.url) {
        onImageChange(json.url);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Dosya yüklenirken bir hata oluştu.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!imageUrl) return;
    
    if (!confirm("Bu resmi silmek istediğinizden emin misiniz?")) return;

    try {
      const filePath = supabasePublicObjectPath(imageUrl, bucketName);
      if (filePath) {
        const params = new URLSearchParams({ bucket: bucketName, path: filePath });
        const res = await fetch(`/api/dashboard/upload?${params}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!res.ok) {
          const json = (await res.json()) as { error?: string };
          console.error("Delete error:", json.error);
        }
      }

      // Clear from state
      onImageChange("");
    } catch (error) {
      console.error("Error removing image:", error);
      // Still clear from UI even if deletion failed
      onImageChange("");
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.ico,image/x-icon,image/vnd.microsoft.icon"
        onChange={handleChange}
        className="hidden"
        disabled={uploading}
      />

      {imageUrl ? (
        // Preview with remove option
        <div className="relative group">
          <div
            className={`relative ${aspectRatio} w-full overflow-hidden rounded-xl border-2 border-border-light bg-white`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={label}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 rounded-xl">
            <button
              type="button"
              onClick={handleButtonClick}
              disabled={uploading}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              Değiştir
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
            >
              Kaldır
            </button>
          </div>
        </div>
      ) : (
        // Upload area
        <div
          onClick={handleButtonClick}
          className={`relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer ${
            uploading
              ? "border-primary bg-primary/5 opacity-50"
              : "border-border-light bg-background-light hover:border-primary hover:bg-primary/5"
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              uploading ? "bg-primary/20" : "bg-border-light"
            }`}>
              <span className="material-symbols-outlined text-3xl text-primary">
                {uploading ? "hourglass_empty" : "cloud_upload"}
              </span>
            </div>

            <div className="text-center">
              <p className="text-text-light font-medium mb-1">
                {uploading ? "Yükleniyor..." : `${label} Yükle`}
              </p>
              <p className="text-sm text-subtle-light">
                PNG, JPG, GIF - Maksimum 5MB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
