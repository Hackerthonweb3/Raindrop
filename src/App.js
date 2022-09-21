import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, getDefaultWallets, ConnectButton } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, useAccount, WagmiConfig } from 'wagmi';
import { Flex, ChakraProvider } from '@chakra-ui/react'
import { publicProvider } from 'wagmi/providers/public';
import { theme } from './utils/theme'
import { OrbisProvider, useOrbis } from './utils/context/orbis';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useRoutes } from "react-router-dom";
import LandingPage from './pages/landingPage';
import Profile from './components/views/Profile'
import Sidebar from './components/layout/Sidebar'
import Preconnect from './components/views/Preconnect'
import Welcome from './components/layout/Welcome';
import Home from './components/views/Home';
import Explore from './components/views/Explore';

const { chains, provider } = configureChains(
  [
    chain.polygon,
    chain.optimism,
    //...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true'
    chain.goerli//, chain.kovan, chain.rinkeby, chain.ropsten]
    //  : []),
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


export default function App() {

  useEffect(() => {
    window.ethereum.on('chainChanged', () => {
      document.location.reload();
    })
  }, [])

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <ChakraProvider theme={theme}>
          <OrbisProvider>
            <BrowserRouter>
              <Routes>
                <Route path='/' element={<LandingPage />} />
                <Route path='/app/*' element={<RoutingWrapper />} />
              </Routes>
            </BrowserRouter>

          </OrbisProvider>

        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

const RoutingWrapper = () => {

  const { isConnected } = useAccount()
  const { user, welcome, setWelcome } = useOrbis()

  console.log('User', user);
  console.log('isConnceted', isConnected);

  return (
    <div>

      <div style={{ position: 'fixed', right: '10px', top: '10px', zIndex: '10' }}>
        <ConnectButton chainStatus='icon' accountStatus='address' showBalance={false} />
      </div>

      {(isConnected && user)
        ? (
          <Flex w='100%' height='100vh'>
            <Sidebar />
            {welcome && <Welcome setWelcome={setWelcome} />}
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='profile/:profileAddress' element={<Profile />} />
              <Route path='explore' element={<Explore />} />
            </Routes>

          </Flex>
        )
        : <Preconnect />
      }


    </div>
  )

}