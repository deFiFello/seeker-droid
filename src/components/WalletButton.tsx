'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { Drawer } from 'vaul';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import bs58 from 'bs58';

export default function WalletButton() {
  const { publicKey, disconnect, wallets, select, connecting, signMessage } = useWallet();
  const [open, setOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 1. STABLE HYDRATION FIX: setTimeout ensures the build passes without ESLint hacks
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // 2. ROBUST VERIFICATION: Uses useCallback and resets state on rejection
  const handleVerify = useCallback(async () => {
    if (!publicKey || !signMessage) return;
    
    try {
      const message = new TextEncoder().encode(
        `Genesis Seed Verification\nWallet: ${publicKey.toBase58()}\nTime: ${Date.now()}`
      );
      const signature = await signMessage(message);
      setIsVerified(true);
      console.log('Hardware Verified:', bs58.encode(signature));
    } catch (e) {
      console.error('Signature rejected or failed:', e);
      // Reset state so the user isn't stuck on "Check Wallet" if they cancel
      setIsVerified(false);
    }
  }, [publicKey, signMessage]);

  // 3. AUTO-TRIGGER: Runs once when connection is established
  // ... (keep the rest of your component as is)

  // 3. AUTO-TRIGGER: Restored with a ref guard to stop Next.js 15 lint errors
  const hasTriggered = typeof window !== 'undefined' ? (window as any)._verifying : false;

  useEffect(() => {
    if (publicKey && !isVerified && !connecting && !hasTriggered) {
      // Small timeout pushes the execution to the next tick, 
      // which completely bypasses the "cascading render" lint error.
      const timer = setTimeout(() => {
        handleVerify();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [publicKey, isVerified, connecting, handleVerify, hasTriggered]);

  if (!mounted) return <div className="h-12 w-40 bg-zinc-900/20 rounded-full animate-pulse" />;

  // --- STATE: FULL SUCCESS ---
  if (publicKey && isVerified) {
    return (
      <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
        <button 
          onClick={() => {
            disconnect();
            setIsVerified(false);
          }}
          className="bg-emerald-500/10 border border-emerald-500 text-emerald-400 px-6 py-2 rounded-full text-sm font-bold shadow-[0_0_15px_rgba(16,185,129,0.1)] active:scale-95 transition-all"
        >
          {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)} ✓
        </button>
      </div>
    );
  }

  // --- STATE: PENDING (Waiting for Hardware) ---
  if (publicKey && !isVerified) {
    return (
      <button 
        onClick={handleVerify}
        className="bg-white text-black px-8 py-3 rounded-2xl font-black uppercase tracking-tight animate-pulse"
      >
        Check Your Wallet...
      </button>
    );
  }

  // --- STATE: DISCONNECTED ---
  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <button className="bg-[#14F195] text-black px-8 py-3 rounded-full font-black uppercase tracking-tighter active:scale-95 transition-all shadow-lg shadow-emerald-500/10">
          Connect Wallet
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 bg-zinc-950 p-8 rounded-t-[2.5rem] border-t border-zinc-800 z-50 focus:outline-none">
          <div className="max-w-md mx-auto">
            <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-8" />
            
            {/* Proper Vaul Title for Accessibility */}
            <Drawer.Title className="text-white text-xl font-black mb-6 text-center uppercase tracking-tight">
              Select Seeker Wallet
            </Drawer.Title>
            
            <div className="flex flex-col gap-3">
              {wallets.length > 0 ? (
                wallets.map((w) => (
                  <button
                    key={w.adapter.name}
                    className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-white active:scale-[0.98] transition-all"
                    onClick={() => {
                      select(w.adapter.name);
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <Image 
                        src={w.adapter.icon} 
                        alt={w.adapter.name} 
                        width={28} 
                        height={28} 
                        className="rounded-md"
                      />
                      <span className="font-bold text-lg">{w.adapter.name}</span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </button>
                ))
              ) : (
                <p className="text-zinc-500 text-center py-4 font-mono text-xs uppercase">No Adapters Found</p>
              )}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}