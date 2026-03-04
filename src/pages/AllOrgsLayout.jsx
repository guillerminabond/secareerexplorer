import React from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import NominateModal from "@/components/NominateModal";

const tabClass = ({ isActive }) =>
  `my-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
    isActive
      ? "bg-[#A51C30] text-white shadow-md"
      : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
  }`;

export default function AllOrgsLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isNominating = location.pathname === "/all-orgs/nominate";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 flex gap-2 overflow-x-auto scrollbar-hide">
          <NavLink to="/all-orgs/database"  end className={tabClass}>Database</NavLink>
          <NavLink to="/all-orgs/dashboard" end className={tabClass}>Dashboard</NavLink>
        </div>
      </div>

      {/* Always render the child page (database or dashboard) as the backdrop */}
      <Outlet />

      {/* Nominate modal overlay — shown when URL is /all-orgs/nominate */}
      {isNominating && (
        <NominateModal onClose={() => navigate("/all-orgs/database")} />
      )}
    </div>
  );
}
