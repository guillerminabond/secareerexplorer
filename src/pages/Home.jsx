// Legacy Home.jsx — replaced by route-based pages.
// "/" now redirects to /explore in App.jsx.
// This file is kept as a thin redirect to avoid breaking any stale imports.
// Safe to delete once all references are confirmed removed.

import { Navigate } from "react-router-dom";

export default function Home() {
  return <Navigate to="/explore" replace />;
}
