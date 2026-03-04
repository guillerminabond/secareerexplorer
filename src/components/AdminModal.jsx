import React, { useEffect } from "react";
import { X } from "lucide-react";
import Admin from "@/pages/Admin";

export default function AdminModal({ onClose }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-stretch bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative bg-gray-50 w-full flex flex-col overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white shadow border border-gray-200 text-gray-400 hover:text-gray-700 transition-colors"
          title="Close admin panel"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable admin content */}
        <div className="flex-1 overflow-y-auto">
          <Admin />
        </div>
      </div>
    </div>
  );
}
