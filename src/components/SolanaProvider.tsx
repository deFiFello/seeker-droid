'use client';

import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'; 
import { clusterApiUrl } from '@solana/web3.js';
import {
    createDefaultAuthorizationCache,
    createDefaultChainSelector,
    createDefaultWalletNotFoundHandler,
    registerMwa,
} from '@solana-mobile/wallet-standard-mobile';

// We register MWA globally to ensure the Seeker hardware is recognized
if (typeof window !== 'undefined') {
    registerMwa({
        appIdentity: {
            name: 'SeekerDroid',
            uri: 'https://seeker-droid.vercel.app',
            icon: 'favicon.ico', 
        },
        authorizationCache: createDefaultAuthorizationCache(),
        chains: ['solana:mainnet', 'solana:devnet'],
        chainSelector: createDefaultChainSelector(),
        onWalletNotFound: createDefaultWalletNotFoundHandler(),
    });
}

export function SolanaProvider({ children }: { children: React.ReactNode }) {
    // Standard endpoint for Mainnet
    const endpoint = useMemo(() => clusterApiUrl('mainnet-beta'), []);
    
    // We leave this empty because MWA 2.0 handles wallet discovery automatically
    const wallets = useMemo(() => [], []);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                {/* WalletModalProvider is GONE. 
                  This prevents the "We can't find a wallet" popup from Screenshot 4568.
                */}
                {children}
            </WalletProvider>
        </ConnectionProvider>
    );
}