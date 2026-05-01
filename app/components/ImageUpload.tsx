"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import Image from "next/image";
import { supabasePublicObjectPath } from "@/lib/supabasePublicObjectPath";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  bucketName?: string;
}

export default function ImageUpload({
  images,
  onImagesChange,
  maxImages = 5,
  bucketName = "menu-images",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      await handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    if (images.length >= maxImages) {
      alert(`Maksimum ${maxImages} fotoğraf yükleyebilirsiniz.`);
      return;
    }

    const remainingSlots = maxImages - images.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    // Validate file types
    const validFiles = filesToUpload.filter((file) => {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} geçerli bir resim dosyası değil.`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert(`${file.name} çok büyük. Maksimum dosya boyutu 5MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of validFiles) {
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
          alert(`${file.name} yüklenirken hata oluştu: ${json.error || res.statusText}`);
          continue;
        }

        if (json.url) {
          uploadedUrls.push(json.url);
        }
      }

      if (uploadedUrls.length > 0) {
        onImagesChange([...images, ...uploadedUrls]);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Dosyalar yüklenirken bir hata oluştu.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (index: number) => {
    const imageUrl = images[index];
    
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

      // Remove from state
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
    } catch (error) {
      console.error("Error removing image:", error);
      // Still remove from UI even if deletion failed
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border-light bg-white"
        } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          disabled={uploading || images.length >= maxImages}
        />

        <div className="flex flex-col items-center gap-3">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              dragActive ? "bg-primary/20" : "bg-border-light"
            }`}
          >
            <span className="material-symbols-outlined text-3xl text-primary">
              {uploading ? "hourglass_empty" : "cloud_upload"}
            </span>
          </div>

          <div className="text-center">
            <p className="mb-1 font-medium text-text-light">
              {uploading ? "Yükleniyor..." : "Fotoğraf yüklemek için tıklayın veya sürükleyin"}
            </p>
            <p className="text-sm text-subtle-light">
              PNG, JPG, GIF - Maksimum 5MB ({images.length}/{maxImages} fotoğraf)
            </p>
          </div>

          <button
            type="button"
            onClick={handleButtonClick}
            disabled={uploading || images.length >= maxImages}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Fotoğraf Seç
          </button>
        </div>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((imageUrl, index) => (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden rounded-xl bg-border-light"
            >
              <Image
                src={imageUrl}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
              
              {/* Remove button overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-transform hover:scale-110"
                  title="Fotoğrafı sil"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>

              {/* Image number badge */}
              <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
