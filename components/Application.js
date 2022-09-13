import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Orbis } from '@orbisclub/orbis-sdk'
import { Flex } from "@chakra-ui/react"
import Preconnect from './views/Preconnect';
import { useOrbis } from '../utils/context/orbis';
import Register from './views/Register';
import Sidebar from './layout/Sidebar';
import Profile from './layout/Profile';

let orbis = new Orbis();

const Application = () => {

    const { address, isConnected } = useAccount();
    const [tab, setTab] = useState(0);

    const { user } = useOrbis();

    console.log('User', user);

    return (
        <div>
            <div style={{ position: 'absolute', right: '10px', top: '10px   ' }}>
                <ConnectButton chainStatus='icon' accountStatus='address' showBalance={false} />
            </div>

            {(isConnected && user)
                ? (
                    <Flex w='100vw' height='100vh'>
                        <Sidebar tab={tab} setTab={setTab} />
                        {tab == 0 && <Profile />}

                    </Flex>
                )
                : <Preconnect />
            }

        </div>
    )
}

export default Application;