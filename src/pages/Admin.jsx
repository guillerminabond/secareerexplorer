import React, { useState, useEffect } from "react";
import { fetchOrgs, deleteOrg } from "@/api/organizationsApi";
import { fetchNominations, updateNominationStatus } from "@/api/nominationsApi";
import OrgForm from "@/components/admin/OrgForm";
import { Plus, Pencil, Trash2, Lock, CheckCircle, XCircle, Clock } from "lucide-react";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "hbsse2024";

// ── Nomination status badge ───────────────────────────────────
function StatusBadge({ status }) {
  if (status === "approved") return <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full"><CheckCircle className="w-3 h-3" />Approved</span>;
  if (status === "rejected") return <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full"><XCircle className="w-3 h-3" />Rejected</span>;
  return <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full"><Clock className="w-3 h-3" />Pending</span>;
}

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [adminTab, setAdminTab] = useState("orgs"); // "orgs" | "nominations"

  // Organizations state
  const [orgs, setOrgs] = useState([]);
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // Nominations state
  const [nominations, setNominations] = useState([]);
  const [loadingNoms, setLoadingNoms] = useState(true);
  const [expandedNom, setExpandedNom] = useState(null);
  const [approvingNom, setApprovingNom] = useState(null); // nomination to approve → opens OrgForm pre-filled

  const login = () => {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwError(false); }
    else setPwError(true);
  };

  const loadOrgs = async () => {
    setLoadingOrgs(true);
    try { const data = await fetchOrgs(); setOrgs(data); }
    catch (err) { console.error("Error loading organizations:", err); }
    finally { setLoadingOrgs(false); }
  };

  const loadNominations = async () => {
    setLoadingNoms(true);
    try { const data = await fetchNominations(); setNominations(data); }
    catch (err) { console.error("Error loading nominations:", err); }
    finally { setLoadingNoms(false); }
  };

  useEffect(() => {
    if (authed) { loadOrgs(); loadNominations(); }
  }, [authed]);

  const handleDelete = async (id) => {
    try { await deleteOrg(id); }
    catch (err) { console.error("Error deleting org:", err); }
    setDeleting(null);
    loadOrgs();
  };

  const handleReject = async (id) => {
    try { await updateNominationStatus(id, "rejected"); }
    catch (err) { console.error("Error rejecting nomination:", err); }
    loadNominations();
  };

  const handleApproveAfterSave = async (nomId) => {
    try { await updateNominationStatus(nomId, "approved"); }
    catch (err) { console.error("Error marking nomination approved:", err); }
    setApprovingNom(null);
    loadOrgs();
    loadNominations();
  };

  // ── Login screen ──────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-[#A51C30]" />
            <h1 className="text-lg font-bold text-gray-900">Admin Login</h1>
          </div>
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#A51C30]/30"
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
          />
          {pwError && <p className="text-red-500 text-xs mb-3">Incorrect password</p>}
          <button onClick={login} className="w-full py-2 bg-[#A51C30] text-white rounded-lg text-sm font-medium">
            Login
          </button>
        </div>
      </div>
    );
  }

  // ── Org edit form ─────────────────────────────────────────────
  if (editing !== null) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <h1 className="text-xl font-bold text-gray-900 mb-6">
            {editing.id ? "Edit Organization" : "Add Organization"}
          </h1>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <OrgForm
              org={editing.id ? editing : null}
              onSave={() => { setEditing(null); loadOrgs(); }}
              onCancel={() => setEditing(null)}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── Approve nomination → OrgForm pre-filled ───────────────────
  if (approvingNom !== null) {
    const n = approvingNom;
    const prefilledOrg = {
      name: n.name || "",
      website: n.website || "",
      description: n.description || "",
      org_type: n.org_type || "",
      // cause_areas, regions etc. will be blank since OrgForm handles them from DB
    };
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => setApprovingNom(null)} className="text-sm text-gray-400 hover:text-gray-600">← Back to nominations</button>
          </div>
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

  // ── Main admin panel ──────────────────────────────────────────
  const pendingCount = nominations.filter(n => n.status === "pending").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Sub-tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setAdminTab("orgs")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${adminTab === "orgs" ? "bg-[#A51C30] text-white shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`}
            >
              Organizations
            </button>
            <button
              onClick={() => setAdminTab("nominations")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${adminTab === "nominations" ? "bg-[#A51C30] text-white shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`}
            >
              Nominations
              {pendingCount > 0 && (
                <span className={`text-xs rounded-full px-1.5 py-0.5 ${adminTab === "nominations" ? "bg-white/30 text-white" : "bg-amber-500 text-white"}`}>{pendingCount}</span>
              )}
            </button>
          </div>

          {adminTab === "orgs" && (
            <button
              onClick={() => setEditing({})}
              className="flex items-center gap-2 px-4 py-2 bg-[#A51C30] text-white rounded-lg text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> Add Organization
            </button>
          )}
        </div>

        {/* ── Organizations tab ── */}
        {adminTab === "orgs" && (
          loadingOrgs ? (
            <div className="text-sm text-gray-400">Loading…</div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orgs.map(org => (
                    <tr key={org.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{org.name}</td>
                      <td className="px-4 py-3 text-gray-500">{org.org_type}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <button onClick={() => setEditing(org)} className="text-gray-400 hover:text-[#A51C30]">
                            <Pencil className="w-4 h-4" />
                          </button>
                          {deleting === org.id ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleDelete(org.id)} className="text-xs text-red-500 font-medium">Confirm</button>
                              <button onClick={() => setDeleting(null)} className="text-xs text-gray-400">Cancel</button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleting(org.id)} className="text-gray-400 hover:text-red-500">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {orgs.length === 0 && (
                    <tr><td colSpan={3} className="text-center py-8 text-gray-400">No organizations yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* ── Nominations tab ── */}
        {adminTab === "nominations" && (
          loadingNoms ? (
            <div className="text-sm text-gray-400">Loading…</div>
          ) : (
            <div className="space-y-3">
              {nominations.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm">No nominations yet.</div>
              )}
              {nominations.map(n => (
                <div key={n.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50"
                    onClick={() => setExpandedNom(expandedNom === n.id ? null : n.id)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <StatusBadge status={n.status} />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{n.name}</p>
                        {n.org_type && <p className="text-xs text-gray-400">{n.org_type}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                      <span className="text-xs text-gray-400">{new Date(n.created_at).toLocaleDateString()}</span>
                      {n.status === "pending" && (
                        <div className="flex gap-1.5">
                          <button
                            onClick={e => { e.stopPropagation(); setApprovingNom(n); }}
                            className="flex items-center gap-1 text-xs bg-green-500 text-white rounded px-2 py-1 hover:bg-green-600"
                          >
                            <CheckCircle className="w-3 h-3" /> Approve
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); handleReject(n.id); }}
                            className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 rounded px-2 py-1 hover:bg-red-50 hover:text-red-600"
                          >
                            <XCircle className="w-3 h-3" /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {expandedNom === n.id && (
                    <div className="border-t border-gray-100 px-4 py-3 space-y-2 bg-gray-50 text-xs text-gray-600">
                      {n.website && <p><span className="font-semibold text-gray-500">Website:</span> <a href={n.website} target="_blank" rel="noopener noreferrer" className="text-[#A51C30] hover:underline">{n.website}</a></p>}
                      {n.description && <p><span className="font-semibold text-gray-500">Description:</span> {n.description}</p>}
                      {n.cause_areas && <p><span className="font-semibold text-gray-500">Cause areas:</span> {n.cause_areas}</p>}
                      {n.regions && <p><span className="font-semibold text-gray-500">Regions:</span> {n.regions}</p>}
                      {n.hbs_connection && <p><span className="font-semibold text-gray-500">HBS connection:</span> {n.hbs_connection}</p>}
                      {n.submitted_by && <p><span className="font-semibold text-gray-500">Submitted by:</span> {n.submitted_by}</p>}
                      {n.admin_notes && <p><span className="font-semibold text-gray-500">Admin notes:</span> {n.admin_notes}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
