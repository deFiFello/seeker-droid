"use client";

import { useEffect, useState } from "react";
import WalletButton from "@/components/WalletButton";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // This is a standard pattern for PWAs to avoid hydration mismatch
    setMounted(true);
  }, []);

  // Return a stable black screen while mounting to prevent "flicker" 
  // and satisfy Next.js server-side rendering
  if (!mounted) {
    return <main className="min-h-screen bg-black" />;
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-between p-6 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] overflow-hidden">
      <nav className="w-full flex justify-between items-center z-10">
        <h1 className="text-xl font-black tracking-tighter italic uppercase">
          Seeker<span className="text-[#14F195]">Droid</span>
        </h1>
        <WalletButton />
      </nav>

      <section className="relative text-center space-y-4 py-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#14F195]/10 blur-[100px] -z-10" />
        <h2 className="text-6xl font-black tracking-tighter leading-[0.9]">
          SOLANA <br />
          <span className="text-zinc-600">MEETS</span> <br />
          ANDROID
        </h2>
        <p className="text-zinc-400 max-w-[280px] mx-auto text-sm font-medium leading-relaxed">
          The cross-compatible PWA template <br />
          <span className="text-zinc-500">optimized for the Solana Seeker.</span>
        </p>
      </section>

      <footer className="w-full max-w-sm bg-zinc-900/40 border border-zinc-800/50 p-5 rounded-[2.5rem] backdrop-blur-xl mb-4">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.3em] mb-2">System Status</p>
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center">
                <div className="w-2 h-2 bg-[#14F195] rounded-full" />
                <div className="absolute w-2 h-2 bg-[#14F195] rounded-full animate-ping opacity-75" />
              </div>
              <span className="text-[11px] font-bold text-zinc-200 uppercase tracking-widest">MWA Provider Initialized</span>
            </div>
          </div>
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-[0.2em] mb-1">Environment</p>
              <p className="text-xs font-mono text-[#14F195]/80">Mainnet-Beta / Seeker</p>
            </div>
            <div className="px-2.5 py-1 bg-zinc-800/50 border border-zinc-700/30 rounded-full text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">
              v1.0.0
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}