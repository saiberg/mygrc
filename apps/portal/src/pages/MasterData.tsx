import { useState, useEffect } from 'react';
import { Users, Plus, Trash2, RefreshCw, Search, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE = 'http://localhost:3000/api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

// --- Tab Types ---
type Tab = 'users' | 'roles';

export const MasterData = () => {
  const [tab, setTab] = useState<Tab>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  // User form state
  const [userForm, setUserForm] = useState({ user_code: '', full_name: '', email: '', source_system: '' });
  // Role form state
  const [roleForm, setRoleForm] = useState({ role_name: '', process_area: '', criticality: 'Medium', role_desc: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([
        fetch(`${API_BASE}/master-data/users`),
        fetch(`${API_BASE}/master-data/roles`),
      ]);
      setUsers(await usersRes.json());
      setRoles(await rolesRes.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const showMessage = (type: 'ok' | 'err', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3500);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/master-data/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm),
      });
      if (!res.ok) throw new Error((await res.json()).message);
      setUserForm({ user_code: '', full_name: '', email: '', source_system: '' });
      showMessage('ok', 'User created successfully.');
      fetchData();
    } catch (err: any) {
      showMessage('err', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/master-data/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleForm),
      });
      if (!res.ok) throw new Error((await res.json()).message);
      setRoleForm({ role_name: '', process_area: '', criticality: 'Medium', role_desc: '' });
      showMessage('ok', 'Role created successfully.');
      fetchData();
    } catch (err: any) {
      showMessage('err', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (type: Tab, id: string) => {
    try {
      await fetch(`${API_BASE}/master-data/${type}/${id}`, { method: 'DELETE' });
      showMessage('ok', `Record deleted.`);
      fetchData();
    } catch {
      showMessage('err', 'Delete failed.');
    }
  };

  const filteredUsers = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.user_code?.toLowerCase().includes(search.toLowerCase())
  );
  const filteredRoles = roles.filter(r =>
    r.role_name?.toLowerCase().includes(search.toLowerCase())
  );

  const criticalityBadge = (c: string) => {
    const map: Record<string, string> = {
      High: 'bg-rose-50 text-rose-600 border-rose-200',
      Medium: 'bg-amber-50 text-amber-600 border-amber-200',
      Low: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    };
    return map[c] || 'bg-slate-100 text-slate-500 border-slate-200';
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">

      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Master Data</h1>
          <p className="text-slate-500 text-sm mt-1">Manage GRC Users and Roles for this tenant.</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </motion.div>

      {/* Toast message */}
      {message && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className={`px-4 py-3 rounded-lg text-sm font-medium border ${message.type === 'ok' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
          {message.text}
        </motion.div>
      )}

      {/* Tabs */}
      <motion.div variants={itemVariants} className="flex gap-1 border-b border-slate-200">
        {(['users', 'roles'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-medium capitalize transition-all border-b-2 -mb-px ${tab === t ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            {t === 'users' ? <span className="flex items-center gap-2"><Users className="w-4 h-4" />Users ({users.length})</span>
              : <span className="flex items-center gap-2"><Briefcase className="w-4 h-4" />Roles ({roles.length})</span>}
          </button>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Create Form */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-600" />
            {tab === 'users' ? 'New GRC User' : 'New GRC Role'}
          </h3>

          {tab === 'users' ? (
            <form onSubmit={handleCreateUser} className="space-y-3">
              {[
                { label: 'User Code *', key: 'user_code', placeholder: 'e.g. USR001' },
                { label: 'Full Name *', key: 'full_name', placeholder: 'e.g. John Smith' },
                { label: 'Email *', key: 'email', placeholder: 'john@company.com' },
                { label: 'Source System', key: 'source_system', placeholder: 'e.g. SAP ECC' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{field.label}</label>
                  <input
                    placeholder={field.placeholder}
                    value={(userForm as any)[field.key]}
                    onChange={e => setUserForm(p => ({ ...p, [field.key]: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 placeholder-slate-300 transition"
                  />
                </div>
              ))}
              <button type="submit" disabled={submitting}
                className="w-full mt-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50">
                {submitting ? 'Creating...' : 'Create User'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleCreateRole} className="space-y-3">
              {[
                { label: 'Role Name *', key: 'role_name', placeholder: 'e.g. FI_POSTING' },
                { label: 'Process Area *', key: 'process_area', placeholder: 'e.g. Finance' },
                { label: 'Description', key: 'role_desc', placeholder: 'Brief description' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{field.label}</label>
                  <input
                    placeholder={field.placeholder}
                    value={(roleForm as any)[field.key]}
                    onChange={e => setRoleForm(p => ({ ...p, [field.key]: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 placeholder-slate-300 transition"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Criticality *</label>
                <select value={roleForm.criticality} onChange={e => setRoleForm(p => ({ ...p, criticality: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition bg-white">
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              <button type="submit" disabled={submitting}
                className="w-full mt-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50">
                {submitting ? 'Creating...' : 'Create Role'}
              </button>
            </form>
          )}
        </motion.div>

        {/* Table */}
        <motion.div variants={itemVariants} className="xl:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                placeholder={`Search ${tab}...`}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 placeholder-slate-300 transition"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-400 text-sm">Loading...</div>
          ) : tab === 'users' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr className="text-left text-slate-500 text-xs uppercase tracking-wide">
                    <th className="px-4 py-3 font-medium">User Code</th>
                    <th className="px-4 py-3 font-medium">Full Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Source</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredUsers.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-slate-400">No users found. Create one to get started.</td></tr>
                  ) : filteredUsers.map(u => (
                    <tr key={u.id_user} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">{u.user_code}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{u.full_name}</td>
                      <td className="px-4 py-3 text-slate-500">{u.email}</td>
                      <td className="px-4 py-3 text-slate-500">{u.source_system || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${u.status ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                          {u.status ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleDelete('users', u.id_user)} className="text-slate-300 hover:text-rose-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr className="text-left text-slate-500 text-xs uppercase tracking-wide">
                    <th className="px-4 py-3 font-medium">Role Name</th>
                    <th className="px-4 py-3 font-medium">Process Area</th>
                    <th className="px-4 py-3 font-medium">Description</th>
                    <th className="px-4 py-3 font-medium">Criticality</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredRoles.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-12 text-slate-400">No roles found. Create one to get started.</td></tr>
                  ) : filteredRoles.map(r => (
                    <tr key={r.id_role} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-slate-700">{r.role_name}</td>
                      <td className="px-4 py-3 text-slate-600">{r.process_area}</td>
                      <td className="px-4 py-3 text-slate-500">{r.role_desc || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${criticalityBadge(r.criticality)}`}>
                          {r.criticality}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleDelete('roles', r.id_role)} className="text-slate-300 hover:text-rose-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};
