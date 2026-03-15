'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import WalletButton from '@/components/WalletButton';
import Image from 'next/image';
import bs58 from 'bs58';

type VerifyStatus = 'idle' | 'pending' | 'success' | 'error';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { publicKey, connected, signMessage } = useWallet();
  const [status, setStatus] = useState<VerifyStatus>('idle');

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  // User-initiated verification ONLY — never auto-trigger signMessage
  const handleVerifyIdentity = async () => {
    if (!publicKey || !signMessage) return;

    try {
      setStatus('pending');
      const message = new TextEncoder().encode(
        `SeekerDroid Identity Verification\nWallet: ${publicKey.toBase58()}\nTimestamp: ${Date.now()}`
      );
      const signature = await signMessage(message);
      console.log('Verified:', bs58.encode(signature));
      setStatus('success');
    } catch (e) {
      console.error('Sign rejected:', e);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  if (!mounted) return <main className="min-h-[100dvh] bg-black" />;

  return (
    <main className="min-h-[100dvh] bg-black text-white flex flex-col items-center justify-between p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] overflow-hidden select-none">
      {/* ─── NAV ─── */}
      <nav className="w-full flex justify-between items-center">
        <h1 className="text-lg font-black tracking-tighter italic uppercase">
          Seeker<span className="text-[#14F195]">Droid</span>
        </h1>
        <WalletButton />
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative text-center space-y-3 flex-1 flex flex-col items-center justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#14F195]/8 blur-[100px] -z-10 pointer-events-none" />

        <h2 className="text-5xl font-black tracking-tighter leading-[0.9]">
          SOLANA <br />
          <span className="text-zinc-600">MEETS</span> <br />
          ANDROID
        </h2>

        <p className="text-zinc-500 text-xs uppercase tracking-[0.2em] font-bold max-w-[240px] mx-auto pt-2">
          Mobile-native PWA template for the Solana dApp Store
        </p>

        {/* ─── ACTION AREA ─── */}
        <div className="pt-6 min-h-[72px] flex items-center justify-center">
          {!connected ? (
            <p className="text-zinc-600 text-[10px] uppercase tracking-[0.3em] font-bold animate-pulse">
              Connect wallet to begin
            </p>
          ) : status === 'success' ? (
            <div className="flex flex-col items-center gap-2 animate-in fade-in zoom-in duration-300">
              <div className="bg-[#14F195]/10 border border-[#14F195]/30 text-[#14F195] px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-tight">
                Identity Verified ✓
              </div>
              <p className="text-zinc-600 text-[10px] font-mono">
                {publicKey?.toBase58().slice(0, 8)}…{publicKey?.toBase58().slice(-8)}
              </p>
            </div>
          ) : (
            <button
              onClick={handleVerifyIdentity}
              disabled={status === 'pending'}
              className={`px-8 py-3.5 rounded-2xl font-black uppercase tracking-tight text-sm transition-all active:scale-95 ${
                status === 'pending'
                  ? 'bg-zinc-800 text-zinc-400 animate-pulse'
                  : status === 'error'
                    ? 'bg-red-500/20 border border-red-500/40 text-red-400'
                    : 'bg-white text-black'
              }`}
            >
              {status === 'pending'
                ? 'Check Your Wallet…'
                : status === 'error'
                  ? 'Try Again'
                  : 'Verify Mobile Identity'}
            </button>
          )}
        </div>
      </section>

      {/* ─── STATUS FOOTER ─── */}
      <footer className="w-full max-w-sm space-y-4">
        <div className="bg-zinc-900/40 border border-zinc-800/50 p-5 rounded-[2rem] backdrop-blur-xl">
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-[9px] text-zinc-600 uppercase font-black tracking-[0.3em] mb-1.5">
                System Status
              </p>
              <div className="flex items-center gap-2">
                <div className="relative flex items-center justify-center">
                  <div className={`w-2 h-2 rounded-full ${connected ? 'bg-[#14F195]' : 'bg-zinc-700'}`} />
                  {connected && (
                    <div className="absolute w-2 h-2 bg-[#14F195] rounded-full animate-ping opacity-75" />
                  )}
                </div>
                <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-widest">
                  {connected ? 'Session Active' : 'MWA Standby'}
                </span>
              </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

            <div className="flex justify-between items-end">
              <div>
                <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-[0.2em] mb-0.5">
                  Network
                </p>
                <p className="text-xs font-mono text-[#14F195]/80">Mainnet-Beta</p>
              </div>
              <div className="px-2.5 py-1 bg-zinc-800/50 border border-zinc-700/30 rounded-full text-[9px] font-bold text-zinc-500 uppercase tracking-tight">
                v1.1.0
              </div>
            </div>
          </div>
        </div>

        {/* Solana Mobile branding */}
        <div className="flex justify-center opacity-30">
          <Image
            src="/icons/solana-mobile-logo.png"
            alt="Solana Mobile"
            width={120}
            height={20}
            className="h-4 w-auto"
          />
        </div>
      </footer>
    </main>
  );
}
