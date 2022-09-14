import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useState } from 'react';
import { useAccount, useProvider } from 'wagmi';
import { Flex } from "@chakra-ui/react"
import Preconnect from './views/Preconnect';
import { useOrbis } from '../utils/context/orbis';
import Sidebar from './layout/Sidebar';
import Profile from './views/Profile';

const Application = () => {

    const { isConnected } = useAccount();
    const [tab, setTab] = useState(0);

    const provider = useProvider();
    const { user } = useOrbis();

    console.log('User', user);

    provider.on("network", (newNetwork, oldNetwork) => {
        console.log('New network', newNetwork);
        if(oldNetwork) {
            window.location.reload();
        }
    })

    return (
        <div>
            <div style={{ position: 'fixed', right: '10px', top: '10px', zIndex:'10'}}>
                <ConnectButton chainStatus='icon' accountStatus='address' showBalance={false} />
            </div>

            {(isConnected && user)
                ? (
                    <Flex w='100%' height='100vh'>
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