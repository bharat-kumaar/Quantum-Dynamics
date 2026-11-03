'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  ExternalLink, 
  Loader2, 
  FileText, 
  Film, 
  FileImage, 
  Archive, 
  Maximize2, 
  Sparkles,
  ShieldCheck,
  HardDrive
} from 'lucide-react';
import { MediaAsset } from '@/types/media';
import { MediaService } from '@/services/media.service';

interface MediaPreviewModalProps {
  asset: MediaAsset | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MediaPreviewModal({ asset, isOpen, onClose }: MediaPreviewModalProps) {
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset loading status whenever asset changes, with safety fallback
  useEffect(() => {
    setIsMediaLoaded(false);
    const timer = setTimeout(() => {
      setIsMediaLoaded(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, [asset]);

  if (!isOpen || !asset) return null;

  const fileUrl = MediaService.getFileUrl(asset.filename);
  const mimetype = (asset.mimetype || '').toLowerCase();
  const isImage = mimetype.includes('image');
  const isVideo = mimetype.includes('video');
  const isPdf = mimetype.includes('pdf') || (asset.filename || '').endsWith('.pdf');
  const isZip = mimetype.includes('zip') || mimetype.includes('compressed') || (asset.filename || '').endsWith('.zip');

  const fileExt = (asset.filename && asset.filename.includes('.'))
    ? asset.filename.split('.').pop()?.toUpperCase()
    : 'FILE';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl border border-slate-700/80 bg-[#070b16] shadow-2xl overflow-hidden ring-1 ring-cyan-500/20">
        
        {/* Subtle top neon laser accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-20" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-slate-800/80 bg-[#090e1e]/90 backdrop-blur-md z-20">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
              {isImage && <FileImage className="h-5 w-5" />}
              {isVideo && <Film className="h-5 w-5" />}
              {isPdf && <FileText className="h-5 w-5" />}
              {isZip && <Archive className="h-5 w-5" />}
              {!isImage && !isVideo && !isPdf && !isZip && <HardDrive className="h-5 w-5" />}
            </div>
            
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-white truncate" title={asset.originalName}>
                {asset.originalName}
              </h2>
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-0.5">
                <span className="px-1.5 py-0.2 rounded bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30">
                  {fileExt}
                </span>
                <span>•</span>
                <span>{asset.size ? (asset.size / 1024 / 1024).toFixed(2) : '0.00'} MB</span>
                <span>•</span>
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="h-3 w-3" /> VERIFIED VAULT ASSET
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <a 
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="h-9 px-3 rounded-xl border border-slate-800 bg-[#060a14] text-xs font-mono text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 hover:bg-cyan-500/10 flex items-center gap-1.5 transition-all"
              title="Open Raw File in New Window"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Raw Stream</span>
            </a>

            <a 
              href={fileUrl}
              download={asset.originalName}
              className="h-9 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-white text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
              title="Download to Local System"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>

            <button 
              onClick={onClose}
              className="h-9 w-9 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800/50 flex items-center justify-center transition-colors ml-1"
              title="Close Preview (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Viewport Area */}
        <div className="relative flex-1 min-h-[380px] sm:min-h-[480px] max-h-[78vh] bg-[#04060d] flex items-center justify-center p-4 sm:p-6 overflow-hidden select-none">
          
          {/* Real-Time Loading Indicator */}
          {!isMediaLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#050811]/90 backdrop-blur-md z-10 animate-in fade-in duration-200">
              <div className="relative flex items-center justify-center">
                <div className="h-14 w-14 rounded-2xl border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
                <Sparkles className="absolute h-5 w-5 text-cyan-400 animate-pulse" />
              </div>
              <p className="text-xs font-mono text-cyan-300 uppercase tracking-widest animate-pulse">
                Rendering Asset Payload...
              </p>
            </div>
          )}

          {/* 1. IMAGE VIEWER */}
          {isImage && (
            <div className="relative flex items-center justify-center w-full h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={fileUrl} 
                alt={asset.originalName}
                onLoad={() => setIsMediaLoaded(true)}
                onError={() => setIsMediaLoaded(true)}
                className={`max-h-[72vh] max-w-full w-auto object-contain rounded-2xl shadow-2xl transition-opacity duration-300 ${
                  isMediaLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-98'
                }`}
              />
            </div>
          )}

          {/* 2. VIDEO STREAM PLAYER */}
          {isVideo && (
            <div className="relative flex items-center justify-center w-full h-full max-h-[74vh]">
              <video 
                src={fileUrl}
                controls
                autoPlay
                playsInline
                onLoadedData={() => setIsMediaLoaded(true)}
                onCanPlay={() => setIsMediaLoaded(true)}
                onLoadedMetadata={() => setIsMediaLoaded(true)}
                onError={() => setIsMediaLoaded(true)}
                className="max-h-[72vh] max-w-full w-auto rounded-2xl shadow-2xl bg-black border border-slate-800"
              />
            </div>
          )}

          {/* 3. PDF / DOCUMENT EMBED */}
          {isPdf && (
            <div className="w-full h-[70vh] flex flex-col rounded-2xl overflow-hidden border border-slate-800 bg-[#090e1e]">
              <iframe 
                src={fileUrl}
                title={asset.originalName}
                onLoad={() => setIsMediaLoaded(true)}
                className="w-full h-full rounded-2xl border-0 bg-white"
              />
            </div>
          )}

          {/* 4. ARCHIVE / OTHER FILES INSPECTOR */}
          {(isZip || (!isImage && !isVideo && !isPdf)) && (
            <div 
              onMouseEnter={() => setIsMediaLoaded(true)}
              className="flex flex-col items-center justify-center text-center p-8 max-w-md w-full rounded-3xl border border-slate-800/80 bg-[#090e1e]/90 shadow-2xl space-y-4"
              ref={() => {
                if (!isMediaLoaded) {
                  setTimeout(() => setIsMediaLoaded(true), 200);
                }
              }}
            >
              <div className="h-16 w-16 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shadow-lg shadow-cyan-500/15">
                {isZip ? <Archive className="h-8 w-8" /> : <HardDrive className="h-8 w-8" />}
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">{asset.originalName}</h3>
                <p className="text-xs font-mono text-slate-400">
                  Compressed Binary Firmware / Neural Package
                </p>
                <div className="inline-block mt-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300">
                  Payload Size: {asset.size ? (asset.size / 1024 / 1024).toFixed(2) : '0.00'} MB
                </div>
              </div>
              <p className="text-[11px] font-mono text-slate-500 max-w-xs">
                Direct browser decoding is disabled for binary archives to maintain sandboxed execution. Download archive to inspect artifacts locally.
              </p>
              <a 
                href={fileUrl}
                download={asset.originalName}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-white px-5 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"
              >
                <Download className="h-4 w-4" />
                <span>Unpack & Download</span>
              </a>
            </div>
          )}

        </div>

        {/* Modal Footer Bar */}
        <div className="px-6 py-3 border-t border-slate-800/80 bg-[#090e1e]/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-slate-500">
          <div>
            <span>Asset Filename: </span>
            <span className="text-slate-400 truncate">{asset.filename}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">ESC</kbd> to exit view</span>
          </div>
        </div>

      </div>
    </div>
  );
}
