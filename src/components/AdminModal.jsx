import React, { useEffect } from "react";
import { X } from "lucide-react";
import Admin from "@/pages/Admin";

export default function AdminModal({ onClose }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    // Prevent background scroll while modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
      {/* Full-viewport panel — scrolls internally */}
      <div className="absolute inset-0 bg-gray-50 overflow-y-auto">
        {/* Sticky close button */}
        <div className="sticky top-0 z-10 flex justify-end px-4 pt-3 pb-2 bg-gray-50 border-b border-gray-100">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white shadow-sm border border-gray-200 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            title="Close admin panel"
          >
            <X className="w-4 h-4" />
            Close
          </button>
        </div>

        {/* Admin content — min-h removed via wrapper so it fits inside the panel */}
        <div className="admin-modal-content">
          <Admin />
        </div>
      </div>
    </div>
  );
}
