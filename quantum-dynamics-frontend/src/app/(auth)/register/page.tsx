import { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Hexagon, ShieldCheck, UserCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Personnel Provisioning • Quantum Dynamics',
  description: 'Enterprise Clearance Provisioning & Clearance Authorization',
};

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#050811] px-4 py-12 sm:px-6 lg:px-8 bg-quantum-grid">
      
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-indigo-600/10 blur-[150px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-cyan-600/10 blur-[140px] animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      <div className="relative z-10 w-full max-w-[480px] animate-in fade-in slide-in-from-bottom-6 duration-700">
        
        {/* Status Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-violet-500/30 bg-[#091122]/90 backdrop-blur-xl text-xs font-mono text-violet-300 shadow-lg shadow-violet-500/10">
            <UserCheck className="h-3.5 w-3.5 text-violet-400" />
            <span className="font-bold tracking-wider">PERSONNEL PROVISIONING</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="relative rounded-3xl border border-slate-700/60 bg-[#090e1f]/85 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-violet-400 to-transparent" />
          
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-600 to-cyan-500 p-[1.5px] shadow-lg shadow-violet-500/20 mb-4">
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[#070b16]">
                <Hexagon className="h-7 w-7 text-violet-400" strokeWidth={2} />
              </div>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Request Clearance
            </h1>
            <p className="mt-1.5 text-xs text-slate-400 font-mono">
              Register corporate profile for Quantum Operations access
            </p>
          </div>

          <RegisterForm />
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-[10px] font-mono text-slate-500 max-w-sm mx-auto flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-cyan-500/70 shrink-0" />
          <span>Zero-Trust Enterprise Access Control strictly enforced.</span>
        </div>
      </div>
    </div>
  );
}
