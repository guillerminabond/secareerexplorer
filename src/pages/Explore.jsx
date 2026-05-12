import React from "react";
import { useOrganizations } from "@/hooks/useOrganizations";
import { useSavedOrgs } from "@/hooks/useSavedOrgs";
import QuizExplore from "@/components/explore/QuizExplore";

export default function Explore() {
  const { orgs, isLoading } = useOrganizations();
  const { savedIds, toggleSave } = useSavedOrgs();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-screen-2xl mx-auto px-6 py-6">
        {isLoading ? (
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
