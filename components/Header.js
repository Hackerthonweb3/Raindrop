import { Flex, Spacer, Button, Image } from '@chakra-ui/react'
import { useRouter } from 'next/router'


const Header = () => {

    const router = useRouter();

    const handleConnect = () => {
        //router.push('App');
    }

    return (
        <Flex p='10px 30px 0 30px' align='center'>
            <Image src='/HeaderLogo.svg' maxH='120px'/>
            <Spacer />
            <Button
                mr='10px'
                variant='solid'
                borderRadius='20px'
                onClick={handleConnect}
                colorScheme='blue'
            >Connect Wallet</Button>
        </Flex>
    )
}

export default Header;