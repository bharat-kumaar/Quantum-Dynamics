'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { 
  FileImage, FileText, Film, Archive, 
  UploadCloud, Search, Loader2, X, Download, Trash2, Filter,
  FolderOpen, Sparkles, HardDrive, CheckCircle2, Copy, Eye, Maximize2,
  ShieldCheck, RefreshCw, Cpu, Database, ChevronRight, Activity
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { getErrorMessage } from '@/lib/error';

import { MediaService } from '@/services/media.service';
import { MediaAsset } from '@/types/media';
import { MediaPreviewModal } from '@/components/media/MediaPreviewModal';

const getExtension = (mimetype?: string, filename?: string) => {
  if (filename && filename.includes('.')) {
    return filename.split('.').pop()?.toUpperCase() || 'FILE';
  }
  if (mimetype) {
    const parts = mimetype.split('/');
    return (parts[1] || parts[0]).toUpperCase();
  }
  return 'FILE';
};

// Fast progressive image component with skeleton shimmer and graceful fallback
function CyberImageThumbnail({ 
  src, 
  alt, 
  fallbackIcon 
}: { 
  src: string; 
  alt: string; 
  fallbackIcon: React.ReactNode 
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#040711]">
      {/* Skeleton Shimmer shown while high-res image buffers */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 skeleton-shimmer z-0 flex items-center justify-center">
          <div className="h-6 w-6 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
        </div>
      )}

      {hasError ? (
        <div className="flex flex-col items-center justify-center p-4 text-center z-10">
          {fallbackIcon}
          <span className="text-[10px] font-mono text-slate-500 mt-1 uppercase">Stream Ready</span>
        </div>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
          className={cn(
            "w-full h-full object-cover transition-all duration-500 group-hover:scale-105",
            isLoaded ? "opacity-85 group-hover:opacity-100" : "opacity-0"
          )}
        />
      )}
    </div>
  );
}

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'image' | 'video' | 'document' | 'archive'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      // Fetch all assets once for ultra-fast, zero-lag instantaneous client-side tab switching
      const data = await MediaService.getAssets();
      setAssets(data || []);
    } catch (error) {
      toast.error('Failed to load media vault.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleFileUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      await MediaService.uploadAsset(file);
      toast.success(`Asset "${file.name}" stored in encrypted vault.`);
      await fetchAssets();
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(getErrorMessage(err) || 'Upload failed.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Permanently purge "${name}" from storage vault?`)) return;
    
    try {
      await MediaService.deleteAsset(id);
      toast.success('Asset purged successfully.');
      setAssets(prev => prev.filter(a => a._id !== id));
      if (previewAsset?._id === id) setPreviewAsset(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete asset.');
    }
  };

  const getFileIcon = (mimetype?: string) => {
    const safeMime = (mimetype || '').toLowerCase();
    if (safeMime.includes('image')) return <FileImage className="h-9 w-9 text-cyan-400 opacity-80" />;
    if (safeMime.includes('video')) return <Film className="h-9 w-9 text-violet-400 opacity-80" />;
    if (safeMime.includes('zip') || safeMime.includes('compressed')) return <Archive className="h-9 w-9 text-amber-400 opacity-80" />;
    return <FileText className="h-9 w-9 text-indigo-400 opacity-80" />;
  };

  // Instant category count indicators
  const categoryCounts = useMemo(() => {
    let images = 0, videos = 0, documents = 0, archives = 0;
    assets.forEach(a => {
      const mime = (a.mimetype || '').toLowerCase();
      if (mime.includes('image')) images++;
      else if (mime.includes('video')) videos++;
      else if (mime.includes('pdf') || mime.includes('document') || mime.includes('text')) documents++;
      else if (mime.includes('zip') || mime.includes('compressed')) archives++;
    });
    return {
      all: assets.length,
      image: images,
      video: videos,
      document: documents,
      archive: archives
    };
  }, [assets]);

  // Instant zero-lag filtered list
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchesSearch = (asset.originalName || '').toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (activeCategory === 'all') return true;
      const mime = (asset.mimetype || '').toLowerCase();
      if (activeCategory === 'image') return mime.includes('image');
      if (activeCategory === 'video') return mime.includes('video');
      if (activeCategory === 'document') return mime.includes('pdf') || mime.includes('document') || mime.includes('text');
      if (activeCategory === 'archive') return mime.includes('zip') || mime.includes('compressed');
      return true;
    });
  }, [assets, searchQuery, activeCategory]);

  const totalVaultSizeMB = useMemo(() => {
    const totalBytes = assets.reduce((sum, item) => sum + (item.size || 0), 0);
    return (totalBytes / (1024 * 1024)).toFixed(1);
  }, [assets]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
      
      {/* 1. FUTURISTIC COMMAND HUD BANNER */}
      <div className="relative rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-[#060b19] via-[#09112a] to-[#060b19] p-6 sm:p-7 shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Subtle Cyber Grid Glow */}
        <div className="absolute inset-0 bg-quantum-grid opacity-30 pointer-events-none" />
        
        {/* Running Neon Top Laser */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-laser-beam" />
        
        {/* Ambient Corner Radial */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative p-3.5 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-600/20 border border-cyan-500/40 text-cyan-300 shadow-xl shadow-cyan-500/15 shrink-0 animate-holo-float">
              <FolderOpen className="h-7 w-7" />
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-cyan-400 animate-ping" />
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-cyan-400" />
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Quantum Media Vault
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-wider">
                  <ShieldCheck className="h-3 w-3" /> SECURE REPO
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1 flex items-center gap-2">
                <span>Encrypted telemetry, neural model binaries, operational schematics & media</span>
              </p>
            </div>
          </div>

          {/* Quick HUD Metrics & Upload Action */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {/* Live Telemetry Pill */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#030611]/80 border border-slate-800 font-mono text-xs">
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Payload Size</p>
                <p className="font-bold text-cyan-300">{totalVaultSizeMB} MB</p>
              </div>
              <div className="h-7 w-[1px] bg-slate-800" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Total Assets</p>
                <p className="font-bold text-white">{assets.length} Files</p>
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchAssets}
              disabled={isLoading}
              className="h-10 w-10 rounded-xl border border-slate-800 bg-[#060a14] hover:bg-slate-800/60 text-slate-400 hover:text-cyan-300 flex items-center justify-center transition-all duration-200 cursor-pointer"
              title="Refresh Vault Repository"
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin text-cyan-400")} />
            </button>

            {/* Ingest Button */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 via-cyan-400 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-xl shadow-cyan-500/25 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <UploadCloud className="h-4 w-4" />
              <span>Ingest Asset</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. ACTION & FILTER CONTROLS */}
      <div className="flex flex-col sm:flex-row gap-3 p-3 rounded-2xl border border-slate-800/80 bg-[#070c1a]/80 backdrop-blur-xl justify-between items-center shadow-lg">
        {/* Search Bar */}
        <div className="relative w-full sm:w-80 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vault archives, blueprints..." 
            className="w-full bg-[#040713] border border-slate-800 text-slate-200 text-xs rounded-xl pl-10 pr-8 py-2.5 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Tabs with Live Counters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#040713] border border-slate-800 w-full sm:w-auto overflow-x-auto">
          {[
            { key: 'all', label: 'All Files', count: categoryCounts.all },
            { key: 'image', label: 'Images', count: categoryCounts.image },
            { key: 'video', label: 'Video Streams', count: categoryCounts.video },
            { key: 'document', label: 'Documents', count: categoryCounts.document },
            { key: 'archive', label: 'Archives', count: categoryCounts.archive },
          ].map((tab) => {
            const isActive = activeCategory === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveCategory(tab.key as any)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap cursor-pointer",
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-black shadow-md shadow-cyan-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                )}
              >
                <span>{tab.label}</span>
                <span className={cn(
                  "text-[10px] px-1.5 py-0.2 rounded-full font-bold",
                  isActive ? "bg-slate-950/40 text-white" : "bg-slate-800 text-slate-400"
                )}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MAIN INTERACTIVE VAULT GRID */}
      <div className="flex-1 flex flex-col">
        {isLoading ? (
          <div className="flex h-72 flex-col items-center justify-center gap-3">
            <div className="relative flex items-center justify-center">
              <div className="h-16 w-16 rounded-2xl border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
              <Activity className="absolute h-6 w-6 text-cyan-400 animate-pulse" />
            </div>
            <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest animate-pulse">
              Synchronizing Quantum Vault...
            </p>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-800/80 rounded-3xl bg-[#060b18]/50 p-12 backdrop-blur-md">
            <Archive className="h-14 w-14 text-slate-700 mx-auto mb-3 animate-holo-float" />
            <h3 className="text-base font-bold text-slate-300">No Assets Matching Query</h3>
            <p className="text-xs text-slate-500 font-mono mt-1 max-w-sm mx-auto">
              {searchQuery ? `No records found matching "${searchQuery}".` : 'No media items found in this category filter.'}
            </p>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 rounded-xl border border-cyan-500/30 text-xs font-mono text-cyan-400 hover:bg-cyan-500/10 transition-colors"
              >
                Clear Search Filter
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 content-start">
            {filteredAssets.map((asset) => {
              const mime = (asset.mimetype || '').toLowerCase();
              const isImage = mime.includes('image');
              const isVideo = mime.includes('video');
              const isPdf = mime.includes('pdf');
              const fileExt = getExtension(asset.mimetype, asset.filename);
              const fileUrl = MediaService.getFileUrl(asset.filename);

              return (
                <div 
                  key={asset._id} 
                  onClick={() => setPreviewAsset(asset)}
                  className="group relative rounded-2xl overflow-hidden flex flex-col bg-[#070c1a] border border-slate-800 hover:border-cyan-500/60 shadow-xl hover:shadow-cyan-500/15 transition-all duration-300 cursor-pointer transform hover:-translate-y-1.5"
                >
                  {/* Subtle Corner Sci-Fi Line */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400/40 z-20 group-hover:border-cyan-400 transition-colors" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400/40 z-20 group-hover:border-cyan-400 transition-colors" />

                  {/* Thumbnail / Media Canvas */}
                  <div className="h-40 bg-[#040713] flex items-center justify-center relative overflow-hidden">
                    {isImage ? (
                      <CyberImageThumbnail 
                        src={fileUrl} 
                        alt={asset.originalName} 
                        fallbackIcon={getFileIcon(asset.mimetype)} 
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4">
                        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 group-hover:scale-110 group-hover:border-cyan-500/40 transition-all duration-300 shadow-lg">
                          {getFileIcon(asset.mimetype)}
                        </div>
                        {isVideo && (
                          <span className="text-[10px] font-mono text-violet-400 mt-2 font-bold flex items-center gap-1">
                            <Film className="h-3 w-3" /> STREAM PAYLOAD
                          </span>
                        )}
                        {isPdf && (
                          <span className="text-[10px] font-mono text-cyan-400 mt-2 font-bold flex items-center gap-1">
                            <FileText className="h-3 w-3" /> PDF DOCUMENT
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Futuristic File Type Badge */}
                    <div className="absolute top-2.5 right-2.5 bg-[#040713]/90 border border-slate-700/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] font-mono font-bold text-cyan-400 shadow-md z-10 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      <span>{fileExt}</span>
                    </div>

                    {/* Cyber Scan Line Effect on Hover */}
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-cyber-scan pointer-events-none z-10" />

                    {/* Hover Quick Action Overlay */}
                    <div className="absolute inset-0 bg-[#030612]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2.5 backdrop-blur-sm z-20">
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewAsset(asset);
                        }}
                        className="h-9 px-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/30 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                        title="View Asset Directly On Screen"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>

                      <a 
                        href={fileUrl}
                        download={asset.originalName}
                        onClick={(e) => e.stopPropagation()}
                        className="h-9 w-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center transition-transform hover:scale-110 shadow-lg cursor-pointer"
                        title="Direct Download File"
                      >
                        <Download className="h-4 w-4" />
                      </a>

                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(asset._id, asset.originalName);
                        }}
                        className="h-9 w-9 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 flex items-center justify-center transition-transform hover:scale-110 shadow-lg cursor-pointer"
                        title="Purge Asset from Vault"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Details Card Footer */}
                  <div className="p-3.5 flex flex-col justify-between bg-[#070c1a] border-t border-slate-800/80 group-hover:bg-[#0a1226] transition-colors">
                    <p className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors truncate" title={asset.originalName}>
                      {asset.originalName || 'Asset Signature'}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-1.5">
                      <span>{asset.size ? (asset.size / 1024 / 1024).toFixed(2) : '0.00'} MB</span>
                      <span className="text-cyan-400 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        <Eye className="h-3 w-3" /> PREVIEW
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. INGESTION / UPLOAD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#070c1a] border border-cyan-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
            {/* Top Laser */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Encrypted Vault Ingestion</h2>
                  <p className="text-[11px] font-mono text-slate-400">Upload Operational Digital Assets</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="h-8 w-8 rounded-lg border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Dropzone */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-cyan-500/30 hover:border-cyan-400 bg-[#040713] rounded-2xl p-8 text-center cursor-pointer transition-all group relative overflow-hidden"
            >
              <input 
                ref={fileInputRef} 
                type="file" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
              <div className="h-14 w-14 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-3 border border-cyan-500/30 group-hover:scale-110 transition-transform">
                {isUploading ? <Loader2 className="h-7 w-7 animate-spin" /> : <UploadCloud className="h-7 w-7" />}
              </div>
              <p className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                {isUploading ? 'Encrypting & Storing Payload...' : 'Click or Drag Files to Upload'}
              </p>
              <p className="text-[10px] text-slate-500 font-mono mt-1.5">
                Supports PNG, JPEG, SVG, MP4, PDF, ZIP (Max 50MB)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. IN-APP DIRECT LIGHTBOX MODAL */}
      <MediaPreviewModal 
        asset={previewAsset} 
        isOpen={!!previewAsset} 
        onClose={() => setPreviewAsset(null)} 
      />

    </div>
  );
}
