"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useContent } from "@/app/contexts/ContentContext";

interface EditableWebsiteTextProps {
  path: string;
  children: React.ReactNode;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
}

export default function EditableWebsiteText({
  path,
  children,
  className = "",
  tag = "span",
}: EditableWebsiteTextProps) {
  const { isAdmin } = useAuth();
  const { updateWebsiteText, websiteContent } = useContent();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get the current content from Firebase or use fallback
  const getContentByPath = (path: string): string => {
    if (!websiteContent) return children as string;

    const pathParts = path.split(".");
    let content: any = websiteContent;

    for (const part of pathParts) {
      if (content && typeof content === "object" && part in content) {
        content = content[part];
      } else {
        return children as string; // fallback if path doesn't exist
      }
    }

    return typeof content === "string" ? content : (children as string);
  };

  const currentContent = getContentByPath(path);
  const [text, setText] = useState(currentContent);

  // Update text when content changes
  useEffect(() => {
    setText(currentContent);
  }, [currentContent]);

  const handleDoubleClick = () => {
    if (isAdmin) {
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (text.trim() === "") return;

    setIsLoading(true);
    try {
      await updateWebsiteText(path, text);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating website text:", error);
      setText(currentContent);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setText(currentContent);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (!isAdmin) {
    const Tag = tag as any;
    return <Tag className={className}>{currentContent}</Tag>;
  }

  if (isEditing) {
    return (
      <div className="relative border-2 border-accent rounded-lg p-3 bg-white shadow-lg">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-3 py-2 border border-accent/20 rounded-lg focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 text-sm text-gray-900 placeholder-gray-500"
          placeholder="Enter text"
          autoFocus
        />

        <div className="flex gap-2 mt-3">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-3 py-1.5 bg-accent text-white text-xs font-medium rounded hover:bg-accent-dark transition-colors disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-1.5 border border-accent/20 text-accent text-xs font-medium rounded hover:bg-accent/10 transition-colors"
          >
            Cancel
          </button>
        </div>

        {isLoading && (
          <div className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full animate-pulse" />
        )}
      </div>
    );
  }

  const Tag = tag as any;

  if (!isAdmin) {
    return <Tag className={className}>{currentContent}</Tag>;
  }

  return (
    <div
      className="relative group cursor-pointer editable-text admin-editable"
      data-editable="true"
      style={{ color: "var(--color-text)" }}
      onDoubleClick={handleDoubleClick}
      title="Double-click to edit"
    >
      <Tag className={className}>{currentContent}</Tag>
      <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 border border-accent/0 group-hover:border-accent/30 rounded transition-all duration-200 pointer-events-none opacity-0 group-hover:opacity-100"></div>
    </div>
  );
}
