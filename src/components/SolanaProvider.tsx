'use client';

import { useMemo, ReactNode } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { 
    SolanaMobileWalletAdapter, 
    createDefaultAuthorizationResultCache, 
    createDefaultAddressSelector, 
    createDefaultWalletNotFoundHandler 
} from '@solana-mobile/wallet-adapter-mobile';

import '@solana/wallet-adapter-react-ui/styles.css';

export function SolanaProvider({ children }: { children: ReactNode }) {
    // 1. Force Devnet for testing (ensure your wallet is ALSO on devnet)
    const network = WalletAdapterNetwork.Devnet; 
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            new SolanaMobileWalletAdapter({
                addressSelector: createDefaultAddressSelector(),
                appIdentity: {
                    name: 'SeekerDroid',
                    uri: 'https://seeker-droid.vercel.app', // MUST match your Vercel URL
                    icon: 'favicon.ico', // Relative to the URI
                },
                // 2. THIS IS THE FIX: Explicitly tell MWA to save the connection in LocalStorage
                authorizationResultCache: createDefaultAuthorizationResultCache(),
                cluster: 'devnet',
                onWalletNotFound: createDefaultWalletNotFoundHandler(),
            }),
        ],
        []
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            {/* 3. autoConnect is essential for MWA to pick up the session on redirect */}
            <WalletProvider wallets={wallets} autoConnect={true}>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}