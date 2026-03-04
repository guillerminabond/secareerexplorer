import React from "react";
import LearnMorePage from "@/components/learnmore/LearnMorePage";

export default function LearnMore() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-crimson text-white px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-crimson-100 text-sm font-medium tracking-wide uppercase mb-1">
            Harvard Business School
          </p>
          <h1 className="text-3xl font-bold mb-1">Learn More</h1>
          <p className="text-crimson-100 text-sm">
            Career paths, cause areas, and organizations in social enterprise.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        <LearnMorePage />
      </div>
    </div>
  );
}
