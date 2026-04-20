import React from "react";
import MainNav from "./components/MainNav";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <style>{`
        /* crimson CSS custom property — used by inline styles that can't reach Tailwind */
        :root { --crimson: #A51C30; }

        /* Hide scrollbars on the nav pill strip while keeping scroll functional */
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }

        /* Admin modal: strip min-h-screen from Admin sub-views */
        .admin-modal-content .min-h-screen { min-height: 0 !important; }
      `}</style>
      {/* ── Site header ─────────────────────────────────── */}
      <div className="bg-crimson text-white px-6 py-3">
        <div className="max-w-screen-2xl mx-auto">
          <p className="text-xs font-medium tracking-wide uppercase text-crimson-100 mb-0.5">Harvard Business School</p>
          <h1 className="text-lg font-bold leading-tight">Social Enterprise Career Explorer</h1>
        </div>
      </div>

      <MainNav />
      {children}

      {/* Disclaimer */}
      <p className="text-center text-xs text-gray-400 mt-10 mb-4 px-4">
        This is a student-created resource. Organization data was collected in March 2026 and may not reflect the most current information. Please verify details directly with each organization.
      </p>
    </div>
  );
}
