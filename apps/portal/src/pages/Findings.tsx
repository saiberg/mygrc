import { useState, useEffect } from 'react';
import { CheckSquare, AlertTriangle, CheckCircle2, Filter, ChevronDown, ShieldAlert, User, BookOpen, Calendar, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { API_BASE } from '../config';

const riskBadge = (level: string) => ({
  Critical: 'bg-rose-50 text-rose-700 border-rose-200',
  High:     'bg-orange-50 text-orange-700 border-orange-200',
  Medium:   'bg-amber-50 text-amber-700 border-amber-200',
  Low:      'bg-blue-50 text-blue-700 border-blue-200',
}[level] || 'bg-slate-100 text-slate-600 border-slate-200');

const statusBadge = (status: string) => ({
  'Open':           'bg-rose-50 text-rose-600 border-rose-200',
  'Mitigated':      'bg-emerald-50 text-emerald-700 border-emerald-200',
  'False Positive': 'bg-slate-100 text-slate-500 border-slate-200',
}[status] || 'bg-slate-100 text-slate-500 border-slate-200');

const STATUS_OPTIONS = ['Open', 'Mitigated', 'False Positive'];
const RISK_OPTIONS   = ['Critical', 'High', 'Medium', 'Low'];

export const Findings = () => {
  const [findings, setFindings] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRisk, setFilterRisk] = useState('');
  const [filterRun, setFilterRun] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [mitigateId, setMitigateId] = useState<string | null>(null);
  const [mitigateForm, setMitigateForm] = useState({ owner_name: '', comments: '', valid_until: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const fetchFindings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);
      if (filterRisk) params.append('risk_level', filterRisk);
      if (filterRun) params.append('run_name', filterRun);
      const [findRes, sumRes] = await Promise.all([
        fetch(`${API_BASE}/findings?${params}`),
        fetch(`${API_BASE}/findings/summary`),
      ]);
      setFindings(await findRes.json());
      setSummary(await sumRes.json());
    } finally {
      setLoading(false);
    }
  };

  // Load runs list once on mount for the filter dropdown
  useEffect(() => {
    fetch(`${API_BASE}/analysis-engine/runs`)
      .then(r => r.json())
      .then(data => setRuns(Array.isArray(data) ? data : []))
      .catch(() => setRuns([]));
  }, []);

  useEffect(() => { fetchFindings(); }, [filterStatus, filterRisk, filterRun]);

  const showMsg = (type: 'ok' | 'err', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3500);
  };

  const handleStatusChange = async (id: string, status: string) => {
    await fetch(`${API_BASE}/findings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    showMsg('ok', `Status updated to "${status}".`);
    fetchFindings();
  };

  const handleMitigate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mitigateId) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/findings/${mitigateId}/mitigate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mitigateForm),
      });
      if (!res.ok) throw new Error((await res.json()).message);
      showMsg('ok', 'Mitigation submitted successfully.');
      setMitigateId(null);
      setMitigateForm({ owner_name: '', comments: '', valid_until: '' });
      fetchFindings();
    } catch (err: any) {
      showMsg('err', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const kpis = summary ? [
    { label: 'Total Findings', value: summary.total, icon: CheckSquare, color: 'text-slate-600', bg: 'bg-slate-50' },
    { label: 'Open',           value: summary.open,  icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: 'Mitigated',      value: summary.mitigated, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Critical',       value: summary.critical,  icon: ShieldAlert,  color: 'text-rose-700', bg: 'bg-rose-50' },
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Findings & Mitigations</h1>
        <p className="text-slate-500 text-sm mt-1">Review GRC conflicts, update statuses, and submit mitigations.</p>
      </div>

      {/* KPIs */}
      {summary && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map(kpi => (
            <div key={kpi.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-800">{kpi.value}</p>
                <p className="text-xs text-slate-500">{kpi.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toast */}
      {message && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className={`px-4 py-3 rounded-lg text-sm font-medium border ${message.type === 'ok' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
          {message.text}
        </motion.div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-wrap items-center gap-3">
        <Filter className="w-4 h-4 text-slate-400" />
        <span className="text-sm text-slate-500 font-medium">Filter:</span>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 bg-white">
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={filterRisk} onChange={e => setFilterRisk(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 bg-white">
          <option value="">All Risk Levels</option>
          {RISK_OPTIONS.map(r => <option key={r}>{r}</option>)}
        </select>
        <div className="relative">
          <PlayCircle className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select value={filterRun} onChange={e => setFilterRun(e.target.value)}
            className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 bg-white">
            <option value="">All Analysis Runs</option>
            {runs.map(r => (
              <option key={r.id_run} value={r.run_name}>{r.run_name}</option>
            ))}
          </select>
        </div>
        {(filterStatus || filterRisk || filterRun) && (
          <button onClick={() => { setFilterStatus(''); setFilterRisk(''); setFilterRun(''); }}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors">
            Clear filters
          </button>
        )}
        <span className="ml-auto text-xs text-slate-400">{findings.length} finding{findings.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Findings List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 text-sm">Loading...</div>
        ) : findings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <CheckCircle2 className="w-10 h-10 text-slate-200 mb-3" />
            <p className="text-slate-500 font-medium">No findings match your filters</p>
            <p className="text-slate-400 text-sm mt-1">Run an analysis to generate findings.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {findings.map(finding => (
              <div key={finding.id_finding}>
                <div className="flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors">
                  <button onClick={() => setExpanded(expanded === finding.id_finding ? null : finding.id_finding)}
                    className="text-slate-400 hover:text-slate-600 transition-colors">
                    <ChevronDown className={`w-4 h-4 transition-transform ${expanded === finding.id_finding ? '' : '-rotate-90'}`} />
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${riskBadge(finding.risk_level)}`}>{finding.risk_level}</span>
                      <span className="font-medium text-slate-800 text-sm">{finding.rule?.rule_name}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      <span className="text-xs text-slate-400 flex items-center gap-1"><User className="w-3 h-3" />{finding.user?.full_name} ({finding.user?.user_code})</span>
                      <span className="text-xs text-slate-300">·</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1"><BookOpen className="w-3 h-3" />{finding.rule?.rule_type}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusBadge(finding.finding_status)}`}>
                      {finding.finding_status}
                    </span>

                    {finding.finding_status === 'Open' && (
                      <button onClick={() => setMitigateId(finding.id_finding)}
                        className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-lg font-medium transition-colors">
                        Mitigate
                      </button>
                    )}

                    {finding.finding_status === 'Open' && (
                      <button onClick={() => handleStatusChange(finding.id_finding, 'False Positive')}
                        className="text-xs border border-slate-200 text-slate-500 hover:bg-slate-50 px-2 py-1 rounded-lg transition-colors">
                        False +
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Detail */}
                <AnimatePresence>
                  {expanded === finding.id_finding && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="mx-5 mb-4 bg-slate-50 rounded-xl border border-slate-100 p-4 space-y-3">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">Run</p>
                            <p className="text-slate-700">{finding.run?.run_name}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">Rule Code</p>
                            <p className="font-mono text-slate-700">{finding.rule?.rule_code}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Detected</p>
                            <p className="text-slate-700">{new Date(finding.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        {finding.evidence_text && (
                          <div>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">Evidence</p>
                            <p className="text-sm text-slate-600 font-mono bg-white p-2 rounded border border-slate-200">{finding.evidence_text}</p>
                          </div>
                        )}
                        {finding.mitigation && (
                          <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                            <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wide mb-1">Mitigation</p>
                            <p className="text-sm text-emerald-700">Owner: <strong>{finding.mitigation.owner_name}</strong> · Status: <strong>{finding.mitigation.approval_status}</strong></p>
                            {finding.mitigation.comments && <p className="text-xs text-emerald-600 mt-1">{finding.mitigation.comments}</p>}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mitigate Modal */}
      <AnimatePresence>
        {mitigateId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Submit Mitigation
              </h3>
              <form onSubmit={handleMitigate} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Owner Name *</label>
                  <input value={mitigateForm.owner_name} onChange={e => setMitigateForm(p => ({ ...p, owner_name: e.target.value }))}
                    placeholder="Responsible person or role"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 placeholder-slate-300 transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Valid Until</label>
                  <input type="date" value={mitigateForm.valid_until} onChange={e => setMitigateForm(p => ({ ...p, valid_until: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Comments</label>
                  <textarea value={mitigateForm.comments} onChange={e => setMitigateForm(p => ({ ...p, comments: e.target.value }))}
                    rows={3} placeholder="Justification or mitigation details..."
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 placeholder-slate-300 resize-none transition" />
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="submit" disabled={submitting || !mitigateForm.owner_name}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50">
                    {submitting ? 'Submitting...' : 'Submit Mitigation'}
                  </button>
                  <button type="button" onClick={() => setMitigateId(null)}
                    className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-500 hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
