import { Metadata } from 'next';
import { Hexagon, Shield, Sparkles, Terminal } from 'lucide-react';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Neural Gateway Access • Quantum Dynamics',
  description: 'Quantum Neural Operations & Gateway Authentication Matrix',
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#050811] px-4 py-12 sm:px-6 lg:px-8 bg-quantum-grid">
      
      {/* Dynamic Animated Ambient Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-cyan-600/10 blur-[150px] animate-pulse" style={{ animationDuration: '7s' }} />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-violet-600/10 blur-[140px] animate-pulse" style={{ animationDuration: '9s' }} />
        <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-indigo-600/15 blur-[130px] animate-pulse" style={{ animationDuration: '11s' }} />
      </div>

      {/* Main Glassmorphism Auth Card */}
      <div className="relative z-10 w-full max-w-[460px] animate-in fade-in slide-in-from-bottom-6 duration-700">
        
        {/* Floating System Status Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-500/30 bg-[#091122]/90 backdrop-blur-xl text-xs font-mono text-cyan-300 shadow-lg shadow-cyan-500/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="font-bold tracking-wider">QUANTUM OS v5.2</span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-400 font-semibold">GATEWAY READY</span>
          </div>
        </div>

        {/* Card Shell */}
        <div className="relative rounded-3xl border border-slate-700/60 bg-[#090e1f]/80 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 overflow-hidden">
          {/* Subtle Top Accent Glow Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          
          {/* Header & Logo */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-violet-600 p-[1.5px] shadow-xl shadow-cyan-500/25 mb-4 group">
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[#070b16]">
                <Hexagon className="h-8 w-8 text-cyan-400 transition-transform duration-500 group-hover:scale-110" strokeWidth={2} />
              </div>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Neural Gateway
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 font-mono">
              Authenticate clearance to enter the operations matrix
            </p>
          </div>

          {/* Form */}
          <LoginForm />
          
        </div>

        {/* Bottom Metadata Badges */}
        <div className="mt-6 flex items-center justify-between px-3 text-[10px] font-mono text-slate-500">
          <div className="flex items-center gap-1.5">
            <Shield className="h-3 w-3 text-cyan-500/70" />
            <span>256-BIT QUANTUM CIPHER</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Terminal className="h-3 w-3 text-emerald-500/70" />
            <span>PRIMARY TELEMETRY</span>
          </div>
        </div>
      </div>
    </div>
  );
}
