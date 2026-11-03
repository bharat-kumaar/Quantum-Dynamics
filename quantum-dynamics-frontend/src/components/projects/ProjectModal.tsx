'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, FolderPlus, Pencil, Sparkles, Building, Calendar, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/error';
import { ProjectService } from '@/services/project.service';
import { Project } from '@/types/project';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Project | null;
}

export function ProjectModal({ isOpen, onClose, onSuccess, initialData }: ProjectModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    client: '',
    description: '',
    status: 'PLANNING',
    dueDate: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        client: initialData.client || '',
        description: initialData.description || '',
        status: initialData.status || 'PLANNING',
        dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({ name: '', client: '', description: '', status: 'PLANNING', dueDate: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (initialData && initialData._id) {
        await ProjectService.updateProject(initialData._id, formData);
        toast.success(`Project "${formData.name}" updated successfully.`);
      } else {
        await ProjectService.createProject(formData);
        toast.success(`Project "${formData.name}" deployed to registry.`);
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err) || 'Operation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl border border-slate-700/80 bg-[#090e1f] shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 px-6 py-5 bg-[#060a14]/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {initialData ? <Pencil className="h-4 w-4" /> : <FolderPlus className="h-4 w-4" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                {initialData ? 'Modify Project Initiative' : 'Initialize New Project'}
              </h2>
              <p className="text-[11px] font-mono text-slate-400">Quantum Repository Provisioning</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="h-8 w-8 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">Project Title</label>
            <input 
              required 
              type="text" 
              placeholder="e.g. Neural Mesh v4.0"
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              className="w-full h-11 bg-[#060a14] border border-slate-800 text-slate-100 rounded-xl px-3.5 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-xs font-medium focus:outline-none transition-all" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="h-3 w-3 text-cyan-400" /> Client / Division
              </label>
              <input 
                required 
                type="text" 
                placeholder="e.g. Quantum Dynamics Labs"
                value={formData.client} 
                onChange={(e) => setFormData({ ...formData, client: e.target.value })} 
                className="w-full h-11 bg-[#060a14] border border-slate-800 text-slate-100 rounded-xl px-3.5 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-xs font-medium focus:outline-none transition-all" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="h-3 w-3 text-cyan-400" /> Target Due Date
              </label>
              <input 
                type="date" 
                value={formData.dueDate} 
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} 
                className="w-full h-11 bg-[#060a14] border border-slate-800 text-slate-100 rounded-xl px-3.5 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-xs font-mono focus:outline-none transition-all" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">Deployment Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full h-11 bg-[#060a14] border border-slate-800 text-slate-100 rounded-xl px-3.5 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-xs font-mono focus:outline-none transition-all"
            >
              <option value="PLANNING">PLANNING - Architecture Phase</option>
              <option value="IN PROGRESS">IN PROGRESS - Active Sprints</option>
              <option value="COMPLETED">COMPLETED - Production Deployed</option>
              <option value="ON HOLD">ON HOLD - Pending Clearance</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="h-3 w-3 text-cyan-400" /> Architecture Briefing
            </label>
            <textarea 
              rows={3}
              placeholder="Technical objectives, infrastructure specifications, and deliverable metrics..."
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              className="w-full bg-[#060a14] border border-slate-800 text-slate-100 rounded-xl p-3 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-xs font-medium focus:outline-none transition-all resize-none" 
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800/80">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2.5 rounded-xl border border-slate-800 bg-[#060a14] text-xs font-mono text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading} 
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Committing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>{initialData ? 'Save Changes' : 'Initialize Repository'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
