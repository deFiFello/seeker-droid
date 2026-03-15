'use client';

import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'; 
import { clusterApiUrl } from '@solana/web3.js';
import {
    createDefaultAuthorizationCache,
    createDefaultChainSelector,
    registerMwa,
} from '@solana-mobile/wallet-standard-mobile';

if (typeof window !== 'undefined') {
    registerMwa({
        appIdentity: {
            name: 'SeekerDroid',
            uri: 'https://seeker-droid.vercel.app',
            icon: 'favicon.ico', 
        },
        authorizationCache: createDefaultAuthorizationCache(),
        chains: ['solana:mainnet'],
        chainSelector: createDefaultChainSelector(),
        // THE FIX: This empty function prevents the library from 
        // triggering the default redirect/modal UI on your Seeker.
        onWalletNotFound: async () => {} 
    });
}

export function SolanaProvider({ children }: { children: React.ReactNode }) {
    const endpoint = useMemo(() => clusterApiUrl('mainnet-beta'), []);
    const wallets = useMemo(() => [], []);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                {children}
            </WalletProvider>
        </ConnectionProvider>
    );
}