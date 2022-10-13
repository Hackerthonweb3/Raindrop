import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, getDefaultWallets, ConnectButton } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, useAccount, WagmiConfig } from 'wagmi';
import { Flex, ChakraProvider } from '@chakra-ui/react'
import { publicProvider } from 'wagmi/providers/public';
import { theme } from './utils/theme'
import { OrbisProvider, useOrbis } from './utils/context/orbis';
import { useEffect, useState, lazy } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from './pages/landingPage';
import Preconnect from './views/Preconnect'
import Welcome from './components/layout/Welcome';
import Home from './views/Home';
import Explore from './views/Explore';
import Sidebar from './components/layout/Sidebar'
import CreatePost from './components/layout/CreatePost';
// import { alchemyProvider } from 'wagmi/providers/alchemy'
import Profile from './views/Profile'
import Messages from './views/Messages';
//const Profile = lazy(() => import('./components/views/Profile'));

const { chains, provider } = configureChains(
  [
    chain.polygon,
    // chain.optimism,
    // chain.goerli,//, chain.kovan, chain.rinkeby, chain.ropsten]
    chain.polygonMumbai
  ],
  [
    //alchemyProvider({ apiKey: 's-FtLQnuBa8xOD2WNGzq6RCKUxVVFYdT', priority: 0 }), //Polygon Main
    //alchemyProvider({ apiKey: 's-o9X09EYTouSzDJBTy7zXVxMm7MoRUQhu', priority: 0 }), //Polygon Mumbai
    publicProvider({ priority: 1 }),
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
  const { user, welcome, setWelcome, orbis } = useOrbis()
  const [creatingPost, setCreatingPost] = useState(false);

  useEffect(() => {
    window.ethereum.on('accountsChanged', async () => {
      const res = await orbis.logout();
      if (res.status == 200) {
        console.log('Logged out')
        window.location.reload();
      }
    })
  }, [])

  return (
    <div>

      <div style={{ position: 'fixed', right: '10px', top: '10px', zIndex: '10' }}>
        <ConnectButton chainStatus='icon' accountStatus='address' showBalance={false} />
      </div>

      {(isConnected && user)
        ? (
          <Flex w='100%' height='100vh'>
            <Sidebar setCreatingPost={setCreatingPost} />
            {welcome && <Welcome setWelcome={setWelcome} />}
            {creatingPost && <CreatePostPopup setCreatingPost={setCreatingPost} />}
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='profile/:profileAddress' element={<Profile />} />
              <Route path='explore' element={<Explore />} />
              <Route path='messages' element={<Messages />} />
            </Routes>

          </Flex>
        )
        : <Preconnect />
      }
    </div>
  )
}

const CreatePostPopup = ({ setCreatingPost }) => {

  return (
    <Flex
      alignItems='center'
      justifyContent='center'
      position='fixed'
      bottom='0px'
      left='0px'
      h='100vh'
      w='100vw'
      backdropFilter='blur(5px)'
      backgroundColor='rgba(10,10,10,0.3)'
      zIndex={5}
    >
      <Flex
        backgroundColor='white'
        minW='450px'
        w='60%'
      >
        <CreatePost popUp setCreatingPost={setCreatingPost} />
      </Flex>
    </Flex>
  )
}
