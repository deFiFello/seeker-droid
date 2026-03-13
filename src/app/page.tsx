import WalletButton from "@/components/WalletButton";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-between p-6 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
      {/* Header */}
      <div className="w-full flex justify-between items-center">
        <h1 className="text-xl font-black tracking-tighter italic uppercase">
          Seeker<span className="text-[#14F195]">Droid</span>
        </h1>
        <WalletButton />
      </div>

      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black tracking-tight leading-none">
          SOLANA <br />
          <span className="text-zinc-500">MEETS</span> <br />
          ANDROID
        </h2>
        <p className="text-zinc-400 max-w-[280px] mx-auto text-sm leading-relaxed">
          The cross-compatible PWA template optimized for the Solana Seeker.
        </p>
      </div>

      {/* Hardware-Style Status Card */}
      <div className="w-full bg-zinc-900/40 border border-zinc-800 p-5 rounded-[2rem] backdrop-blur-md">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-[0.2em] mb-2">System Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#14F195] rounded-full shadow-[0_0_8px_#14F195]" />
              <span className="text-xs font-bold text-zinc-200 uppercase tracking-wide">MWA Provider Initialized</span>
            </div>
          </div>
          
          <div className="h-[1px] w-full bg-zinc-800" />
          
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-[0.2em] mb-1">Environment</p>
              <p className="text-xs font-mono text-zinc-400">Mainnet-Beta / Seeker</p>
            </div>
            <div className="px-2 py-1 bg-zinc-800 rounded text-[9px] font-bold text-zinc-500 uppercase">
              v1.0.0
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}