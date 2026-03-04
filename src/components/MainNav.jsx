import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, Lock, MessageSquare } from "lucide-react";
import FeedbackModal from "./FeedbackModal";

export default function MainNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const p = location.pathname;

  const [showOrgMenu, setShowOrgMenu] = useState(false);
  const [orgMenuPos, setOrgMenuPos] = useState({ top: 0, left: 0 });
  const [showFeedback, setShowFeedback] = useState(false);

  const orgMenuRef = useRef(null);
  const orgDropdownRef = useRef(null);

  // Saved count badge — re-reads on every navigation so it stays fresh
  const savedCount = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("hbs_saved_orgs") || "[]").length; } catch { return 0; }
  }, [p]);

  // Active state derived from URL
  const isExploreActive   = p === "/" || p.startsWith("/explore");
  const isAllOrgsActive   = p.startsWith("/all-orgs");
  const isLearnMoreActive = p.startsWith("/learn-more");
  const isResourcesActive = p.startsWith("/resources");
  const isAdminActive     = p.startsWith("/admin");

  // Close dropdown on outside click
  useEffect(() => {
    if (!showOrgMenu) return;
    const handler = (e) => {
      if (!orgMenuRef.current?.contains(e.target) && !orgDropdownRef.current?.contains(e.target)) {
        setShowOrgMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showOrgMenu]);

  const tabCls = (active) =>
    `flex-shrink-0 my-2 px-3 sm:px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
      active ? "bg-[#A51C30] text-white shadow-md" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
    }`;

  const SUB_ITEMS = [
    { label: "Database",               path: "/all-orgs/database"  },
    { label: "Dashboard",              path: "/all-orgs/dashboard" },
    { label: "Saved Organizations",    path: "/all-orgs/database"  },
    { label: "Nominate an Organization", path: "/all-orgs/nominate" },
  ];

  return (
    <>
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center">

          {/* Scrollable tab strip */}
          <div className="flex gap-1 items-center overflow-x-auto scrollbar-hide px-4 sm:px-6 flex-1 min-w-0">

            {/* Explore */}
            <button onClick={() => navigate("/explore")} className={tabCls(isExploreActive)}>
              Explore
            </button>

            {/* All Organizations — dropdown */}
            <div className="flex-shrink-0" ref={orgMenuRef}>
              <button
                onClick={() => {
                  if (orgMenuRef.current) {
                    const r = orgMenuRef.current.getBoundingClientRect();
                    setOrgMenuPos({ top: r.bottom + 4, left: r.left });
                  }
                  setShowOrgMenu((prev) => !prev);
                }}
                className={`my-2 px-3 sm:px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
                  isAllOrgsActive ? "bg-[#A51C30] text-white shadow-md" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                All Organizations
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${showOrgMenu ? "rotate-180" : ""}`} />
                {savedCount > 0 && (
                  <span className={`text-xs rounded-full px-1.5 py-0.5 leading-none ${isAllOrgsActive ? "bg-white/30 text-white" : "bg-[#A51C30] text-white"}`}>
                    {savedCount}
                  </span>
                )}
              </button>

              {showOrgMenu && (
                <div
                  ref={orgDropdownRef}
                  style={{ position: "fixed", top: orgMenuPos.top, left: orgMenuPos.left, zIndex: 50 }}
                  className="bg-white border border-gray-100 rounded-xl shadow-lg min-w-[220px] py-1.5 overflow-hidden"
                >
                  {SUB_ITEMS.map(({ label, path }) => (
                    <button
                      key={label}
                      onClick={() => { navigate(path); setShowOrgMenu(false); }}
                      className={`w-full text-left flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                        p === path ? "text-[#A51C30] bg-[#A51C30]/5 font-medium" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {label}
                      {label === "Saved Organizations" && savedCount > 0 && (
                        <span className="text-xs bg-[#A51C30] text-white rounded-full px-1.5 py-0.5 leading-none">{savedCount}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Learn More */}
            <button onClick={() => navigate("/learn-more")} className={tabCls(isLearnMoreActive)}>
              Learn More
            </button>

            {/* Resources */}
            <button onClick={() => navigate("/resources")} className={tabCls(isResourcesActive)}>
              Resources
            </button>
          </div>

          {/* Feedback + Admin — pinned right */}
          <div className="flex-shrink-0 border-l border-gray-100 px-3 sm:px-4 self-stretch flex items-center gap-2">
            <button
              onClick={() => setShowFeedback(true)}
              title="Send feedback"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all border text-gray-400 border-gray-200 hover:text-[#A51C30] hover:border-[#A51C30]/40 hover:bg-red-50"
            >
              <MessageSquare className="w-3 h-3" />
              <span className="hidden sm:inline">Feedback</span>
            </button>

            <button
              onClick={() => navigate("/admin")}
              title="Admin panel"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all border ${
                isAdminActive
                  ? "bg-amber-50 text-amber-700 border-amber-300"
                  : "text-gray-400 border-gray-200 hover:text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Lock className="w-3 h-3" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </div>
        </div>
      </div>

      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
    </>
  );
}
