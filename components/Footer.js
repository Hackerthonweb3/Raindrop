import { Flex, Text, Spacer } from '@chakra-ui/react'

const Footer = () => {
    return(
        <Flex backgroundColor='rgba(0, 78, 100, 1)' position='absolute' bottom='0' w='100%' alignItems='center'>
            <Text fontSize='2xl' color='white' py='15px' ml='20px'>Raindrop</Text>
            <Text color='white' ml='50px'>Copyright, all rights reserved. 2022</Text>
            <Text color='white' ml='50px'>Terms and conditions</Text>
            <Text color='white' ml='50px'>Privacy policy</Text>
            <Text color='white' ml='50px'>Cookies</Text>
            <Text color='white' ml='50px'>Security</Text>
        </Flex>
    )
}

export default Footer;