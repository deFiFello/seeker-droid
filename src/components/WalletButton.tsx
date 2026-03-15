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

  useEffect(() => { setMounted(true); }, []);

  const handleVerify = useCallback(async () => {
    if (!publicKey || !signMessage) return;
    try {
      const message = new TextEncoder().encode(`Genesis Seed Verify: ${Date.now()}`);
      const signature = await signMessage(message);
      if (signature) setIsVerified(true);
    } catch (e) {
      console.error('Verification failed', e);
    }
  }, [publicKey, signMessage]);

  useEffect(() => {
    if (publicKey && !isVerified && !connecting) {
      handleVerify();
    }
  }, [publicKey, isVerified, connecting, handleVerify]);

  if (!mounted) return null;

  if (publicKey && isVerified) {
    return (
      <button 
        onClick={() => { disconnect(); setIsVerified(false); }}
        className="bg-[#14F195] text-black px-6 py-2 rounded-full text-sm font-black uppercase shadow-[0_0_20px_rgba(20,241,149,0.3)]"
      >
        Verified ✓
      </button>
    );
  }

  if (publicKey && !isVerified) {
    return (
      <button className="bg-zinc-800 text-zinc-400 px-8 py-3 rounded-2xl font-black uppercase animate-pulse">
        Check Your Wallet...
      </button>
    );
  }

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <button className="bg-white text-black px-8 py-3 rounded-2xl font-black uppercase tracking-tight active:scale-95 transition-all">
          Connect Wallet
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-md z-50" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 bg-zinc-950 p-8 rounded-t-[2.5rem] border-t border-zinc-800 z-50 focus:outline-none">
          <div className="max-w-md mx-auto">
            <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-8" />
            <h2 className="text-white text-xl font-black mb-6 uppercase text-center">Select Wallet</h2>
            <div className="flex flex-col gap-3">
              {wallets.map((w) => (
                <button
                  key={w.adapter.name}
                  className="flex items-center justify-between p-5 bg-zinc-900 border border-zinc-800 rounded-2xl text-white active:scale-95 transition-all"
                  onClick={() => { select(w.adapter.name); setOpen(false); }}
                >
                  <div className="flex items-center gap-4">
                    <Image src={w.adapter.icon} alt={w.adapter.name} width={28} height={28} className="rounded-md" />
                    <span className="font-bold text-lg">{w.adapter.name}</span>
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