import React from "react";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <style>{`
        :root { --crimson: #A51C30; }
        .bg-crimson { background-color: #A51C30; }
        .text-crimson { color: #A51C30; }
        .border-crimson { border-color: #A51C30; }
        .bg-crimson\\/5  { background-color: rgba(165,28,48,0.05); }
        .bg-crimson\\/10 { background-color: rgba(165,28,48,0.10); }
        .border-crimson\\/20 { border-color: rgba(165,28,48,0.20); }
        .ring-crimson\\/30 { --tw-ring-color: rgba(165,28,48,0.3); }
        .hover\\:text-crimson:hover { color: #A51C30; }
        .hover\\:border-crimson:hover { border-color: #A51C30; }
        .focus\\:ring-crimson\\/30:focus { --tw-ring-color: rgba(165,28,48,0.3); }
        .text-crimson-100 { color: rgba(255,255,255,0.8); }
        .accent-crimson { accent-color: #A51C30; }

        /* Hide scrollbars on the nav pill strip while keeping scroll functional */
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
      {children}
    </div>
  );
}
