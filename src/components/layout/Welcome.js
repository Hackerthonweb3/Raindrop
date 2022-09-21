import { Flex, Text, Image, Button, IconButton } from "@chakra-ui/react";
import { CloseIcon } from '@chakra-ui/icons'
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";


const Welcome = ({ setWelcome }) => {

    const navigate = useNavigate()
    const { address } = useAccount()

    const handleBecomeCreator = () => {
        setWelcome(false);
        navigate('profile/' + address + '?editing=true');
    }

    return (
        <Flex
            alignItems='center'
            justifyContent='center'
            position='fixed'
            bottom='0px'
            left='0px'
            h='100vh'
            w='100vw'
            backdropFilter='blur(5px)'
            backgroundColor='rgba(10,10,10,0.3)'
            zIndex={5}
        >
            <Flex
                backgroundColor='white'
                boxShadow='0px 4px 4px 0px rgba(0, 0, 0, 0.25)'
                borderRadius='26px'
                sx={{
                    background: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(90deg, #0085AB 0%, #2CB2C3 34.2%, #F9D520 69.77%, #D1D922 102.6%) border-box',
                    border: '3px solid transparent',
                }}
                flexDirection='column'
                minW='500px'
                alignItems='center'
                maxW='45%'
                position='relative'
            >
                <Image src='/welcome.png' />
                <IconButton onClick={() => setWelcome(false)} icon={<CloseIcon />} variant='ghost' position='absolute' right='10px' top='10px' />
                <Text mt='20px' fontSize='3xl' fontWeight='bold'>Welcome to <span style={{ color: '#3192E7' }}>Raindrop!</span></Text>
                <Text px='30px' mt='10px' color='#848484' w='80%' align='center'><span style={{ color: '#0085AB' }}>Congratulations!</span> You’re so close to sharing with the world! Let’s get you on track. Become a creator
                    and start posting content.</Text>
                <Button onClick={handleBecomeCreator} borderRadius='70px' colorScheme='brand' px='40px' my='20px'>Become a Creator</Button>
            </Flex>
        </Flex>
    )
}

export default Welcome;