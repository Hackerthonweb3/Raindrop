import { Flex, Text } from "@chakra-ui/react"
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useEffect } from "react";


const Preconnect = () => {

    const { openConnectModal } = useConnectModal();

    useEffect(() => {
        openConnectModal && openConnectModal();
    }, [])

    return (
        <Flex alignItems='center' justifyContent='center' h='100vh' w='100vw'>
            <Text fontSize='5xl' align='center'>Please connect your wallet</Text>
        </Flex>
    )
}

export default Preconnect;