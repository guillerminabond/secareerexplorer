import React, { useEffect, useState } from "react";
import { fetchOrgs } from "@/api/organizationsApi";
import QuizExplore from "@/components/explore/QuizExplore";

export default function Explore() {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("hbs_saved_orgs") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    fetchOrgs()
      .then((data) => setOrgs(data))
      .catch((err) => console.error("Error fetching organizations:", err))
      .finally(() => setLoading(false));
  }, []);

  const toggleSave = (id) => {
    setSavedIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id];
      localStorage.setItem("hbs_saved_orgs", JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-6">
        {loading ? (
          /* Skeleton cards — matches the grid layout used in QuizExplore results */
          <div className="max-w-2xl mx-auto py-8 space-y-4">
            <div className="h-8 bg-gray-100 rounded-xl w-2/3 mx-auto animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 animate-pulse">
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-50 rounded w-1/2 mb-3" />
                  <div className="h-3 bg-gray-50 rounded w-full" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <QuizExplore orgs={orgs} savedIds={savedIds} onSave={toggleSave} />
        )}
      </div>
    </div>
  );
}
