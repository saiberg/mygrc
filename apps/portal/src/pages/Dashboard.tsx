import { BarChart3, Users, ShieldAlert, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const kpis = [
  {
    label: 'Total Users Analyzed',
    value: '4,821',
    change: '+12%',
    positive: true,
    icon: Users,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    label: 'Open Findings',
    value: '147',
    change: '-8%',
    positive: true,
    icon: ShieldAlert,
    color: 'bg-amber-50 text-amber-600',
  },
  {
    label: 'Mitigated',
    value: '389',
    change: '+24%',
    positive: true,
    icon: CheckCircle2,
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    label: 'Critical Rules Active',
    value: '23',
    change: '+2',
    positive: false,
    icon: AlertTriangle,
    color: 'bg-rose-50 text-rose-600',
  },
];

const findingsByRisk = [
  { name: 'Critical', count: 34, fill: '#e11d48' },
  { name: 'High', count: 68, fill: '#f97316' },
  { name: 'Medium', count: 112, fill: '#eab308' },
  { name: 'Low', count: 201, fill: '#3b82f6' },
];

const heatmapAreas = [
  { area: 'Finance', critical: 12, high: 24, medium: 38, low: 55 },
  { area: 'HR', critical: 3, high: 8, medium: 19, low: 42 },
  { area: 'Procurement', critical: 8, high: 15, medium: 29, low: 63 },
  { area: 'Sales', critical: 5, high: 11, medium: 22, low: 37 },
  { area: 'IT', critical: 6, high: 10, medium: 14, low: 24 },
];

const getRiskBg = (value: number, max: number) => {
  const ratio = value / max;
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
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">

      {/* Page Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-semibold text-slate-800">Executive Dashboard</h1>
        <p className="text-slate-500 mt-1 text-sm">Real-time overview of your GRC posture and risk exposure.</p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{kpi.label}</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{kpi.value}</p>
                <span className={`text-xs font-medium mt-2 inline-flex items-center gap-1 ${kpi.positive ? 'text-emerald-600' : 'text-rose-500'}`}>
                  <TrendingUp className="w-3 h-3" />
                  {kpi.change} vs last run
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
            <BarChart data={findingsByRisk} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {findingsByRisk.map((entry) => (
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
                {heatmapAreas.map((row) => (
                  <tr key={row.area}>
                    <td className="py-2.5 font-medium text-slate-700">{row.area}</td>
                    <td className="py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs ${getRiskBg(row.critical, 15)}`}>{row.critical}</span>
                    </td>
                    <td className="py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs ${getRiskBg(row.high, 30)}`}>{row.high}</span>
                    </td>
                    <td className="py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs ${getRiskBg(row.medium, 50)}`}>{row.medium}</span>
                    </td>
                    <td className="py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs ${getRiskBg(row.low, 80)}`}>{row.low}</span>
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
