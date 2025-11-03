"use client";

import { useState, useRef, ChangeEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

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
    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Geçerli bir resim dosyası seçin.");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert("Dosya çok büyük. Maksimum dosya boyutu 5MB.");
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Upload error:", error);
        alert(`Yükleme hatası: ${error.message}`);
        return;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucketName).getPublicUrl(filePath);

      onImageChange(publicUrl);
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
      // Extract file path from URL
      const urlParts = imageUrl.split(`/${bucketName}/`);
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        
        // Delete from Supabase Storage
        const { error } = await supabase.storage
          .from(bucketName)
          .remove([filePath]);

        if (error) {
          console.error("Delete error:", error);
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
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        disabled={uploading}
      />

      {imageUrl ? (
        // Preview with remove option
        <div className="relative group">
          <div className={`relative ${aspectRatio} w-full rounded-xl overflow-hidden border-2 border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={label}
              className="w-full h-full object-contain"
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
              : "border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark hover:border-primary hover:bg-primary/5"
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              uploading ? "bg-primary/20" : "bg-border-light dark:bg-border-dark"
            }`}>
              <span className="material-symbols-outlined text-3xl text-primary">
                {uploading ? "hourglass_empty" : "cloud_upload"}
              </span>
            </div>

            <div className="text-center">
              <p className="text-text-light dark:text-text-dark font-medium mb-1">
                {uploading ? "Yükleniyor..." : `${label} Yükle`}
              </p>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                PNG, JPG, GIF - Maksimum 5MB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
