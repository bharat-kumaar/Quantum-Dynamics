'use client';

import { useEffect, useState } from 'react';
import { 
  Users, 
  Search, 
  Mail, 
  Shield, 
  Briefcase, 
  UserPlus, 
  Loader2, 
  Trash2, 
  X,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { UserService } from '@/services/user.service';
import { User } from '@/types/user';
import { getErrorMessage } from '@/lib/error';

export default function TeamMatrixPage() {
  const [team, setTeam] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    department: 'Core Engineering',
    role: 'Developer'
  });

  const fetchTeam = async () => {
    setIsLoading(true);
    try {
      const response = await UserService.getTeamMembers({ search: searchQuery });
      if (response.success) setTeam(response.data);
    } catch (error) {
      toast.error("Failed to sync with personnel matrix.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (id: string, name: string) => {
    if (!window.confirm(`Revoke clearance and remove operative "${name}" from the matrix?`)) return;
    try {
      await UserService.removeTeamMember(id);
      toast.success(`Clearance revoked for ${name}.`);
      fetchTeam();
    } catch (error) {
      toast.error("Failed to revoke clearance.");
    }
  };

  const handleProvisionMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email || !newMember.role) {
      return toast.error("Full name, email, and clearance role are required.");
    }

    setIsSubmitting(true);
    try {
      await UserService.addTeamMember({
        ...newMember,
        email: newMember.email.trim().toLowerCase(),
        name: newMember.name.trim()
      });
      toast.success(`Clearance credentials provisioned for ${newMember.name}.`);
      setIsModalOpen(false);
      setNewMember({ name: '', email: '', department: 'Core Engineering', role: 'Developer' });
      fetchTeam();
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to provision access.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => fetchTeam(), 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const getRoleBadge = (role?: string) => {
    const r = (role || '').toLowerCase();
    if (r === 'admin') return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    if (r === 'team lead') return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    if (r === 'project manager') return 'bg-violet-500/10 text-violet-400 border-violet-500/30';
    if (r === 'developer') return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-md shadow-cyan-500/10">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Team Neural Matrix</h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Authorized personnel, departmental squads, and cryptographic clearance levels
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <UserPlus className="h-4 w-4" />
          <span>Provision Clearance</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative group max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
        <input 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search personnel by name, role, department..." 
          className="w-full bg-[#090e1e]/80 border border-slate-800 text-slate-200 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
        />
      </div>

      {/* Operatives Grid */}
      {isLoading ? (
        <div className="flex h-[40vh] flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          <p className="text-xs font-mono text-cyan-400/80">Querying Personnel Directory...</p>
        </div>
      ) : team.length === 0 ? (
        <div className="rounded-3xl border border-slate-800/80 bg-[#090e1e]/60 p-12 text-center">
          <Users className="h-10 w-10 text-slate-700 mx-auto mb-3" />
          <p className="font-mono text-xs text-slate-400">No personnel records found for &quot;{searchQuery}&quot;</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {team.map((member) => (
            <div 
              key={member._id} 
              className="glass-panel-interactive rounded-3xl p-6 relative overflow-hidden group flex flex-col justify-between"
            >
              {/* Subtle card glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/10 transition-colors" />

              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 p-[1.5px] shadow-lg shadow-cyan-500/10">
                    <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[#090e1f] text-sm font-black text-cyan-300">
                      {member.name ? member.name.substring(0, 2).toUpperCase() : 'OP'}
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-[#090e1f]" />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-md border ${getRoleBadge(member.role)}`}>
                      {member.role || 'Operative'}
                    </span>
                    <button 
                      onClick={() => handleRemove(member._id, member.name)} 
                      className="h-8 w-8 rounded-lg border border-slate-800 bg-[#060a14] flex items-center justify-center text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-colors" 
                      title="Revoke clearance"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white tracking-wide">{member.name}</h3>
                <p className="text-[11px] font-mono text-cyan-400 mt-0.5">{member.department || 'Operations'}</p>

                <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span className="truncate text-slate-300">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span className="text-emerald-400/90 font-semibold">Active Clearance Node</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Provision Access Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#090e1f] border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <UserPlus className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Provision Clearance</h2>
                  <p className="text-[11px] font-mono text-slate-400">Add Operative to Quantum Matrix</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="h-8 w-8 rounded-lg border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleProvisionMember} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">Full Legal Name</label>
                <input 
                  required
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="e.g. Alex Mercer" 
                  className="w-full h-11 bg-[#060a14] border border-slate-800 rounded-xl px-3.5 text-xs text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">Corporate Email</label>
                <input 
                  required
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  placeholder="alex.mercer@quantumdynamics.com" 
                  className="w-full h-11 bg-[#060a14] border border-slate-800 rounded-xl px-3.5 text-xs text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">Division / Department</label>
                <input 
                  value={newMember.department}
                  onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
                  placeholder="e.g. Core Engineering, Cryptography" 
                  className="w-full h-11 bg-[#060a14] border border-slate-800 rounded-xl px-3.5 text-xs text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">Clearance Level</label>
                <select 
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  className="w-full h-11 bg-[#060a14] border border-slate-800 rounded-xl px-3.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 font-mono"
                >
                  <option value="Developer">Developer - Core Engine Access</option>
                  <option value="Team Lead">Team Lead - Squad Command</option>
                  <option value="Project Manager">Project Manager - Portfolio Oversight</option>
                  <option value="admin">Admin - Full System Root</option>
                  <option value="member">Member - General Read Clearance</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800/80">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-mono text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                      <span>Provisioning...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Authorize Access</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
