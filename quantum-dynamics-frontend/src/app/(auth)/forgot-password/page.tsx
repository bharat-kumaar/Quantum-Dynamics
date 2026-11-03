'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Hexagon, Mail, Loader2, ArrowLeft, ShieldAlert, CheckCircle2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/error';
import { AuthService } from '@/services/auth.service';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your corporate email.');

    setIsLoading(true);
    try {
      await AuthService.forgotPassword(email.trim());
      setIsSent(true);
      toast.success('Recovery protocol initiated.');
    } catch (err: unknown) {
      toast.error(getErrorMessage(err) || 'Failed to initiate recovery.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#050811] px-4 py-12 sm:px-6 lg:px-8 bg-quantum-grid">
      
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-600/10 blur-[150px] animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-[460px] animate-in fade-in slide-in-from-bottom-6 duration-700">
        
        {/* Status Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-amber-500/30 bg-[#091122]/90 backdrop-blur-xl text-xs font-mono text-amber-300 shadow-lg shadow-amber-500/10">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-bold tracking-wider">CLEARANCE RECOVERY PROTOCOL</span>
          </div>
        </div>

        {/* Card */}
        <div className="relative rounded-3xl border border-slate-700/60 bg-[#090e1f]/85 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 via-indigo-600 to-cyan-500 p-[1.5px] shadow-lg shadow-amber-500/20 mb-4">
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[#070b16]">
                <Hexagon className="h-7 w-7 text-amber-400" strokeWidth={2} />
              </div>
            </div>
            
            <h1 className="text-2xl font-black tracking-tight text-white">
              Access Key Recovery
            </h1>
            <p className="mt-1.5 text-xs text-slate-400 font-mono">
              Provide corporate address to receive one-time cryptographic reset token
            </p>
          </div>

          {isSent ? (
            <div className="text-center space-y-5">
              <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Reset Transmission Dispatched</h3>
                <p className="text-xs text-slate-400 font-mono leading-relaxed">
                  If the identity <strong>{email}</strong> exists in the directory, a secure recovery URL has been initiated. Check server console for dev fallback link.
                </p>
              </div>
              <Link 
                href="/login" 
                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 hover:underline pt-2"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Return to Gateway
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="h-3 w-3 text-cyan-400" /> Registered Email Address
                </label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. bharatkumar70233@gmail.com" 
                  className="w-full h-11 bg-[#060a14] border border-slate-800 text-slate-100 rounded-xl px-3.5 text-xs font-medium focus:border-cyan-400 focus:outline-none" 
                  disabled={isLoading}
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-amber-500 via-indigo-600 to-cyan-500 hover:from-amber-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Initiating Protocol...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Send Reset Transmission</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors">
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Terminal Login
                </Link>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
