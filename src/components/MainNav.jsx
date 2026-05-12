import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MessageSquare, HelpCircle, LogOut } from "lucide-react";
import FeedbackModal from "./FeedbackModal";
import HowToUseModal from "./HowToUseModal";
import { useAdmin } from "@/contexts/AdminContext";

export default function MainNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const p = location.pathname;
  const { adminMode, logout } = useAdmin();

  const [showFeedback,  setShowFeedback]  = useState(false);
  const [showHowToUse, setShowHowToUse]  = useState(false);

  // Active state derived from URL
  const isExploreActive   = p === "/" || p.startsWith("/explore");
  const isAllOrgsActive   = p.startsWith("/all-orgs");
  const isLearnMoreActive = p.startsWith("/learn-more");
  const isResourcesActive = p.startsWith("/resources");

  const tabCls = (active) =>
    `flex-shrink-0 my-2 px-3 sm:px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
      active ? "bg-crimson text-white shadow-md" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <>
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-screen-2xl mx-auto flex items-center">

          {/* Scrollable tab strip */}
          <div className="flex gap-1 items-center overflow-x-auto scrollbar-hide px-4 sm:px-6 flex-1 min-w-0">

            {/* Explore */}
            <button onClick={() => navigate("/explore")} className={tabCls(isExploreActive)}>
              Explore
            </button>

            {/* All Organizations */}
            <button onClick={() => navigate("/all-orgs/database")} className={tabCls(isAllOrgsActive)}>
              All Organizations
            </button>

            {/* Learn More */}
            <button onClick={() => navigate("/learn-more")} className={tabCls(isLearnMoreActive)}>
              Learn More
            </button>

            {/* Resources */}
            <button onClick={() => navigate("/resources")} className={tabCls(isResourcesActive)}>
              Resources
            </button>
          </div>

          {/* Right-side actions — pinned */}
          <div className="flex-shrink-0 border-l border-gray-100 px-3 sm:px-4 self-stretch flex items-center gap-2">

            {/* Feedback */}
            <button
              onClick={() => setShowFeedback(true)}
              title="Send feedback"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all border text-gray-400 border-gray-200 hover:text-crimson hover:border-crimson/40 hover:bg-red-50"
            >
              <MessageSquare className="w-3 h-3" />
              <span className="hidden sm:inline">Feedback</span>
            </button>

            {/* How to Use */}
            <button
              onClick={() => setShowHowToUse(true)}
              title="How to use this platform"
              className="flex items-center justify-center w-7 h-7 rounded-md text-gray-400 border border-gray-200 hover:text-crimson hover:border-crimson/40 hover:bg-red-50 transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>

            {/* Log out of Admin — only visible when in admin mode */}
            {adminMode && (
              <button
                onClick={() => logout()}
                title="Log out of admin"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all border bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100"
              >
                <LogOut className="w-3 h-3" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {showFeedback  && <FeedbackModal  onClose={() => setShowFeedback(false)}  />}
      {showHowToUse  && <HowToUseModal  onClose={() => setShowHowToUse(false)}  />}
    </>
  );
}
