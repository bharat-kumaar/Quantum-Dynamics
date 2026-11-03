'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#050811]">
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 rounded-2xl border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <div className="absolute h-8 w-8 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 opacity-60 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#050811] text-slate-100 overflow-hidden bg-quantum-grid">
      {/* 1. Futuristic Sci-Fi Sidebar locked on the left */}
      <Sidebar />

      {/* 2. Main Workspace (Header + Viewport) */}
      <div className="flex flex-col flex-1 h-screen min-w-0 overflow-hidden relative">
        {/* Top Header strictly pinned */}
        <div className="w-full shrink-0 z-30">
          <Header />
        </div>

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 bg-radial-vignette smooth-scroll transform-gpu">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
