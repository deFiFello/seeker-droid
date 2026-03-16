'use client';

import type { WalletName } from '@solana/wallet-adapter-base';
import { useWallet } from '@solana/wallet-adapter-react';
import { SolanaMobileWalletAdapterWalletName } from '@solana-mobile/wallet-standard-mobile';
import { Drawer } from 'vaul';
import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';

// Timeout (ms) before we consider an MWA connection attempt failed.
// Seed Vault deep-link returns can hang indefinitely in TWA contexts.
const MWA_CONNECT_TIMEOUT = 8000;

export default function WalletButton() {
  const { publicKey, connected, disconnect, connect, select, wallet, wallets, connecting } =
    useWallet();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [connectAttempted, setConnectAttempted] = useState(false);
  const connectingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  // ─── Timeout: auto-recover from stuck Seed Vault / MWA connections ───
  useEffect(() => {
    if (connecting) {
      connectingTimer.current = setTimeout(() => {
        console.warn('[SeekerDroid] MWA connection timed out — resetting');
        disconnect().catch(() => {});
        setConnectAttempted(false);
      }, MWA_CONNECT_TIMEOUT);
    } else {
      // Connection resolved (success or user cancelled) — clear timer
      if (connectingTimer.current) {
        clearTimeout(connectingTimer.current);
        connectingTimer.current = null;
      }
    }
    return () => {
      if (connectingTimer.current) {
        clearTimeout(connectingTimer.current);
      }
    };
  }, [connecting, disconnect]);

  // ─── Direct connect handler (MWA UX Guidelines) ───
  // 1. If MWA is already selected → call connect() immediately
  // 2. If MWA is available but not selected → select it
  // 3. Otherwise → show wallet picker drawer
  const handleConnect = useCallback(async () => {
    setConnectAttempted(true);

    const mwaWallet = wallets.find(
      (w) => w.adapter.name === SolanaMobileWalletAdapterWalletName,
    );

    if (wallet?.adapter.name === SolanaMobileWalletAdapterWalletName) {
      // MWA already selected — connect directly from this user tap
      try {
        await connect();
      } catch (e) {
        console.error('[SeekerDroid] MWA connect failed:', e);
        setConnectAttempted(false);
      }
    } else if (mwaWallet) {
      // MWA available but not selected — select it, then connect
      select(SolanaMobileWalletAdapterWalletName as WalletName);
      // connect() will fire on next tick once selection registers
      setTimeout(async () => {
        try {
          await connect();
        } catch (e) {
          console.error('[SeekerDroid] MWA connect after select failed:', e);
          setConnectAttempted(false);
        }
      }, 150);
    } else {
      // Desktop or no MWA detected — show wallet picker
      setConnectAttempted(false);
      setOpen(true);
    }
  }, [wallet, wallets, connect, select]);

  // ─── Cancel a stuck connection ───
  const handleCancelConnect = useCallback(() => {
    disconnect().catch(() => {});
    setConnectAttempted(false);
  }, [disconnect]);

  if (!mounted) {
    return <div className="h-10 w-32 bg-zinc-900/20 rounded-full animate-pulse" />;
  }

  // ─── STATE: CONNECTED ───
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

  // ─── STATE: CONNECTING (tappable — lets user cancel stuck attempts) ───
  if (connecting) {
    return (
      <button
        onClick={handleCancelConnect}
        className="bg-zinc-900 border border-zinc-800 text-zinc-400 px-6 py-2 rounded-full text-sm font-bold animate-pulse active:scale-95 transition-transform"
        title="Tap to cancel"
      >
        Connecting…
      </button>
    );
  }

  // ─── STATE: DISCONNECTED ───
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
                        // Small delay for selection to register, then connect
                        setTimeout(async () => {
                          try {
                            await connect();
                          } catch (e) {
                            console.error('[SeekerDroid] Connect failed:', e);
                          }
                        }, 150);
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