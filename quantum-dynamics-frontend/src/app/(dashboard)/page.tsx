'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FolderGit2, 
  PieChart, 
  Sliders, 
  DownloadCloud, 
  Loader2,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Plus,
  Users,
  FolderOpen,
  CheckCircle2,
  Cpu,
  Layers,
  ShieldAlert,
  Zap,
  Globe,
  Radio,
  Clock,
  Terminal,
  ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { DashboardService } from '@/services/dashboard.service';
import { DashboardMetrics, RecentActivity } from '@/types/dashboard';

export default function DashboardHome() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [greeting, setGreeting] = useState('Welcome Back');
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const hr = new Date().getHours();
    if (hr < 12) setGreeting('Good Morning');
    else if (hr < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString() + ' UTC');
    };
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);

    const fetchDashboardData = async () => {
      try {
        const [metricsRes, activitiesRes] = await Promise.all([
          DashboardService.getMetrics(),
          DashboardService.getActivities()
        ]);
        
        if (metricsRes.success) setMetrics(metricsRes.data);
        if (activitiesRes.success) setActivities(activitiesRes.data);
      } catch (error) {
        toast.error('Failed to synchronize dashboard metrics.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
    return () => clearInterval(clockInterval);
  }, []);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const response = await api.get('/dashboard/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `quantum_dynamics_report_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success("System telemetry report generated and downloaded.");
    } catch (error) {
      toast.error("Failed to generate export file.");
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[75vh] flex-col items-center justify-center gap-4">
        <div className="relative flex items-center justify-center">
          <div className="h-20 w-20 rounded-3xl border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <div className="h-12 w-12 rounded-2xl border-2 border-indigo-500/30 border-b-indigo-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }} />
          <Cpu className="absolute h-7 w-7 text-cyan-400 animate-pulse" />
        </div>
        <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest animate-pulse">
          Synchronizing Quantum Command Matrices...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. HERO COMMAND COCKPIT WITH LASER SCAN */}
      <div className="relative rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-[#060b19] via-[#09122c] to-[#080d21] p-6 sm:p-8 backdrop-blur-2xl overflow-hidden shadow-2xl">
        {/* Subtle Cyber Grid */}
        <div className="absolute inset-0 bg-quantum-grid opacity-30 pointer-events-none" />
        
        {/* Continuous Animated Top Laser Beam */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-laser-beam" />
        
        {/* Ambient Corner Radial Accents */}
        <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-cyan-500/10 blur-[90px] pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-mono font-medium shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span>COMMAND COCKPIT • LEVEL 5 TELEMETRY</span>
              </div>

              {currentTime && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-800 bg-[#040713]/80 text-[11px] font-mono text-slate-400">
                  <Clock className="h-3 w-3 text-cyan-400" />
                  <span>{currentTime}</span>
                </div>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {greeting}, <span className="text-gradient-cyan">Commander Bharat</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-mono max-w-xl leading-relaxed">
              All quantum clusters online. 7 operational initiatives deployed with 100% telemetry integrity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/projects"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Initialize Project</span>
            </Link>

            <button 
              onClick={handleExportData}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700/80 bg-[#070c1a]/80 hover:bg-slate-800 text-slate-200 hover:text-white font-mono text-xs transition-all disabled:opacity-50 cursor-pointer shadow-md"
            >
              {isExporting ? <Loader2 className="h-4 w-4 animate-spin text-cyan-400" /> : <DownloadCloud className="h-4 w-4 text-cyan-400" />}
              <span>{isExporting ? 'Exporting...' : 'Export Telemetry'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. KPI TELEMETRY METRICS CARDS (4-CARD GRID) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Metric 1: Active Projects */}
        <div className="group relative rounded-2xl p-5 overflow-hidden bg-[#070c1a] border border-slate-800/80 hover:border-cyan-500/50 shadow-xl hover:shadow-cyan-500/15 transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400/30 group-hover:border-cyan-400 transition-colors" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">Active Projects</span>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 group-hover:border-cyan-400/50 transition-all">
              <FolderGit2 className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-black text-white tracking-tight">{metrics?.activeProjects ?? 0}</p>
            <span className="flex items-center text-xs font-mono text-emerald-400 font-bold gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              <TrendingUp className="h-3 w-3" /> +14.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-2">Active initiatives deployed</p>
        </div>

        {/* Metric 2: Neural Load */}
        <div className="group relative rounded-2xl p-5 overflow-hidden bg-[#070c1a] border border-slate-800/80 hover:border-indigo-500/50 shadow-xl hover:shadow-indigo-500/15 transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-indigo-400/30 group-hover:border-indigo-400 transition-colors" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">Neural Load</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-110 group-hover:border-indigo-400/50 transition-all">
              <PieChart className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-black text-white tracking-tight">{metrics?.utilization?.percentage ?? 0}%</p>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
              OPTIMAL
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-2 w-full bg-slate-900 rounded-full mt-3 overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
              style={{ width: `${metrics?.utilization?.percentage ?? 71}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Total Portfolio */}
        <div className="group relative rounded-2xl p-5 overflow-hidden bg-[#070c1a] border border-slate-800/80 hover:border-violet-500/50 shadow-xl hover:shadow-violet-500/15 transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-violet-400/30 group-hover:border-violet-400 transition-colors" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">Total Portfolio</span>
            <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 group-hover:scale-110 group-hover:border-violet-400/50 transition-all">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-black text-white tracking-tight">{metrics?.totalProjects ?? 0}</p>
            <span className="text-xs font-mono text-slate-400">Total Units</span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-2">58% Internal • 42% Partner</p>
        </div>

        {/* Metric 4: Mesh Security */}
        <div className="group relative rounded-2xl p-5 overflow-hidden bg-[#070c1a] border border-slate-800/80 hover:border-emerald-500/50 shadow-xl hover:shadow-emerald-500/15 transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-emerald-400/30 group-hover:border-emerald-400 transition-colors" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">Zero-Trust Mesh</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 group-hover:border-emerald-400/50 transition-all">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-black text-white tracking-tight">100%</p>
            <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              ONLINE
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-2">Zero anomalous intrusions</p>
        </div>

      </div>

      {/* 3. SPLIT MATRIX: RECENT ACTIVITY & VELOCITY CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Neural Feed */}
        <div className="col-span-1 rounded-3xl border border-slate-800/80 bg-[#070c1a] p-6 backdrop-blur-2xl flex flex-col h-[420px] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
          
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Neural Feed</h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Real-Time
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 smooth-scroll">
            {activities.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center p-6 text-slate-500 font-mono text-xs">
                No recent activity telemetry recorded.
              </div>
            ) : (
              activities.slice(0, 6).map((activity, index) => (
                <div key={index} className="flex gap-3 items-start p-2.5 rounded-xl hover:bg-slate-800/40 border border-transparent hover:border-slate-800 transition-colors">
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-[10px] font-bold text-cyan-300 shrink-0">
                    {activity.user ? activity.user.substring(0, 2).toUpperCase() : 'QD'}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs text-slate-200 leading-snug">
                      <span className="font-bold text-white">{activity.user}</span>{' '}
                      <span className="text-slate-400">{activity.action}</span>{' '}
                      <span className="text-cyan-400 font-semibold">{activity.target}</span>
                    </p>
                    <p className="text-[10px] font-mono text-slate-500">
                      {activity.time ? new Date(activity.time).toLocaleTimeString() : 'Just now'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Project Velocity Chart */}
        <div className="col-span-1 lg:col-span-2 rounded-3xl border border-slate-800/80 bg-[#070c1a] p-6 backdrop-blur-2xl flex flex-col h-[420px] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Operations Velocity Matrix</h2>
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">Telemetric execution volume across active cycles</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="h-2 w-3 rounded-full bg-cyan-400" /> Target
              </span>
              <span className="flex items-center gap-1.5 text-indigo-400">
                <span className="h-2 w-3 rounded-full bg-indigo-500" /> Actual
              </span>
            </div>
          </div>
          
          <div className="flex-1 relative w-full rounded-2xl border border-slate-800/70 bg-[#040713]/80 overflow-hidden">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between py-6 px-4">
              {[100, 75, 50, 25, 0].map((val) => (
                <div key={val} className="flex items-center w-full gap-3">
                  <span className="text-[10px] font-mono text-slate-600 w-6 text-right">{val}%</span>
                  <div className="flex-1 border-b border-dashed border-slate-800/60"></div>
                </div>
              ))}
            </div>
            
            {/* SVG Line Chart */}
            <div className="absolute inset-0 left-12 right-4 top-6 bottom-8">
              <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full drop-shadow-2xl">
                <path d="M0,35 Q15,30 30,22 T60,15 T100,6 L100,40 L0,40 Z" fill="url(#blue-gradient)" opacity="0.35" />
                <path d="M0,35 Q15,30 30,22 T60,15 T100,6" fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="30" cy="22" r="2.5" fill="#040713" stroke="#06b6d4" strokeWidth="2" className="animate-pulse" />
                <circle cx="60" cy="15" r="2.5" fill="#040713" stroke="#06b6d4" strokeWidth="2" className="animate-pulse" />
                <circle cx="100" cy="6" r="2.5" fill="#040713" stroke="#06b6d4" strokeWidth="2" className="animate-pulse" />
                <path d="M0,38 Q20,35 40,28 T80,20 T100,18" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="3 3" />

                <defs>
                  <linearGradient id="blue-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            <div className="absolute bottom-2 left-14 right-4 flex justify-between text-[10px] font-mono text-slate-500">
              <span>CY-01</span><span>CY-02</span><span>CY-03</span><span>CY-04</span><span>CY-05</span><span>CY-06</span>
            </div>
          </div>
        </div>

      </div>

      {/* 4. QUICK OPERATIONS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link 
          href="/projects" 
          className="group relative flex items-center gap-4 p-4 rounded-2xl border border-slate-800 bg-[#070c1a] hover:border-cyan-500/50 hover:shadow-cyan-500/10 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="h-11 w-11 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/30 group-hover:scale-110 transition-transform">
            <FolderGit2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">Manage Projects</p>
            <p className="text-[11px] font-mono text-slate-400">View tasks, progress & due dates</p>
          </div>
        </Link>

        <Link 
          href="/media" 
          className="group relative flex items-center gap-4 p-4 rounded-2xl border border-slate-800 bg-[#070c1a] hover:border-indigo-500/50 hover:shadow-indigo-500/10 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="h-11 w-11 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/30 group-hover:scale-110 transition-transform">
            <FolderOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">Quantum Media Vault</p>
            <p className="text-[11px] font-mono text-slate-400">Encrypted enterprise assets & streams</p>
          </div>
        </Link>

        <Link 
          href="/team" 
          className="group relative flex items-center gap-4 p-4 rounded-2xl border border-slate-800 bg-[#070c1a] hover:border-violet-500/50 hover:shadow-violet-500/10 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="h-11 w-11 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center border border-violet-500/30 group-hover:scale-110 transition-transform">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors">Team Matrix</p>
            <p className="text-[11px] font-mono text-slate-400">Personnel clearance & operational roles</p>
          </div>
        </Link>
      </div>

    </div>
  );
}
