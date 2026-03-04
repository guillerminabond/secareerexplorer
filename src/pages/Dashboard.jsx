import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchOrgs } from "@/api/organizationsApi";
import OrgDashboard from "@/components/dashboard/OrgDashboard";

export default function Dashboard() {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrgs()
      .then(setOrgs)
      .catch(err => console.error("Error fetching organizations:", err))
      .finally(() => setLoading(false));
  }, []);

  // Clicking a chart item navigates to the database pre-filtered
  const handleNavigate = (filters) => {
    navigate("/all-orgs/database", { state: { filters } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-6">
        {loading ? (
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
