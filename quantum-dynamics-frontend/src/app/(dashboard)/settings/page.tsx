'use client';

import { useState } from 'react';
import { 
  Settings, 
  Shield, 
  Bell, 
  Save, 
  Loader2, 
  X, 
  Mail, 
  KeyRound, 
  User, 
  Sparkles,
  CheckCircle2,
  Lock,
  Cpu,
  Fingerprint
} from 'lucide-react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/error';
import { AuthService } from '@/services/auth.service';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role?: string }>(() => {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('qd_user');
        if (raw) return JSON.parse(raw);
      }
    } catch {}
    return { name: 'Bharat Kumar', email: 'bharatkumar70233@gmail.com', role: 'admin' };
  });

  const [formData, setFormData] = useState<{ name: string; password: string }>(() => {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('qd_user');
        if (raw) {
          const parsed = JSON.parse(raw);
          return { name: parsed.name ?? 'Bharat Kumar', password: '' };
        }
      }
    } catch {}
    return { name: 'Bharat Kumar', password: '' };
  });

  // Email OTP Modal State
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isEmailUpdating, setIsEmailUpdating] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const payload: { name: string; password?: string } = { name: formData.name.trim() };
      if (formData.password) payload.password = formData.password;

      await AuthService.updateProfile(payload);
      
      const updatedUser = { ...user, name: formData.name.trim() };
      localStorage.setItem('qd_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast.success('Operator profile parameters committed successfully.');
      setFormData(prev => ({ ...prev, password: '' }));
    } catch (err: unknown) {
      toast.error(getErrorMessage(err) || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return toast.error('Please enter a new corporate email.');
    
    setIsEmailUpdating(true);
    try {
      await AuthService.requestEmailUpdate(newEmail);
      setOtpSent(true);
      toast.success('Verification code transmitted to your new email.');
    } catch (err: unknown) {
      toast.error(getErrorMessage(err) || 'Failed to send verification code.');
    } finally {
      setIsEmailUpdating(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return toast.error('Please enter the verification code.');
    
    setIsEmailUpdating(true);
    try {
      await AuthService.verifyEmailUpdate(newEmail, otp);
      
      const updatedUser = { ...user, email: newEmail.trim().toLowerCase() };
      localStorage.setItem('qd_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast.success('Corporate email successfully recalibrated.');
      setShowEmailModal(false);
      setOtpSent(false);
      setNewEmail('');
      setOtp('');
    } catch (err: unknown) {
      toast.error(getErrorMessage(err) || 'Invalid or expired code.');
    } finally {
      setIsEmailUpdating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl relative">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-md shadow-cyan-500/10">
          <Settings className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">System Settings & Node Security</h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Operator profile configuration, cryptographic credentials, and notification relays
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        
        {/* Profile Identity Card */}
        <section className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800/80">
            <div className="flex items-center gap-4">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 p-[1.5px] shadow-lg shadow-cyan-500/15">
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[#090e1f] text-lg font-black text-cyan-300">
                  {user.name.substring(0, 2).toUpperCase() || 'BK'}
                </div>
                <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-[#090e1f]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{user.name}</span>
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-mono font-bold uppercase">
                    {user.role || 'Admin'}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{user.email}</p>
              </div>
            </div>

            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 self-start sm:self-center">
              <CheckCircle2 className="h-4 w-4" /> CLEARANCE ROOT
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <User className="h-3 w-3 text-cyan-400" /> Operator Legal Name
              </label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full h-11 bg-[#060a14] border border-slate-800 text-slate-100 rounded-xl px-3.5 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-xs font-medium focus:outline-none transition-all" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="h-3 w-3 text-cyan-400" /> New Access Key
              </label>
              <input 
                type="password" 
                placeholder="Leave blank to maintain current"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full h-11 bg-[#060a14] border border-slate-800 text-slate-100 placeholder:text-slate-600 rounded-xl px-3.5 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-xs font-mono focus:outline-none transition-all" 
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="h-3 w-3 text-cyan-400" /> Corporate Communication Address
                </label>
                <button 
                  onClick={() => setShowEmailModal(true)}
                  className="text-[10px] font-mono font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-wider hover:underline"
                >
                  Recalibrate Address ↵
                </button>
              </div>
              <input 
                type="email" 
                value={user.email}
                disabled
                className="w-full h-11 bg-[#060a14]/60 border border-slate-800 text-slate-400 font-mono rounded-xl px-3.5 text-xs cursor-not-allowed opacity-80" 
              />
            </div>
          </div>
        </section>

        {/* Security & Notification Controls */}
        <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800/80 space-y-5">
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Shield className="h-4 w-4 text-cyan-400" /> Cryptographic Telemetry Settings
          </h3>

          <div className="divide-y divide-slate-800/80">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Fingerprint className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Quantum 2FA Authentication</h4>
                  <p className="text-[11px] font-mono text-slate-400">Require one-time cryptographic handshake on terminal access.</p>
                </div>
              </div>
              <input type="checkbox" className="h-5 w-5 rounded border-slate-700 bg-slate-900 accent-cyan-500 cursor-pointer" defaultChecked />
            </div>

            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Bell className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Critical Incident Transmissions</h4>
                  <p className="text-[11px] font-mono text-slate-400">Receive immediate priority telemetry for pipeline or node drops.</p>
                </div>
              </div>
              <input type="checkbox" className="h-5 w-5 rounded border-slate-700 bg-slate-900 accent-cyan-500 cursor-pointer" defaultChecked />
            </div>
          </div>
        </section>

        {/* Save Changes Button */}
        <div className="flex justify-end pt-2">
          <button 
            onClick={handleSave} 
            disabled={isLoading}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : <Save className="h-4 w-4" />}
            <span>Commit Profile Changes</span>
          </button>
        </div>

      </div>

      {/* Recalibrate Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#090e1f] border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Recalibrate Email</h2>
                  <p className="text-[11px] font-mono text-slate-400">Security Verification Protocol</p>
                </div>
              </div>
              <button 
                onClick={() => { setShowEmailModal(false); setOtpSent(false); }} 
                className="h-8 w-8 rounded-lg border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {!otpSent ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">New Corporate Email</label>
                  <input 
                    required
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="new.email@quantumdynamics.com" 
                    className="w-full h-11 bg-[#060a14] border border-slate-800 rounded-xl px-3.5 text-xs text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 font-medium" 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isEmailUpdating}
                  className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  {isEmailUpdating ? 'Transmitting Code...' : 'Send Verification OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">Verification Security Code</label>
                  <input 
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="e.g. 4892" 
                    className="w-full h-11 bg-[#060a14] border border-slate-800 rounded-xl px-3.5 text-xs text-white text-center font-mono tracking-widest text-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20" 
                  />
                  <p className="text-[10px] font-mono text-slate-500 text-center mt-1">Check server console or mailbox for 4-digit code.</p>
                </div>
                <button 
                  type="submit" 
                  disabled={isEmailUpdating}
                  className="w-full bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  {isEmailUpdating ? 'Verifying...' : 'Authenticate & Update'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
