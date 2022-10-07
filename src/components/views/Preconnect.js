import { CheckIcon } from "@chakra-ui/icons";
import { Flex, Text, Spinner, Image } from "@chakra-ui/react"
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useOrbis } from "../../utils/context/orbis";

const Preconnect = () => {

    const { openConnectModal } = useConnectModal();
    const { isConnected } = useAccount();
    const { gettingUser, signing, connecting } = useOrbis();

    useEffect(() => {
        !isConnected && openConnectModal && openConnectModal();
    }, [])

    return (
        <Flex alignItems='center' flexDirection='column' justifyContent='center' h='100vh' w='100vw' position='relative'>

            <Image src='/Logo.svg' maxW='30%' left='20px' top='20px' position='absolute' />

            {!connecting && //Not connecting to orbis (No previous session)
                <Flex alignItems='center' flexDirection='column'>
                    <Flex alignItems='center' mb='20px'>
                        {isConnected ? //Wallet connected?
                            <CheckIcon color='green' boxSize={5} />
                            :
                            <Spinner color="brand.500" />
                        }
                        <Text fontSize='xl' fontWeight='semibold' ml='10px'>Connect Wallet</Text>
                    </Flex>
                    <Flex alignItems='center' mb='20px'>
                        {isConnected &&
                            gettingUser ?
                            <CheckIcon color='green' boxSize={5} />
                            :
                            (signing &&
                                <Spinner color="brand.500" />
                            )
                        }
                        <Text fontSize='xl' fontWeight='semibold' ml='10px'>Sign login messages</Text>
                    </Flex>
                </Flex>
            }

            {isConnected && connecting && //Connecting to orbis...
                <Flex alignItems='center' mb='20px'>
                    <Spinner color="brand.500" />
                    <Text fontSize='3xl' fontWeight='semibold' ml='10px'>Logging in...</Text>
                </Flex>
            }
        </Flex>
    )
}

export default Preconnect;