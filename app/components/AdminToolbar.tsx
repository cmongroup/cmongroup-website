"use client";

import React from "react";
import { useAuth } from "@/app/contexts/AuthContext";

export default function AdminToolbar() {
  const { adminUser, logout } = useAuth();

  if (!adminUser) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-accent text-text px-4 py-2 rounded-lg shadow-lg border border-accent/20">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium">Admin Mode</span>
        </div>
        
        <div className="text-xs opacity-80">
          {adminUser.email}
        </div>
        
        <button
          onClick={logout}
          className="px-3 py-1 bg-accent-dark text-text text-xs rounded hover:bg-accent/80 transition-colors"
        >
          Exit
        </button>
      </div>
      
      <div className="text-xs opacity-60 mt-1">
        Double-click any text or image to edit
      </div>
    </div>
  );
}
