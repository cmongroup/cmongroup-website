"use client";

import React, { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useContent } from "@/app/contexts/ContentContext";

interface EditableTextProps {
  companySlug: string;
  path: string;
  children: React.ReactNode;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
}

export default function EditableText({
  companySlug,
  path,
  children,
  className = "",
  tag = "span",
}: EditableTextProps) {
  const { isAdmin } = useAuth();
  const { updateCompanyText } = useContent();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(children as string);
  const [isLoading, setIsLoading] = useState(false);

  const handleDoubleClick = () => {
    if (isAdmin) {
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (text.trim() === "") return;

    setIsLoading(true);
    try {
      await updateCompanyText(companySlug, path, text);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating text:", error);
      setText(children as string);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setText(children as string);
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
    return <Tag className={className}>{children}</Tag>;
  }

  if (isEditing) {
    return (
      <div className="relative border-2 border-accent rounded-lg p-2 bg-white">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-2 py-1 border border-accent/20 rounded-lg focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 text-sm"
          placeholder="Enter text"
          autoFocus
        />

        <div className="flex gap-2 mt-2">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-3 py-1 bg-accent text-text rounded text-xs hover:bg-accent-dark transition-colors disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-1 border border-accent/20 text-accent rounded text-xs hover:bg-accent/10 transition-colors"
          >
            Cancel
          </button>
        </div>

        {isLoading && (
          <div className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
        )}
      </div>
    );
  }

  const Tag = tag as any;
  return (
    <Tag
      className={`${className} ${isAdmin ? "cursor-pointer hover:bg-accent/30 hover:border-2 hover:border-accent/60 hover:shadow-md rounded px-2 py-1 transition-all duration-200 relative group editable-text admin-editable" : ""}`}
      data-editable={isAdmin ? "true" : "false"}
      style={isAdmin ? { color: "var(--color-text)" } : undefined}
      onDoubleClick={handleDoubleClick}
      title={isAdmin ? "Double-click to edit" : undefined}
    >
      {children}
      {isAdmin && (
        <div className="absolute inset-0 border border-accent/0 group-hover:border-accent/80 rounded transition-all duration-200 pointer-events-none opacity-0 group-hover:opacity-100"></div>
      )}
    </Tag>
  );
}
