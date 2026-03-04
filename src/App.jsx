import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { pagesConfig } from "./pages.config";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import AllOrgsLayout from "./pages/AllOrgsLayout";
import AllOrgs from "./pages/AllOrgs";
import Nominate from "./pages/Nominate";
import Dashboard from "./pages/Dashboard";
import LearnMore from "./pages/LearnMore";
import Resources from "./pages/Resources";
import Admin from "./pages/Admin";

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) =>
  Layout ? (
    <Layout currentPageName={currentPageName}>{children}</Layout>
  ) : (
    <>{children}</>
  );

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <Routes>
          {/* ── Home (main page) ──────────────────────────────── */}
          <Route
            path="/"
            element={
              <LayoutWrapper currentPageName={mainPageKey}>
                <MainPage />
              </LayoutWrapper>
            }
          />

          {/* ── Dynamic pages from pagesConfig ───────────────── */}
          {Object.entries(Pages).map(([path, Page]) => (
            <Route
              key={path}
              path={`/${path}`}
              element={
                <LayoutWrapper currentPageName={path}>
                  <Page />
                </LayoutWrapper>
              }
            />
          ))}

          {/* ── All Organizations (nested layout) ────────────── */}
          <Route
            path="/all-orgs"
            element={
              <LayoutWrapper currentPageName="All Organizations">
                <AllOrgsLayout />
              </LayoutWrapper>
            }
          >
            {/* /all-orgs → redirect to /all-orgs/database */}
            <Route index element={<Navigate to="/all-orgs/database" replace />} />
            <Route path="database"  element={<AllOrgs />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="nominate"  element={<Nominate />} />
          </Route>

          {/* ── Standalone pages ─────────────────────────────── */}
          <Route
            path="/learn-more"
            element={
              <LayoutWrapper currentPageName="Learn More">
                <LearnMore />
              </LayoutWrapper>
            }
          />
          <Route
            path="/resources"
            element={
              <LayoutWrapper currentPageName="Resources">
                <Resources />
              </LayoutWrapper>
            }
          />

          {/* ── Admin ────────────────────────────────────────── */}
          <Route
            path="/admin"
            element={
              <LayoutWrapper currentPageName="Admin">
                <Admin />
              </LayoutWrapper>
            }
          />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App
