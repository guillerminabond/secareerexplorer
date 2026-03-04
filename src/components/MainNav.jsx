import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, MessageSquare } from "lucide-react";
import FeedbackModal from "./FeedbackModal";
import AdminModal from "./AdminModal";

export default function MainNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const p = location.pathname;

  const [showFeedback, setShowFeedback] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  // Active state derived from URL
  const isExploreActive   = p === "/" || p.startsWith("/explore");
  const isAllOrgsActive   = p.startsWith("/all-orgs");
  const isLearnMoreActive = p.startsWith("/learn-more");
  const isResourcesActive = p.startsWith("/resources");

  const tabCls = (active) =>
    `flex-shrink-0 my-2 px-3 sm:px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
      active ? "bg-[#A51C30] text-white shadow-md" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
    }`;

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

            {/* All Organizations — direct link, sub-nav handled by AllOrgsLayout */}
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

          {/* Feedback + Admin — pinned right, both open as popups */}
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
              onClick={() => setShowAdmin(true)}
              title="Admin panel"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all border text-gray-400 border-gray-200 hover:text-gray-600 hover:bg-gray-50"
            >
              <Lock className="w-3 h-3" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </div>
        </div>
      </div>

      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
      {showAdmin    && <AdminModal    onClose={() => setShowAdmin(false)} />}
    </>
  );
}
