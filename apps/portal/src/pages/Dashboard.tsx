import { useState, useEffect } from 'react';
import { BarChart3, Users, ShieldAlert, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

import { API_BASE } from '../config';

const getRiskBg = (value: number, max: number) => {
  const ratio = max > 0 ? value / max : 0;
  if (ratio > 0.7) return 'bg-rose-100 text-rose-700 font-semibold';
  if (ratio > 0.4) return 'bg-amber-50 text-amber-700';
  return 'bg-slate-50 text-slate-500';
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [riskChart, setRiskChart] = useState<any[]>([]);
  const [heatmap, setHeatmap] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const [sRes, cRes, hRes] = await Promise.all([
        fetch(`${API_BASE}/dashboard/stats`),
        fetch(`${API_BASE}/dashboard/findings-by-risk`),
        fetch(`${API_BASE}/dashboard/heatmap`),
      ]);
      if (!sRes.ok || !cRes.ok || !hRes.ok) throw new Error('La API respondió con un error.');
      setStats(await sRes.json());
      setRiskChart(await cRes.json());
      setHeatmap(await hRes.json());
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo conectar con el servidor. Verifica que la API y la base de datos estén en línea.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const kpiData = stats?.kpis ? [
    { label: 'Total Users', value: stats.kpis.totalUsers, icon: Users, color: 'bg-blue-50 text-blue-600', positive: true, change: '0%' },
    { label: 'Open Findings', value: stats.kpis.openFindings, icon: ShieldAlert, color: 'bg-amber-50 text-amber-600', positive: false, change: '0%' },
    { label: 'Mitigated', value: stats.kpis.mitigatedFindings, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600', positive: true, change: '0%' },
    { label: 'Critical Rules', value: stats.kpis.criticalRules, icon: AlertTriangle, color: 'bg-rose-50 text-rose-600', positive: false, change: '0%' },
  ] : [];

  if (loading) return <div className="p-8 text-slate-400">Cargando dashboard...</div>;

  if (error) return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 gap-6"
    >
      <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-rose-500" />
      </div>
      <div className="text-center max-w-md">
        <h2 className="text-lg font-semibold text-slate-800 mb-1">No se pudo cargar el dashboard</h2>
        <p className="text-sm text-slate-500 mb-4">{error}</p>
        <button
          onClick={fetchData}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          Reintentar
        </button>
      </div>
    </motion.div>
  );

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">

      {/* Page Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-semibold text-slate-800">Executive Dashboard</h1>
        <p className="text-slate-500 mt-1 text-sm">Real-time overview of your GRC posture and risk exposure.</p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {kpiData.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{kpi.label}</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{kpi.value.toLocaleString()}</p>
                <span className={`text-xs font-medium mt-2 inline-flex items-center gap-1 ${kpi.positive ? 'text-emerald-600' : 'text-rose-500'}`}>
                  <TrendingUp className="w-3 h-3" />
                  {kpi.change}
                </span>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${kpi.color}`}>
                <kpi.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Chart + Heatmap Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-5 gap-5">

        {/* Bar Chart */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-slate-400" />
            <h3 className="font-semibold text-slate-700 text-sm">Findings by Risk Level</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={riskChart} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {riskChart.map((entry: any) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Heatmap */}
        <div className="xl:col-span-3 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5 text-slate-400" />
            <h3 className="font-semibold text-slate-700 text-sm">Risk Heatmap by Business Area</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 text-xs uppercase tracking-wide">
                  <th className="text-left pb-3 font-medium">Area</th>
                  <th className="text-center pb-3 font-medium">Critical</th>
                  <th className="text-center pb-3 font-medium">High</th>
                  <th className="text-center pb-3 font-medium">Medium</th>
                  <th className="text-center pb-3 font-medium">Low</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {heatmap.map((row) => (
                  <tr key={row.area}>
                    <td className="py-2.5 font-medium text-slate-700">{row.area}</td>
                    <td className="py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs ${getRiskBg(row.critical, 10)}`}>{row.critical}</span>
                    </td>
                    <td className="py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs ${getRiskBg(row.high, 20)}`}>{row.high}</span>
                    </td>
                    <td className="py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs ${getRiskBg(row.medium, 30)}`}>{row.medium}</span>
                    </td>
                    <td className="py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs ${getRiskBg(row.low, 50)}`}>{row.low}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
};
