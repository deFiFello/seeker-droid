'use client';

import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'; 
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import {
    createDefaultAuthorizationCache,
    createDefaultChainSelector,
    createDefaultWalletNotFoundHandler,
    registerMwa,
} from '@solana-mobile/wallet-standard-mobile';

// 1. Client-side only registration
if (typeof window !== 'undefined') {
    registerMwa({
        appIdentity: {
            name: 'SeekerDroid',
            uri: 'https://seeker-droid.vercel.app',
            icon: 'favicon.ico', 
        },
        authorizationCache: createDefaultAuthorizationCache(),
        chains: ['solana:devnet', 'solana:mainnet'],
        chainSelector: createDefaultChainSelector(),
        onWalletNotFound: createDefaultWalletNotFoundHandler(),
    });
}

export function SolanaProvider({ children }: { children: React.ReactNode }) {
    // Switching to devnet for the test push
    const endpoint = useMemo(() => clusterApiUrl('devnet'), []);

    // 2. Mobile Wallet Adapter is now automatically injected via registerMwa
    const wallets = useMemo(() => [], []);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}