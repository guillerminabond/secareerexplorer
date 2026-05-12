import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { deleteOrg } from "@/api/organizationsApi";
import { useOrganizations, useInvalidateOrgs } from "@/hooks/useOrganizations";
import { fetchNominations, updateNominationStatus } from "@/api/nominationsApi";
import { fetchFeedback } from "@/api/feedbackApi";
import OrgForm from "@/components/admin/OrgForm";
import FeedbackTab from "@/components/admin/FeedbackTab";
import NominationsTab from "@/components/admin/NominationsTab";
import OrgMappingTab from "@/components/admin/OrgMappingTab";
import {
  Plus, Pencil, Trash2, Lock, CheckCircle, XCircle, Clock,
  Loader2, UserPlus, LogOut, Users, MessageSquare, Grid3x3,
  Building2, ListChecks, Mail, KeyRound
} from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { supabase } from "@/api/supabaseClient";

// ── Edge Function helper ──────────────────────────────────────────
const INVITE_FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/invite-admin`;

async function callInviteFunction(method, body = null) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error("Not authenticated");
  const opts = {
    method,
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(INVITE_FN_URL, opts);
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);
  return json;
}

// ── Users tab ─────────────────────────────────────────────────────
function UsersTab() {
  const [newEmail,    setNewEmail]    = useState("");
  const [creating,    setCreating]    = useState(false);
  const [createMsg,   setCreateMsg]   = useState(null);

  // Admin users list
  const [users,       setUsers]       = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError,  setUsersError]  = useState(null);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setUsersError(null);
    try {
      const data = await callInviteFunction("GET");
      setUsers(data.users ?? []);
    } catch (err) {
      setUsersError(err.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async () => {
    setCreateMsg(null);
    if (!newEmail.trim()) {
      setCreateMsg({ type: "error", text: "Email is required." });
      return;
    }
    setCreating(true);
    try {
      const data = await callInviteFunction("POST", { email: newEmail.trim() });
      setCreateMsg({ type: "success", text: data.message });
      setNewEmail("");
      fetchUsers(); // refresh the table
    } catch (err) {
      setCreateMsg({ type: "error", text: err.message || "Failed to send invite." });
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  };

  const formatDateTime = (iso) => {
    if (!iso) return "Never";
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "numeric", minute: "2-digit",
    });
  };

  const getStatus = (user) => {
    if (user.confirmed_at) return "confirmed";
    return "invited";
  };

  return (
    <div className="space-y-6">
      {/* ── Create form ─────────────────────────────────────────── */}
      <div className="max-w-md">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-1">
            <UserPlus className="w-4 h-4 text-[#A51C30]" />
            <h2 className="text-sm font-bold text-gray-900">Create New Admin User</h2>
          </div>
          <p className="text-xs text-gray-400 mb-5">
            An invite email will be sent. The new user sets their own password via the link.
          </p>

          <input
            type="email"
            placeholder="New admin email"
            value={newEmail}
            onChange={e => { setNewEmail(e.target.value); setCreateMsg(null); }}
            onKeyDown={e => e.key === "Enter" && handleCreate()}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#A51C30]/30"
          />

          {createMsg && (
            <p className={`text-xs mb-3 ${createMsg.type === "success" ? "text-green-600" : "text-red-500"}`}>
              {createMsg.text}
            </p>
          )}

          <button
            onClick={handleCreate}
            disabled={creating}
            className="w-full py-2 bg-[#A51C30] text-white rounded-lg text-sm font-medium disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {creating && <Loader2 className="w-4 h-4 animate-spin" />}
            {creating ? "Sending…" : "Send Invite"}
          </button>
        </div>
      </div>

      {/* ── Admin users table ───────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#A51C30]" />
            <h2 className="text-sm font-bold text-gray-900">Admin Users</h2>
            {!loadingUsers && (
              <span className="text-xs text-gray-400">({users.length})</span>
            )}
          </div>
          <button
            onClick={fetchUsers}
            disabled={loadingUsers}
            className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
          >
            {loadingUsers ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
            Refresh
          </button>
        </div>

        {usersError && (
          <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-4">
            <p className="text-xs text-red-600">{usersError}</p>
            <p className="text-xs text-red-400 mt-1">
              Make sure the <code className="bg-red-100 px-1 rounded">invite-admin</code> Edge Function is deployed.
            </p>
          </div>
        )}

        {loadingUsers && !usersError ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-gray-300" />
          </div>
        ) : !usersError && users.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-6">No admin users found.</p>
        ) : !usersError ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-400 pb-2 pr-4">Email</th>
                  <th className="text-left text-xs font-medium text-gray-400 pb-2 pr-4">Status</th>
                  <th className="text-left text-xs font-medium text-gray-400 pb-2 pr-4">Created</th>
                  <th className="text-left text-xs font-medium text-gray-400 pb-2">Last Login</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const status = getStatus(u);
                  return (
                    <tr key={u.id} className="border-b border-gray-50 last:border-0">
                      <td className="py-2.5 pr-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{u.email}</span>
                        </div>
                      </td>
                      <td className="py-2.5 pr-4">
                        {status === "confirmed" ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                            <CheckCircle className="w-3 h-3" />
                            Confirmed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3" />
                            Invited
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 pr-4 text-xs text-gray-500">
                        {formatDate(u.created_at)}
                      </td>
                      <td className="py-2.5 text-xs text-gray-500">
                        {formatDateTime(u.last_sign_in_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>

      <div className="max-w-md bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-700">
        <strong>Note:</strong> All admin users have the same permissions.
        To deactivate an account, use the{" "}
        <a
          href="https://supabase.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-amber-900"
        >
          Supabase Dashboard
        </a>.
      </div>
    </div>
  );
}

// ── Tab config ────────────────────────────────────────────────────
const TABS = [
  { id: "orgs",        label: "Organizations", icon: Building2  },
  { id: "nominations", label: "Nominations",   icon: ListChecks },
  { id: "feedback",    label: "Feedback",      icon: MessageSquare },
  { id: "mapping",     label: "Mapping",       icon: Grid3x3   },
  { id: "users",       label: "Users",         icon: Users      },
];

export default function Admin() {
  const { adminMode, authLoading, login, logout } = useAdmin();
  const [email,        setEmail]        = useState("");
  const [pw,           setPw]           = useState("");
  const [loginError,   setLoginError]   = useState("");
  const [loggingIn,    setLoggingIn]    = useState(false);
  const [loginMode,    setLoginMode]    = useState("password"); // "password" | "magic"
  const [magicSent,    setMagicSent]    = useState(false);
  const [activeTab,    setActiveTab]    = useState("orgs");

  // Data state — orgs via TanStack Query, nominations/feedback manual
  const { orgs, isLoading: loadingOrgs } = useOrganizations();
  const invalidateOrgs = useInvalidateOrgs();
  const [nominations,  setNominations]  = useState([]);
  const [feedback,     setFeedback]     = useState([]);
  const [loadingNoms,  setLoadingNoms]  = useState(true);
  const [loadingFb,    setLoadingFb]    = useState(true);

  // Org management
  const [editing,     setEditing]     = useState(null);
  const [deleting,    setDeleting]    = useState(null);

  // Nomination approval flow (full-page form)
  const [approvingNom, setApprovingNom] = useState(null);

  const handleLogin = async () => {
    if (!email.trim() || !pw) { setLoginError("Email and password are required."); return; }
    setLoggingIn(true);
    setLoginError("");
    const { error } = await login(email.trim(), pw);
    setLoggingIn(false);
    if (error) { setLoginError("Incorrect email or password."); setPw(""); }
  };

  const handleMagicLink = async () => {
    if (!email.trim()) { setLoginError("Please enter your email address."); return; }
    setLoggingIn(true);
    setLoginError("");
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    });
    setLoggingIn(false);
    if (error) { setLoginError(error.message || "Failed to send magic link."); }
    else { setMagicSent(true); }
  };

  const loadNominations = async () => {
    setLoadingNoms(true);
    try { const data = await fetchNominations(); setNominations(data); }
    catch (err) { console.error("Error loading nominations:", err); }
    finally { setLoadingNoms(false); }
  };

  const loadFeedback = async () => {
    setLoadingFb(true);
    try { const data = await fetchFeedback(); setFeedback(data); }
    catch (err) { console.error("Error loading feedback:", err); }
    finally { setLoadingFb(false); }
  };

  useEffect(() => {
    if (adminMode) {
      loadNominations();
      loadFeedback();
    }
  }, [adminMode]);

  const handleDelete = async (id) => {
    try { await deleteOrg(id); }
    catch (err) { console.error("Error deleting org:", err); }
    setDeleting(null);
    invalidateOrgs();
  };

  const handleApproveAfterSave = async (nomId) => {
    try { await updateNominationStatus(nomId, "approved"); }
    catch (err) { console.error("Error marking nomination approved:", err); }
    setApprovingNom(null);
    invalidateOrgs();
    loadNominations();
  };

  // ── Auth loading ──────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="bg-gray-50 flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-[#A51C30]" />
      </div>
    );
  }

  // ── Login screen ─────────────────────────────────────────────
  if (!adminMode) {
    return (
      <div className="bg-gray-50 flex items-center justify-center py-24">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">

          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-[#A51C30]" />
            <h1 className="text-lg font-bold text-gray-900">Admin Login</h1>
          </div>

          {/* Mode toggle */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-5">
            <button
              onClick={() => { setLoginMode("password"); setLoginError(""); setMagicSent(false); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                loginMode === "password" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <KeyRound className="w-3 h-3" /> Password
            </button>
            <button
              onClick={() => { setLoginMode("magic"); setLoginError(""); setMagicSent(false); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                loginMode === "magic" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Mail className="w-3 h-3" /> Magic link
            </button>
          </div>

          {/* Email (shared) */}
          <input
            type="email"
            placeholder="Admin email"
            autoFocus
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#A51C30]/30"
            value={email}
            onChange={e => { setEmail(e.target.value); setLoginError(""); setMagicSent(false); }}
            onKeyDown={e => e.key === "Enter" && (loginMode === "password" ? handleLogin() : handleMagicLink())}
          />

          {/* ── Password mode ── */}
          {loginMode === "password" && (
            <>
              <input
                type="password"
                placeholder="Password"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-1 focus:outline-none focus:ring-2 focus:ring-[#A51C30]/30"
                value={pw}
                onChange={e => { setPw(e.target.value); setLoginError(""); }}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
              />
              <div className="flex justify-end mb-4">
                <Link to="/forgot-password" className="text-xs text-gray-400 hover:text-[#A51C30] transition-colors">
                  Forgot password?
                </Link>
              </div>
              {loginError && <p className="text-red-500 text-xs mb-3">{loginError}</p>}
              <button
                onClick={handleLogin}
                disabled={loggingIn}
                className="w-full py-2 bg-[#A51C30] text-white rounded-lg text-sm font-medium disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loggingIn && <Loader2 className="w-4 h-4 animate-spin" />}
                {loggingIn ? "Verifying…" : "Login"}
              </button>
            </>
          )}

          {/* ── Magic link mode ── */}
          {loginMode === "magic" && (
            <>
              {magicSent ? (
                <div className="text-center py-3">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-800 mb-1">Check your inbox</p>
                  <p className="text-xs text-gray-500 mb-4">
                    A magic link has been sent to <strong>{email}</strong>. Click it to log in — no password needed.
                  </p>
                  <button
                    onClick={() => { setMagicSent(false); setLoginError(""); }}
                    className="text-xs text-[#A51C30] hover:underline"
                  >
                    Send again
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-xs text-gray-400 mb-4">
                    We'll email you a secure link. Click it to sign in instantly — no password required.
                  </p>
                  {loginError && <p className="text-red-500 text-xs mb-3">{loginError}</p>}
                  <button
                    onClick={handleMagicLink}
                    disabled={loggingIn}
                    className="w-full py-2 bg-[#A51C30] text-white rounded-lg text-sm font-medium disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loggingIn && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loggingIn ? "Sending…" : "Send magic link"}
                  </button>
                </>
              )}
            </>
          )}

        </div>
      </div>
    );
  }

  // ── Org edit form ────────────────────────────────────────────
  if (editing !== null) {
    return (
      <div className="bg-gray-50">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <h1 className="text-xl font-bold text-gray-900 mb-6">
            {editing.id ? "Edit Organization" : "Add Organization"}
          </h1>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <OrgForm
              org={editing.id ? editing : null}
              onSave={() => { setEditing(null); invalidateOrgs(); }}
              onCancel={() => setEditing(null)}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── Approve nomination → OrgForm pre-filled ──────────────────
  if (approvingNom !== null) {
    const n = approvingNom;
    const prefilledOrg = {
      name:        n.name        || "",
      website:     n.website     || "",
      description: n.description || "",
      org_type:    n.org_type    || "",
    };
    return (
      <div className="bg-gray-50">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <button onClick={() => setApprovingNom(null)} className="text-sm text-gray-400 hover:text-gray-600 mb-2">
            ← Back to nominations
          </button>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-sm text-amber-800">
            <strong>Approving nomination:</strong> {n.name}{n.hbs_connection ? ` — "${n.hbs_connection}"` : ""}
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-6">Add Organization from Nomination</h1>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <OrgForm
              org={prefilledOrg}
              onSave={() => handleApproveAfterSave(n.id)}
              onCancel={() => setApprovingNom(null)}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── Derived counts for badges ─────────────────────────────────
  const pendingCount  = nominations.filter(n => n.status === "pending").length;
  const unreadFbCount = feedback.filter(f => !f.archived && !f.starred).length;
  const starredCount  = feedback.filter(f => f.starred && !f.archived).length;

  // ── Main admin panel ─────────────────────────────────────────
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#A51C30]" />
            <h1 className="text-base font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-100"
            title="Log out"
          >
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </div>

        {/* ── Tab nav ── */}
        <div className="flex gap-1 mb-6 flex-wrap">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const badge =
              tab.id === "nominations" ? pendingCount :
              tab.id === "feedback"    ? (starredCount || unreadFbCount) :
              null;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all
                  ${isActive
                    ? "bg-[#A51C30] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800 hover:bg-white hover:border-gray-100 border border-transparent"}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                {badge > 0 && (
                  <span className={`text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center font-semibold
                    ${isActive ? "bg-white/25 text-white" : "bg-[#A51C30] text-white"}`}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Add org button (only shown on orgs tab) */}
          {activeTab === "orgs" && (
            <button
              onClick={() => setEditing({})}
              className="ml-auto flex items-center gap-1.5 px-4 py-2 bg-[#A51C30] text-white rounded-lg text-sm font-medium hover:bg-[#8e1728] transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Organization
            </button>
          )}
        </div>

        {/* ── Organizations tab ── */}
        {activeTab === "orgs" && (
          loadingOrgs ? (
            <div className="flex items-center gap-2 text-sm text-gray-400 py-8">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading organizations…
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Type</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">HQ</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orgs.map(org => (
                    <tr key={org.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{org.name}</td>
                      <td className="px-4 py-3 text-gray-500 hidden sm:table-cell text-sm">{org.org_type}</td>
                      <td className="px-4 py-3 text-gray-400 hidden md:table-cell text-xs">{org.hq}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => setEditing(org)}
                            className="p-1.5 text-gray-400 hover:text-[#A51C30] hover:bg-red-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          {deleting === org.id ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleDelete(org.id)} className="text-xs text-red-500 font-medium hover:text-red-700">Confirm</button>
                              <button onClick={() => setDeleting(null)} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleting(org.id)}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {orgs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-gray-400">No organizations yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {orgs.length > 0 && (
                <div className="px-4 py-2 border-t border-gray-50 bg-gray-50">
                  <p className="text-xs text-gray-400">{orgs.length} organizations</p>
                </div>
              )}
            </div>
          )
        )}

        {/* ── Nominations tab ── */}
        {activeTab === "nominations" && (
          loadingNoms ? (
            <div className="flex items-center gap-2 text-sm text-gray-400 py-8">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading nominations…
            </div>
          ) : (
            <NominationsTab
              nominations={nominations}
              onReload={loadNominations}
              onApprove={n => setApprovingNom(n)}
            />
          )
        )}

        {/* ── Feedback tab ── */}
        {activeTab === "feedback" && (
          loadingFb ? (
            <div className="flex items-center gap-2 text-sm text-gray-400 py-8">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading feedback…
            </div>
          ) : (
            <FeedbackTab
              feedback={feedback}
              onReload={loadFeedback}
            />
          )
        )}

        {/* ── Mapping tab ── */}
        {activeTab === "mapping" && (
          loadingOrgs ? (
            <div className="flex items-center gap-2 text-sm text-gray-400 py-8">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading organizations…
            </div>
          ) : (
            <OrgMappingTab orgs={orgs} />
          )
        )}

        {/* ── Users tab ── */}
        {activeTab === "users" && <UsersTab />}

      </div>
    </div>
  );
}
