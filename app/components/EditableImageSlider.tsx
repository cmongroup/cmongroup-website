"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useAuth } from "@/app/contexts/AuthContext";
import { useContent } from "@/app/contexts/ContentContext";

interface EditableImageSliderProps {
  companySlug: string;
  sectionNumber: number;
  images: string[];
  alts: string[];
  placeholderSrc?: string;
  className?: string;
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
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
      resolve(compressedDataUrl);
    };

    img.src = URL.createObjectURL(file);
  });
};

const isDataUrlTooLarge = (dataUrl: string): boolean => {
  const base64Data = dataUrl.split(",")[1];
  if (!base64Data) return false;
  const sizeInBytes = (base64Data.length * 3) / 4;
  const maxSizeInBytes = 800 * 1024; // 800KB limit
  return sizeInBytes > maxSizeInBytes;
};

export default function EditableImageSlider({
  companySlug,
  sectionNumber,
  images,
  alts,
  placeholderSrc,
  className = "",
}: EditableImageSliderProps) {
  const { isAdmin } = useAuth();
  const { updateCompanySectionImages } = useContent();

  // Filter out empty images
  const validImages = images.filter((img) => img && img.trim() !== "");
  const validAlts = alts.slice(0, validImages.length);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [localImages, setLocalImages] = useState<string[]>(validImages);
  const [localAlts, setLocalAlts] = useState<string[]>(validAlts);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? localImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === localImages.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleImageClick = (index: number) => {
    if (isAdmin && !isEditing) {
      setEditingIndex(index);
      fileInputRef.current?.click();
    }
  };

  const handleAddImage = () => {
    if (isAdmin && localImages.length < 5) {
      setEditingIndex(localImages.length);
      fileInputRef.current?.click();
    }
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || editingIndex === null) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

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

      let compressedDataUrl = await compressImage(file, 800, 0.8);

      if (isDataUrlTooLarge(compressedDataUrl)) {
        compressedDataUrl = await compressImage(file, 600, 0.6);
        if (isDataUrlTooLarge(compressedDataUrl)) {
          setError(
            "Image is still too large after compression. Please select a smaller image."
          );
          setEditingIndex(null);
          return;
        }
      }

      const newImages = [...localImages];
      const newAlts = [...localAlts];

      if (editingIndex < localImages.length) {
        newImages[editingIndex] = compressedDataUrl;
      } else {
        newImages.push(compressedDataUrl);
        newAlts.push(
          `${companySlug} section ${sectionNumber} image ${editingIndex + 1}`
        );
      }

      setLocalImages(newImages);
      setLocalAlts(newAlts);
      setIsEditing(true);
    } catch (err) {
      setError("Error processing image. Please try again.");
      console.error("Error processing image:", err);
    } finally {
      setIsLoading(false);
      setEditingIndex(null);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Prepare arrays of exactly 5 elements (empty strings for unused slots)
      const imagesToSave = Array(5).fill("");
      const altsToSave = Array(5).fill("");

      localImages.forEach((img, idx) => {
        imagesToSave[idx] = img;
        altsToSave[idx] = localAlts[idx] || "";
      });

      await updateCompanySectionImages(
        companySlug,
        sectionNumber,
        imagesToSave,
        altsToSave
      );

      setIsEditing(false);
      setError(null);
    } catch (error) {
      console.error("Error updating images:", error);
      setError("Failed to save images. Please try again.");
      setLocalImages(validImages);
      setLocalAlts(validAlts);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setLocalImages(validImages);
    setLocalAlts(validAlts);
    setIsEditing(false);
    setError(null);
  };

  const handleDeleteImage = (index: number) => {
    const newImages = localImages.filter((_, idx) => idx !== index);
    const newAlts = localAlts.filter((_, idx) => idx !== index);
    setLocalImages(newImages);
    setLocalAlts(newAlts);
    setIsEditing(true);

    // Adjust current index if needed
    if (currentIndex >= newImages.length && newImages.length > 0) {
      setCurrentIndex(newImages.length - 1);
    } else if (newImages.length === 0) {
      setCurrentIndex(0);
    }
  };

  // If no images, show placeholder or add button
  if (localImages.length === 0) {
    return (
      <div className={`relative ${className}`}>
        <div className="aspect-4/3 overflow-hidden bg-background relative rounded-2xl shadow-soft ring-1 ring-black/5 flex items-center justify-center">
          {placeholderSrc ? (
            <Image
              src={placeholderSrc}
              alt="Placeholder"
              width={600}
              height={450}
              className="w-full h-full object-cover opacity-30"
            />
          ) : (
            <div className="text-muted">No images</div>
          )}
          {isAdmin && (
            <button
              onClick={handleAddImage}
              className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/60 transition-colors"
            >
              <div className="text-white text-center">
                <div className="text-4xl mb-2">+</div>
                <div className="text-sm">Add Image</div>
              </div>
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Image Display */}
      <div className="aspect-4/3 overflow-hidden bg-background relative rounded-2xl shadow-soft ring-1 ring-black/5">
        <Image
          src={localImages[currentIndex]}
          alt={localAlts[currentIndex] || `Image ${currentIndex + 1}`}
          width={600}
          height={450}
          className="w-full h-full object-cover"
        />

        {/* Navigation Arrows - only show if more than 1 image */}
        {localImages.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              aria-label="Previous image"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              aria-label="Next image"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Admin Edit Overlay */}
        {isAdmin && !isEditing && (
          <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center group">
            <button
              onClick={() => handleImageClick(currentIndex)}
              className="opacity-0 group-hover:opacity-100 bg-white text-black px-4 py-2 rounded-lg transition-opacity"
            >
              Change Image
            </button>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Dots Navigation */}
      {localImages.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {localImages.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-accent w-8"
                  : "bg-muted/40 hover:bg-muted/60"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Admin Controls */}
      {isAdmin && (
        <div className="mt-4 space-y-2">
          {/* Thumbnail Grid */}
          <div className="flex gap-2 flex-wrap">
            {localImages.map((img, index) => (
              <div key={index} className="relative group">
                <Image
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  width={80}
                  height={60}
                  className={`rounded cursor-pointer object-cover ${
                    index === currentIndex
                      ? "ring-2 ring-accent"
                      : "ring-1 ring-black/10"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
                {isEditing && (
                  <button
                    onClick={() => handleDeleteImage(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            {/* Add Image Button */}
            {localImages.length < 5 && (
              <button
                onClick={handleAddImage}
                className="w-20 h-15 border-2 border-dashed border-muted/40 hover:border-accent rounded flex items-center justify-center text-muted hover:text-accent transition-colors"
              >
                <span className="text-2xl">+</span>
              </button>
            )}
          </div>

          {/* Save/Cancel Buttons */}
          {isEditing && (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-accent text-text px-4 py-2 rounded hover:bg-accent/80 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="bg-muted/20 text-text px-4 py-2 rounded hover:bg-muted/30 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && <div className="text-sm text-red-600">{error}</div>}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
