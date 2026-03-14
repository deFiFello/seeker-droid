"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import WalletButton from "@/components/WalletButton";
import bs58 from 'bs58';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { publicKey, signMessage } = useWallet();
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleVerifyIdentity = async () => {
    if (!publicKey || !signMessage) return;
    
    try {
      setStatus("pending");
      const message = new TextEncoder().encode(`Verify SeekerDroid Identity: ${Date.now()}`);
      const signature = await signMessage(message);
      
      // Use the simpler bs58 call here
      console.log("Signature received:", bs58.encode(signature));
      
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (e) {
      console.error(e);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };
  
  if (!mounted) return <main className="min-h-screen bg-black" />;

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
        
        {/* NEW PRACTICAL TEST SECTION */}
        <div className="pt-8 h-24 flex flex-col items-center justify-center">
          {!publicKey ? (
            <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold animate-pulse">
              Connect Wallet to Start Test
            </p>
          ) : (
            <button
              onClick={handleVerifyIdentity}
              disabled={status === "pending"}
              className={`px-8 py-4 rounded-2xl font-black uppercase tracking-tighter transition-all active:scale-95 ${
                status === "success" 
                ? "bg-green-500 text-white" 
                : status === "error" 
                ? "bg-red-500 text-white"
                : "bg-white text-black hover:bg-[#14F195]"
              }`}
            >
              {status === "pending" ? "Check Your Wallet..." : 
               status === "success" ? "Identity Verified ✓" : 
               status === "error" ? "Verification Failed" : 
               "Verify Mobile Identity"}
            </button>
          )}
        </div>
      </section>

      <footer className="w-full max-w-sm bg-zinc-900/40 border border-zinc-800/50 p-5 rounded-[2.5rem] backdrop-blur-xl mb-4">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.3em] mb-2">System Status</p>
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center">
                <div className={`w-2 h-2 rounded-full ${publicKey ? 'bg-[#14F195]' : 'bg-zinc-600'}`} />
                {publicKey && <div className="absolute w-2 h-2 bg-[#14F195] rounded-full animate-ping opacity-75" />}
              </div>
              <span className="text-[11px] font-bold text-zinc-200 uppercase tracking-widest">
                {publicKey ? 'Session Authenticated' : 'MWA Provider Standby'}
              </span>
            </div>
          </div>
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-[0.2em] mb-1">Network</p>
              <p className="text-xs font-mono text-[#14F195]/80">Mainnet-Beta</p>
            </div>
            <div className="px-2.5 py-1 bg-zinc-800/50 border border-zinc-700/30 rounded-full text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">
              v1.0.1
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}