import React from "react";
import { useNavigate } from "react-router-dom";
import { useOrganizations } from "@/hooks/useOrganizations";
import OrgDashboard from "@/components/dashboard/OrgDashboard";

export default function Dashboard() {
  const { orgs, isLoading } = useOrganizations();
  const navigate = useNavigate();

  const handleNavigate = (filters) => {
    navigate("/all-orgs/database", { state: { filters } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-screen-2xl mx-auto px-6 py-6">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-pulse">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 h-24" />
            ))}
          </div>
        ) : (
          <OrgDashboard orgs={orgs} onNavigate={handleNavigate} />
        )}
      </div>
    </div>
  );
}
