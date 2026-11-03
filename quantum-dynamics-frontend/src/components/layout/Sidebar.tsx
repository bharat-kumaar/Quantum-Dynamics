'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FolderGit2, 
  Users, 
  Settings, 
  Hexagon,
  LogOut,
  Activity,
  FolderOpen,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: LayoutDashboard,
    badge: 'Live',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
  },
  { 
    name: 'Projects', 
    href: '/projects', 
    icon: FolderGit2,
    badge: null,
    badgeColor: null
  },
  { 
    name: 'Media Vault', 
    href: '/media', 
    icon: FolderOpen,
    badge: 'S3',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
  },
  { 
    name: 'Team Matrix', 
    href: '/team', 
    icon: Users,
    badge: null,
    badgeColor: null
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: Settings,
    badge: null,
    badgeColor: null
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [userName, setUserName] = useState('Bharat Kumar');
  const [userRole, setUserRole] = useState('Admin');
  const [userInitials, setUserInitials] = useState('BK');

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('qd_user');
        if (raw) {
          const u = JSON.parse(raw);
          if (u?.name) {
            setUserName(u.name);
            setUserInitials(u.name.substring(0, 2).toUpperCase());
          }
          if (u?.role) {
            setUserRole(u.role);
          }
        }
      }
    } catch {}
  }, []);

  const handleLogout = () => {
    if (typeof document !== 'undefined') {
      document.cookie = "qd_access_token=; path=/; max-age=0;";
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    if (typeof window !== 'undefined') {
      window.location.replace('/login');
    }
  };

  return (
    <aside className="hidden md:flex h-full w-72 flex-col shrink-0 border-r border-slate-800/80 bg-[#070b14]/90 backdrop-blur-2xl text-slate-300 relative z-40 select-none">
      {/* Top Branding Section */}
      <div className="flex h-20 items-center justify-between px-6 border-b border-slate-800/70 relative">
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-violet-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
            <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[#090d1a]">
              <Hexagon className="h-6 w-6 text-cyan-400 group-hover:rotate-45 transition-transform duration-500" strokeWidth={2} />
            </div>
            {/* Pulsing micro indicator */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 border-2 border-[#070b14]"></span>
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black tracking-wider text-white">QUANTUM</span>
              <span className="text-sm font-black tracking-wider text-cyan-400">DYNAMICS</span>
            </div>
            <span className="text-[10px] font-mono font-medium tracking-widest text-slate-400 uppercase">Neural Gateway</span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
        <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-widest text-slate-500 flex items-center justify-between">
          <span>Command Modules</span>
          <Sparkles className="h-3 w-3 text-cyan-400" />
        </div>

        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group relative flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-gradient-to-r from-cyan-500/15 via-indigo-500/10 to-transparent text-white border border-cyan-500/30 shadow-md shadow-cyan-500/5 font-semibold" 
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 border border-transparent"
              )}
            >
              {/* Active glow bar on left */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-gradient-to-b from-cyan-400 to-indigo-500 rounded-r-full shadow-[0_0_12px_#06b6d4]" />
              )}

              <div className="flex items-center gap-3">
                <item.icon className={cn(
                  "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" : "text-slate-400 group-hover:text-slate-200"
                )} />
                <span className="tracking-wide text-xs font-semibold">{item.name}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <span className={cn("text-[10px] font-mono px-2 py-0.5 rounded-full border", item.badgeColor)}>
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <ChevronRight className="h-4 w-4 text-cyan-400/80" />
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Telemetry & System Status Widget */}
      <div className="px-4 py-3 mx-4 mb-3 rounded-2xl border border-slate-800/80 bg-[#0b1224]/80 backdrop-blur-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300 font-bold">Node Telemetry</span>
          </div>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">99.98%</span>
        </div>
        
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>Neural Sync</span>
            <span className="text-cyan-400">Stable</span>
          </div>
          {/* Animated progress meter */}
          <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-500 rounded-full w-[78%] animate-pulse" />
          </div>
        </div>
      </div>

      {/* User Session Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-[#080d1a]/80">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 p-[1.5px] shadow-md shadow-cyan-500/10">
              <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#090e1f] text-xs font-black text-cyan-300">
                {userInitials}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-[#080d1a]" />
            </div>

            <div className="flex flex-col min-w-0">
              <span className="truncate text-xs font-bold text-white tracking-wide">{userName}</span>
              <div className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-cyan-400" />
                <span className="text-[10px] font-mono font-medium text-slate-400 uppercase">{userRole}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            title="Terminate Session"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
