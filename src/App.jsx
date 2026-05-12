import { Analytics } from "@vercel/analytics/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { AdminProvider } from "./contexts/AdminContext";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import Layout from "./Layout";
import Explore from "./pages/Explore";
import AllOrgsLayout from "./pages/AllOrgsLayout";
import AllOrgs from "./pages/AllOrgs";
import Dashboard from "./pages/Dashboard";
import LearnMore from "./pages/LearnMore";
import Resources from "./pages/Resources";
import Admin from "./pages/Admin";
import HowToUse from "./pages/HowToUse";
import UpdatePassword from "./pages/UpdatePassword";
import ForgotPassword from "./pages/ForgotPassword";
import AuthConfirm from "./pages/AuthConfirm";

function App() {
  return (
    <AdminProvider>
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <Routes>
          {/* ── "/" redirects to Explore ──────────────────────── */}
          <Route path="/" element={<Navigate to="/explore" replace />} />

          {/* ── Explore (main page) ──────────────────────────── */}
          <Route
            path="/explore"
            element={
              <Layout><Explore /></Layout>
            }
          />

          {/* ── All Organizations (nested layout) ────────────── */}
          <Route
            path="/all-orgs"
            element={
              <Layout><AllOrgsLayout /></Layout>
            }
          >
            <Route index element={<Navigate to="/all-orgs/database" replace />} />
            <Route path="database"  element={<AllOrgs />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="nominate"  element={<AllOrgs />} />
          </Route>

          {/* ── Standalone pages ─────────────────────────────── */}
          <Route
            path="/learn-more"
            element={<Layout><LearnMore /></Layout>}
          />
          <Route
            path="/resources"
            element={<Layout><Resources /></Layout>}
          />
          <Route
            path="/how-to-use"
            element={<Layout><HowToUse /></Layout>}
          />
          <Route
            path="/admin"
            element={<Layout><Admin /></Layout>}
          />

          {/* ── Auth flows ──────────────────────────────────── */}
          <Route path="/auth/confirm"     element={<AuthConfirm />} />
          <Route path="/update-password"  element={<UpdatePassword />} />
          <Route path="/forgot-password"  element={<ForgotPassword />} />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
      <Analytics />
    </QueryClientProvider>
    </AdminProvider>
  );
}

export default App
