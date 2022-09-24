import { Flex, Spacer, Image, Button } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useNavigate } from 'react-router-dom';

const Header = () => {

    const navigate = useNavigate();

    return (
        <Flex p='10px 30px 0 30px' align='center' w='100%'>
            <Image src='/HeaderLogo.svg' maxH='120px' />
            <Spacer />
            {/*<ConnectButton chainStatus='icon' accountStatus='address' showBalance={false} />*/}
            <Button colorScheme='brand' borderRadius='70px' px='40px' onClick={() => navigate('/app')}>Enter App</Button>
        </Flex>
    )
}

export default Header;