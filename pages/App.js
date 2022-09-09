import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, getDefaultWallets, ConnectButton } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { ChakraProvider } from '@chakra-ui/react'
import { publicProvider } from 'wagmi/providers/public';
import Header from '../components/Header';

const { chains, provider } = configureChains(
    [
        chain.polygon,
        chain.optimism,
        ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true'
            ? [chain.goerli, chain.kovan, chain.rinkeby, chain.ropsten]
            : []),
    ],
    [
        publicProvider(),
    ]
);

const { connectors } = getDefaultWallets({
    appName: 'Raindrop',
    chains,
});

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
});


export default function Home() {

    return (
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains}>
                <ChakraProvider>
                    <Header />
                    TEST
                </ChakraProvider>
            </RainbowKitProvider>
        </WagmiConfig>
    )
}