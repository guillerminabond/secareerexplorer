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
          <div className="text-sm text-gray-500">Loading organizations…</div>
        ) : (
          <QuizExplore orgs={orgs} savedIds={savedIds} onSave={toggleSave} />
        )}
      </div>
    </div>
  );
}
