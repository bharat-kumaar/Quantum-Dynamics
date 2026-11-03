import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap" 
});

export const metadata: Metadata = {
  title: "Quantum Dynamics • Enterprise Command Neural Portal",
  description: "Next-Generation Enterprise Telemetry, Project Management & Neural Operations Matrix",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth" data-scroll-behavior="smooth">
      <body className={`${inter.className} min-h-screen bg-[#050811] text-slate-200 antialiased selection:bg-cyan-500/20 selection:text-cyan-300 overflow-x-hidden`}>
        {/* Global Ambient Glow Nodes - GPU Hardware Accelerated */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transform-gpu will-change-transform">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-600/8 rounded-full blur-[100px] transform-gpu translate-z-0 pointer-events-none" />
          <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-[120px] transform-gpu translate-z-0 pointer-events-none" />
          <div className="absolute -bottom-40 left-1/3 w-[450px] h-[450px] bg-violet-600/8 rounded-full blur-[110px] transform-gpu translate-z-0 pointer-events-none" />
        </div>

        <div className="relative z-10">
          {children}
        </div>
        
        <Toaster 
          richColors 
          position="top-right" 
          theme="dark" 
          toastOptions={{
            className: "glass-panel text-slate-100 border border-slate-700/60 shadow-2xl backdrop-blur-xl",
          }}
        />
      </body>
    </html>
  );
}
