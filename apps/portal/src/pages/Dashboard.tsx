import { useState, useEffect } from 'react';
import {
  BarChart3, Users, ShieldAlert, CheckCircle2, AlertTriangle,
  Activity, PlayCircle, Clock, TrendingUp, Layers, Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

import { API_BASE } from '../config';

const STATUS_BADGES: Record<string, string> = {
  Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Running: 'bg-blue-50 text-blue-700 border-blue-200',
  Failed: 'bg-rose-50 text-rose-700 border-rose-200',
  Pending: 'bg-slate-50 text-slate-600 border-slate-200',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [riskChart, setRiskChart] = useState<any[]>([]);
  const [heatmap, setHeatmap] = useState<any[]>([]);
  const [recentRuns, setRecentRuns] = useState<any[]>([]);
  const [topRules, setTopRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const [sRes, cRes, hRes, rRes, tRes] = await Promise.all([
        fetch(`${API_BASE}/dashboard/stats`),
        fetch(`${API_BASE}/dashboard/findings-by-risk`),
        fetch(`${API_BASE}/dashboard/heatmap`),
        fetch(`${API_BASE}/dashboard/recent-runs`),
        fetch(`${API_BASE}/dashboard/top-rules`),
      ]);
      if (!sRes.ok || !cRes.ok || !hRes.ok || !rRes.ok || !tRes.ok)
        throw new Error('API returned an error.');
      setStats(await sRes.json());
      setRiskChart(await cRes.json());
      setHeatmap(await hRes.json());
      setRecentRuns(await rRes.json());
      setTopRules(await tRes.json());
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Could not connect to server. Verify API and database are online.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const formatDate = (d: string) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      <span className="text-slate-400 text-sm">Loading dashboard...</span>
    </div>
  );

  if (error) return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 gap-6">
      <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-rose-500" />
      </div>
      <div className="text-center max-w-md">
        <h2 className="text-lg font-semibold text-slate-800 mb-1">Failed to load dashboard</h2>
        <p className="text-sm text-slate-500 mb-4">{error}</p>
        <button onClick={fetchData}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
          Retry
        </button>
      </div>
    </motion.div>
  );

  const kpis = stats?.kpis;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">

      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Executive Dashboard</h1>
          <p className="text-slate-500 mt-1 text-sm">Real-time overview of your GRC posture and risk exposure.</p>
        </div>
        {kpis && (
          <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5" /> {kpis.completedRuns} runs completed</span>
            <span className="flex items-center gap-1"><Target className="w-3.5 h-3.5" /> {kpis.totalRules} rules active</span>
          </div>
        )}
      </motion.div>

      {/* KPI Cards Row 1 — 5 cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Users */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center"><Users className="w-4 h-4 text-blue-600" /></div>
            <span className="text-xs text-slate-500 font-medium">Users</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{kpis?.totalUsers ?? 0}</p>
          <p className="text-xs text-slate-400 mt-1">{kpis?.activeUsers ?? 0} active · {kpis?.inactiveUsers ?? 0} inactive</p>
        </div>

        {/* Open Findings */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center"><ShieldAlert className="w-4 h-4 text-amber-600" /></div>
            <span className="text-xs text-slate-500 font-medium">Open</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{kpis?.openFindings ?? 0}</p>
          <p className="text-xs text-slate-400 mt-1">{kpis?.openRate ?? 0}% of {kpis?.totalFindings ?? 0} findings</p>
        </div>

        {/* Mitigated */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-emerald-600" /></div>
            <span className="text-xs text-slate-500 font-medium">Mitigated</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{kpis?.mitigatedFindings ?? 0}</p>
          <p className="text-xs text-slate-400 mt-1">{kpis?.mitigationRate ?? 0}% mitigation rate</p>
        </div>

        {/* Critical Rules */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center"><AlertTriangle className="w-4 h-4 text-rose-600" /></div>
            <span className="text-xs text-slate-500 font-medium">Critical Rules</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{kpis?.criticalRules ?? 0}</p>
          <p className="text-xs text-slate-400 mt-1">of {kpis?.totalRules ?? 0} total rules</p>
        </div>

        {/* False Positives */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center"><Layers className="w-4 h-4 text-slate-500" /></div>
            <span className="text-xs text-slate-500 font-medium">False Positive</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{kpis?.falsePositiveFindings ?? 0}</p>
          <p className="text-xs text-slate-400 mt-1">excluded from risk count</p>
        </div>
      </motion.div>

      {/* Row 2: Chart + Heatmap */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-700 text-sm mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-slate-400" /> Findings by Risk Level
          </h3>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskChart} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {riskChart.map((entry: any) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heatmap */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-700 text-sm mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-slate-400" /> Risk Heatmap by Business Area
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 text-xs uppercase tracking-wide border-b border-slate-100">
                  <th className="text-left pb-3 font-medium">Area</th>
                  <th className="text-center pb-3 font-medium">Critical</th>
                  <th className="text-center pb-3 font-medium">High</th>
                  <th className="text-center pb-3 font-medium">Medium</th>
                  <th className="text-center pb-3 font-medium">Low</th>
                  <th className="text-right pb-3 font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {heatmap.length === 0 ? (
                  <tr><td colSpan={6} className="py-8 text-center text-slate-400 text-sm">No findings data available</td></tr>
                ) : (
                  heatmap.map((row: any) => {
                    const total = row.critical + row.high + row.medium + row.low;
                    return (
                      <tr key={row.area} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-2.5 font-semibold text-slate-700">{row.area}</td>
                        <td className="py-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${row.critical > 0 ? 'bg-rose-100 text-rose-700' : 'text-slate-300'}`}>{row.critical}</span>
                        </td>
                        <td className="py-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${row.high > 0 ? 'bg-orange-100 text-orange-700' : 'text-slate-300'}`}>{row.high}</span>
                        </td>
                        <td className="py-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${row.medium > 0 ? 'bg-amber-50 text-amber-700' : 'text-slate-300'}`}>{row.medium}</span>
                        </td>
                        <td className="py-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${row.low > 0 ? 'bg-blue-50 text-blue-700' : 'text-slate-300'}`}>{row.low}</span>
                        </td>
                        <td className="py-2.5 text-right font-bold text-slate-600">{total}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Row 3: Recent Runs + Top Rules */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Analysis Runs */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-700 text-sm mb-4 flex items-center gap-2">
            <PlayCircle className="w-4 h-4 text-slate-400" /> Recent Analysis Runs
          </h3>
          {recentRuns.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">No analysis runs executed yet</div>
          ) : (
            <div className="space-y-2">
              {recentRuns.map((run: any) => (
                <div key={run.id_run} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${run.status === 'Completed' ? 'bg-emerald-500' : run.status === 'Running' ? 'bg-blue-500 animate-pulse' : run.status === 'Failed' ? 'bg-rose-500' : 'bg-slate-300'}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate">{run.run_name}</p>
                      <p className="text-xs text-slate-400">{run.scope_type} · by {run.executed_by}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(run.run_date)}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${STATUS_BADGES[run.status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>{run.status}</span>
                    <span className="text-xs font-bold text-slate-500 w-8 text-right">{run._count?.findings ?? 0}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Conflicting Rules */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-700 text-sm mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-slate-400" /> Top Conflicting Rules
          </h3>
          {topRules.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">No rules triggered yet</div>
          ) : (
            <div className="space-y-2">
              {topRules.map((rule: any, i: number) => (
                <div key={rule.rule_code} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <span className="text-xs font-bold text-slate-400 w-5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate">{rule.rule_name}</p>
                    <p className="text-xs text-slate-400">{rule.rule_code}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    rule.risk_level?.toUpperCase() === 'CRITICAL' || rule.risk_level?.toUpperCase() === 'HIGH'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : rule.risk_level?.toUpperCase() === 'MEDIUM'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>{rule.risk_level}</span>
                  <span className="text-lg font-bold text-slate-700 w-8 text-right">{rule.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

    </motion.div>
  );
};
