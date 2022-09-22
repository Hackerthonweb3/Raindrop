import { CheckIcon } from "@chakra-ui/icons";
import { Flex, Text, Spinner } from "@chakra-ui/react"
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useEffect } from "react";
import { useAccount, useNetwork } from "wagmi";
import { SUPPORTED_CHAINS } from "../../utils/constants";
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
        <Flex alignItems='center' flexDirection='column' justifyContent='center' h='100vh' w='100vw'>

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
                            ((SUPPORTED_CHAINS.includes(chain.id) && orbisChain == chain.id) ?
                                <CheckIcon color='green' boxSize={5} />
                                :
                                <Spinner color="brand.500" />
                            )
                        }
                        <Text fontSize='xl' fontWeight='semibold' ml='10px'>Select proper chain (the one in which you created your account)</Text>
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