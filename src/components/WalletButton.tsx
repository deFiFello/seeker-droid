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

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleVerify = useCallback(async () => {
    if (!publicKey || !signMessage) return;
    try {
      const message = new TextEncoder().encode(`Genesis Seed Auth: ${new Date().getTime()}`);
      const signature = await signMessage(message);
      setIsVerified(true);
      console.log('Proof Secured:', bs58.encode(signature));
    } catch (e) {
      console.error('Verification failed', e);
      setIsVerified(false);
    }
  }, [publicKey, signMessage]);

  // 3. Auto-trigger on initial connection
  useEffect(() => {
    if (publicKey && !isVerified && !connecting) {
      // Wrapping in setTimeout(0) pushes the execution to the next tick,
      // which satisfies the Next.js 15 "cascading render" check.
      const timeoutId = setTimeout(() => {
        handleVerify();
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [publicKey, isVerified, connecting, handleVerify]);
  
  if (!mounted) return <div className="h-10 w-32" />;

  // --- UI: CONNECTED ---
  if (publicKey) {
    return (
      <div className="flex items-center gap-2">
        {/* Main Action Button */}
        <button 
          onClick={!isVerified ? handleVerify : undefined}
          disabled={isVerified}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-mono border transition-all ${
            isVerified 
              ? 'bg-zinc-900/50 border-emerald-500/30 text-emerald-400 cursor-default' 
              : 'bg-amber-500/10 border-amber-500/50 text-amber-500 animate-pulse active:scale-95'
          }`}
        >
          <span>{publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}</span>
          {isVerified ? (
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          ) : (
            <span className="text-[10px] font-bold">VERIFY</span>
          )}
        </button>

        {/* Dedicated Disconnect Button */}
        <button 
          onClick={() => { disconnect(); setIsVerified(false); }}
          className="p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white active:scale-90 transition-all"
          aria-label="Disconnect"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  // --- UI: DISCONNECTED ---
  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <button className="bg-[#14F195] text-black px-8 py-3 rounded-full font-bold active:scale-95 transition-transform uppercase tracking-tighter shadow-lg shadow-emerald-500/10">
          {connecting ? 'Linking...' : 'Connect Wallet'}
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 bg-zinc-950 p-8 rounded-t-[2.5rem] border-t border-zinc-800 z-50 focus:outline-none">
          <div className="max-w-md mx-auto">
            <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-6" />
            <Drawer.Title className="text-white text-lg font-bold mb-6 text-center tracking-tight">
              Select Wallet
            </Drawer.Title>
            
            <div className="flex flex-col gap-3">
              {wallets.map((w) => (
                <button
                  key={w.adapter.name}
                  className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-white active:scale-95 transition-all group hover:border-zinc-700"
                  onClick={() => {
                    select(w.adapter.name);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-4">
                    <Image src={w.adapter.icon} alt={w.adapter.name} width={28} height={28} className="rounded grayscale group-hover:grayscale-0 transition-all" />
                    <span className="font-bold">{w.adapter.name}</span>
                  </div>
                  <div className="text-zinc-600 group-hover:text-emerald-500 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}