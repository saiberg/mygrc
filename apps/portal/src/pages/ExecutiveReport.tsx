import { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  LayoutDashboard, 
  Grid, 
  BarChart3, 
  Award, 
  AlertTriangle, 
  Milestone, 
  ShieldCheck,
  PlayCircle,
  Loader2,
  ShieldAlert,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell 
} from 'recharts';

import { API_BASE } from '../config';

const slideVariants: any = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.25 } },
};

// Circular progress indicator component for KPIs
const CircularProgressRing = ({ percentage, color, size = 70, strokeWidth = 6 }: { percentage: number; color: string; size?: number; strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <span className="absolute text-xs font-bold text-slate-700">{percentage}%</span>
    </div>
  );
};

export const ExecutiveReport = () => {
  const [runs, setRuns] = useState<any[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<string>('');
  const [reportData, setReportData] = useState<any>(null);
  const [loadingRuns, setLoadingRuns] = useState(true);
  const [loadingReport, setLoadingReport] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [approvedStatus, setApprovedStatus] = useState<boolean>(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const presentationRef = useRef<HTMLDivElement>(null);

  const fetchRuns = async () => {
    setLoadingRuns(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/analysis-engine/runs`);
      if (!res.ok) throw new Error('Failed to load analysis runs.');
      const data = await res.json();
      
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

  const fetchReport = async (id: string) => {
    setLoadingReport(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/analysis-engine/runs/${id}/executive-report`);
      if (!res.ok) throw new Error('Failed to fetch executive report data.');
      const data = await res.json();
      setReportData(data);
    } catch (err: any) {
      console.error(err);
      setError('Error loading executive report data.');
    } finally {
      setLoadingReport(false);
    }
  };

  useEffect(() => {
    fetchRuns();
  }, []);

  useEffect(() => {
    if (selectedRunId) {
      fetchReport(selectedRunId);
      setApprovedStatus(false);
    } else {
      setReportData(null);
    }
  }, [selectedRunId]);

  const slides = [
    { id: 0, title: '01. Executive Summary Cover', icon: FileText },
    { id: 1, title: '02. Executive Dashboard', icon: LayoutDashboard },
    { id: 2, title: '03. SoD Risk Heat Map', icon: Grid },
    { id: 3, title: '04. Critical Access Distribution', icon: BarChart3 },
    { id: 4, title: '05. Access Governance Maturity', icon: Award },
    { id: 5, title: '06. Top 10 Findings', icon: AlertTriangle },
    { id: 6, title: '07. 30/60/90 Day Roadmap', icon: Milestone },
    { id: 7, title: '08. Executive Conclusion', icon: ShieldCheck },
  ];

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const getRiskColor = (level: string) => {
    const l = level?.toUpperCase();
    if (l === 'CRITICAL' || l === 'HIGH') return 'text-rose-600 bg-rose-50 border-rose-100';
    if (l === 'MEDIUM') return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-blue-600 bg-blue-50 border-blue-100';
  };

  const oklchToHex = (colorStr: string): string => {
    // Map common Tailwind oklch/oklab colors to hex equivalents
    const colorMap: Record<string, string> = {
      'oklch(0.505 0.213 25.2)': '#f97316',  // Orange
      'oklch(0.637 0.238 16.4)': '#ef4444',  // Red
      'oklch(0.705 0.213 142.5)': '#10b981', // Emerald
      'oklch(0.611 0.287 42.1)': '#f59e0b', // Amber
      'oklch(0.592 0.19 272)': '#a855f7',   // Purple
      'oklch(0.624 0.2 263.9)': '#8b5cf6',  // Violet
      'oklch(0.704 0.158 29.2)': '#ff6b35', // OrangeDark
      'oklch(0.54 0.05 250.8)': '#e2e8f0',  // Slate-200
      'oklch(0.699 0.11 148)': '#6ee7b7',   // Emerald-300
      // Tailwind v4 oklab variants
      'oklab(0.5 -0.1 0.1)': '#6b7280',     // Gray-500
      'oklab(0.7 -0.05 0.05)': '#d1d5db',   // Gray-300
      'oklab(0.9 -0.02 0.02)': '#f3f4f6',   // Gray-100
      'oklab(0.95 0 0)': '#f9fafb',         // Gray-50
      'oklab(0.3 0 0)': '#1f2937',          // Gray-800
      'oklab(0.4 0 0)': '#374151',          // Gray-700
      'oklab(0.6 0 0)': '#9ca3af',          // Gray-400
      'oklab(0.8 0 0)': '#e5e7eb',          // Gray-200
      'oklab(0.2 0 0)': '#111827',          // Gray-900
    };
    
    for (const [key, hex] of Object.entries(colorMap)) {
      if (colorStr.includes(key)) return hex;
    }
    
    // Generic fallback: try to extract lightness
    if (colorStr.includes('oklch')) {
      const match = colorStr.match(/oklch\(([0-9.]+)\s/);
      if (match) {
        const lightness = parseFloat(match[1]);
        if (lightness > 0.9) return '#f8fafc';
        if (lightness > 0.7) return '#f1f5f9';
        if (lightness > 0.5) return '#cbd5e1';
        return '#1e293b';
      }
    }
    
    if (colorStr.includes('oklab')) {
      const match = colorStr.match(/oklab\(([0-9.]+)\s/);
      if (match) {
        const lightness = parseFloat(match[1]);
        if (lightness > 0.9) return '#f9fafb';
        if (lightness > 0.7) return '#e5e7eb';
        if (lightness > 0.5) return '#9ca3af';
        return '#374151';
      }
    }
    
    return '#ffffff';
  };

  const generatePDF = async () => {
    if (!presentationRef.current || !reportData) return;
    setGeneratingPDF(true);
    try {
      // Get ALL stylesheet content and replace oklch/oklab with hex
      let allCSS = '';
      const styles = document.querySelectorAll('style');
      styles.forEach(s => {
        let text = s.textContent || '';
        text = text.replace(/oklch\([^)]*\)/g, (m) => oklchToHex(m));
        text = text.replace(/oklab\([^)]*\)/g, (m) => oklchToHex(m));
        allCSS += text + '\n';
      });
      
      const links = document.querySelectorAll('link[rel="stylesheet"]');
      const linkPromises = Array.from(links).map(async (link) => {
        try {
          const href = (link as HTMLLinkElement).href;
          const resp = await fetch(href);
          let text = await resp.text();
          text = text.replace(/oklch\([^)]*\)/g, (m: string) => oklchToHex(m));
          text = text.replace(/oklab\([^)]*\)/g, (m: string) => oklchToHex(m));
          return text;
        } catch { return ''; }
      });
      
      const externalCSS = await Promise.all(linkPromises);
      allCSS += externalCSS.join('\n');
      
      // Build report content manually from reportData
      const buildHeatMapRows = () => {
        if (!reportData.heatMap?.length) return '<tr><td colspan="5" style="text-align:center;padding:40px;color:#94a3b8;">No process area findings to display</td></tr>';
        return reportData.heatMap.map((row: any) => {
          const getBg = (val: number) => {
            if (val === 0) return 'background:#f8fafc;color:#94a3b8';
            if (val > 10) return 'background:#ffe4e6;color:#881337;font-weight:700';
            if (val > 4) return 'background:#fef3c7;color:#92400e;font-weight:700';
            return 'background:#eff6ff;color:#1e40af;font-weight:600';
          };
          return `<tr style="border-bottom:1px solid #f1f5f9">
            <td style="padding:16px;font-weight:600;color:#1e293b">${row.area}</td>
            <td style="padding:16px;text-align:center"><span style="padding:6px 12px;border-radius:8px;font-size:14px;font-weight:700;${getBg(row.critical)}">${row.critical}</span></td>
            <td style="padding:16px;text-align:center"><span style="padding:6px 12px;border-radius:8px;font-size:14px;font-weight:700;${getBg(row.high)}">${row.high}</span></td>
            <td style="padding:16px;text-align:center"><span style="padding:6px 12px;border-radius:8px;font-size:14px;font-weight:700;${getBg(row.medium)}">${row.medium}</span></td>
            <td style="padding:16px;text-align:center"><span style="padding:6px 12px;border-radius:8px;font-size:14px;font-weight:700;${getBg(row.low)}">${row.low}</span></td>
          </tr>`;
        }).join('');
      };
      
      const buildFindingsRows = () => {
        if (!reportData.topFindings?.length) return '<tr><td colspan="4" style="text-align:center;padding:40px;color:#94a3b8;">No findings available</td></tr>';
        return reportData.topFindings.map((f: any, i: number) => {
          const riskColors: Record<string, string> = {
            'CRITICAL': 'background:#ffe4e6;color:#be123c;border:1px solid #fecdd3',
            'HIGH': 'background:#ffe4e6;color:#be123c;border:1px solid #fecdd3',
            'MEDIUM': 'background:#fef3c7;color:#b45309;border:1px solid #fde68a',
          };
          const rc = riskColors[f.riskLevel?.toUpperCase()] || 'background:#eff6ff;color:#1e40af;border:1px solid #bfdbfe';
          return `<tr style="border-bottom:1px solid #f1f5f9;${i%2===0?'background:#f8fafc':''}">
            <td style="padding:16px;font-weight:700;color:#475569;text-align:center">#${i+1}</td>
            <td style="padding:16px;font-weight:600;color:#1e293b">${f.title}</td>
            <td style="padding:16px;text-align:center"><span style="padding:6px 12px;border-radius:8px;font-size:12px;font-weight:700;${rc}">${f.riskLevel}</span></td>
            <td style="padding:16px;text-align:right;font-weight:700;color:#e11d48;font-size:18px">${f.count}</td>
          </tr>`;
        }).join('');
      };
      
      const buildMaturityLevels = () => {
        if (!reportData.maturity?.levels) return '';
        return reportData.maturity.levels.map((lvl: any) => {
          const isCurrent = Math.floor(reportData.maturity.score) === lvl.level;
          const bg = isCurrent ? 'background:linear-gradient(135deg,#eef2ff,#dbeafe);border:1px solid #93c5fd;box-shadow:0 1px 3px rgba(0,0,0,0.1)' : 'background:#fff;border:1px solid #e2e8f0;color:#475569';
          const circleBg = isCurrent ? 'background:#4f46e5;color:#fff' : 'background:#e2e8f0;color:#64748b';
          return `<div style="display:flex;align-items:flex-start;gap:16px;padding:16px;border-radius:12px;margin-bottom:12px;${bg}">
            <div style="width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex-shrink:0;${circleBg}">${lvl.level}</div>
            <div>
              <span style="font-size:14px;font-weight:700;color:${isCurrent?'#312e81':'#1e293b'}">${lvl.name}${isCurrent?' <span style="margin-left:8px;padding:4px 8px;border-radius:8px;background:#c7d2fe;color:#3730a3;font-size:10px;font-weight:900;text-transform:uppercase">Current</span>':''}</span>
              <p style="font-size:14px;margin-top:4px;color:${isCurrent?'#4338ca':'#64748b'}">${lvl.desc}</p>
            </div>
          </div>`;
        }).join('');
      };
      
      const reportHTML = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; margin:0; padding:0; box-sizing:border-box; }
  @page { size: A4 landscape; margin: 15mm; }
  body { font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #1e293b; background: #fff; padding: 20px; }
  .slide { page-break-after: always; min-height: 90vh; padding: 40px; border: 1px solid #e2e8f0; border-radius: 16px; margin-bottom: 20px; position: relative; overflow: hidden; }
  .slide:last-child { page-break-after: avoid; }
  .slide-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 24px; margin-bottom: 32px; }
  .slide-badge { font-size: 12px; font-weight: 600; color: #475569; text-transform: uppercase; letter-spacing: 2px; }
  .slide-num { font-size: 18px; font-weight: 900; color: #4f46e5; background: #eef2ff; padding: 6px 12px; border-radius: 8px; border: 1px solid #c7d2fe; }
  h2 { font-size: 30px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
  h3 { font-size: 24px; font-weight: 700; color: #0f172a; }
  .subtitle { color: #64748b; font-size: 14px; font-weight: 500; margin-bottom: 32px; }
  .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 32px; }
  .kpi-card { background: linear-gradient(135deg, #f8fafc, #fff); border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; text-align: center; }
  .kpi-value { font-size: 36px; font-weight: 900; }
  .kpi-label { font-size: 12px; font-weight: 700; color: #334155; margin-top: 8px; }
  .kpi-sub { font-size: 11px; color: #64748b; margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #0f172a; color: #fff; font-size: 12px; font-weight: 700; text-transform: uppercase; padding: 16px; text-align: left; }
  .roadmap-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .roadmap-card { border-radius: 16px; padding: 24px; position: relative; overflow: hidden; }
  .roadmap-badge { display: inline-block; padding: 6px 12px; border-radius: 9999px; color: #fff; font-weight: 700; font-size: 12px; text-transform: uppercase; margin-bottom: 16px; }
  .conclusion-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .conclusion-card { border-radius: 16px; padding: 24px; border: 2px solid; }
  .cover-center { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; min-height: 70vh; }
  .cover-logo { width: 80px; height: 80px; border-radius: 24px; background: linear-gradient(135deg, #4f46e5, #3b82f6); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 900; font-size: 30px; margin-bottom: 32px; }
  .cover-title { font-size: 36px; font-weight: 900; color: #0f172a; max-width: 700px; line-height: 1.2; }
  .cover-subtitle { font-size: 20px; font-weight: 700; color: #4f46e5; margin-top: 16px; }
  .cover-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; border-top: 1px solid #cbd5e1; padding-top: 48px; margin-top: 64px; max-width: 500px; text-align: left; }
  .info-box { background: linear-gradient(135deg, #eef2ff, #dbeafe); border: 1px solid #93c5fd; border-radius: 16px; padding: 20px; display: flex; gap: 16px; margin-top: 24px; }
  .score-circle { width: 80px; height: 80px; border-radius: 16px; background: linear-gradient(135deg, #4f46e5, #3b82f6); color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .progress-bar { width: 100%; height: 10px; background: #cbd5e1; border-radius: 9999px; overflow: hidden; margin-top: 12px; }
  .progress-fill { height: 10px; border-radius: 9999px; background: linear-gradient(90deg, #4f46e5, #3b82f6); }
  .footer-note { border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: auto; font-size: 12px; color: #64748b; display: flex; justify-content: space-between; }
  .accent-circle { position: absolute; border-radius: 50%; filter: blur(40px); pointer-events: none; }
</style>
</head>
<body>

<!-- SLIDE 1: Cover -->
<div class="slide">
  <div class="accent-circle" style="width:128px;height:128px;background:rgba(99,102,241,0.05);top:0;right:0;"></div>
  <div class="accent-circle" style="width:192px;height:192px;background:rgba(59,130,246,0.05);bottom:0;left:0;"></div>
  <div class="cover-center">
    <div class="cover-logo">GRC</div>
    <h2 class="cover-title">SAP ECC & SAP ECP<br>Access Governance Audit</h2>
    <p class="cover-subtitle">Board / Audit Committee Presentation</p>
    <div style="margin-top:40px;padding:8px 24px;border-radius:9999px;background:#f1f5f9;border:1px solid #cbd5e1;font-size:12px;font-weight:700;color:#334155;text-transform:uppercase;letter-spacing:1px">Big Four Consulting Style</div>
    <div class="cover-meta">
      <div><span style="font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;display:block">Analysis Execution</span><span style="font-size:16px;font-weight:700;color:#1e293b;display:block;margin-top:4px">${reportData.run.run_name}</span></div>
      <div><span style="font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;display:block">Run Date</span><span style="font-size:16px;font-weight:700;color:#1e293b;display:block;margin-top:4px">${formatDate(reportData.run.run_date)}</span></div>
    </div>
  </div>
</div>

<!-- SLIDE 2: Executive Dashboard -->
<div class="slide">
  <div class="slide-header">
    <div><span class="slide-badge">Board Audit Committee</span><h3>Executive Dashboard</h3><p class="subtitle" style="margin-bottom:0">High level security compliance metrics and critical exposure indicators.</p></div>
    <div class="slide-num">2 / 8</div>
  </div>
  <div class="kpi-grid">
    <div class="kpi-card"><div class="kpi-value" style="color:#ef4444">${reportData.kpis.sodRate}%</div><div class="kpi-label">SoD Conflict Rate</div><div class="kpi-sub">Segregation of Duties</div></div>
    <div class="kpi-card"><div class="kpi-value" style="color:#f97316">${reportData.kpis.criticalAccessRate}%</div><div class="kpi-label">Critical Access</div><div class="kpi-sub">Privileged Exposure</div></div>
    <div class="kpi-card"><div class="kpi-value" style="color:#64748b">${reportData.kpis.inactiveUsersRate}%</div><div class="kpi-label">Inactive Users</div><div class="kpi-sub">Access Cleanup</div></div>
    <div class="kpi-card"><div class="kpi-value" style="color:#10b981">${reportData.kpis.complianceRate}%</div><div class="kpi-label">Compliance Rate</div><div class="kpi-sub">Policy Adherence</div></div>
  </div>
  <div style="background:linear-gradient(135deg,#f8fafc,#fff);border:1px solid #e2e8f0;border-radius:16px;padding:24px">
    <div style="margin-bottom:20px">
      <div style="font-size:14px;font-weight:700;color:#334155">Audit Finding Breakdown</div>
      <div style="font-size:12px;color:#64748b;margin-top:4px">Risk classification by severity</div>
    </div>
    <div style="display:flex;gap:32px;align-items:flex-end;justify-content:center;padding:0 20px">
      ${reportData.findingCounts?.map((fc: any, i: number) => {
        const colors = ['#4f46e5','#ef4444','#f97316','#64748b'];
        const maxVal = Math.max(...reportData.findingCounts.map((f:any)=>f.count), 1);
        const barHeight = Math.max((fc.count / maxVal * 120), 8);
        return `<div style="flex:1;max-width:120px;text-align:center;display:flex;flex-direction:column;align-items:center">
          <div style="font-size:18px;font-weight:900;color:#1e293b;margin-bottom:8px">${fc.count}</div>
          <div style="width:100%;height:${barHeight}px;background:${colors[i]};border-radius:8px 8px 0 0"></div>
          <div style="font-size:12px;font-weight:600;color:#64748b;margin-top:12px;white-space:nowrap">${fc.name}</div>
        </div>`;
      }).join('') || ''}
    </div>
  </div>
</div>

<!-- SLIDE 3: Risk Heat Map -->
<div class="slide">
  <div class="slide-header">
    <div><span class="slide-badge">Risk Analysis</span><h3>SoD Risk Heat Map</h3><p class="subtitle" style="margin-bottom:0">Cross-system conflict heat map grouped by functional business areas.</p></div>
    <div class="slide-num">3 / 8</div>
  </div>
  <table style="border:1px solid #e2e8f0;border-radius:16px;overflow:hidden">
    <thead><tr><th style="text-align:left">Functional Area</th><th style="text-align:center">Critical</th><th style="text-align:center">High</th><th style="text-align:center">Medium</th><th style="text-align:center">Low</th></tr></thead>
    <tbody>${buildHeatMapRows()}</tbody>
  </table>
  <div class="info-box">
    <div style="font-size:24px">⚠️</div>
    <div><p style="font-size:14px;font-weight:700;color:#312e81">Heat Map Severity Guide</p><p style="font-size:14px;color:#4338ca;margin-top:8px">Heat map points are counted based on triggered rules. AP/Vendor conflicts typically occupy High/Critical risk ranges and require immediate mitigating controls.</p></div>
  </div>
</div>

<!-- SLIDE 4: Module Distribution -->
<div class="slide">
  <div class="slide-header">
    <div><span class="slide-badge">Access Analysis</span><h3>Critical Access Distribution by Module</h3><p class="subtitle" style="margin-bottom:0">Unique conflicting roles/users distribution across core modules.</p></div>
    <div class="slide-num">4 / 8</div>
  </div>
  <div style="display:grid;grid-template-columns:3fr 2fr;gap:24px">
    <div style="background:linear-gradient(135deg,#f8fafc,#fff);border:1px solid #e2e8f0;border-radius:16px;padding:24px">
      ${reportData.moduleDistribution?.map((md: any, i: number) => {
        const colors = ['#4f46e5','#3b82f6','#06b6d4','#10b981','#f59e0b'];
        const maxVal = Math.max(...reportData.moduleDistribution.map((m:any)=>m.count), 1);
        const w = Math.max((md.count / maxVal * 100), 0);
        const showInside = w > 15;
        return `<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
          <div style="width:60px;font-size:14px;font-weight:700;color:#1e293b;text-align:right">${md.name}</div>
          <div style="flex:1;background:#f1f5f9;border-radius:9999px;height:24px;overflow:hidden;position:relative">
            <div style="width:${w}%;min-width:${md.count > 0 ? '4px' : '0'};height:24px;background:${colors[i]};border-radius:9999px;display:flex;align-items:center;justify-content:flex-end;padding-right:8px;font-size:12px;font-weight:700;color:#fff">${showInside ? md.count : ''}</div>
          </div>
          ${!showInside ? `<span style="font-size:13px;font-weight:700;color:#64748b;min-width:20px">${md.count}</span>` : ''}
        </div>`;
      }).join('') || ''}
    </div>
    <div>
      <div style="background:linear-gradient(135deg,#fff1f2,#fecdd3);border:2px solid #fecdd3;border-radius:16px;padding:20px;margin-bottom:16px">
        <div style="display:flex;gap:12px"><span style="font-size:20px">⚠️</span><div><span style="font-size:12px;font-weight:700;color:#be123c;text-transform:uppercase">Critical Module</span><div style="font-size:18px;font-weight:700;color:#881337;margin-top:4px">${reportData.moduleDistribution?.[0]?.name || 'FI'}</div><p style="font-size:12px;color:#be123c;margin-top:8px;font-weight:500">${reportData.moduleDistribution?.[0]?.count || 0} users with conflicting access</p></div></div>
      </div>
      <div style="background:linear-gradient(135deg,#eef2ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:20px">
        <div style="display:flex;gap:12px"><span style="font-size:20px">✅</span><div><span style="font-size:12px;font-weight:700;color:#4338ca;text-transform:uppercase">Immediate Action</span><p style="font-size:12px;color:#4338ca;margin-top:8px;font-weight:500">Restrict unnecessary profiles from ${reportData.moduleDistribution?.[0]?.name || 'Basis/FI'} to instantly drop conflict rates.</p></div></div>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 5: Maturity -->
<div class="slide">
  <div class="slide-header">
    <div><span class="slide-badge">Governance Assessment</span><h3>Access Governance Maturity</h3><p class="subtitle" style="margin-bottom:0">Audit assessment of organizational risk management maturity.</p></div>
    <div class="slide-num">5 / 8</div>
  </div>
  <div style="display:flex;align-items:center;gap:24px;padding:24px;background:linear-gradient(135deg,#eef2ff,#dbeafe);border:1px solid #93c5fd;border-radius:16px;margin-bottom:24px">
    <div class="score-circle"><span style="font-size:30px;font-weight:900">${reportData.maturity.score}</span><span style="font-size:10px;font-weight:700;text-transform:uppercase">/ 5.0</span></div>
    <div style="flex:1">
      <div style="font-size:18px;font-weight:700;color:#0f172a">Governance Maturity Rating</div>
      <div style="font-size:14px;color:#475569;margin-top:4px;font-weight:500">Level: <span style="font-weight:700;color:#4f46e5">Level ${Math.floor(reportData.maturity.score)} - ${reportData.maturity.levels?.[Math.floor(reportData.maturity.score)-1]?.name || 'Defined'}</span></div>
      <div class="progress-bar"><div class="progress-fill" style="width:${(reportData.maturity.score/5)*100}%"></div></div>
    </div>
  </div>
  ${buildMaturityLevels()}
</div>

<!-- SLIDE 6: Top Findings -->
<div class="slide">
  <div class="slide-header">
    <div><span class="slide-badge">Audit Findings</span><h3>Top Findings</h3><p class="subtitle" style="margin-bottom:0">Audit identified findings requiring remediation priorities.</p></div>
    <div class="slide-num">6 / 8</div>
  </div>
  <table style="border:1px solid #e2e8f0;border-radius:16px;overflow:hidden">
    <thead><tr><th style="text-align:center;width:60px">ID</th><th>Finding Description</th><th style="text-align:center">Risk Level</th><th style="text-align:right">Count</th></tr></thead>
    <tbody>${buildFindingsRows()}</tbody>
  </table>
</div>

<!-- SLIDE 7: Roadmap -->
<div class="slide">
  <div class="slide-header">
    <div><span class="slide-badge">Remediation Plan</span><h3>30 / 60 / 90 Day Remediation Roadmap</h3><p class="subtitle" style="margin-bottom:0">Recommended chronological framework to execute controls mitigation.</p></div>
    <div class="slide-num">7 / 8</div>
  </div>
  <div class="roadmap-grid">
    <div class="roadmap-card" style="background:linear-gradient(135deg,#eef2ff,rgba(199,210,254,0.5));border:2px solid #93c5fd">
      <div style="position:absolute;top:16px;right:16px;font-size:60px;font-weight:900;color:#4f46e5;opacity:0.2">30</div>
      <div class="roadmap-badge" style="background:#4f46e5">Days 0-30</div>
      <h4 style="font-size:18px;font-weight:700;color:#0f172a;margin-bottom:12px">Immediate Remediation</h4>
      <p style="font-size:14px;color:#334155;line-height:1.6;font-weight:500">${reportData.roadmap.days30}</p>
    </div>
    <div class="roadmap-card" style="background:linear-gradient(135deg,#eff6ff,rgba(191,219,254,0.5));border:2px solid #93c5fd">
      <div style="position:absolute;top:16px;right:16px;font-size:60px;font-weight:900;color:#3b82f6;opacity:0.2">60</div>
      <div class="roadmap-badge" style="background:#3b82f6">Days 31-60</div>
      <h4 style="font-size:18px;font-weight:700;color:#0f172a;margin-bottom:12px">Access Redesign</h4>
      <p style="font-size:14px;color:#334155;line-height:1.6;font-weight:500">${reportData.roadmap.days60}</p>
    </div>
    <div class="roadmap-card" style="background:linear-gradient(135deg,#ecfdf5,rgba(167,243,208,0.5));border:2px solid #6ee7b7">
      <div style="position:absolute;top:16px;right:16px;font-size:60px;font-weight:900;color:#10b981;opacity:0.2">90</div>
      <div class="roadmap-badge" style="background:#10b981">Days 61-90</div>
      <h4 style="font-size:18px;font-weight:700;color:#0f172a;margin-bottom:12px">Governance Setup</h4>
      <p style="font-size:14px;color:#334155;line-height:1.6;font-weight:500">${reportData.roadmap.days90}</p>
    </div>
  </div>
</div>

<!-- SLIDE 8: Conclusion -->
<div class="slide">
  <div class="slide-header">
    <div><span class="slide-badge">Final Review</span><h3>Executive Conclusion</h3><p class="subtitle" style="margin-bottom:0">Audit final report review, sign-off status and approval recommendations.</p></div>
    <div class="slide-num">8 / 8</div>
  </div>
  <div class="conclusion-grid">
    <div class="conclusion-card" style="background:linear-gradient(135deg,#fff1f2,#fecdd3);border-color:#fecdd3">
      <span style="font-size:12px;font-weight:700;color:#475569;text-transform:uppercase;display:block">Overall Risk Posture</span>
      <div style="display:flex;align-items:center;gap:12px;margin-top:12px">
        <span style="width:16px;height:16px;border-radius:50%;background:${reportData.conclusion.overallRisk==='Critical'||reportData.conclusion.overallRisk==='High'?'#ef4444':'#f59e0b'}"></span>
        <span style="font-size:24px;font-weight:900;color:#0f172a">${reportData.conclusion.overallRisk} Risk</span>
      </div>
      <p style="font-size:14px;color:#334155;margin-top:16px;line-height:1.6;font-weight:500">${reportData.conclusion.remediationTarget}</p>
      <div style="display:flex;align-items:center;gap:12px;margin-top:24px;border-top:1px solid rgba(203,213,225,0.4);padding-top:16px">
        <span style="font-size:14px;color:#475569;font-weight:600">Scope: <span style="font-weight:700">${reportData.run.scope_type}</span></span>
      </div>
    </div>
    <div class="conclusion-card" style="background:linear-gradient(135deg,#eef2ff,#dbeafe);border-color:#93c5fd">
      <span style="font-size:12px;font-weight:700;color:#475569;text-transform:uppercase;display:block">Sign-off Approval</span>
      <h4 style="font-size:18px;font-weight:700;color:#0f172a;margin-top:12px">Committee Approval Status</h4>
      <p style="font-size:14px;color:#334155;margin-top:12px;line-height:1.6;font-weight:500">Audit presentation report must be signed off by the lead GRC Auditor or Audit Committee chair to finalize remediation workflow.</p>
      <div style="margin-top:24px;padding:12px;border-radius:12px;background:linear-gradient(135deg,#d1fae5,#a7f3d0);border:2px solid #6ee7b7;display:flex;align-items:center;justify-content:center;gap:8px;color:#065f46;font-size:14px;font-weight:700">
        ✅ Report Approved & Signed Off
      </div>
    </div>
  </div>
  <div class="footer-note">
    <span>${reportData.run.run_name} · By ${reportData.run.executed_by}</span>
    <span>Generated: ${new Date().toLocaleDateString()} by MyGRC</span>
  </div>
</div>

</body>
</html>`;
      
      // Create iframe and write content
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.left = '-99999px';
      iframe.style.top = '0';
      iframe.style.width = '1200px';
      iframe.style.height = '900px';
      document.body.appendChild(iframe);
      
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) throw new Error('Could not access iframe document');
      
      iframeDoc.open();
      iframeDoc.write(reportHTML);
      iframeDoc.close();
      
      // Wait for iframe to render
      await new Promise(r => setTimeout(r, 1500));
      
      // Trigger print
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      
      // Clean up
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 10000);
      
      console.log('PDF print dialog opened');
    } catch (err: any) {
      console.error('Error generating PDF:', err);
      console.error('Details:', err?.message || err?.toString());
      alert('Error generating PDF: ' + (err?.message || 'Unknown error occurred'));
    } finally {
      setGeneratingPDF(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Dropdown Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Executive Report</h1>
          <p className="text-slate-500 text-sm mt-1">Audit Committee & Board level Access Governance Presentation.</p>
        </div>

        {/* Selection menu and PDF button */}
        <div className="flex items-center gap-3">
          {reportData && (
            <button
              onClick={generatePDF}
              disabled={generatingPDF}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              {generatingPDF ? 'Generating...' : 'Download PDF'}
            </button>
          )}
          <div className="flex items-center gap-2">
          {loadingRuns ? (
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading runs...
            </div>
          ) : runs.length === 0 ? (
            <span className="text-slate-500 text-sm font-medium">No completed runs available</span>
          ) : (
            <div className="relative flex items-center">
              <PlayCircle className="w-5 h-5 text-indigo-600 absolute left-3 pointer-events-none" />
              <select
                value={selectedRunId}
                onChange={(e) => setSelectedRunId(e.target.value)}
                className="pl-10 pr-10 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 bg-white transition cursor-pointer appearance-none min-w-[260px] font-medium shadow-sm"
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
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
          <button onClick={fetchRuns} className="ml-auto underline hover:text-rose-900 transition-colors">Retry</button>
        </div>
      )}

      {loadingReport ? (
        <div className="flex flex-col items-center justify-center py-40 text-slate-400 text-sm gap-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
          <span>Preparing Audit Committee Presentation deck...</span>
        </div>
      ) : !reportData ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-800 text-lg animate-pulse">Select an Analysis Run</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">An analysis execution must be completed in order to compile board level reports.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" ref={presentationRef}>
          {/* Left Slide Navigation Deck */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm h-fit flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 mb-3 block letter-spacing-wide">Presentation Navigation</span>
            {slides.map((s) => {
              const Icon = s.icon;
              const isActive = activeSlide === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSlide(s.id)}
                  className={`flex items-center gap-3 px-3 py-3.5 w-full rounded-xl text-left text-sm font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' 
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate text-xs">{s.title}</span>
                </button>
              );
            })}
          </div>

          {/* Right Presentation View Container */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-md p-8 min-h-[500px] flex flex-col relative overflow-hidden">
            {/* Background design accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Top Slide Number Indicator */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg shadow-indigo-200" />
                <span className="text-sm font-bold text-slate-600 uppercase tracking-widest letter-spacing-wider">
                  Board Audit Committee Presentation
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">SLIDE</span>
                <span className="text-lg font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200 shadow-sm">
                  {activeSlide + 1} / 8
                </span>
              </div>
            </div>

            {/* Dynamic Content Display with AnimatePresence */}
            <div className="flex-1 flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex-1 flex flex-col"
                >
                  {/* SLIDE 1: COVER PAGE */}
                  {activeSlide === 0 && (
                    <div className="flex-1 flex flex-col justify-center items-center text-center py-12 relative">
                      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white font-black text-3xl mb-8 shadow-2xl shadow-indigo-300">
                        GRC
                      </div>
                      <h2 className="text-4xl font-black text-slate-900 tracking-tight max-w-2xl leading-tight">
                        SAP ECC & SAP ECP Access Governance Audit
                      </h2>
                      <p className="text-xl font-bold text-indigo-600 mt-4">
                        Board / Audit Committee Presentation
                      </p>
                      <div className="mt-10 px-6 py-2 rounded-full bg-slate-100 border border-slate-300 text-xs font-bold text-slate-700 uppercase tracking-wider shadow-sm">
                        Big Four Consulting Style
                      </div>
                      
                      <div className="grid grid-cols-2 gap-12 border-t border-slate-300 pt-12 mt-16 w-full max-w-md text-left">
                        <div>
                          <span className="text-xs uppercase font-bold text-slate-500 block tracking-wider">Analysis Execution</span>
                          <span className="text-base font-bold text-slate-800 truncate block mt-1" title={reportData.run.run_name}>
                            {reportData.run.run_name}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs uppercase font-bold text-slate-500 block tracking-wider">Run Date</span>
                          <span className="text-base font-bold text-slate-800 block mt-1">
                            {formatDate(reportData.run.run_date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SLIDE 2: EXECUTIVE DASHBOARD */}
                  {activeSlide === 1 && (
                    <div className="space-y-8 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">Executive Dashboard</h3>
                        <p className="text-slate-500 text-sm mt-2 font-medium">High level security compliance metrics and critical exposure indicators.</p>
                      </div>

                      {/* Gauges Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
                          <CircularProgressRing percentage={reportData.kpis.sodRate} color="#ef4444" size={80} />
                          <span className="text-xs font-bold text-slate-700 mt-4 block leading-tight">SoD Conflict Rate</span>
                          <span className="text-[11px] text-slate-500 mt-1">Segregation of Duties</span>
                        </div>
                        <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
                          <CircularProgressRing percentage={reportData.kpis.criticalAccessRate} color="#f97316" size={80} />
                          <span className="text-xs font-bold text-slate-700 mt-4 block leading-tight">Critical Access</span>
                          <span className="text-[11px] text-slate-500 mt-1">Privileged Exposure</span>
                        </div>
                        <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
                          <CircularProgressRing percentage={reportData.kpis.inactiveUsersRate} color="#64748b" size={80} />
                          <span className="text-xs font-bold text-slate-700 mt-4 block leading-tight">Inactive Users</span>
                          <span className="text-[11px] text-slate-500 mt-1">Access Cleanup</span>
                        </div>
                        <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
                          <CircularProgressRing percentage={reportData.kpis.complianceRate} color="#10b981" size={80} />
                          <span className="text-xs font-bold text-slate-700 mt-4 block leading-tight">Compliance Rate</span>
                          <span className="text-[11px] text-slate-500 mt-1">Policy Adherence</span>
                        </div>
                      </div>

                      {/* Finding Counts Chart */}
                      <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-6 flex-1 flex flex-col min-h-[200px] shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-sm font-bold text-slate-700 block">Audit Finding Breakdown</span>
                            <span className="text-xs text-slate-500 block mt-1">Risk classification by severity</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <ResponsiveContainer width="100%" height={160}>
                            <BarChart data={reportData.findingCounts} barSize={50}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b', fontWeight: '600' }} axisLine={false} tickLine={false} />
                              <YAxis tick={{ fontSize: 12, fill: '#64748b', fontWeight: '600' }} axisLine={false} tickLine={false} allowDecimals={false} />
                              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                {reportData.findingCounts.map((entry: any, i: number) => {
                                  const colors = ['#4f46e5', '#ef4444', '#f97316', '#64748b'];
                                  return <Cell key={entry.name} fill={colors[i] || '#6366f1'} />;
                                })}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SLIDE 3: RISK HEAT MAP */}
                  {activeSlide === 2 && (
                    <div className="space-y-8 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">SoD Risk Heat Map</h3>
                        <p className="text-slate-500 text-sm mt-2 font-medium">Cross-system conflict heat map grouped by functional business areas.</p>
                      </div>

                      {/* Real Heatmap Grid */}
                      <div className="flex-1 overflow-x-auto py-4">
                        {reportData.heatMap.length === 0 ? (
                          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                            No process area findings to display
                          </div>
                        ) : (
                          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                            <table className="w-full text-sm border-collapse">
                              <thead>
                                <tr className="bg-slate-900 text-white text-xs uppercase font-bold border-b border-slate-700">
                                  <th className="py-4 px-4 text-left font-bold tracking-wide">Functional Area</th>
                                  <th className="py-4 px-4 text-center font-bold">Critical</th>
                                  <th className="py-4 px-4 text-center font-bold">High</th>
                                  <th className="py-4 px-4 text-center font-bold">Medium</th>
                                  <th className="py-4 px-4 text-center font-bold">Low</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {reportData.heatMap.map((row: any) => {
                                  const getHeatBg = (val: number) => {
                                    if (val === 0) return 'bg-slate-50 text-slate-400';
                                    if (val > 10) return 'bg-rose-100 text-rose-900 font-bold shadow-sm';
                                    if (val > 4) return 'bg-amber-100 text-amber-900 font-bold shadow-sm';
                                    return 'bg-blue-50 text-blue-700 font-medium';
                                  };

                                  return (
                                    <tr key={row.area} className="hover:bg-slate-50/50 transition-colors">
                                      <td className="py-4 px-4 font-semibold text-slate-800">{row.area}</td>
                                      <td className="py-4 px-4 text-center">
                                        <span className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${getHeatBg(row.critical)}`}>
                                          {row.critical}
                                        </span>
                                      </td>
                                      <td className="py-4 px-4 text-center">
                                        <span className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${getHeatBg(row.high)}`}>
                                          {row.high}
                                        </span>
                                      </td>
                                      <td className="py-4 px-4 text-center">
                                        <span className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${getHeatBg(row.medium)}`}>
                                          {row.medium}
                                        </span>
                                      </td>
                                      <td className="py-4 px-4 text-center">
                                        <span className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${getHeatBg(row.low)}`}>
                                          {row.low}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>

                      {/* Audit Note */}
                      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl p-5 flex gap-4 shadow-sm">
                        <ShieldAlert className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-indigo-900">Heat Map Severity Guide</p>
                          <p className="text-sm text-indigo-700 mt-2 leading-relaxed">
                            Heat map points are counted based on triggered rules. AP/Vendor conflicts typically occupy High/Critical risk ranges and require immediate mitigating controls.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SLIDE 4: CRITICAL ACCESS DISTRIBUTION BY MODULE */}
                  {activeSlide === 3 && (
                    <div className="space-y-8 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">Critical Access Distribution by Module</h3>
                        <p className="text-slate-500 text-sm mt-2 font-medium">Unique conflicting roles/users distribution across core modules.</p>
                      </div>

                      {/* Grid with chart and audit details */}
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 flex-1 items-center">
                        <div className="md:col-span-3 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                          <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={reportData.moduleDistribution} layout="vertical" barSize={22}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                              <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b', fontWeight: '600' }} axisLine={false} tickLine={false} allowDecimals={false} />
                              <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#334155', fontWeight: 'bold' }} axisLine={false} tickLine={false} width={60} />
                              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                              <Bar dataKey="count" fill="#6366f1" radius={[0, 6, 6, 0]}>
                                {reportData.moduleDistribution.map((entry: any, idx: number) => {
                                  const colors = ['#4f46e5', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b'];
                                  return <Cell key={entry.name} fill={colors[idx] || '#6366f1'} />;
                                })}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Audit Details */}
                        <div className="md:col-span-2 space-y-4">
                          <div className="bg-gradient-to-br from-rose-50 to-red-50 rounded-2xl border border-rose-200 p-5 shadow-sm">
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="text-xs uppercase font-bold text-rose-700 block tracking-wide">Critical Module</span>
                                <span className="text-lg font-bold text-rose-900 block mt-1">
                                  {reportData.moduleDistribution[0]?.name || 'FI'}
                                </span>
                                <p className="text-xs text-rose-700 mt-2 leading-relaxed font-medium">
                                  {reportData.moduleDistribution[0]?.count || 0} users with conflicting access
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-200 p-5 shadow-sm">
                            <div className="flex items-start gap-3">
                              <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="text-xs uppercase font-bold text-indigo-700 block tracking-wide">Immediate Action</span>
                                <p className="text-xs text-indigo-700 mt-2 font-medium leading-relaxed">
                                  Restrict unnecessary profiles from {reportData.moduleDistribution[0]?.name || 'Basis/FI'} to instantly drop conflict rates.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SLIDE 5: ACCESS GOVERNANCE MATURITY */}
                  {activeSlide === 4 && (
                    <div className="space-y-8 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">Access Governance Maturity</h3>
                        <p className="text-slate-500 text-sm mt-2 font-medium">Audit assessment of organizational risk management maturity.</p>
                      </div>

                      {/* Big Score Header */}
                      <div className="flex items-center gap-6 py-6 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl p-6 shadow-sm">
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white flex flex-col items-center justify-center shadow-lg shadow-indigo-300">
                          <span className="text-3xl font-black">{reportData.maturity.score}</span>
                          <span className="text-[10px] uppercase font-bold">/ 5.0</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-lg font-bold text-slate-900">Governance Maturity Rating</div>
                          <div className="text-sm text-slate-600 mt-1 font-medium">
                            Level: <span className="font-bold text-indigo-600">Level {Math.floor(reportData.maturity.score)} - {reportData.maturity.levels[Math.floor(reportData.maturity.score) - 1]?.name || 'Defined'}</span>
                          </div>
                          <div className="w-full bg-slate-300 h-2.5 mt-3 rounded-full overflow-hidden shadow-sm">
                            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 h-2.5 rounded-full transition-all duration-700 shadow-lg" style={{ width: `${(reportData.maturity.score / 5.0) * 100}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Levels Timeline */}
                      <div className="space-y-3 flex-1 overflow-y-auto max-h-[220px] pr-2">
                        {reportData.maturity.levels.map((lvl: any) => {
                          const isCurrent = Math.floor(reportData.maturity.score) === lvl.level;
                          return (
                            <div 
                              key={lvl.level}
                              className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 ${
                                isCurrent 
                                  ? 'bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-300 shadow-md ring-2 ring-indigo-200' 
                                  : 'bg-white border-slate-200 text-slate-600'
                              }`}
                            >
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-sm ${
                                isCurrent ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
                              }`}>
                                {lvl.level}
                              </div>
                              <div className="flex-1">
                                <span className={`text-sm font-bold ${isCurrent ? 'text-indigo-900' : 'text-slate-800'}`}>
                                  {lvl.name} {isCurrent && <span className="ml-2 px-2 py-1 rounded-lg bg-indigo-200 text-indigo-800 text-[10px] font-black uppercase shadow-sm">Current</span>}
                                </span>
                                <p className={`text-sm mt-1 leading-relaxed ${isCurrent ? 'text-indigo-700' : 'text-slate-500'}`}>
                                  {lvl.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* SLIDE 6: TOP 10 FINDINGS */}
                  {activeSlide === 5 && (
                    <div className="space-y-8 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">Top Findings</h3>
                        <p className="text-slate-500 text-sm mt-2 font-medium">Audit identified findings requiring remediation priorities.</p>
                      </div>

                      {/* Findings Table */}
                      <div className="flex-1 overflow-y-auto max-h-[320px] border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        {reportData.topFindings.length === 0 ? (
                          <div className="py-16 text-center text-slate-400 text-sm font-medium">No findings available in this run</div>
                        ) : (
                          <table className="w-full text-sm text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-900 text-white font-bold uppercase text-xs sticky top-0 z-10">
                                <th className="py-4 px-4 font-bold tracking-wide">ID</th>
                                <th className="py-4 px-4 font-bold">Finding Description</th>
                                <th className="py-4 px-4 text-center font-bold">Risk Level</th>
                                <th className="py-4 px-4 text-right font-bold">Count</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {reportData.topFindings.map((finding: any, idx: number) => (
                                <tr key={finding.id} className="hover:bg-slate-50/80 transition-colors even:bg-slate-50/40">
                                  <td className="py-4 px-4 font-bold text-slate-600 w-12 text-center">#{idx + 1}</td>
                                  <td className="py-4 px-4 font-semibold text-slate-800 truncate" title={finding.title}>
                                    {finding.title}
                                  </td>
                                  <td className="py-4 px-4 text-center">
                                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${getRiskColor(finding.riskLevel)}`}>
                                      {finding.riskLevel}
                                    </span>
                                  </td>
                                  <td className="py-4 px-4 text-right">
                                    <span className="font-bold text-rose-600 text-lg">{finding.count}</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  )}

                  {/* SLIDE 7: 30 / 60 / 90 DAY ROADMAP */}
                  {activeSlide === 6 && (
                    <div className="space-y-8 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">30 / 60 / 90 Day Remediation Roadmap</h3>
                        <p className="text-slate-500 text-sm mt-2 font-medium">Recommended chronological framework to execute controls mitigation.</p>
                      </div>

                      {/* Roadmap Layout */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 py-4">
                        {/* 30 Days */}
                        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 border-2 border-indigo-300 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow">
                          <div className="absolute top-4 right-4 opacity-20 pointer-events-none">
                            <span className="text-6xl font-extrabold text-indigo-600">30</span>
                          </div>
                          <div className="relative z-10">
                            <span className="px-3 py-1 rounded-full bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider inline-block shadow-md">Days 0-30</span>
                            <h4 className="text-lg font-bold text-slate-900 mt-4">Immediate Remediation</h4>
                            <p className="text-sm text-slate-700 mt-3 leading-relaxed font-medium">
                              {reportData.roadmap.days30}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 mt-6 cursor-pointer hover:underline group">
                            Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>

                        {/* 60 Days */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-300 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow">
                          <div className="absolute top-4 right-4 opacity-20 pointer-events-none">
                            <span className="text-6xl font-extrabold text-blue-600">60</span>
                          </div>
                          <div className="relative z-10">
                            <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-bold text-xs uppercase tracking-wider inline-block shadow-md">Days 31-60</span>
                            <h4 className="text-lg font-bold text-slate-900 mt-4">Access Redesign</h4>
                            <p className="text-sm text-slate-700 mt-3 leading-relaxed font-medium">
                              {reportData.roadmap.days60}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm font-bold text-blue-600 mt-6 cursor-pointer hover:underline group">
                            Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>

                        {/* 90 Days */}
                        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-2 border-emerald-300 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow">
                          <div className="absolute top-4 right-4 opacity-20 pointer-events-none">
                            <span className="text-6xl font-extrabold text-emerald-600">90</span>
                          </div>
                          <div className="relative z-10">
                            <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider inline-block shadow-md">Days 61-90</span>
                            <h4 className="text-lg font-bold text-slate-900 mt-4">Governance Setup</h4>
                            <p className="text-sm text-slate-700 mt-3 leading-relaxed font-medium">
                              {reportData.roadmap.days90}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 mt-6 cursor-pointer hover:underline group">
                            Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SLIDE 8: EXECUTIVE CONCLUSION */}
                  {activeSlide === 7 && (
                    <div className="space-y-8 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">Executive Conclusion</h3>
                        <p className="text-slate-500 text-sm mt-2 font-medium">Audit final report review, sign-off status and approval recommendations.</p>
                      </div>

                      {/* Overall status warning box */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
                        <div className={`rounded-2xl p-6 flex flex-col justify-between shadow-md border-2 ${
                          reportData.conclusion.overallRisk === 'Critical' || reportData.conclusion.overallRisk === 'High' 
                            ? 'bg-gradient-to-br from-rose-50 to-red-50 border-rose-300' 
                            : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300'
                        }`}>
                          <div>
                            <span className="text-xs uppercase font-bold text-slate-600 block tracking-wide">Overall Risk Posture</span>
                            <div className="flex items-center gap-3 mt-3">
                              <span className={`h-4 w-4 rounded-full animate-pulse ${
                                reportData.conclusion.overallRisk === 'Critical' || reportData.conclusion.overallRisk === 'High' ? 'bg-rose-500' : 'bg-amber-500'
                              }`} />
                              <span className="text-2xl font-extrabold text-slate-900">
                                {reportData.conclusion.overallRisk} Risk
                              </span>
                            </div>
                            <p className="text-sm text-slate-700 mt-4 leading-relaxed font-medium">
                              {reportData.conclusion.remediationTarget}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-3 mt-6 border-t border-slate-300/40 pt-4">
                            <Sliders className="w-5 h-5 text-slate-600" />
                            <span className="text-sm text-slate-700 font-semibold">
                              Scope: <span className="font-bold">{reportData.run.scope_type}</span>
                            </span>
                          </div>
                        </div>

                        {/* Interactive Sign-off action */}
                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-300 rounded-2xl p-6 flex flex-col justify-between shadow-md">
                          <div>
                            <span className="text-xs uppercase font-bold text-slate-600 block tracking-wide">Sign-off Approval</span>
                            <h4 className="text-lg font-bold text-slate-900 mt-3">Committee Approval Status</h4>
                            <p className="text-sm text-slate-700 mt-3 leading-relaxed font-medium">
                              Audit presentation report must be signed off by the lead GRC Auditor or Audit Committee chair to finalize remediation workflow.
                            </p>
                          </div>

                          <div className="mt-6">
                            {approvedStatus ? (
                              <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-xl p-3 flex items-center justify-center gap-2 text-emerald-700 text-sm font-bold shadow-md">
                                <CheckCircle2 className="w-5 h-5" /> Report Approved & Signed Off
                              </div>
                            ) : (
                              <button 
                                onClick={() => setApprovedStatus(true)}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-sm transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                              >
                                <CheckCircle2 className="w-5 h-5" />
                                Sign Off Audit Presentation
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slide Navigation Buttons Footer */}
            <div className="border-t border-slate-200 pt-6 mt-6 flex justify-between items-center text-xs gap-4">
              <button 
                onClick={() => setActiveSlide(prev => Math.max(0, prev - 1))}
                disabled={activeSlide === 0}
                className="px-5 py-2.5 border-2 border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100 hover:border-slate-400 transition disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
              >
                ← Previous
              </button>
              
              <span className="text-slate-500 font-semibold text-xs flex-1 text-center line-clamp-1">
                {reportData.run.run_name} · By {reportData.run.executed_by}
              </span>
              
              <button 
                onClick={() => setActiveSlide(prev => Math.min(slides.length - 1, prev + 1))}
                disabled={activeSlide === slides.length - 1}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-lg font-bold transition disabled:opacity-30 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
