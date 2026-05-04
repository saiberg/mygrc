import { useState, useEffect } from 'react';
import { PlayCircle, Clock, CheckCircle2, XCircle, ChevronRight, Loader2, BarChart3, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { API_BASE } from '../config';

const statusColors: Record<string, string> = {
  Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Running:   'bg-blue-50 text-blue-700 border-blue-200',
  Failed:    'bg-rose-50 text-rose-700 border-rose-200',
};

const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'Completed') return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
  if (status === 'Running')   return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
  return <XCircle className="w-4 h-4 text-rose-500" />;
};

const SCOPE_TYPES = ['All Users', 'Department', 'User Group', 'Role-Based'];
const DEFAULT_FORM = { run_name: '', scope_type: 'All Users', scope_value: 'ALL', executed_by: '' };

export const AnalysisEngine = () => {
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchRuns = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/analysis-engine/runs`);
      setRuns(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRuns(); }, []);

  const showMsg = (type: 'ok' | 'err', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4500);
  };

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    setExecuting(true);
    try {
      const res = await fetch(`${API_BASE}/analysis-engine/runs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Run failed');
      showMsg('ok', `Run "${form.run_name}" completed. ${data._count?.findings ?? 0} findings generated.`);
      setForm(DEFAULT_FORM);
      setShowForm(false);
      fetchRuns();
    } catch (err: any) {
      showMsg('err', err.message);
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Analysis Engine</h1>
          <p className="text-slate-500 text-sm mt-1">Trigger GRC analysis runs and review execution history.</p>
        </div>
        <button onClick={() => setShowForm(p => !p)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">
          <PlayCircle className="w-4 h-4" /> New Analysis Run
        </button>
      </div>

      {/* Toast */}
      {message && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className={`px-4 py-3 rounded-lg text-sm font-medium border ${message.type === 'ok' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
          {message.text}
        </motion.div>
      )}

      {/* New Run Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-6">
              <h3 className="font-semibold text-slate-800 mb-5 flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-blue-600" /> Configure New Run
              </h3>
              <form onSubmit={handleExecute} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Run Name *</label>
                  <input value={form.run_name} onChange={e => setForm(p => ({ ...p, run_name: e.target.value }))}
                    placeholder="e.g. Q1 2025 Full Audit"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 placeholder-slate-300 transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Executed By</label>
                  <input value={form.executed_by} onChange={e => setForm(p => ({ ...p, executed_by: e.target.value }))}
                    placeholder="e.g. auditor@company.com"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 placeholder-slate-300 transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Scope Type *</label>
                  <select value={form.scope_type} onChange={e => setForm(p => ({ ...p, scope_type: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 bg-white transition">
                    {SCOPE_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Scope Value *</label>
                  <input value={form.scope_value} onChange={e => setForm(p => ({ ...p, scope_value: e.target.value }))}
                    placeholder="e.g. Finance, ALL, HR_DEPT"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 placeholder-slate-300 transition" />
                </div>

                {/* Info box */}
                <div className="sm:col-span-2 bg-blue-50 rounded-lg p-3 border border-blue-100 flex items-start gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-blue-700">The engine will evaluate all <strong>active users</strong> against all <strong>active risk rules</strong> and generate findings for any SOD conflicts or sensitive access detected.</p>
                </div>

                <div className="sm:col-span-2 flex gap-3">
                  <button type="submit" disabled={executing || !form.run_name}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50">
                    {executing
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Running analysis...</>
                      : <><PlayCircle className="w-4 h-4" /> Execute Run</>}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)}
                    className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-500 hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Runs History */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-700 text-sm">Execution History</span>
          <span className="text-xs text-slate-400 ml-auto">{runs.length} run{runs.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 text-sm gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading runs...
          </div>
        ) : runs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <PlayCircle className="w-10 h-10 text-slate-200 mb-3" />
            <p className="text-slate-500 font-medium">No runs yet</p>
            <p className="text-slate-400 text-sm mt-1">Execute your first analysis to detect GRC conflicts.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {runs.map(run => (
              <div key={run.id_run} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                <StatusIcon status={run.status} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 text-sm">{run.run_name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Users className="w-3 h-3" />{run.scope_type}: {run.scope_value}
                    </span>
                    <span className="text-xs text-slate-300">·</span>
                    <span className="text-xs text-slate-400">{run.executed_by}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[run.status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                    {run.status}
                  </span>
                  <p className="text-xs text-slate-400 mt-1">{run._count?.findings ?? 0} findings</p>
                </div>
                <p className="text-xs text-slate-400 hidden sm:block w-32 text-right">
                  {new Date(run.run_date).toLocaleString()}
                </p>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
