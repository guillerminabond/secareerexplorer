import React, { useState, useEffect } from "react";
import { fetchOrgs, deleteOrg } from "@/api/organizationsApi";
import OrgForm from "@/components/admin/OrgForm";
import { Plus, Pencil, Trash2, Lock } from "lucide-react";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "hbsse2024";

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const login = () => {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwError(false); }
    else setPwError(true);
  };

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchOrgs();
      setOrgs(data);
    } catch (err) {
      console.error('Error loading organizations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (authed) load(); }, [authed]);

  const handleDelete = async (id) => {
    try {
      await deleteOrg(id);
    } catch (err) {
      console.error('Error deleting organization:', err);
    }
    setDeleting(null);
    load();
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-crimson" />
            <h1 className="text-lg font-bold text-gray-900">Admin Login</h1>
          </div>
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-crimson/30"
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
          />
          {pwError && <p className="text-red-500 text-xs mb-3">Incorrect password</p>}
          <button onClick={login} className="w-full py-2 bg-crimson text-white rounded-lg text-sm font-medium">
            Login
          </button>
        </div>
      </div>
    );
  }

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
              onSave={() => { setEditing(null); load(); }}
              onCancel={() => setEditing(null)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">Admin — Organizations</h1>
          <button
            onClick={() => setEditing({})}
            className="flex items-center gap-2 px-4 py-2 bg-crimson text-white rounded-lg text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Add Organization
          </button>
        </div>

        {loading ? (
          <div className="text-sm text-gray-400">Loading...</div>
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
                        <button onClick={() => setEditing(org)} className="text-gray-400 hover:text-crimson">
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
                  <tr><td colSpan={4} className="text-center py-8 text-gray-400">No organizations yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
