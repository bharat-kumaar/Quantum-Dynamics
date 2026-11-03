'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, FolderGit2, Users, Paperclip, 
  Loader2, Calendar, UserCheck, CheckCircle2, 
  UploadCloud, Download, FileText, FileImage, Film, Archive, Target, Plus,
  Sparkles, ExternalLink, ShieldCheck, Building, Clock, Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

import { ProjectService } from '@/services/project.service';
import { MediaService } from '@/services/media.service';
import { Project, UserRef } from '@/types/project';
import { MediaAsset } from '@/types/media';
import { getErrorMessage } from '@/lib/error';
import { MediaPreviewModal } from '@/components/media/MediaPreviewModal';

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);
  
  // Tabs state
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'team' | 'files'>('overview');
  const [isUploading, setIsUploading] = useState(false);
  
  // Milestone state
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ title: '', status: 'Pending', dueDate: '' });
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProjectDetails = async () => {
    setIsLoading(true);
    try {
      const response = await ProjectService.getProjectById(projectId);
      setProject(response.data);
      
      const mediaAssets = await MediaService.getAssets({ projectId });
      setMedia(mediaAssets || []);
    } catch (error) {
      toast.error('Failed to load project details.');
      router.push('/projects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!projectId) return;
    fetchProjectDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const handleFileUpload = async (e: any) => {
    const files = e.target?.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    setIsUploading(true);
    try {
      await MediaService.uploadAsset(file, projectId);
      toast.success(`Attached "${file.name}" to project repository.`);
      fetchProjectDetails();
    } catch (err: any) {
      toast.error(getErrorMessage(err) || 'Failed to attach file.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestone.title || !newMilestone.dueDate) return toast.error("Title and Due Date required.");

    setIsAddingMilestone(true);
    try {
      await ProjectService.addMilestone(projectId, newMilestone);
      toast.success("Milestone recorded in operational timeline.");
      setShowMilestoneForm(false);
      setNewMilestone({ title: '', status: 'Pending', dueDate: '' });
      fetchProjectDetails();
    } catch (error) {
      toast.error("Failed to add milestone.");
    } finally {
      setIsAddingMilestone(false);
    }
  };

  const getFileIcon = (mimetype?: string) => {
    const safeMime = (mimetype || '').toLowerCase();
    if (safeMime.includes('image')) return <FileImage className="h-8 w-8 text-cyan-400 opacity-70" />;
    if (safeMime.includes('video')) return <Film className="h-8 w-8 text-violet-400 opacity-70" />;
    if (safeMime.includes('zip') || safeMime.includes('compressed')) return <Archive className="h-8 w-8 text-amber-400 opacity-70" />;
    return <FileText className="h-8 w-8 text-indigo-400 opacity-70" />;
  };

  if (isLoading) {
    return (
      <div className="flex h-[65vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        <p className="text-xs font-mono text-cyan-400/80">Querying Project Cluster...</p>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto">
      
      {/* Back button */}
      <button 
        onClick={() => router.push('/projects')} 
        className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        <span>Return to Project Registry</span>
      </button>

      {/* Project Hero Header */}
      <div className="rounded-3xl border border-slate-800/80 bg-gradient-to-r from-[#0c152e]/90 via-[#090e1f]/90 to-[#120f2e]/90 p-6 sm:p-8 backdrop-blur-2xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 shadow-md">
                <FolderGit2 className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">{project.name}</h1>
                <p className="text-[10px] font-mono text-slate-500">ID: {project._id}</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-mono leading-relaxed pl-14">
              {project.description || 'No detailed architecture brief provided.'}
            </p>
          </div>
          
          <div className="flex items-center gap-3 self-start md:self-center">
            <div className="text-right">
              <span className={cn(
                "px-3.5 py-1 text-xs font-mono font-bold uppercase rounded-md border",
                project.status === 'COMPLETED' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : 
                project.status === 'IN PROGRESS' ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" :
                "bg-slate-500/10 text-slate-400 border-slate-500/30"
              )}>
                {project.status || 'PLANNING'}
              </span>
              <p className="text-[10px] font-mono text-slate-500 mt-1.5">{project.client || 'Internal Operations'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-800/80 gap-1 overflow-x-auto">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'milestones', label: 'Milestones & Sprints' },
          { key: 'team', label: 'Assigned Operatives' },
          { key: 'files', label: 'Vault Documents' },
        ].map((tab) => (
          <button 
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)} 
            className={cn(
              "px-5 py-3 text-xs font-mono font-semibold transition-all border-b-2 whitespace-nowrap", 
              activeTab === tab.key 
                ? "border-cyan-400 text-cyan-400 bg-cyan-500/5 font-bold" 
                : "border-transparent text-slate-400 hover:text-slate-200"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="pt-2 pb-12">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel rounded-3xl p-6 border border-slate-800/80 space-y-5">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Building className="h-4 w-4 text-cyan-400" /> Infrastructure Specifications
              </h3>
              <div className="divide-y divide-slate-800/60 font-mono text-xs">
                <div className="flex justify-between py-3">
                  <span className="text-slate-500">Client / Org:</span>
                  <span className="font-bold text-slate-200">{project.client}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-slate-500">Target Delivery:</span>
                  <span className="font-bold text-cyan-400">
                    {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'TBD'}
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-slate-500">Team Lead:</span>
                  <span className="font-bold text-slate-200">{project.teamLead || 'Bharat Kumar'}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-slate-500">Telemetry Status:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                    ONLINE
                  </span>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-3xl p-6 border border-slate-800/80 space-y-4">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Target className="h-4 w-4 text-violet-400" /> Milestone Velocity
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Tracked against defined sprints and deliverable artifacts.
              </p>
              <div className="p-4 rounded-2xl bg-[#060a14] border border-slate-800">
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-slate-400">Completion Velocity</span>
                  <span className="text-cyan-400 font-bold">
                    {project.milestones && project.milestones.length > 0 
                      ? `${Math.round((project.milestones.filter(m => m.status === 'Completed').length / project.milestones.length) * 100)}%` 
                      : '0%'}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full transition-all duration-700" 
                    style={{
                      width: project.milestones && project.milestones.length > 0
                        ? `${(project.milestones.filter(m => m.status === 'Completed').length / project.milestones.length) * 100}%`
                        : '0%'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MILESTONES TAB */}
        {activeTab === 'milestones' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-[#090e1e]/80 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-xl">
              <div>
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Target className="h-4 w-4 text-cyan-400" /> Operational Milestones
                </h3>
                <p className="text-[11px] font-mono text-slate-400 mt-0.5">Track key architectural phases</p>
              </div>
              <button 
                onClick={() => setShowMilestoneForm(!showMilestoneForm)} 
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Milestone</span>
              </button>
            </div>

            {/* Add Milestone Form */}
            {showMilestoneForm && (
              <form onSubmit={handleAddMilestone} className="glass-panel p-6 rounded-3xl border border-slate-700/80 space-y-4 animate-in slide-in-from-top-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">Milestone Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Core Engine Deployment"
                      value={newMilestone.title}
                      onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                      className="w-full h-10 bg-[#060a14] border border-slate-800 text-slate-200 text-xs rounded-xl px-3 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">Target Due Date</label>
                    <input 
                      type="date" 
                      required 
                      value={newMilestone.dueDate} 
                      onChange={(e) => setNewMilestone({...newMilestone, dueDate: e.target.value})} 
                      className="w-full h-10 bg-[#060a14] border border-slate-800 text-slate-200 text-xs rounded-xl px-3 focus:border-cyan-400 focus:outline-none font-mono" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">Status</label>
                    <select 
                      value={newMilestone.status} 
                      onChange={(e) => setNewMilestone({...newMilestone, status: e.target.value})} 
                      className="w-full h-10 bg-[#060a14] border border-slate-800 text-slate-200 text-xs rounded-xl px-3 focus:border-cyan-400 focus:outline-none font-mono"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowMilestoneForm(false)} className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white transition-colors">Cancel</button>
                  <button type="submit" disabled={isAddingMilestone} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2">
                    {isAddingMilestone ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Record Milestone'}
                  </button>
                </div>
              </form>
            )}

            {/* Milestones List */}
            {(!project.milestones || project.milestones.length === 0) ? (
              <div className="text-center py-16 border border-dashed border-slate-800 rounded-3xl bg-[#090e1e]/40 p-8">
                <Target className="h-10 w-10 text-slate-700 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-300">No Milestones Recorded</h3>
                <p className="text-xs text-slate-500 font-mono mt-1">Initialize the first delivery sprint above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {project.milestones.map((m: any, idx: number) => (
                  <div key={idx} className="glass-panel-interactive rounded-2xl p-4 flex items-center justify-between border border-slate-800/80">
                    <div className="flex items-center gap-3.5">
                      <div className={cn(
                        "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border",
                        m.status === 'Completed' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                        m.status === 'In Progress' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' :
                        'bg-slate-800/60 border-slate-700 text-slate-500'
                      )}>
                        {m.status === 'Completed' ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{m.title}</h4>
                        <p className="text-[10px] font-mono text-slate-400">Target: {new Date(m.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={cn(
                      "px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded-md border",
                      m.status === 'Completed' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
                      m.status === 'In Progress' ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" : 
                      "bg-slate-500/10 text-slate-400 border-slate-500/20"
                    )}>
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TEAM TAB */}
        {activeTab === 'team' && (
          <div className="glass-panel rounded-3xl p-6 border border-slate-800/80 space-y-5">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="h-4 w-4 text-cyan-400" /> Assigned Personnel Matrix
            </h3>

            {(!project.team || project.team.length === 0) ? (
              <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-[#060a14] p-6 text-slate-500 text-xs font-mono">
                No operatives assigned to this project cluster.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.team.map((member: UserRef) => (
                  <div key={member._id} className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#060a14] border border-slate-800">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-300 text-xs">
                      {member.name ? member.name.substring(0, 2).toUpperCase() : 'OP'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{member.name}</p>
                      <p className="text-[10px] font-mono text-cyan-400">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FILES TAB */}
        {activeTab === 'files' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-[#090e1e]/80 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-xl">
              <div>
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Project Documents & Assets</h3>
                <p className="text-[11px] font-mono text-slate-400 mt-0.5">Encrypted artifacts associated with this initiative</p>
              </div>
              <label className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer">
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                <span>{isUploading ? 'Uploading...' : 'Attach File'}</span>
                <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} disabled={isUploading} />
              </label>
            </div>

            {media.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-slate-800 rounded-3xl bg-[#090e1e]/40 p-8">
                <Paperclip className="h-10 w-10 text-slate-700 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-300">No Attachments</h3>
                <p className="text-xs font-mono text-slate-500 mt-1">Upload relevant schematics, blueprints, or documents.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {media.map((asset: MediaAsset) => (
                  <div 
                    key={asset._id} 
                    onClick={() => setPreviewAsset(asset)}
                    className="glass-panel-interactive rounded-2xl overflow-hidden flex flex-col border border-slate-800/80 group cursor-pointer hover:border-cyan-500/50 hover:shadow-cyan-500/10 transition-all duration-200"
                  >
                    <div className="h-28 bg-[#060a14] flex items-center justify-center relative">
                      {getFileIcon(asset.mimetype)}
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-[#050811]/85 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewAsset(asset);
                          }}
                          className="h-8 px-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] flex items-center gap-1 shadow-md shadow-cyan-500/20"
                          title="View on screen"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>View</span>
                        </button>
                        <a 
                          href={MediaService.getFileUrl(asset.filename)} 
                          download={asset.originalName}
                          onClick={(e) => e.stopPropagation()} 
                          className="h-8 w-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center transition-colors"
                          title="Direct download"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                    <div className="p-3 bg-[#080d1b] group-hover:bg-[#0a1124] transition-colors">
                      <p className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors truncate" title={asset.originalName}>{asset.originalName}</p>
                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 mt-1">
                        <span>{asset.size ? (asset.size / 1024 / 1024).toFixed(2) : '0.00'} MB</span>
                        <span className="text-cyan-400 font-bold flex items-center gap-0.5">
                          <Eye className="h-2.5 w-2.5" /> View
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* In-App Media Preview Modal */}
      <MediaPreviewModal 
        asset={previewAsset} 
        isOpen={!!previewAsset} 
        onClose={() => setPreviewAsset(null)} 
      />
    </div>
  );
}
