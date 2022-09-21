import { Flex, Spacer, Image } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Header = () => {
    return (
        <Flex p='10px 30px 0 30px' align='center'  w='100%'>
            <Image src='/HeaderLogo.svg' maxH='120px'/>
            <Spacer />
            <ConnectButton chainStatus='icon' accountStatus='address' showBalance={false} />
        </Flex>
    )
}

export default Header;