import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { ChakraProvider } from '@chakra-ui/react'
import { publicProvider } from 'wagmi/providers/public';
import Application from '../components/Application';
import { theme } from '../utils/theme'
import { OrbisProvider } from '../utils/context/orbis';

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
                <ChakraProvider theme={theme}>
                    <OrbisProvider>

                        <Application />

                    </OrbisProvider>
                </ChakraProvider>
            </RainbowKitProvider>
        </WagmiConfig>
    )
}