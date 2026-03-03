import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function AllOrgsLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-crimson text-white px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-crimson-100 text-sm font-medium tracking-wide uppercase mb-1">
            Harvard Business School
          </p>
          <h1 className="text-3xl font-bold mb-1">All organizations</h1>
          <p className="text-crimson-100 text-sm">
            Browse the full list of organizations and nominate additions.
          </p>
        </div>
      </div>

      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 flex gap-4">
          <NavLink
            end
            to="/all-orgs"
            className={({ isActive }) =>
              `my-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#A51C30] text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`
            }
          >
            All organizations
          </NavLink>
          <NavLink
            to="/all-orgs/nominate"
            className={({ isActive }) =>
              `my-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#A51C30] text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`
            }
          >
            Nominate an organization
          </NavLink>
        </div>
      </div>

      <Outlet />
    </div>
  );
}
