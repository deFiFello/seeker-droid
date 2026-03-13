'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { Drawer } from 'vaul';
import { useState } from 'react';

export default function WalletButton() {
  const { wallet, publicKey, disconnect, connecting, wallets, select } = useWallet();
  const [open, setOpen] = useState(false);

  const formatAddress = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

  if (publicKey) {
    return (
      <button 
        onClick={() => disconnect()}
        className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full text-sm font-medium text-white flex items-center gap-2"
      >
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        {formatAddress(publicKey.toBase58())}
      </button>
    );
  }

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <button className="bg-[#14F195] text-black px-6 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-opacity">
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-zinc-900 flex flex-col rounded-t-[20px] h-fit max-h-[70%] mt-24 fixed bottom-0 left-0 right-0 border-t border-zinc-800 outline-none z-50">
          <div className="p-4 bg-zinc-900 rounded-t-[20px] flex-1 pb-10">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-700 mb-8" />
            <div className="max-w-md mx-auto">
              <Drawer.Title className="font-bold text-xl mb-4 text-white text-center">Select Wallet</Drawer.Title>
              <div className="flex flex-col gap-3">
                {wallets.map((w) => (
                  <button
                    key={w.adapter.name}
                    className="flex items-center gap-4 p-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-2xl transition-all text-white border border-zinc-700/50"
                    onClick={() => {
                      select(w.adapter.name);
                      setOpen(false);
                    }}
                  >
                    {/* Manual Icon Rendering */}
                    {w.adapter.icon && (
                      <img 
                        src={w.adapter.icon} 
                        alt={w.adapter.name} 
                        className="w-8 h-8 rounded-lg" 
                      />
                    )}
                    <div className="flex flex-col items-start">
                      <span className="font-bold">{w.adapter.name}</span>
                      <span className="text-xs text-zinc-500 uppercase tracking-wider">{w.readyState}</span>
                    </div>
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