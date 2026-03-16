'use client';

import { useMemo, useEffect, useRef } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { clusterApiUrl } from '@solana/web3.js';
import {
  createDefaultAuthorizationCache,
  createDefaultChainSelector,
  createDefaultWalletNotFoundHandler,
  registerMwa,
} from '@solana-mobile/wallet-standard-mobile';

function RegisterMwa() {
  const registered = useRef(false);

  useEffect(() => {
    // Register exactly once, guaranteed client-side (no SSR)
    if (registered.current) return;
    registered.current = true;

    registerMwa({
      appIdentity: {
        name: 'SeekerDroid',
        uri: 'https://seeker-droid.vercel.app',
        icon: '/icons/icon-192x192.png',
      },
      authorizationCache: createDefaultAuthorizationCache(),
      chains: ['solana:mainnet', 'solana:devnet'],
      chainSelector: createDefaultChainSelector(),
      onWalletNotFound: createDefaultWalletNotFoundHandler(),
    });
  }, []);

  return null;
}

export function SolanaProvider({ children }: { children: React.ReactNode }) {
  const endpoint = useMemo(() => clusterApiUrl('mainnet-beta'), []);
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      {/* autoConnect MUST be false — MWA requires user-initiated actions on Android Chrome */}
      <WalletProvider wallets={wallets} autoConnect={false}>
        <RegisterMwa />
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
}