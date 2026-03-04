import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Compass, Database, BarChart2, BookOpen, Link2,
  Bookmark, PlusCircle, ChevronDown, ChevronUp,
} from "lucide-react";

const SECTIONS = [
  {
    icon: Compass,
    title: "Explore",
    path: "/explore",
    cta: "Open Explore",
    color: "bg-crimson/5 border-crimson/20 text-crimson",
    steps: [
      {
        heading: "Free-text search",
        body: "Type anything in the search bar — e.g. \"climate nonprofit in Africa\" or \"education funder Asia\". Results are ranked by relevance across org name, type, cause, region, and description.",
      },
      {
        heading: "Guided quiz",
        body: "Pick a starting point (cause area, org type, role, region, or population you want to serve) and answer 2–3 questions. A live match count updates as you select so you always know how many orgs fit.",
      },
      {
        heading: "Info icons",
        body: "Each answer chip shows a small ℹ icon. Click it for a one-sentence definition — useful if you're still learning the SE landscape.",
      },
      {
        heading: "Refine results",
        body: "After seeing your results, the Preferences panel lets you toggle individual options on/off without re-doing the quiz.",
      },
      {
        heading: "Surprise me",
        body: "Hit the \"Surprise me\" button on the home screen to get a random organization you haven't saved yet — good for serendipitous discovery.",
      },
    ],
  },
  {
    icon: Database,
    title: "All Organizations",
    path: "/all-orgs/database",
    cta: "Open Database",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    steps: [
      {
        heading: "Search & filter",
        body: "Use the search bar to find orgs by name or description. Click Filters to narrow by cause area, org type, region, role type, or target population — filters stack (AND logic).",
      },
      {
        heading: "Table vs. card view",
        body: "Toggle between a compact table (good for scanning many orgs) and a card grid (good for reading descriptions at a glance).",
      },
      {
        heading: "Saving organizations",
        body: "Click the bookmark icon on any card or row to save it. Your saves are stored locally in your browser — no account needed.",
      },
      {
        heading: "Viewing saved orgs",
        body: "Click the Saved button in the toolbar to filter down to only the organizations you've bookmarked.",
      },
      {
        heading: "Nominating an org",
        body: "Don't see an organization you think should be here? Click Nominate in the toolbar and fill in what you know. The HBS SE team will review it.",
      },
    ],
  },
  {
    icon: BarChart2,
    title: "Dashboard",
    path: "/all-orgs/dashboard",
    cta: "Open Dashboard",
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
    steps: [
      {
        heading: "At-a-glance stats",
        body: "See total organizations, distinct cause areas, regions covered, and org types represented in the database.",
      },
      {
        heading: "Clickable charts",
        body: "Every bar, pie segment, and population tag is clickable. Clicking takes you to the Database pre-filtered for exactly that category — no manual filter setup needed.",
      },
      {
        heading: "Coverage matrix (admin)",
        body: "Admins can see a Cause × Region heat map showing where the database is dense vs. sparse — useful for identifying gaps.",
      },
    ],
  },
  {
    icon: BookOpen,
    title: "Learn More",
    path: "/learn-more",
    cta: "Open Learn More",
    color: "bg-purple-50 border-purple-200 text-purple-700",
    steps: [
      {
        heading: "🌍 Causes tab",
        body: "Deep-dives on each cause area — what the issue is, key actors, and what careers there look like.",
      },
      {
        heading: "🏢 Organizations tab",
        body: "Explains each org type (nonprofit, impact investing, B Corp, hybrid, etc.) and when you'd choose one over another.",
      },
      {
        heading: "💼 Career Paths tab",
        body: "Breaks down functional roles (ops, finance, strategy, comms, programs) and what they look like inside SE orgs.",
      },
    ],
  },
  {
    icon: Link2,
    title: "Resources",
    path: "/resources",
    cta: "Open Resources",
    color: "bg-amber-50 border-amber-200 text-amber-700",
    steps: [
      {
        heading: "General resources",
        body: "Job boards, career platforms, and sector newsletters — Devex, Candid, B Corp Directory, Escape the City, Fast Forward, and more.",
      },
      {
        heading: "HBS-specific resources",
        body: "Links to HBS clubs, the Summer Fellows and Leadership Fellows programs, CPD, 12Twenty mentorships, alumni directory, and SE faculty research.",
      },
      {
        heading: "Tag filtering",
        body: "Use the tag bar to filter resources by org type, geography, or function (Career Support, Fellowship, Funding, etc.).",
      },
    ],
  },
];

function Section({ icon: Icon, title, path, cta, color, steps }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border ${color}`}>
            <Icon className="w-5 h-5" />
          </span>
          <span className="text-base font-semibold text-gray-900">{title}</span>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
        }
      </button>

      {open && (
        <div className="border-t border-gray-100 px-6 py-5 space-y-4">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold flex items-center justify-center">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-0.5">{s.heading}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
          <div className="pt-2">
            <button
              onClick={() => navigate(path)}
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${color}`}
            >
              {cta} →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HowToUse() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">How to use this platform</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            The HBS Social Enterprise Career Explorer helps you discover impact organizations,
            understand the SE landscape, and find your next career move.
            Click any section below to expand it.
          </p>
        </div>

        <div className="space-y-3 mb-10">
          {SECTIONS.map(s => <Section key={s.title} {...s} />)}
        </div>

        {/* Quick tips */}
        <div className="bg-white border border-gray-100 rounded-2xl px-6 py-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">Quick tips</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Bookmark,   tip: "Saves are stored in your browser — they'll persist across sessions on the same device." },
              { icon: BarChart2,  tip: "Start with the Dashboard to get the big picture, then click into the areas that interest you." },
              { icon: Compass,    tip: "The ℹ icons in Explore are especially helpful if you're new to the SE landscape." },
              { icon: PlusCircle, tip: "Nominate organizations you've found through recruiting or networking that aren't in the database yet." },
            ].map(({ icon: Icon, tip }, i) => (
              <div key={i} className="flex gap-3 text-sm text-gray-500">
                <Icon className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
