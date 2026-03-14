'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { Drawer } from 'vaul';
import { useState, useEffect } from 'react';

export default function WalletButton() {
  const { publicKey, disconnect, connecting, wallets, select, connected } = useWallet();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // AUTO-CLOSE DRAWER ON SUCCESS
  useEffect(() => {
    if (connected && open) {
      setOpen(false);
    }
  }, [connected, open]);

  const formatAddress = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

  if (!mounted) return (
    <div className="h-9 w-32 bg-zinc-800 rounded-full animate-pulse" />
  );

  if (publicKey) {
    return (
      <button 
        onClick={() => disconnect()}
        className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full text-sm font-medium text-white flex items-center gap-2 hover:bg-zinc-800 transition-all active:scale-95"
      >
        <div className="w-2 h-2 bg-[#14F195] rounded-full shadow-[0_0_8px_#14F195] animate-pulse" />
        {formatAddress(publicKey.toBase58())}
      </button>
    );
  }

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <button className="bg-[#14F195] text-black px-6 py-2 rounded-full text-sm font-black uppercase tracking-tight hover:opacity-90 transition-all active:scale-90">
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Drawer.Content className="bg-zinc-950 flex flex-col rounded-t-[32px] h-fit max-h-[85%] fixed bottom-0 left-0 right-0 border-t border-zinc-800 outline-none z-[60]">
          <div className="p-6 bg-zinc-950 rounded-t-[32px] flex-1 pb-12">
            <div className="mx-auto w-12 h-1 rounded-full bg-zinc-800 mb-8" />
            <div className="max-w-md mx-auto px-2">
              <Drawer.Title className="font-black text-2xl mb-6 text-white text-center italic uppercase tracking-tighter">
                Select <span className="text-[#14F195]">Wallet</span>
              </Drawer.Title>
              <div className="flex flex-col gap-3">
                {wallets
                  .filter(w => w.readyState !== 'NotDetected' || w.adapter.name === 'Solana Mobile Stack')
                  .map((w) => (
                  <button
                    key={w.adapter.name}
                    className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800/50 hover:border-[#14F195]/50 rounded-2xl transition-all group active:bg-zinc-800"
                    onClick={async () => {
                      try {
                        // For MWA, selecting the adapter triggers the mobile handshake
                        await select(w.adapter.name);
                      } catch (e) {
                        console.error("Selection failed", e);
                      }
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center overflow-hidden">
                        {w.adapter.icon ? (
                          <img src={w.adapter.icon} alt={w.adapter.name} className="w-6 h-6" />
                        ) : (
                          <div className="w-6 h-6 bg-zinc-700 rounded-md" />
                        )}
                      </div>
                      <div className="flex flex-col items-start text-left">
                        <span className="font-bold text-white group-hover:text-[#14F195] transition-colors">
                          {w.adapter.name === 'Solana Mobile Stack' ? 'Mobile Wallet' : w.adapter.name}
                        </span>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                          {w.readyState}
                        </span>
                      </div>
                    </div>
                    <div className="text-zinc-700 group-hover:text-[#14F195] transition-colors">→</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}