import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  ShieldAlert, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle, 
  Calendar, 
  Layers, 
  User, 
  PlayCircle,
  Loader2,
  FileBarChart,
  Layers2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';

import { API_BASE } from '../config';

const RISK_COLORS: Record<string, string> = {
  Critical: '#e11d48', // rose-600
  High:     '#ea580c', // orange-600
  Medium:   '#d97706', // amber-600
  Low:      '#2563eb', // blue-600
};

const RISK_BADGES: Record<string, string> = {
  Critical: 'bg-rose-50 text-rose-700 border-rose-200',
  High:     'bg-orange-50 text-orange-700 border-orange-200',
  Medium:   'bg-amber-50 text-amber-700 border-amber-200',
  Low:      'bg-blue-50 text-blue-700 border-blue-200',
};

const STATUS_COLORS: Record<string, string> = {
  Open:             '#ef4444', // red-500
  Mitigated:        '#10b981', // emerald-500
  'False Positive': '#64748b', // slate-500
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export const RisksReports = () => {
  const [runs, setRuns] = useState<any[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<string>('');
  const [stats, setStats] = useState<any>(null);
  const [loadingRuns, setLoadingRuns] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRuns = async () => {
    setLoadingRuns(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/analysis-engine/runs`);
      if (!res.ok) throw new Error('Failed to load analysis runs.');
      const data = await res.json();
      
      // Filter only completed runs to display stats
      const completed = data.filter((r: any) => r.status === 'Completed');
      setRuns(completed);
      
      if (completed.length > 0) {
        setSelectedRunId(completed[0].id_run);
      }
    } catch (err: any) {
      console.error(err);
      setError('Error fetching analysis runs. Verify the server connection.');
    } finally {
      setLoadingRuns(false);
    }
  };

  const fetchStats = async (id: string) => {
    setLoadingStats(true);
    try {
      const res = await fetch(`${API_BASE}/analysis-engine/runs/${id}/stats`);
      if (!res.ok) throw new Error('Failed to fetch statistics for the selected run.');
      const data = await res.json();
      console.log('Stats API response:', JSON.stringify(data, null, 2));
      setStats(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error loading run statistics.');
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchRuns();
  }, []);

  useEffect(() => {
    if (selectedRunId) {
      fetchStats(selectedRunId);
    } else {
      setStats(null);
    }
  }, [selectedRunId]);

  const handleRunChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRunId(e.target.value);
  };

  // Format date nicely
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Dropdown Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Risks Reports</h1>
          <p className="text-slate-500 text-sm mt-1">Review statistical insights and segregation of duty (SoD) details per analysis run.</p>
        </div>

        {/* Selection menu */}
        <div className="flex items-center gap-2">
          {loadingRuns ? (
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading runs...
            </div>
          ) : runs.length === 0 ? (
            <span className="text-slate-500 text-sm font-medium">No completed runs available</span>
          ) : (
            <div className="relative flex items-center">
              <PlayCircle className="w-5 h-5 text-blue-600 absolute left-3 pointer-events-none" />
              <select
                value={selectedRunId}
                onChange={handleRunChange}
                className="pl-10 pr-10 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 bg-white transition cursor-pointer appearance-none min-w-[240px] font-medium"
              >
                {runs.map(run => (
                  <option key={run.id_run} value={run.id_run}>
                    {run.run_name} ({run.scope_type})
                  </option>
                ))}
              </select>
              <div className="absolute right-3 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content State Rendering */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
          <button onClick={fetchRuns} className="ml-auto underline hover:text-rose-900 transition-colors">Retry</button>
        </div>
      )}

      {loadingStats ? (
        <div className="flex flex-col items-center justify-center py-32 text-slate-400 text-sm gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          <span>Computing analysis report details...</span>
        </div>
      ) : !stats ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
          <FileBarChart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-800 text-lg">No Run Selected</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">Please create and complete an analysis run from the Analysis Engine to view statistics.</p>
        </div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          {/* Top KPI Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* KPI 1: Total Findings */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-500">Total Conflicts</p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">{stats.total}</p>
                  <p className="text-xs text-slate-400 mt-2">Segregation of Duties violations</p>
                </div>
                <div className={`p-3 rounded-lg ${stats.total > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'}`}>
                  <ShieldAlert className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* KPI 2: Mitigation Rate */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-500">Mitigation Rate</p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">{stats.mitigationRate}%</p>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
                      style={{ width: `${stats.mitigationRate}%` }}
                    />
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* KPI 3: Scope Details */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-500">Scope Type</p>
                  <p className="text-xl font-bold text-slate-800 mt-1.5">{stats.run.scope_type}</p>
                  <p className="text-xs text-slate-400 mt-2 truncate">Value: {stats.run.scope_value}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                  <Layers className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* KPI 4: Execution Date & Author */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-500">Execution Info</p>
                  <p className="text-xs font-semibold text-slate-700 mt-2 truncate" title={stats.run.executed_by}>
                    By: {stats.run.executed_by}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <Calendar className="w-3. h-3." /> {formatDate(stats.run.run_date)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 text-slate-500">
                  <User className="w-5 h-5" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Visual Charts Row */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Risk Distribution Chart */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-slate-400" />
                <h3 className="font-semibold text-slate-700 text-sm">Findings by Risk Level</h3>
              </div>
              <div style={{ width: '100%', height: 260 }}>
                {stats.total === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <span className="text-slate-400 text-sm">No findings generated in this run</span>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.byRisk} barSize={40}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
                        cursor={{ fill: '#f8fafc' }}
                      />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {stats.byRisk.map((entry: any) => (
                          <Cell key={entry.name} fill={RISK_COLORS[entry.name] || '#94a3b8'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Status Distribution Pie Chart */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-slate-400" />
                <h3 className="font-semibold text-slate-700 text-sm">Findings by Mitigation Status</h3>
              </div>
              <div style={{ width: '100%', height: 260 }}>
                {stats.total === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <span className="text-slate-400 text-sm">No status data to display</span>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.byStatus.filter((s: any) => s.count > 0)}
                        cx="50%"
                        cy="45%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="count"
                      >
                        {stats.byStatus.map((entry: any) => (
                          <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }} />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36} 
                        iconType="circle"
                        formatter={(value) => <span className="text-xs text-slate-600 font-medium">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </motion.div>

          {/* Grids / Tables Row */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Top Impacted Entities (Users or Roles depending on run scope) */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-slate-400" />
                <h3 className="font-semibold text-slate-700 text-sm">
                  {stats.run.scope_type === 'Role-Based' ? 'Top Conflicting Roles' : 'Top Users with Conflict'}
                </h3>
              </div>
              
              {stats.total === 0 ? (
                <div className="py-12 text-center text-slate-400 text-sm">No conflicts found in this run</div>
              ) : stats.run.scope_type === 'Role-Based' ? (
                // Role table
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-slate-400 text-xs uppercase tracking-wide border-b border-slate-100 text-left">
                        <th className="pb-3 font-medium">Role Name</th>
                        <th className="pb-3 font-medium">Process Area</th>
                        <th className="pb-3 font-medium text-right">Conflicts Count</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {stats.topRoles.map((role: any) => (
                        <tr key={role.role_name} className="hover:bg-slate-50/55 transition-colors">
                          <td className="py-3 font-semibold text-slate-700">{role.role_name}</td>
                          <td className="py-3 text-slate-500">{role.process_area || 'N/A'}</td>
                          <td className="py-3 text-right font-bold text-rose-600">{role.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                // User table
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-slate-400 text-xs uppercase tracking-wide border-b border-slate-100 text-left">
                        <th className="pb-3 font-medium">User Code</th>
                        <th className="pb-3 font-medium">Full Name</th>
                        <th className="pb-3 font-medium text-right">Conflicts Count</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {stats.topUsers.map((user: any) => (
                        <tr key={user.user_code} className="hover:bg-slate-50/55 transition-colors">
                          <td className="py-3 font-mono font-semibold text-slate-800">{user.user_code}</td>
                          <td className="py-3 text-slate-600">{user.full_name}</td>
                          <td className="py-3 text-right font-bold text-rose-600">{user.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Top Triggered Rules */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Layers2 className="w-5 h-5 text-slate-400" />
                <h3 className="font-semibold text-slate-700 text-sm">Top Conflicting Rules Triggered</h3>
              </div>

              {stats.total === 0 ? (
                <div className="py-12 text-center text-slate-400 text-sm">No rules were triggered</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-slate-400 text-xs uppercase tracking-wide border-b border-slate-100 text-left">
                        <th className="pb-3 font-medium">Rule Code</th>
                        <th className="pb-3 font-medium">Rule Name</th>
                        <th className="pb-3 font-medium">Risk Level</th>
                        <th className="pb-3 font-medium text-right">Conflicts</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {stats.topRules.map((rule: any) => (
                        <tr key={rule.rule_code} className="hover:bg-slate-50/55 transition-colors">
                          <td className="py-3 font-semibold text-slate-800">{rule.rule_code}</td>
                          <td className="py-3 text-slate-500 max-w-[200px] truncate" title={rule.rule_name}>
                            {rule.rule_name}
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${RISK_BADGES[rule.risk_level] || 'bg-slate-100'}`}>
                              {rule.risk_level}
                            </span>
                          </td>
                          <td className="py-3 text-right font-bold text-slate-700">{rule.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
