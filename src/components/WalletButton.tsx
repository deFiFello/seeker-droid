'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { Drawer } from 'vaul';
import { useState, useEffect } from 'react';

export default function WalletButton() {
  const { publicKey, disconnect, wallets, select, connecting } = useWallet();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
      const timer = setTimeout(() => setMounted(true), 0);
      return () => clearTimeout(timer);
  }, []);
  

  if (!mounted) return <button className="opacity-0">Connect</button>;

  if (publicKey) {
    return (
      <button 
        onClick={() => disconnect()}
        className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full text-sm text-white"
      >
        {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
      </button>
    );
  }

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <button className="bg-[#14F195] text-black px-6 py-2 rounded-full font-bold">
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 bg-zinc-950 p-6 rounded-t-3xl border-t border-zinc-800">
          <div className="max-w-md mx-auto">
            <h2 className="text-white font-bold mb-4">Select Wallet</h2>
            <div className="flex flex-col gap-2">
              {wallets.map((w) => (
                <button
                  key={w.adapter.name}
                  className="flex items-center gap-3 p-4 bg-zinc-900 rounded-xl text-white active:scale-95 transition-transform"
                  onClick={() => {
                    select(w.adapter.name);
                    setOpen(false);
                  }}
                >
                  <img src={w.adapter.icon} alt={w.adapter.name} className="w-6 h-6" />
                  <span>{w.adapter.name}</span>
                </button>
              ))}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}