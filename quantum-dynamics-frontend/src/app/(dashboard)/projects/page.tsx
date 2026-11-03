'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  FolderGit2, 
  Plus, 
  Search, 
  Loader2,
  Trash2,
  Pencil,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  Calendar,
  Building,
  UserCheck,
  ExternalLink,
  Layers,
  Sparkles,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import { ProjectService } from '@/services/project.service';
import { Project } from '@/types/project';
import { ProjectModal } from '@/components/projects/ProjectModal';

const ITEMS_PER_PAGE = 6;

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProjects = async (search?: string) => {
    setIsLoading(true);
    try {
      const response = await ProjectService.getProjects({ search, limit: 100 });
      if (response.success) {
        setProjects(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch projects:", error);
      toast.error('Failed to load project repositories.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to terminate project "${name}"? This operation is irreversible.`)) return;
    
    try {
      await ProjectService.deleteProject(id);
      toast.success(`Project "${name}" decommissioned successfully.`);
      fetchProjects(searchQuery); 
    } catch (error) {
      toast.error('Failed to terminate project.');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProjects(searchQuery);
      setCurrentPage(1);
    }, 350);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (!statusFilter) return true;
      return (p.status || '').toUpperCase() === statusFilter.toUpperCase();
    });
  }, [projects, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProjects = filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getStatusBadge = (status?: string) => {
    const s = (status || '').toUpperCase();
    if (s === 'COMPLETED') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (s === 'IN PROGRESS') return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    if (s === 'PLANNING') return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    if (s === 'ON HOLD') return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      
      {/* 1. TOP HEADER & HUD STATUS */}
      <div className="relative rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-[#060b19] via-[#09112a] to-[#060b19] p-6 sm:p-7 shadow-2xl overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-laser-beam" />
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-600/20 border border-cyan-500/40 text-cyan-300 shadow-xl shadow-cyan-500/15 shrink-0 animate-holo-float">
              <FolderGit2 className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Project Repositories
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[10px] font-mono font-bold text-cyan-300 uppercase">
                  <ShieldCheck className="h-3 w-3" /> ACTIVE DEPLOYMENTS
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Active telemetric database clusters, pipelines, and enterprise initiatives
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchProjects(searchQuery)}
              disabled={isLoading}
              className="h-10 w-10 rounded-xl border border-slate-800 bg-[#060a14] hover:bg-slate-800/60 text-slate-400 hover:text-cyan-300 flex items-center justify-center transition-all cursor-pointer"
              title="Reload Repositories"
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin text-cyan-400")} />
            </button>

            <button 
              onClick={() => { setEditingProject(null); setIsModalOpen(true); }}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-400 via-cyan-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-xl shadow-cyan-500/25 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Initialize Project</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SEARCH & STATUS FILTER */}
      <div className="flex flex-col sm:flex-row gap-3 p-3 rounded-2xl border border-slate-800/80 bg-[#070c1a]/80 backdrop-blur-xl shadow-lg">
        <div className="relative flex-1 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title, client, or architecture..." 
            className="w-full bg-[#040713] border border-slate-800 text-slate-200 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
          />
        </div>

        <div className="flex gap-2.5">
          <select 
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="bg-[#040713] border border-slate-800 text-slate-300 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500/60 transition-all font-mono cursor-pointer"
          >
            <option value="">Status: All Portfolios</option>
            <option value="PLANNING">Planning</option>
            <option value="IN PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="ON HOLD">On Hold</option>
          </select>

          {statusFilter && (
            <button 
              onClick={() => setStatusFilter('')} 
              className="text-xs text-cyan-400 font-mono px-3 py-1.5 rounded-xl border border-cyan-500/20 bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* 3. PROJECT MATRIX TABLE */}
      <div className="rounded-3xl border border-slate-800/80 bg-[#070c1a] backdrop-blur-2xl overflow-hidden shadow-2xl flex flex-col relative">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-[#040713] border-b border-slate-800/80 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              <tr>
                <th className="px-6 py-4">Project Entity</th>
                <th className="px-6 py-4">Client / Node</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Lead Architect</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mx-auto" />
                    <p className="text-xs font-mono text-cyan-400/80 mt-2">Querying Repository Registry...</p>
                  </td>
                </tr>
              ) : currentProjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-500">
                    <FolderGit2 className="h-10 w-10 text-slate-700 mx-auto mb-3 animate-holo-float" />
                    <p className="font-mono text-xs">No project telemetry matches your search parameters.</p>
                  </td>
                </tr>
              ) : (
                currentProjects.map((project) => (
                  <tr key={project._id} className="hover:bg-cyan-500/[0.04] transition-colors group">
                    <td className="px-6 py-4">
                      <Link 
                        href={`/projects/${project._id}`} 
                        className="font-bold text-white hover:text-cyan-300 transition-colors flex items-center gap-2 group-hover:translate-x-1 duration-200"
                      >
                        <span>{project.name}</span>
                        <ExternalLink className="h-3.5 w-3.5 text-slate-600 group-hover:text-cyan-400 transition-colors opacity-0 group-hover:opacity-100" />
                      </Link>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                        ID: {project._id.substring(0, 8)} • {project.description?.slice(0, 48) || 'No telemetry briefing'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-300 font-mono">
                        <Building className="h-3.5 w-3.5 text-slate-500" />
                        <span>{project.client || 'Internal Operations'}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={cn("px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-md border inline-flex items-center gap-1", getStatusBadge(project.status))}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                        {project.status || 'PLANNING'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-400 font-mono">
                        <Calendar className="h-3.5 w-3.5 text-slate-500" />
                        <span>
                          {project.dueDate 
                            ? new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
                            : 'TBD'}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-[10px] font-black text-cyan-300">
                          {project.createdBy?.name?.substring(0, 2).toUpperCase() || 'AD'}
                        </div>
                        <span className="text-xs font-semibold text-slate-200 font-mono">
                          {project.createdBy?.name || 'Administrator'}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(project)} 
                          title="Modify Project"
                          className="h-8 w-8 rounded-lg border border-slate-800 bg-[#040713] flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-colors cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(project._id, project.name)} 
                          title="Decommission Project"
                          className="h-8 w-8 rounded-lg border border-slate-800 bg-[#040713] flex items-center justify-center text-slate-400 hover:text-rose-400 hover:border-rose-500/40 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 4. PAGINATION FOOTER */}
        {!isLoading && filteredProjects.length > 0 && (
          <div className="border-t border-slate-800/80 bg-[#040713] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[11px] font-mono text-slate-500">
              Showing <span className="text-white font-bold">{startIndex + 1}</span> to <span className="text-white font-bold">{Math.min(startIndex + ITEMS_PER_PAGE, filteredProjects.length)}</span> of <span className="text-cyan-400 font-bold">{filteredProjects.length}</span> recorded repositories
            </div>
            
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setCurrentPage(1)} 
                disabled={currentPage === 1}
                className="h-8 w-8 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-500/40 hover:bg-cyan-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center cursor-pointer"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                disabled={currentPage === 1}
                className="h-8 w-8 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-500/40 hover:bg-cyan-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <div className="flex items-center gap-1 px-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={cn(
                      "h-8 w-8 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer",
                      currentPage === i + 1 
                        ? "bg-gradient-to-r from-cyan-400 to-indigo-600 text-slate-950 shadow-md shadow-cyan-500/20" 
                        : "border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                disabled={currentPage === totalPages}
                className="h-8 w-8 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-500/40 hover:bg-cyan-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setCurrentPage(totalPages)} 
                disabled={currentPage === totalPages}
                className="h-8 w-8 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-500/40 hover:bg-cyan-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center cursor-pointer"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Project Modal */}
      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingProject(null); }} 
        onSuccess={() => { fetchProjects(searchQuery); setEditingProject(null); }}
        initialData={editingProject}
      />
    </div>
  );
}
