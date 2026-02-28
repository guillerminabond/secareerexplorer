import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";

export default function Layout({ children, currentPageName }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        :root {
          --crimson: #A51C30;
        }
        .bg-crimson { background-color: #A51C30; }
        .text-crimson { color: #A51C30; }
        .border-crimson { border-color: #A51C30; }
        .bg-crimson\\/5 { background-color: rgba(165, 28, 48, 0.05); }
        .border-crimson\\/20 { border-color: rgba(165, 28, 48, 0.2); }
        .bg-crimson\\/10 { background-color: rgba(165, 28, 48, 0.1); }
        .ring-crimson\\/30 { --tw-ring-color: rgba(165,28,48,0.3); }
        .hover\\:text-crimson:hover { color: #A51C30; }
        .hover\\:border-crimson:hover { border-color: #A51C30; }
        .focus\\:ring-crimson\\/30:focus { --tw-ring-color: rgba(165,28,48,0.3); }
        .text-crimson-100 { color: rgba(255,255,255,0.8); }
        .accent-crimson { accent-color: #A51C30; }
      `}</style>
      {children}
      {currentPageName !== "Admin" && (
        <div className="fixed bottom-4 right-4">
          <Link
            to={createPageUrl("Admin")}
            className="text-xs text-gray-300 hover:text-gray-500 transition-colors"
          >
            Admin
          </Link>
        </div>
      )}
    </div>
  );
}
