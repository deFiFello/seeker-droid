'use client';
import type { WalletName } from '@solana/wallet-adapter-base';
import { useWallet } from '@solana/wallet-adapter-react';
import { SolanaMobileWalletAdapterWalletName } from '@solana-mobile/wallet-standard-mobile';
import { Drawer } from 'vaul';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

export default function WalletButton() {
  const { publicKey, connected, disconnect, connect, select, wallet, wallets, connecting } = useWallet();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  // Direct connect handler following MWA UX Guidelines:
  // 1. If MWA is already selected → call connect() immediately
  // 2. If MWA is available but not selected → select it (triggers connect)
  // 3. Otherwise → show wallet picker drawer
  const handleConnect = useCallback(async () => {
    const mwaWallet = wallets.find(
      (w) => w.adapter.name === SolanaMobileWalletAdapterWalletName
    );

    if (wallet?.adapter.name === SolanaMobileWalletAdapterWalletName) {
      // MWA is selected — connect directly from this user tap
      try {
        await connect();
      } catch (e) {
        console.error('MWA connect failed:', e);
      }
    } else if (mwaWallet) {
      // MWA is available but not selected — select it
      select(SolanaMobileWalletAdapterWalletName as WalletName);    } else {
      // Desktop or no MWA — show wallet picker
      setOpen(true);
    }
  }, [wallet, wallets, connect, select]);

  if (!mounted) {
    return <div className="h-10 w-32 bg-zinc-900/20 rounded-full animate-pulse" />;
  }

  // STATE: CONNECTED
  if (connected && publicKey) {
    return (
      <button
        onClick={() => disconnect()}
        className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full active:scale-95 transition-transform"
      >
        <div className="w-2 h-2 rounded-full bg-[#14F195]" />
        <span className="text-xs font-bold text-zinc-300 font-mono">
          {publicKey.toBase58().slice(0, 4)}…{publicKey.toBase58().slice(-4)}
        </span>
      </button>
    );
  }

  // STATE: CONNECTING
  if (connecting) {
    return (
      <button
        disabled
        className="bg-zinc-900 border border-zinc-800 text-zinc-500 px-6 py-2 rounded-full text-sm font-bold animate-pulse"
      >
        Connecting…
      </button>
    );
  }

  // STATE: DISCONNECTED
  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      {/* Primary connect button — tries MWA first, falls back to drawer */}
      <button
        onClick={handleConnect}
        className="bg-[#14F195] text-black px-6 py-2.5 rounded-full font-black text-sm uppercase tracking-tight active:scale-95 transition-transform"
      >
        Connect
      </button>

      {/* Bottom-sheet wallet picker (only shown when MWA isn't available) */}
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 bg-zinc-950 p-6 rounded-t-[2rem] border-t border-zinc-800 z-50 focus:outline-none">
          <div className="max-w-md mx-auto">
            <div className="w-10 h-1 bg-zinc-800 rounded-full mx-auto mb-6" />

            <Drawer.Title className="text-white text-lg font-black mb-5 uppercase tracking-tight text-center">
              Select Wallet
            </Drawer.Title>

            <div className="flex flex-col gap-2">
              {wallets.length > 0 ? (
                wallets.map((w) => {
                  // Per MWA UX Guidelines: show "Use Installed Wallet" for MWA
                  const displayName =
                    w.adapter.name === SolanaMobileWalletAdapterWalletName
                      ? 'Use Installed Wallet'
                      : w.adapter.name;

                  return (
                    <button
                      key={w.adapter.name}
                      className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-white active:scale-[0.98] transition-transform"
                      onClick={async () => {
                        select(w.adapter.name);
                        setOpen(false);
                        // Small delay to let selection register, then connect
                        setTimeout(async () => {
                          try {
                            await connect();
                          } catch (e) {
                            console.error('Connect failed:', e);
                          }
                        }, 100);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={w.adapter.icon}
                          alt={displayName}
                          width={28}
                          height={28}
                          className="rounded-md"
                        />
                        <span className="font-bold">{displayName}</span>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </button>
                  );
                })
              ) : (
                <p className="text-zinc-500 py-6 text-xs uppercase tracking-widest font-bold text-center">
                  No wallets detected
                </p>
              )}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
