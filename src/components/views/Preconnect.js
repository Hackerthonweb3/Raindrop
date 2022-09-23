import { CheckIcon } from "@chakra-ui/icons";
import { Flex, Text, Spinner, Image } from "@chakra-ui/react"
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useEffect } from "react";
import { useAccount, useNetwork } from "wagmi";
import { CHAIN_NAMES, SUPPORTED_CHAINS } from "../../utils/constants";
import { useOrbis } from "../../utils/context/orbis";

const Preconnect = () => {

    const { openConnectModal } = useConnectModal();
    const { isConnected } = useAccount();
    const { chain } = useNetwork()
    const { gettingUser, orbisChain, signing, connecting } = useOrbis();

    useEffect(() => {
        openConnectModal && openConnectModal();
    }, [])

    //console.log('Chains', SUPPORTED_CHAINS);

    return (
        <Flex alignItems='center' flexDirection='column' justifyContent='center' h='100vh' w='100vw' position='relative'>

            <Image src='/Logo.svg' maxW='30%' left='20px' top='20px' position='absolute' />

            {isConnected && connecting &&
                <Flex alignItems='center' mb='20px'>
                    <Spinner color="brand.500" />
                    <Text fontSize='3xl' fontWeight='semibold' ml='10px'>Logging in...</Text>
                </Flex>
            }

            {!connecting &&
                <Flex alignItems='center' flexDirection='column'>
                    <Flex alignItems='center' mb='20px'>
                        {isConnected ?
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
                            ((!SUPPORTED_CHAINS.includes(chain.id) && orbisChain && orbisChain != chain.id) ?
                                <Spinner color="brand.500" />
                                :
                                <CheckIcon color='green' boxSize={5} />
                            )
                        }
                        <Text fontSize='xl' fontWeight='semibold' ml='10px'>Select proper chain (the one in which you created your account ({CHAIN_NAMES[orbisChain]}))</Text>
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

            {/*
            <Text fontSize='5xl' align='center'>Logging in...</Text>
            <Text fontSize='xl' color='gray' align='center'>If prompted, please sign log in messages</Text>
            */}
        </Flex>
    )
}

export default Preconnect;