import { Flex, Image, Text, Button, Spacer } from "@chakra-ui/react"
import { useAccount } from "wagmi"
import { useOrbis } from '../../utils/context/orbis';

const Tab = (props) => {
    return (
        <Flex mt='30px' mx='25px' cursor='pointer' w='80%' pr='auto' borderRight='3px solid' borderColor='brand.400'>
            <Image src={props.icon} fill='brand.400' />
            <Text ml='10px' color='#8F9BBA' fontWeight='500' fontSize='xl'>{props.text}</Text>
        </Flex>
    )
}

const tabs = [{ text: 'My Profile', icon: 'myProfile.svg' }]

const Sidebar = (props) => {

    const { user } = useOrbis();
    const { address } = useAccount();

    return (
        <Flex position='fixed' overflow='hidden' flexDirection='column' alignItems='center' h='100vh' minW='250px' maxW='250px' borderRight='1px solid' borderColor='brand.400'>
            <Image src='Logo.svg' maxW='30%' m='20px' cursor='pointer' alignSelf='flex-start' />
            <Flex flexDirection='column' w='100%'>
                <Flex color='brand.400' mt='30px' mx='25px' cursor='pointer' w='80%' pr='auto' borderRight='3px solid' borderColor='brand.400'>
                    <object data="myProfile.svg" style={{ fill: 'brand.400' }} />
                    <Text ml='10px' color='#8F9BBA' fontWeight='500' fontSize='xl'>My Profile</Text>
                </Flex>

                <Flex mt='20px' mx='25px' cursor='pointer' w='80%' pr='auto' borderRight='3px solid' borderColor='brand.400'>
                    <Image src="myProfile.svg" fill='brand.400' />
                    <Text ml='10px' color='#8F9BBA' fontWeight='500' fontSize='xl'>Explore</Text>
                </Flex>

                <Flex mt='20px' mx='25px' cursor='pointer' w='80%' pr='auto' borderRight='3px solid' borderColor='brand.400'>
                    <Image src="myProfile.svg" fill='brand.400' />
                    <Text ml='10px' color='#8F9BBA' fontWeight='500' fontSize='xl'>Messages</Text>
                </Flex>

                <Flex mt='20px' mx='25px' cursor='pointer' w='80%' pr='auto' borderRight='3px solid' borderColor='brand.400'>
                    <Image src="myProfile.svg" fill='brand.400' />
                    <Text ml='10px' color='#8F9BBA' fontWeight='500' fontSize='xl'>Fan tools</Text>
                </Flex>

                <Flex mt='20px' mx='25px' cursor='pointer' w='80%' pr='auto' borderRight='3px solid' borderColor='brand.400'>
                    <Image src="myProfile.svg" fill='brand.400' />
                    <Text ml='10px' color='#8F9BBA' fontWeight='500' fontSize='xl'>Settings</Text>
                </Flex>
            </Flex>

            <Button borderRadius='70px' mt='50px' w='70%' colorScheme='brand' color='white'>Create</Button>

            <Spacer />

            <Flex w='100%'>
                {user && (user.username || address)}
            </Flex>
        </Flex>
    )
}

export default Sidebar;