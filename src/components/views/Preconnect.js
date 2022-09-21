import { Flex, Text } from "@chakra-ui/react"
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useEffect } from "react";


const Preconnect = () => {

    const { openConnectModal } = useConnectModal();

    useEffect(() => {
        openConnectModal && openConnectModal();
    }, [])

    return (
        <Flex alignItems='center' flexDirection='column' justifyContent='center' h='100vh' w='100vw'>
            <Text fontSize='5xl' align='center'>Logging in...</Text>
            <Text fontSize='xl' color='gray' align='center'>If prompted, please sign log in messages</Text>
        </Flex>
    )
}

export default Preconnect;