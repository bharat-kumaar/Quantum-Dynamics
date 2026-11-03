'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Hexagon, ShieldCheck, Loader2, CheckCircle2, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/error';
import { AuthService } from '@/services/auth.service';

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) return toast.error('Access key must be at least 6 characters.');
    if (password !== confirmPassword) return toast.error('Access keys do not match.');

    setIsLoading(true);
    try {
      await AuthService.resetPassword(token, password);
      setIsSuccess(true);
      toast.success('Access key recalibrated successfully.');
      setTimeout(() => router.push('/login'), 2500);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err) || 'Token invalid or expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#050811] px-4 py-12 sm:px-6 lg:px-8 bg-quantum-grid">
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-600/10 blur-[150px] animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-[460px] animate-in fade-in slide-in-from-bottom-6 duration-700">
        
        {/* Status Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-500/30 bg-[#091122]/90 backdrop-blur-xl text-xs font-mono text-cyan-300 shadow-lg shadow-cyan-500/10">
            <KeyRound className="h-3.5 w-3.5 text-cyan-400" />
            <span className="font-bold tracking-wider">CRYPTOGRAPHIC KEY RECALIBRATION</span>
          </div>
        </div>

        {/* Card */}
        <div className="relative rounded-3xl border border-slate-700/60 bg-[#090e1f]/85 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-violet-600 p-[1.5px] shadow-lg shadow-cyan-500/20 mb-4">
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[#070b16]">
                <Hexagon className="h-7 w-7 text-cyan-400" strokeWidth={2} />
              </div>
            </div>
            
            <h1 className="text-2xl font-black tracking-tight text-white">
              Recalibrate Key
            </h1>
            <p className="mt-1.5 text-xs text-slate-400 font-mono">
              Define new cryptographic password for this clearance token
            </p>
          </div>

          {isSuccess ? (
            <div className="text-center space-y-4">
              <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-white">Access Key Updated</h3>
              <p className="text-xs text-slate-400 font-mono">
                Redirecting to Neural Gateway in a few moments...
              </p>
              <Link href="/login" className="text-xs font-mono text-cyan-400 hover:underline block pt-2">
                Click here if not redirected automatically ↵
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="h-3 w-3 text-cyan-400" /> New Access Key
                </label>
                <input 
                  type="password" 
                  required
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 bg-[#060a14] border border-slate-800 text-slate-100 rounded-xl px-3.5 text-xs font-mono focus:border-cyan-400 focus:outline-none" 
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="h-3 w-3 text-cyan-400" /> Confirm New Key
                </label>
                <input 
                  type="password" 
                  required
                  placeholder="Repeat new access key"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-11 bg-[#060a14] border border-slate-800 text-slate-100 rounded-xl px-3.5 text-xs font-mono focus:border-cyan-400 focus:outline-none" 
                  disabled={isLoading}
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Recalibrating...</span>
                  </>
                ) : (
                  <span>Commit New Access Key</span>
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
