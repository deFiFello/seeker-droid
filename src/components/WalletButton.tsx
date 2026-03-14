'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { Drawer } from 'vaul';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import bs58 from 'bs58';

export default function WalletButton() {
  const { publicKey, disconnect, wallets, select, connecting, signMessage } = useWallet();
  const [open, setOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleVerify = async () => {
    if (!publicKey || !signMessage) return;
    try {
      const message = new TextEncoder().encode(`Verify Seeker: ${new Date().getTime()}`);
      const signature = await signMessage(message);
      setIsVerified(true);
      console.log('Verified:', bs58.encode(signature));
    } catch (e) {
      console.error(e);
      disconnect(); // If they cancel verification, clear the state
    }
  };

  if (!mounted) return <div className="h-10 w-32" />;

  // ONE BUTTON: If connected, show address. 
  // Click once to Verify (Biometrics), click again to Disconnect.
  if (publicKey) {
    return (
      <button 
        onClick={!isVerified ? handleVerify : () => { disconnect(); setIsVerified(false); }}
        className="bg-zinc-900 border border-emerald-500/50 px-6 py-2 rounded-full text-sm text-emerald-400 font-mono shadow-[0_0_10px_rgba(16,185,129,0.1)] transition-all"
      >
        {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)} {isVerified ? '✓' : '(Verify)'}
      </button>
    );
  }

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <button className="bg-[#14F195] text-black px-8 py-3 rounded-full font-black uppercase tracking-tighter active:scale-95 transition-all">
          {connecting ? 'Linking...' : 'Connect Wallet'}
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 bg-zinc-950 p-8 rounded-t-[2.5rem] border-t border-zinc-800 z-50 focus:outline-none">
          <div className="max-w-md mx-auto">
            <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-8" />
            <h2 className="text-white text-xl font-black mb-6 text-center">Select Wallet</h2>
            <div className="flex flex-col gap-3">
              {wallets.map((w) => (
                <button
                  key={w.adapter.name}
                  className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-white active:scale-[0.98] transition-all"
                  onClick={() => {
                    select(w.adapter.name);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-4">
                    <Image src={w.adapter.icon} alt={w.adapter.name} width={32} height={32} className="rounded-lg" />
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