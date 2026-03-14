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
    // SWITCHED TO MAINNET
    const network = WalletAdapterNetwork.Mainnet; 
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            new SolanaMobileWalletAdapter({
                addressSelector: createDefaultAddressSelector(),
                appIdentity: {
                    name: 'SeekerDroid',
                    uri: 'https://seeker-droid.vercel.app',
                    icon: 'https://seeker-droid.vercel.app/favicon.ico', 
                },
                authorizationResultCache: createDefaultAuthorizationResultCache(),
                cluster: 'mainnet-beta', // Must match network
                onWalletNotFound: createDefaultWalletNotFoundHandler(),
            }),
        ],
        []
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}