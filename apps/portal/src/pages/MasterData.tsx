import { useState, useEffect } from 'react';
import { Users, Plus, Trash2, RefreshCw, Search, Briefcase, Link2, Edit3, Power, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
type Tab = 'users' | 'roles' | 'assignments';

export const MasterData = () => {
  const [tab, setTab] = useState<Tab>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  // Editing state
  const [editing, setEditing] = useState<{ id: string; type: Tab } | null>(null);

  // Form states
  const [userForm, setUserForm] = useState({ user_code: '', full_name: '', email: '', source_system: '' });
  const [roleForm, setRoleForm] = useState({ role_name: '', role_desc: '', process_area: '', criticality: 'Medium' });
  const [assignmentForm, setAssignmentForm] = useState({ id_user: '', id_role: '', valid_from: new Date().toISOString().split('T')[0], valid_to: '' });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, rolesRes, assignRes] = await Promise.all([
        fetch(`${API_BASE}/master-data/users`),
        fetch(`${API_BASE}/master-data/roles`),
        fetch(`${API_BASE}/master-data/assignments`),
      ]);
      setUsers(await usersRes.json());
      setRoles(await rolesRes.json());
      setAssignments(await assignRes.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const showMessage = (type: 'ok' | 'err', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3500);
  };

  const handleCreateOrUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const isEdit = !!editing && editing.type === 'users';
      const url = isEdit ? `${API_BASE}/master-data/users/${editing?.id}` : `${API_BASE}/master-data/users`;
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm),
      });
      if (!res.ok) throw new Error((await res.json()).message);
      
      setUserForm({ user_code: '', full_name: '', email: '', source_system: '' });
      setEditing(null);
      showMessage('ok', isEdit ? 'User updated.' : 'User created.');
      fetchData();
    } catch (err: any) {
      showMessage('err', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateOrUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const isEdit = !!editing && editing.type === 'roles';
      const url = isEdit ? `${API_BASE}/master-data/roles/${editing?.id}` : `${API_BASE}/master-data/roles`;
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleForm),
      });
      if (!res.ok) throw new Error((await res.json()).message);

      setRoleForm({ role_name: '', process_area: '', criticality: 'Medium', role_desc: '' });
      setEditing(null);
      showMessage('ok', isEdit ? 'Role updated.' : 'Role created.');
      fetchData();
    } catch (err: any) {
      showMessage('err', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/master-data/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignmentForm),
      });
      if (!res.ok) throw new Error((await res.json()).message);
      setAssignmentForm({ id_user: '', id_role: '', valid_from: new Date().toISOString().split('T')[0], valid_to: '' });
      showMessage('ok', 'Role assigned successfully.');
      fetchData();
    } catch (err: any) {
      showMessage('err', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (type: Tab, id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      await fetch(`${API_BASE}/master-data/${type}/${id}`, { method: 'DELETE' });
      showMessage('ok', `Record deleted.`);
      fetchData();
    } catch {
      showMessage('err', 'Delete failed.');
    }
  };

  const handleToggleStatus = async (type: 'users' | 'roles', id: string) => {
    try {
      const res = await fetch(`${API_BASE}/master-data/${type}/${id}/toggle`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Toggle failed');
      fetchData();
    } catch (err: any) {
      showMessage('err', err.message);
    }
  };

  const startEdit = (type: Tab, item: any) => {
    setTab(type);
    setEditing({ id: type === 'users' ? item.id_user : item.id_role, type });
    if (type === 'users') {
      setUserForm({ user_code: item.user_code, full_name: item.full_name, email: item.email, source_system: item.source_system || '' });
    } else if (type === 'roles') {
      setRoleForm({ role_name: item.role_name, process_area: item.process_area, criticality: item.criticality, role_desc: item.role_desc || '' });
    }
  };

  const cancelEdit = () => {
    setEditing(null);
    setUserForm({ user_code: '', full_name: '', email: '', source_system: '' });
    setRoleForm({ role_name: '', process_area: '', criticality: 'Medium', role_desc: '' });
  };

  const filteredUsers = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.user_code?.toLowerCase().includes(search.toLowerCase())
  );
  const filteredRoles = roles.filter(r =>
    r.role_name?.toLowerCase().includes(search.toLowerCase())
  );
  const filteredAssignments = assignments.filter(a =>
    a.user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    a.role.role_name?.toLowerCase().includes(search.toLowerCase())
  );

  const criticalityBadge = (c: string) => {
    const map: Record<string, string> = {
      High: 'bg-rose-50 text-rose-600 border-rose-200',
      Medium: 'bg-amber-50 text-amber-600 border-amber-200',
      Low: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    };
    return map[c] || 'bg-slate-100 text-slate-500 border-slate-200';
  };

  const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString() : '—';

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">

      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Master Data</h1>
          <p className="text-slate-500 text-sm mt-1">Manage GRC Users, Roles and Assignments.</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </motion.div>

      {/* Toast message */}
      <AnimatePresence>
        {message && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`px-4 py-3 rounded-lg text-sm font-medium border shadow-lg fixed top-6 right-6 z-50 ${message.type === 'ok' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="flex gap-1 border-b border-slate-200">
        {[
          { id: 'users', label: 'Users', icon: Users, count: users.length },
          { id: 'roles', label: 'Roles', icon: Briefcase, count: roles.length },
          { id: 'assignments', label: 'Assignments', icon: Link2, count: assignments.length },
        ].map(t => (
          <button key={t.id} onClick={() => { setTab(t.id as Tab); cancelEdit(); }}
            className={`px-5 py-2.5 text-sm font-medium capitalize transition-all border-b-2 -mb-px flex items-center gap-2 ${tab === t.id ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            <t.icon className="w-4 h-4" /> {t.label} ({t.count})
          </button>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Create Form */}
        <motion.div variants={itemVariants} className="xl:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm sticky top-6">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                {editing ? `Edit ${editing.type === 'users' ? 'User' : 'Role'}` : `New ${tab === 'users' ? 'User' : tab === 'roles' ? 'Role' : 'Assignment'}`}
              </span>
              {editing && (
                <button onClick={cancelEdit} className="text-xs text-slate-400 hover:text-rose-500">Cancel</button>
              )}
            </h3>

            {tab === 'users' ? (
              <form onSubmit={handleCreateOrUpdateUser} className="space-y-3">
                {[
                  { label: 'User Code *', key: 'user_code', placeholder: 'e.g. USR001', disabled: !!editing },
                  { label: 'Full Name *', key: 'full_name', placeholder: 'e.g. John Smith' },
                  { label: 'Email *', key: 'email', placeholder: 'john@company.com' },
                  { label: 'Source System', key: 'source_system', placeholder: 'e.g. SAP ECC' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{field.label}</label>
                    <input
                      placeholder={field.placeholder}
                      value={(userForm as any)[field.key]}
                      disabled={field.disabled}
                      onChange={e => setUserForm(p => ({ ...p, [field.key]: e.target.value }))}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 placeholder-slate-300 transition disabled:bg-slate-50 disabled:text-slate-400"
                    />
                  </div>
                ))}
                <button type="submit" disabled={submitting}
                  className="w-full mt-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50">
                  {submitting ? 'Saving...' : editing ? 'Update User' : 'Create User'}
                </button>
              </form>
            ) : tab === 'roles' ? (
              <form onSubmit={handleCreateOrUpdateRole} className="space-y-3">
                {[
                  { label: 'Role Name *', key: 'role_name', placeholder: 'e.g. FI_POSTING', disabled: !!editing },
                  { label: 'Process Area *', key: 'process_area', placeholder: 'e.g. Finance' },
                  { label: 'Description', key: 'role_desc', placeholder: 'Brief description' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{field.label}</label>
                    <input
                      placeholder={field.placeholder}
                      disabled={field.disabled}
                      value={(roleForm as any)[field.key]}
                      onChange={e => setRoleForm(p => ({ ...p, [field.key]: e.target.value }))}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 placeholder-slate-300 transition disabled:bg-slate-50 disabled:text-slate-400"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Criticality *</label>
                  <select value={roleForm.criticality} onChange={e => setRoleForm(p => ({ ...p, criticality: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition bg-white text-sm">
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <button type="submit" disabled={submitting}
                  className="w-full mt-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50">
                  {submitting ? 'Saving...' : editing ? 'Update Role' : 'Create Role'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleAssignRole} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">User *</label>
                  <select value={assignmentForm.id_user} onChange={e => setAssignmentForm(p => ({ ...p, id_user: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition bg-white text-sm">
                    <option value="">Select user...</option>
                    {users.map(u => <option key={u.id_user} value={u.id_user}>{u.full_name} ({u.user_code})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Role *</label>
                  <select value={assignmentForm.id_role} onChange={e => setAssignmentForm(p => ({ ...p, id_role: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition bg-white text-sm">
                    <option value="">Select role...</option>
                    {roles.map(r => <option key={r.id_role} value={r.id_role}>{r.role_name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Valid From *</label>
                  <input type="date" value={assignmentForm.valid_from} onChange={e => setAssignmentForm(p => ({ ...p, valid_from: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition bg-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Valid To</label>
                  <input type="date" value={assignmentForm.valid_to} onChange={e => setAssignmentForm(p => ({ ...p, valid_to: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition bg-white text-sm" />
                </div>
                <button type="submit" disabled={submitting || !assignmentForm.id_user || !assignmentForm.id_role}
                  className="w-full mt-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50">
                  {submitting ? 'Assigning...' : 'Assign Role'}
                </button>
              </form>
            )}
          </div>
        </motion.div>

        {/* Table Area */}
        <motion.div variants={itemVariants} className="xl:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                placeholder={`Search in ${tab}...`}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 placeholder-slate-300 transition bg-white"
              />
            </div>
            {loading && <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-left text-slate-500 text-xs uppercase tracking-wide">
                  {tab === 'users' && (
                    <>
                      <th className="px-4 py-4 font-medium">User Code</th>
                      <th className="px-4 py-4 font-medium">Full Name</th>
                      <th className="px-4 py-4 font-medium">Email / Source</th>
                      <th className="px-4 py-4 font-medium text-center">Status</th>
                      <th className="px-4 py-4 font-medium"><span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Audit</span></th>
                      <th className="px-4 py-4"></th>
                    </>
                  )}
                  {tab === 'roles' && (
                    <>
                      <th className="px-4 py-4 font-medium">Role Name</th>
                      <th className="px-4 py-4 font-medium">Area / criticality</th>
                      <th className="px-4 py-4 font-medium">Description</th>
                      <th className="px-4 py-4 font-medium text-center">Status</th>
                      <th className="px-4 py-4 font-medium"><span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Audit</span></th>
                      <th className="px-4 py-4"></th>
                    </>
                  )}
                  {tab === 'assignments' && (
                    <>
                      <th className="px-4 py-4 font-medium">User</th>
                      <th className="px-4 py-4 font-medium">Role</th>
                      <th className="px-4 py-4 font-medium">Valid From</th>
                      <th className="px-4 py-4 font-medium">Valid To</th>
                      <th className="px-4 py-4 font-medium text-center">Status</th>
                      <th className="px-4 py-4"></th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {tab === 'users' && (
                  filteredUsers.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-20 text-slate-400">No users found.</td></tr>
                  ) : filteredUsers.map(u => (
                    <tr key={u.id_user} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-4 py-4 font-mono text-xs text-blue-600 bg-blue-50/30 font-semibold">{u.user_code}</td>
                      <td className="px-4 py-4 font-medium text-slate-700">{u.full_name}</td>
                      <td className="px-4 py-4">
                        <div className="text-slate-600 font-medium">{u.email}</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-tight">{u.source_system || 'Manual'}</div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button onClick={() => handleToggleStatus('users', u.id_user)} 
                          className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-all ${u.status ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                          {u.status ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-[10px] text-slate-400">Created: {formatDate(u.created_at)}</div>
                        <div className="text-[10px] text-slate-400">Updated: {u.updated_at ? formatDate(u.updated_at) : formatDate(u.created_at)}</div>
                      </td>
                      <td className="px-4 py-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => startEdit('users', u)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete('users', u.id_user)} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                {tab === 'roles' && (
                  filteredRoles.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-20 text-slate-400">No roles found.</td></tr>
                  ) : filteredRoles.map(r => (
                    <tr key={r.id_role} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-4 py-4 font-mono text-xs text-slate-600 bg-slate-50 font-semibold">{r.role_name}</td>
                      <td className="px-4 py-4">
                        <div className="text-slate-700 font-medium">{r.process_area}</div>
                        <div className={`text-[10px] uppercase font-bold mt-0.5 ${r.criticality === 'High' ? 'text-rose-600' : r.criticality === 'Medium' ? 'text-amber-600' : 'text-emerald-600'}`}>{r.criticality}</div>
                      </td>
                      <td className="px-4 py-4 text-slate-500 text-xs italic">{r.role_desc || '—'}</td>
                      <td className="px-4 py-4 text-center">
                        <button onClick={() => handleToggleStatus('roles', r.id_role)} 
                          className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-all ${r.status ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                          {r.status ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-[10px] text-slate-400">Created: {formatDate(r.created_at)}</div>
                      </td>
                      <td className="px-4 py-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => startEdit('roles', r)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete('roles', r.id_role)} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                {tab === 'assignments' && (
                  filteredAssignments.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-20 text-slate-400">No assignments found.</td></tr>
                  ) : filteredAssignments.map(a => (
                    <tr key={a.id_user_role} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-4 py-4">
                        <div className="font-medium text-slate-700">{a.user.full_name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{a.user.user_code}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-slate-700">{a.role.role_name}</div>
                        <div className="text-[10px] text-slate-400">{a.role.process_area}</div>
                      </td>
                      <td className="px-4 py-4 text-slate-600 text-xs">{formatDate(a.valid_from)}</td>
                      <td className="px-4 py-4 text-slate-600 text-xs">{formatDate(a.valid_to)}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${a.status ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {a.status ? 'Valid' : 'Expired'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right pr-6">
                        <button onClick={() => handleDelete('assignments', a.id_user_role)} className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
