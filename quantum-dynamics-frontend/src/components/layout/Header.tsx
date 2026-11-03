'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Bell, 
  Loader2, 
  FolderGit2, 
  User as UserIcon, 
  Sparkles, 
  ShieldCheck, 
  Terminal, 
  Command,
  ExternalLink
} from 'lucide-react';
import { DashboardService } from '@/services/dashboard.service';

export function Header() {
  const router = useRouter();
  
  // User State
  const [userName, setUserName] = useState('Bharat Kumar');
  const [userRole, setUserRole] = useState('Admin');

  // Search States
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ projects: any[], users: any[] }>({ projects: [], users: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Notification States
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('qd_user');
        if (raw) {
          const u = JSON.parse(raw);
          if (u?.name) setUserName(u.name);
          if (u?.role) setUserRole(u.role);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (searchRef.current && !searchRef.current.contains(target)) {
        setShowDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(target)) {
        setShowNotifications(false);
      }
    };
    
    if (typeof document !== 'undefined') {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

  // Debounced Search Logic
  useEffect(() => {
    if (!query.trim()) {
      setResults({ projects: [], users: [] });
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await DashboardService.globalSearch(query);
        if (res.success) {
          setResults(res.data);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Fetch Notifications on Open
  const fetchNotifications = async () => {
    setIsLoadingNotes(true);
    try {
      const res = await DashboardService.getNotifications();
      if (res.success) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setIsLoadingNotes(false);
    }
  };

  return (
    <header className="h-20 w-full border-b border-slate-800/80 bg-[#070b14]/80 backdrop-blur-2xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 relative z-30">
      
      {/* Left: System Breadcrumb / Node Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-mono font-medium shadow-sm">
          <Terminal className="h-3.5 w-3.5 text-cyan-400" />
          <span className="hidden sm:inline">NODE //</span>
          <span className="font-bold text-white tracking-wider">QD-ALPHA-01</span>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-500">
          <span>•</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            TELEMETRY ACTIVE
          </span>
        </div>
      </div>

      {/* Middle: Universal Search Bar */}
      <div className="flex-1 max-w-xl relative" ref={searchRef}>
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if (query.trim()) setShowDropdown(true); }}
            placeholder="Search projects, quantum assets, team matrix..."
            className="w-full h-10 pl-10 pr-16 bg-[#0a101f]/70 border border-slate-800 text-xs font-medium text-slate-100 placeholder:text-slate-500 rounded-xl focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
            ) : (
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800/80 border border-slate-700/60 rounded">
                <Command className="h-2.5 w-2.5" /> K
              </kbd>
            )}
          </div>
        </div>

        {/* Global Search Dropdown */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2.5 bg-[#0b1224]/95 border border-slate-700/70 rounded-2xl shadow-2xl backdrop-blur-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {results.projects.length === 0 && results.users.length === 0 ? (
              <div className="p-6 text-center text-xs font-mono text-slate-400">
                No telemetry signatures matched &quot;{query}&quot;
              </div>
            ) : (
              <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-slate-800/60">
                {results.projects.length > 0 && (
                  <div className="p-2 space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 px-2 block mb-1">Projects</span>
                    {results.projects.map((proj: any) => (
                      <button 
                        key={proj._id}
                        onClick={() => { setShowDropdown(false); setQuery(''); router.push(`/projects/${proj._id}`); }}
                        className="w-full text-left flex items-center justify-between px-3 py-2 hover:bg-cyan-500/10 rounded-xl transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:text-cyan-400">
                            <FolderGit2 className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">{proj.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{proj.client || 'Internal Architecture'}</p>
                          </div>
                        </div>
                        <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                )}

                {results.users.length > 0 && (
                  <div className="p-2 space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet-400 px-2 block mb-1">Personnel</span>
                    {results.users.map((user: any) => (
                      <button 
                        key={user._id}
                        onClick={() => { setShowDropdown(false); setQuery(''); router.push(`/team`); }}
                        className="w-full text-left flex items-center justify-between px-3 py-2 hover:bg-violet-500/10 rounded-xl transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400 group-hover:text-violet-300">
                            <UserIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-100 group-hover:text-violet-300 transition-colors">{user.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{user.role} • {user.department}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">Team</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Notification Alerts + Profile */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => {
              const nextState = !showNotifications;
              setShowNotifications(nextState);
              if (nextState) fetchNotifications();
            }}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-[#0a101f] text-slate-400 hover:text-white hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all duration-200"
            title="System Telemetry Alerts"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
          </button>

          {showNotifications && (
            <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-[#0a101f]/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-900/60 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">Neural Transmissions</span>
                </div>
                {!isLoadingNotes && (
                  <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full font-bold">
                    {notifications.length} Alerts
                  </span>
                )}
              </div>

              <div className="max-h-[320px] overflow-y-auto divide-y divide-slate-800/60">
                {isLoadingNotes ? (
                  <div className="p-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-cyan-400" /></div>
                ) : notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs font-mono text-slate-400">All systems operating within nominal limits.</div>
                ) : (
                  notifications.map((note: any) => (
                    <div key={note._id} className="p-4 hover:bg-slate-800/40 transition-colors flex gap-3.5 items-start">
                      <div className={`mt-0.5 h-8 w-8 rounded-xl flex items-center justify-center shrink-0 border ${
                        note.type === 'security' 
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
                          : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                      }`}>
                        <Bell className="h-4 w-4" />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <p className="text-xs font-bold text-slate-100">{note.title}</p>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{note.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Profile Link */}
        <button
          onClick={() => router.push('/settings')}
          className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-xl border border-slate-800 bg-[#0a101f] hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all duration-200"
        >
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white text-[11px] font-black shadow-md shadow-cyan-500/20">
            {userName.substring(0, 2).toUpperCase()}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-200 leading-none">{userName}</span>
            <span className="text-[9px] font-mono text-cyan-400 font-semibold tracking-wider uppercase mt-0.5">{userRole}</span>
          </div>
        </button>
      </div>

    </header>
  );
}
