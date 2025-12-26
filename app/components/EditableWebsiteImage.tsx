"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useAuth } from "@/app/contexts/AuthContext";
import { useContent } from "@/app/contexts/ContentContext";

interface EditableWebsiteImageProps {
  path: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholderSrc?: string;
  onLoadComplete?: (info: { naturalWidth: number; naturalHeight: number }) => void;
}

// Image compression function
const compressImage = (
  file: File,
  maxWidth: number = 800,
  quality: number = 0.8
): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const img = new window.Image();

    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
      resolve(compressedDataUrl);
    };

    img.src = URL.createObjectURL(file);
  });
};

// Check if data URL is too large for Firebase (limit to ~800KB to be safe)
const isDataUrlTooLarge = (dataUrl: string): boolean => {
  // Remove data URL prefix to get just the base64 data
  const base64Data = dataUrl.split(",")[1];
  if (!base64Data) return false;

  // Calculate size in bytes (base64 is ~33% larger than binary)
  const sizeInBytes = (base64Data.length * 3) / 4;
  const maxSizeInBytes = 250 * 1024; // 250KB limit

  return sizeInBytes > maxSizeInBytes;
};

export default function EditableWebsiteImage({
  path,
  src,
  alt,
  width = 800,
  height = 600,
  className = "",
  priority = false,
  placeholderSrc,
  onLoadComplete,
}: EditableWebsiteImageProps) {
  const { isAdmin } = useAuth();
  const { updateWebsiteImage } = useContent();
  const [isEditing, setIsEditing] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  const [imageAlt, setImageAlt] = useState(alt);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (isAdmin) {
      setError(null);
      fileInputRef.current?.click();
    }
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB before compression)
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxFileSize) {
      setError(
        "Image file is too large. Please select an image smaller than 5MB."
      );
      return;
    }

    try {
      setError(null);
      setIsLoading(true);

      // Compress the image - Target 250KB
      // 1. Initial attempt
      let compressedDataUrl = await compressImage(file, 800, 0.7);

      // Check if compressed image is still too large for Firebase
      if (isDataUrlTooLarge(compressedDataUrl)) {
        // 2. Reduce size
        compressedDataUrl = await compressImage(file, 600, 0.7);

        if (isDataUrlTooLarge(compressedDataUrl)) {
          // 3. Reduce quality
          compressedDataUrl = await compressImage(file, 600, 0.5);

          if (isDataUrlTooLarge(compressedDataUrl)) {
            // 4. Last resort
            compressedDataUrl = await compressImage(file, 400, 0.5);

            if (isDataUrlTooLarge(compressedDataUrl)) {
               setError(
                "Image is still too large after compression. Please select a smaller or simpler image."
               );
               return;
            }
          }
        }
      }

      setImageSrc(compressedDataUrl);

      setIsEditing(true);
    } catch (err) {
      setError("Error processing image. Please try again.");
      console.error("Error processing image:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (imageSrc.trim() === "" || imageAlt.trim() === "") return;

    setIsLoading(true);
    try {
      // Update both src and alt text
      await updateWebsiteImage(path, imageSrc);
      const altPath = path.replace("Src", "Alt");
      await updateWebsiteImage(altPath, imageAlt);

      setIsEditing(false);
      setError(null);
    } catch (error) {
      console.error("Error updating website image:", error);
      setError("Failed to save image. Please try again.");
      setImageSrc(src);
      setImageAlt(alt);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setImageSrc(src);
    setImageAlt(alt);
    setIsEditing(false);
    setError(null);
  };

  const handleRestorePlaceholder = async () => {
    try {
      setIsLoading(true);

      // Use placeholderSrc if available, otherwise fall back to original src
      const imageToRestore = placeholderSrc || src;

      await updateWebsiteImage(path, imageToRestore);
      const altPath = path.replace("Src", "Alt");
      await updateWebsiteImage(altPath, alt);

      setImageSrc(imageToRestore);
      setImageAlt(alt);
      setError(null);
      setIsEditing(false); // Exit editing mode after restoring placeholder
    } catch (error) {
      console.error("Error restoring image:", error);
      setError("Failed to restore image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (!isAdmin) {
    return (
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={width}
        height={height}
        className={className}
        priority={priority}
        onLoadingComplete={onLoadComplete}
      />
    );
  }

  if (isEditing) {
    return (
      <div className="w-full h-full bg-white rounded-2xl shadow-lg ring-1 ring-accent/20 overflow-hidden">
        {/* Image Preview - Takes up the same space as the original image */}
        <div className="w-full h-3/4 relative">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            priority={priority}
          />
        </div>

        {/* Form Controls - Positioned below the image preview */}
        <div className="w-full h-1/4 bg-gray-50 p-4 border-t border-accent/20">
          <div className="space-y-3">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                <p className="text-red-600 text-xs">{error}</p>
              </div>
            )}

            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-gray-700 whitespace-nowrap">
                Alt Text:
              </label>
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 px-2 py-1 text-xs border border-accent/20 rounded focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/20 text-gray-900 placeholder-gray-500"
                placeholder="Enter alt text"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleRestorePlaceholder}
                className="px-3 py-1 text-xs border border-accent/20 text-accent rounded hover:bg-accent/10 transition-colors font-medium"
              >
                Restore
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-3 py-1 text-xs bg-accent text-white rounded hover:bg-accent-dark transition-colors disabled:opacity-50 font-medium"
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1 text-xs border border-accent/20 text-accent rounded hover:bg-accent/10 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="absolute top-2 right-2 w-3 h-3 bg-accent rounded-full animate-pulse" />
        )}
      </div>
    );
  }

  return (
    <div className="relative group">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={width}
        height={height}
        className={`${className} ${isAdmin ? "cursor-pointer" : ""}`}
        priority={priority}
        onClick={handleClick}
        onLoadingComplete={onLoadComplete}
      />

      {isAdmin && (
        <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none border border-transparent group-hover:border-accent/30">
          <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg text-sm font-medium text-gray-900 text-center shadow-lg border border-accent/20">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Click to change image</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Max 5MB, will be compressed
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
