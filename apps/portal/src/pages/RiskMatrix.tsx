import { useState, useEffect } from 'react';
import { ShieldAlert, Plus, Trash2, RefreshCw, ChevronDown, ChevronRight, ToggleLeft, ToggleRight, Tag, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { API_BASE } from '../config';

const RISK_LEVELS = ['Critical', 'High', 'Medium', 'Low'];
const RULE_TYPES = ['Segregation of Duties', 'Sensitive Access', 'Critical Action', 'Critical Permission'];

const riskBadge = (level: string) => {
  const map: Record<string, string> = {
    Critical: 'bg-rose-50 text-rose-700 border-rose-200',
    High: 'bg-orange-50 text-orange-700 border-orange-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    Low: 'bg-blue-50 text-blue-700 border-blue-200',
  };
  return map[level] || 'bg-slate-100 text-slate-600 border-slate-200';
};

const DEFAULT_RULE_FORM = {
  rule_code: '',
  rule_name: '',
  rule_type: 'Segregation of Duties',
  risk_level: 'High',
  description: '',
  mitigation_text: '',
  active_flag: true,
};

const DEFAULT_ITEM = { object_type: 'Tcode', object_value: '', seq_no: 1 };

export const RiskMatrix = () => {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(DEFAULT_RULE_FORM);
  const [items, setItems] = useState([{ ...DEFAULT_ITEM }]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/risk-matrix/rules`);
      setRules(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRules(); }, []);

  const showMsg = (type: 'ok' | 'err', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        items: items.filter(i => i.object_value.trim() !== ''),
      };
      const url = editingId ? `${API_BASE}/risk-matrix/rules/${editingId}` : `${API_BASE}/risk-matrix/rules`;
      const method = editingId ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).message);
      
      cancelEdit();
      showMsg('ok', editingId ? 'Rule updated.' : 'Rule created.');
      fetchRules();
    } catch (err: any) {
      showMsg('err', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (rule: any) => {
    setEditingId(rule.id_rule);
    setForm({
      rule_code: rule.rule_code,
      rule_name: rule.rule_name,
      rule_type: rule.rule_type,
      risk_level: rule.risk_level,
      description: rule.description || '',
      mitigation_text: rule.mitigation_text || '',
      active_flag: rule.active_flag,
    });
    setItems(rule.items?.length > 0 ? rule.items.map((it: any) => ({ ...it })) : [{ ...DEFAULT_ITEM }]);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(DEFAULT_RULE_FORM);
    setItems([{ ...DEFAULT_ITEM }]);
    setShowForm(false);
  };

  const handleToggle = async (id: string) => {
    await fetch(`${API_BASE}/risk-matrix/rules/${id}/toggle`, { method: 'PATCH' });
    fetchRules();
  };

  const handleDelete = async (id: string) => {
    await fetch(`${API_BASE}/risk-matrix/rules/${id}`, { method: 'DELETE' });
    showMsg('ok', 'Rule deleted.');
    fetchRules();
  };

  const addItem = () => setItems(prev => [...prev, { object_type: 'Tcode', object_value: '', seq_no: prev.length + 1 }]);
  const removeItem = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: string, value: string) =>
    setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item));

  // Group rules by risk level
  const rulesByLevel = RISK_LEVELS.reduce((acc, level) => {
    acc[level] = rules.filter(r => r.risk_level === level);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Risk Matrix</h1>
          <p className="text-slate-500 text-sm mt-1">Define and manage GRC business rules that drive the analysis engine.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchRules} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={() => setShowForm(p => !p)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> New Rule
          </button>
        </div>
      </div>

      {/* Toast */}
      {message && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className={`px-4 py-3 rounded-lg text-sm font-medium border ${message.type === 'ok' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
          {message.text}
        </motion.div>
      )}

      {/* Create Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden">
            <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-6">
              <h3 className="font-semibold text-slate-800 mb-5 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-blue-600" /> {editingId ? 'Update Risk Rule' : 'Define New Risk Rule'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Rule base fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Rule Code *', key: 'rule_code', placeholder: 'e.g. SOD-FI-001' },
                    { label: 'Rule Name *', key: 'rule_name', placeholder: 'e.g. Create & Post Vendor Invoice' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs font-medium text-slate-500 mb-1">{f.label}</label>
                      <input value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 placeholder-slate-300 transition" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Rule Type *</label>
                    <select value={form.rule_type} onChange={e => setForm(p => ({ ...p, rule_type: e.target.value }))}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 bg-white transition">
                      {RULE_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Risk Level *</label>
                    <select value={form.risk_level} onChange={e => setForm(p => ({ ...p, risk_level: e.target.value }))}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 bg-white transition">
                      {RISK_LEVELS.map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                    <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                      rows={2} placeholder="Describe the risk scenario..."
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 placeholder-slate-300 resize-none transition" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Mitigation Guidance</label>
                    <textarea value={form.mitigation_text} onChange={e => setForm(p => ({ ...p, mitigation_text: e.target.value }))}
                      rows={2} placeholder="Recommended mitigation actions..."
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 placeholder-slate-300 resize-none transition" />
                  </div>
                  <div className="sm:col-span-2 flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg border border-slate-200">
                    <label className="text-xs font-medium text-slate-600">Active Status</label>
                    <button type="button" onClick={() => setForm(p => ({ ...p, active_flag: !p.active_flag }))}
                      className={`px-3 py-1 rounded text-[11px] font-bold uppercase transition-all ${form.active_flag ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-200 text-slate-500 border border-slate-300'}`}>
                      {form.active_flag ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>

                {/* Rule Items */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Rule Items (Objects)</label>
                    <button type="button" onClick={addItem}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors">
                      <Plus className="w-3 h-3" /> Add Item
                    </button>
                  </div>
                  <div className="space-y-2">
                    {items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-50 rounded-lg p-2 border border-slate-100">
                        <span className="text-xs text-slate-400 font-mono w-5 text-center">{idx + 1}</span>
                        <select value={item.object_type} onChange={e => updateItem(idx, 'object_type', e.target.value)}
                          className="border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-600 bg-white outline-none focus:ring-1 focus:ring-blue-200">
                          <option>Tcode</option>
                          <option>AuthObject</option>
                          <option>Role</option>
                          <option>Profile</option>
                        </select>
                        <input value={item.object_value} onChange={e => updateItem(idx, 'object_value', e.target.value)}
                          placeholder="Value e.g. FB50"
                          className="flex-1 border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-700 outline-none focus:ring-1 focus:ring-blue-200 placeholder-slate-300" />
                        {items.length > 1 && (
                          <button type="button" onClick={() => removeItem(idx)} className="text-slate-300 hover:text-rose-500 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={submitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50">
                    {submitting ? 'Saving...' : editingId ? 'Update Rule' : 'Save Rule'}
                  </button>
                  <button type="button" onClick={cancelEdit}
                    className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-500 hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rules Table grouped by Risk Level */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center py-16 text-slate-400 text-sm">
          Loading rules...
        </div>
      ) : rules.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center py-20 text-center">
          <ShieldAlert className="w-10 h-10 text-slate-200 mb-3" />
          <p className="text-slate-500 font-medium">No rules defined yet</p>
          <p className="text-slate-400 text-sm mt-1">Create your first GRC rule to start the analysis engine.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {RISK_LEVELS.map(level => {
            const levelRules = rulesByLevel[level];
            if (!levelRules || levelRules.length === 0) return null;
            return (
              <div key={level} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Level header */}
                <div className="flex items-center gap-3 px-5 py-3 bg-slate-50 border-b border-slate-100">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${riskBadge(level)}`}>{level}</span>
                  <span className="text-xs text-slate-400">{levelRules.length} rule{levelRules.length !== 1 ? 's' : ''}</span>
                </div>

                {/* Rules */}
                <div className="divide-y divide-slate-50">
                  {levelRules.map((rule: any) => (
                    <div key={rule.id_rule}>
                      <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                        {/* Expand toggle */}
                        <button onClick={() => setExpanded(expanded === rule.id_rule ? null : rule.id_rule)}
                          className="text-slate-400 hover:text-slate-600 transition-colors">
                          {expanded === rule.id_rule
                            ? <ChevronDown className="w-4 h-4" />
                            : <ChevronRight className="w-4 h-4" />}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-slate-400">{rule.rule_code}</span>
                            <span className="text-slate-800 font-medium text-sm truncate">{rule.rule_name}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-xs text-slate-400">{rule.rule_type}</span>
                            <span className="text-xs text-slate-300">·</span>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Tag className="w-3 h-3" />{rule.items?.length || 0} items
                            </span>
                            <span className="text-xs text-slate-300">·</span>
                            <span className="text-xs text-slate-400">{rule._count?.findings || 0} findings</span>
                          </div>
                        </div>

                        {/* Active toggle */}
                        <button onClick={() => handleToggle(rule.id_rule)}
                          title={rule.active_flag ? 'Deactivate' : 'Activate'}
                          className={`transition-colors ${rule.active_flag ? 'text-emerald-500 hover:text-emerald-700' : 'text-slate-300 hover:text-slate-500'}`}>
                          {rule.active_flag
                            ? <ToggleRight className="w-6 h-6" />
                            : <ToggleLeft className="w-6 h-6" />}
                        </button>

                        <button onClick={() => startEdit(rule)} className="text-slate-300 hover:text-blue-600 transition-colors ml-1" title="Edit">
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button onClick={() => handleDelete(rule.id_rule)} className="text-slate-300 hover:text-rose-500 transition-colors ml-1" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Expanded detail */}
                      <AnimatePresence>
                        {expanded === rule.id_rule && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden">
                            <div className="mx-5 mb-4 bg-slate-50 rounded-xl border border-slate-100 p-4 space-y-4">
                              {rule.description && (
                                <div>
                                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Description</p>
                                  <p className="text-sm text-slate-600">{rule.description}</p>
                                </div>
                              )}
                              {rule.mitigation_text && (
                                <div>
                                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Mitigation Guidance</p>
                                  <p className="text-sm text-slate-600">{rule.mitigation_text}</p>
                                </div>
                              )}
                              {rule.items && rule.items.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">Rule Objects</p>
                                  <div className="flex flex-wrap gap-2">
                                    {rule.items.map((item: any) => (
                                      <div key={item.id_rule_item}
                                        className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1">
                                        <span className="text-xs font-medium text-blue-600">{item.object_type}</span>
                                        <span className="text-slate-300">·</span>
                                        <span className="text-xs font-mono text-slate-700">{item.object_value}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
