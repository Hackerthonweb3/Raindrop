import { Flex, Image, Text, Button, Spacer, createIcon, Switch } from "@chakra-ui/react"
import { useAccount, useDisconnect, useNetwork, useSigner } from "wagmi"
import { useOrbis } from '../../utils/context/orbis';
import { useLocation, useNavigate } from "react-router-dom";
import Blockies from 'react-blockies';
import formatAddress from "../../utils/formatAddress";
import { utils } from "ethers";
import { useEffect, useState } from "react";
import { isUserSubscribed, turnOffNotifications, turnOnNotifications } from "../../utils/epns";
import { ExploreIcon, FanToolsIcon, HomeIcon, MessagesIcon, MyProfileIcon } from "../Icons";

const Tab = (props) => {
    return (
        <Flex mt='30px' mx='25px' cursor='pointer' w='80%' pr='auto' borderRight='3px solid' borderColor='brand.400'>
            <Image src={props.icon} fill='brand.400' />
            <Text ml='10px' color='#8F9BBA' fontWeight='500' fontSize='xl'>{props.text}</Text>
        </Flex>
    )
}

const Sidebar = ({ setCreatingPost }) => {

    const { user, orbis } = useOrbis();
    const { address } = useAccount();
    const { disconnect } = useDisconnect()
    const { chain } = useNetwork();
    const signer = useSigner();

    const navigate = useNavigate();
    const location = useLocation();

    const [notifications, setNotifications] = useState(false);

    const handleMyProfile = () => {
        navigate('/app/profile/' + address || '')
    }
    const handleHome = () => {
        navigate('/app')
    }
    const handleExplore = () => {
        navigate('/app/explore')
    }
    const handleFanTools = () => {
        window.location.href = 'https://app.unlock-protocol.com/dashboard';
    }
    const handleMessages = () => {
        navigate('/app/messages')
    }

    const handleLogOut = async () => {
        disconnect()
        const res = await orbis.logout();
        if (res.status == 200) {
            console.log('Logged out')
            navigate('/')
            window.location.reload();
        }
    }

    const handleCreate = () => {
        setCreatingPost(true);
    }

    const handleToggleNotifications = async (e) => {
        setNotifications(!notifications); //For better UX

        if (chain.id != 80001) { //If not Mumbai, where EPNS test is
            alert('Please change to Mumbai where EPNS is located')
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x13881' }] //Mumbai hex (80001 to base16)
            })
        }

        if (notifications) {
            if (!await turnOffNotifications(address, signer)) { //If not, failed
                setNotifications(true) //Return to original
            }
        } else {
            if (!await turnOnNotifications(address, signer)) { //If not, failed
                setNotifications(false) //Return to original
            }
        }
    }

    const getNotif = async () => {
        const a = await isUserSubscribed(address);
        console.log('NOTIF', a)
        setNotifications(a)
    }

    useEffect(() => {
        getNotif();
    }, [])

    return (
        <Flex position='fixed' overflow='hidden' flexDirection='column' alignItems='center' h='100vh' minW='250px' maxW='250px' borderRight='1px solid' borderColor='brand.500'>
            <Image src='/Logo.svg' maxW='30%' m='20px' cursor='pointer' alignSelf='flex-start' />
            <Flex flexDirection='column' w='100%'>
                <Flex alignItems='center' onClick={handleHome} color={location.pathname == '/app' ? 'brand.500' : '#8F9BBA'} mt='30px' mx='25px' cursor='pointer' w='80%' pr='auto' borderRight='3px solid' borderColor={location.pathname == '/app' ? 'brand.500' : 'white'}>
                    <HomeIcon color='inherit' boxSize={6} />
                    <Text ml='10px' color='inherit' fontWeight='500' fontSize='xl'>Home</Text>
                </Flex>

                {address && user &&
                    <Flex alignItems='center' onClick={handleMyProfile} color={location.pathname == ('/app/profile/' + address) ? 'brand.500' : '#8F9BBA'} mt='20px' mx='25px' cursor='pointer' w='80%' pr='auto' borderRight='3px solid' borderColor={location.pathname == ('/app/profile/' + address) ? 'brand.500' : 'white'}>
                        <MyProfileIcon color='inherit' boxSize={6} />
                        <Text ml='10px' color='inherit' fontWeight='500' fontSize='xl'>My Profile</Text>
                    </Flex>
                }

                <Flex alignItems='center' onClick={handleExplore} mt='20px' color={location.pathname == '/app/explore' ? 'brand.500' : '#8F9BBA'} mx='25px' cursor='pointer' w='80%' pr='auto' borderRight='3px solid' borderColor={location.pathname == '/app/explore' ? 'brand.500' : 'white'}>
                    <ExploreIcon color='inherit' boxSize={6} />
                    <Text ml='10px' color='inherit' fontWeight='500' fontSize='xl'>Explore</Text>
                </Flex>

                <Flex alignItems='center' onClick={handleMessages} mt='20px' color={location.pathname == '/app/messages' ? 'brand.500' : '#8F9BBA'} mx='25px' cursor='pointer' w='80%' pr='auto' borderRight='3px solid' borderColor={location.pathname == '/app/messages' ? 'brand.500' : 'white'}>
                    <MessagesIcon color='inherit' boxSize={6} />
                    <Text ml='10px' color='inherit' fontWeight='500' fontSize='xl'>Messages</Text>
                </Flex>

                <Flex alignItems='center' onClick={handleFanTools} mt='20px' mx='25px' color='#8F9BBA' cursor='pointer' w='80%' pr='auto' borderRight='3px solid' borderColor='white'>
                    <FanToolsIcon color='inherit' boxSize={6} />
                    <Text ml='10px' color='inherit' fontWeight='500' fontSize='xl'>Fan tools</Text>
                </Flex>

                {/*
                <Flex mt='20px' mx='25px' cursor='pointer' w='80%' pr='auto' borderRight='3px solid' borderColor='brand.400'>
                <Image src="/myProfile.svg" fill='brand.400' />
                <Text ml='10px' color='#8F9BBA' fontWeight='500' fontSize='xl'>Settings</Text>
                </Flex>
            */}
            </Flex>

            <Button onClick={handleCreate} borderRadius='70px' mt='50px' w='70%' colorScheme='brand' color='white'>Create</Button>

            <Spacer />

            {/*
            <Flex alignItems='center' mb='10px' w='100%'>
                <Switch ml='10px' isChecked={notifications} onChange={handleToggleNotifications} />
                <Text ml='8px' fontWeight='semibold'>EPNS notifications</Text>
            </Flex>
            */}

            {address && user &&
                <Flex w='100%' p='10px' alignItems='center' borderBottom='1px solid' borderTop='1px solid' borderColor='brand.500'>
                    <Flex ml='10px' cursor='pointer' alignItems='center' onClick={handleLogOut} >
                        <Image src='/logout.svg' />
                        <Text ml='10px' fontWeight='semibold' color='brand.500'>Log Out</Text>
                    </Flex>
                </Flex>
            }

            {address && user &&
                <Flex w='100%' p='10px' alignItems='center' cursor='pointer' onClick={() => navigate('/app/profile/' + address)}>
                    {user && user.details.profile && user.details.profile.pfp ?
                        <Image src={user.details.profile.pfp} maxH='50px' max='70px' />
                        :
                        <Blockies seed={utils.getAddress(address)} scale={4} />
                    }
                    <Text ml='10px' fontWeight='semibold'>{((user && user.username) || formatAddress(address))}</Text>
                </Flex>
            }
        </Flex>
    )
}

export default Sidebar;