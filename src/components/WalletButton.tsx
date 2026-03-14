'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { Drawer } from 'vaul';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import bs58 from 'bs58';

export default function WalletButton() {
  const { publicKey, disconnect, wallets, select, connecting, signMessage } = useWallet();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Identity Verification Handler (The Seeker Hardware Test)
  const handleVerifyIdentity = async () => {
    try {
      if (!publicKey || !signMessage) return;
      
      const message = new TextEncoder().encode(
        `Verify Seeker Identity for Solis\nTimestamp: ${new Date().toISOString()}`
      );
      
      // This triggers the Android Intent Picker / Biometric prompt
      const signature = await signMessage(message);
      const signatureBase58 = bs58.encode(signature);
      
      console.log('Hardware Signature Secured:', signatureBase58);
      setIsVerified(true);
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  if (!mounted) return <div className="h-10 w-32" />;

  // State 1: Connected + Verified
  if (publicKey && isVerified) {
    return (
      <div className="flex flex-col items-center gap-4">
        <button 
          onClick={() => disconnect()}
          className="bg-zinc-900 border border-emerald-500/50 px-4 py-2 rounded-full text-sm text-emerald-400 font-mono shadow-[0_0_10px_rgba(16,185,129,0.1)]"
        >
          {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)} ✓
        </button>
      </div>
    );
  }

  // State 2: Connected but needs Verification
  if (publicKey && !isVerified) {
    return (
      <button 
        onClick={handleVerifyIdentity}
        className="bg-white text-black px-6 py-3 rounded-xl font-black uppercase tracking-tight hover:bg-zinc-200 transition-colors"
      >
        Verify Mobile Identity
      </button>
    );
  }

  // State 3: Disconnected
  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <button className="bg-[#14F195] text-black px-8 py-3 rounded-full font-black uppercase tracking-tighter active:scale-95 transition-transform">
          {connecting ? 'Linking...' : 'Initialize Seeker'}
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 bg-zinc-950 p-8 rounded-t-[2.5rem] border-t border-zinc-800 z-50">
          <div className="max-w-md mx-auto">
            <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-8" />
            <h2 className="text-white text-xl font-black mb-6 text-center">Protocol Selection</h2>
            <div className="flex flex-col gap-3">
              {wallets.length > 0 ? (
                wallets.map((w) => (
                  <button
                    key={w.adapter.name}
                    className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-white active:scale-[0.98] transition-all hover:border-zinc-600"
                    onClick={() => {
                      select(w.adapter.name);
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <Image 
                        src={w.adapter.icon} 
                        alt={w.adapter.name} 
                        width={32} 
                        height={32} 
                        className="rounded-lg"
                      />
                      <span className="font-bold text-lg">{w.adapter.name}</span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </button>
                ))
              ) : (
                <p className="text-zinc-500 text-center py-4">No compatible wallets found.</p>
              )}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}