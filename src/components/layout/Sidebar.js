import { Flex, Image, Text, Button, Spacer, createIcon } from "@chakra-ui/react"
import { useAccount, useDisconnect } from "wagmi"
import { useOrbis } from '../../utils/context/orbis';
import { useLocation, useNavigate } from "react-router-dom";
import Blockies from 'react-blockies';


const Tab = (props) => {
    return (
        <Flex mt='30px' mx='25px' cursor='pointer' w='80%' pr='auto' borderRight='3px solid' borderColor='brand.400'>
            <Image src={props.icon} fill='brand.400' />
            <Text ml='10px' color='#8F9BBA' fontWeight='500' fontSize='xl'>{props.text}</Text>
        </Flex>
    )
}

const Sidebar = () => {

    const { user, orbis } = useOrbis();
    const { address } = useAccount();
    const { disconnect } = useDisconnect()

    const navigate = useNavigate();
    const location = useLocation();

    const handleMyProfile = () => {
        navigate('/app/profile/' + address)
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

    const handleLogOut = async () => {
        disconnect()
        const res = await orbis.logout();
        if (res.status == 200) {
            console.log('Logged out')
            navigate('/')
        }
    }

    return (
        <Flex position='fixed' overflow='hidden' flexDirection='column' alignItems='center' h='100vh' minW='250px' maxW='250px' borderRight='1px solid' borderColor='brand.400'>
            <Image src='/Logo.svg' maxW='30%' m='20px' cursor='pointer' alignSelf='flex-start' />
            <Flex flexDirection='column' w='100%'>
                <Flex alignItems='center' onClick={handleHome} color={location.pathname == '/app' ? 'brand.500' : '#8F9BBA'} mt='30px' mx='25px' cursor='pointer' w='80%' pr='auto' borderRight='3px solid' borderColor={location.pathname == '/app' ? 'brand.500' : 'white'}>
                    <HomeIcon color='inherit' boxSize={5} />
                    <Text ml='10px' color='inherit' fontWeight='500' fontSize='xl'>Home</Text>
                </Flex>

                <Flex alignItems='center' onClick={handleMyProfile} color={location.pathname == ('/app/profile/' + address) ? 'brand.500' : '#8F9BBA'} mt='20px' mx='25px' cursor='pointer' w='80%' pr='auto' borderRight='3px solid' borderColor={location.pathname == ('/app/profile/' + address) ? 'brand.500' : 'white'}>
                    <MyProfileIcon color='inherit' boxSize={5} />
                    <Text ml='10px' color='inherit' fontWeight='500' fontSize='xl'>My Profile</Text>
                </Flex>

                <Flex alignItems='center' onClick={handleExplore} mt='20px' color={location.pathname == '/app/explore' ? 'brand.500' : '#8F9BBA'} mx='25px' cursor='pointer' w='80%' pr='auto' borderRight='3px solid' borderColor={location.pathname == '/app/explore' ? 'brand.500' : 'white'}>
                    <ExploreIcon color='inherit' boxSize={5} />
                    <Text ml='10px' color='inherit' fontWeight='500' fontSize='xl'>Explore</Text>
                </Flex>

                {/**
                <Flex mt='20px' mx='25px' cursor='pointer' w='80%' pr='auto' borderRight='3px solid' borderColor='brand.400'>
                    <Image src="/myProfile.svg" fill='brand.400' />
                    <Text ml='10px' color='#8F9BBA' fontWeight='500' fontSize='xl'>Messages</Text>
                </Flex>
                */}

                <Flex alignItems='center' onClick={handleFanTools} mt='20px' mx='25px' color='#8F9BBA' cursor='pointer' w='80%' pr='auto' borderRight='3px solid' borderColor='white'>
                    <FanToolsIcon color='inherit' boxSize={5} />
                    <Text ml='10px' color='inherit' fontWeight='500' fontSize='xl'>Fan tools</Text>
                </Flex>

                {/*
                <Flex mt='20px' mx='25px' cursor='pointer' w='80%' pr='auto' borderRight='3px solid' borderColor='brand.400'>
                    <Image src="/myProfile.svg" fill='brand.400' />
                    <Text ml='10px' color='#8F9BBA' fontWeight='500' fontSize='xl'>Settings</Text>
                </Flex>
                */}
            </Flex>

            <Button borderRadius='70px' mt='50px' w='70%' colorScheme='brand' color='white'>Create</Button>

            <Spacer />

            <Flex w='100%' p='10px' alignItems='center' borderBottom='1px solid' borderTop='1px solid' borderColor='brand.500'>
                <Flex cursor='pointer' alignItems='center' onClick={handleLogOut} >
                    <Image src='/logout.svg' />
                    <Text ml='10px' fontWeight='semibold' color='brand.500'>Log Out</Text>
                </Flex>
            </Flex>

            <Flex w='100%' p='10px' alignItems='center' cursor='pointer' onClick={() => navigate('/app/profile/' + address)}>
                {user && user.details.profile && user.details.profile.pfp ?
                    <Image src={'https://' + user.details.profile.pfp + '.ipfs.w3s.link'} maxH='50px' max='70px' />
                    :
                    <Blockies seed={address} scale={4} />
                }
                {user && <Text ml='10px' fontWeight='semibold'>{(user.username || address)}</Text>}
            </Flex>
        </Flex>
    )
}

const MyProfileIcon = createIcon({
    viewBox: "0 0 24 24",
    path: [
        <path fillRule="evenodd" clipRule="evenodd" d="M11.964 12.655c-2.193 0-3.972 1.697-3.972 3.791v1.084c0 .299-.254.541-.567.541a.555.555 0 0 1-.568-.541v-1.084c0-2.692 2.287-4.875 5.107-4.875 2.82 0 5.107 2.183 5.107 4.875v1.084c0 .299-.254.541-.567.541a.555.555 0 0 1-.568-.541v-1.084c0-2.094-1.778-3.791-3.972-3.791Z" fill="currentColor" />,
        <path fillRule="evenodd" clipRule="evenodd" d="M11.964 11.417a2.167 2.167 0 1 0 0-4.334 2.167 2.167 0 0 0 0 4.334Zm0 1.083a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Z" fill="currentColor" />,
        <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" fill='none' />
    ]
})

const HomeIcon = createIcon({
    viewBox: "0 0 30 30",
    path: [
        <path fillRule="evenodd" clipRule="evenodd" d="M14.9897 5.21406L15.0002 5.20864L15.0111 5.2143L20.5779 8.55438L22.5002 9.71253V23.5001C22.5002 24.2414 22.4982 24.6471 22.4744 24.9385L22.4715 24.9715L22.4386 24.9744C22.1471 24.9982 21.7415 25.0001 21.0002 25.0001H9.00015C8.25883 25.0001 7.8532 24.9982 7.56174 24.9744L7.52878 24.9715L7.52591 24.9385C7.5021 24.6471 7.50015 24.2414 7.50015 23.5001V9.71256L9.41536 8.55866L14.9897 5.21406ZM8.12727 6.41604L1.85707 10.1782C1.26509 10.5333 1.07314 11.3012 1.42832 11.8931C1.78351 12.4851 2.55133 12.6771 3.14331 12.3219L5.00015 11.2078V23.5001C5.00015 24.9002 5.00015 25.6003 5.27264 26.1351C5.51232 26.6055 5.89477 26.988 6.36518 27.2276C6.89996 27.5001 7.60002 27.5001 9.00015 27.5001H21.0002C22.4003 27.5001 23.1003 27.5001 23.6351 27.2276C24.1055 26.988 24.488 26.6055 24.7277 26.1351C25.0002 25.6003 25.0002 24.9002 25.0002 23.5001V11.2077L26.8571 12.3219C27.449 12.6771 28.2169 12.4851 28.5721 11.8931C28.9272 11.3012 28.7353 10.5333 28.1433 10.1782L21.8659 6.41171L17.0644 3.51886C16.7153 3.30854 16.4474 3.14714 16.2204 3.02577C16.1674 2.99613 16.1136 2.96857 16.0591 2.94307C15.8702 2.85087 15.7064 2.7895 15.5382 2.75242C15.1837 2.67432 14.8166 2.67432 14.4621 2.75243C14.2934 2.7896 14.1293 2.85119 13.9397 2.94379C13.8862 2.96887 13.8334 2.99594 13.7813 3.02501C13.554 3.14647 13.2857 3.3081 12.9359 3.51886L8.12727 6.41604Z" fill="currentColor" />,
        <path fillRule="evenodd" clipRule="evenodd" d="M16.25 25V20C16.25 19.3096 15.6904 18.75 15 18.75C14.3096 18.75 13.75 19.3096 13.75 20V25H16.25ZM15 16.25C12.9289 16.25 11.25 17.9289 11.25 20V27.5H18.75V20C18.75 17.9289 17.0711 16.25 15 16.25Z" fill="currentColor" />
    ]
})

const ExploreIcon = createIcon({
    viewBox: "0 0 17 16",
    path: [
        <path d="M13.5001 1.18196L10.0001 14.182" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />,
        <path d="M15.3202 4.32899L2 4.34491" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />,
        <path d="M6.50014 1.18196L3.00014 14.182" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />,
        <path d="M14.3202 11.0189L0.999997 11.0349" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    ]
})

const FanToolsIcon = createIcon({
    viewBox: "0 0 21 17",
    path: [
        <path fillRule="evenodd" clipRule="evenodd" d="M3.10889 4.92037C3.10907 4.07202 3.32718 3.23813 3.74207 2.49961C4.15695 1.76109 4.75452 1.14302 5.47678 0.705386C6.19904 0.267754 7.02146 0.0254171 7.86423 0.00189284C8.70701 -0.0216314 9.54152 0.174456 10.2868 0.571126C11.032 0.967795 11.6627 1.55158 12.1177 2.26582C12.5726 2.98006 12.8363 3.80051 12.8832 4.64754C12.9302 5.49457 12.7587 6.33942 12.3854 7.1001C12.0122 7.86079 11.4499 8.51147 10.753 8.98901C12.2537 9.54284 13.5553 10.5359 14.4903 11.8403C15.4253 13.1447 15.951 14.7009 15.9997 16.3085C16.0023 16.3966 15.9877 16.4844 15.9566 16.5668C15.9255 16.6493 15.8786 16.7247 15.8185 16.7889C15.6972 16.9185 15.5296 16.9944 15.3528 16.9997C15.1759 17.005 15.0041 16.9395 14.8753 16.8174C14.7465 16.6953 14.6711 16.5267 14.6658 16.3487C14.6128 14.6052 13.8873 12.9509 12.6429 11.7364C11.3985 10.5219 9.733 9.84274 7.99941 9.84274C6.26583 9.84274 4.60037 10.5219 3.35596 11.7364C2.11155 12.9509 1.38599 14.6052 1.33303 16.3487C1.32413 16.524 1.24737 16.6887 1.11921 16.8077C0.991054 16.9267 0.821682 16.9904 0.647381 16.9853C0.473081 16.9801 0.307716 16.9065 0.186713 16.7802C0.0657097 16.6538 -0.00130714 16.4848 1.93218e-05 16.3094C0.04853 14.7016 0.574136 13.1453 1.50918 11.8407C2.44423 10.5361 3.74591 9.54289 5.24669 8.98901C4.58748 8.53782 4.04803 7.93116 3.67539 7.22196C3.30276 6.51276 3.10827 5.72258 3.10889 4.92037V4.92037ZM7.99986 1.34117C7.05647 1.34117 6.15171 1.71826 5.48463 2.38949C4.81756 3.06072 4.44279 3.9711 4.44279 4.92037C4.44279 5.86963 4.81756 6.78001 5.48463 7.45124C6.15171 8.12247 7.05647 8.49956 7.99986 8.49956C8.94325 8.49956 9.84801 8.12247 10.5151 7.45124C11.1822 6.78001 11.5569 5.86963 11.5569 4.92037C11.5569 3.9711 11.1822 3.06072 10.5151 2.38949C9.84801 1.71826 8.94325 1.34117 7.99986 1.34117Z" fill="currentColor" />,
        <path d="M15.1508 5.30049C15.0214 5.30049 14.8955 5.30915 14.7713 5.32649C14.6846 5.34187 14.5957 5.33979 14.5099 5.32037C14.424 5.30096 14.343 5.2646 14.2716 5.21347C14.2002 5.16233 14.14 5.09748 14.0945 5.02277C14.0489 4.94805 14.019 4.86502 14.0066 4.77861C13.9941 4.6922 13.9994 4.60419 14.022 4.51983C14.0446 4.43547 14.0841 4.35649 14.1382 4.28759C14.1922 4.2187 14.2598 4.16131 14.3367 4.11884C14.4136 4.07637 14.4984 4.04969 14.586 4.04041C15.4555 3.91579 16.3422 4.08131 17.1065 4.51092C17.8708 4.94053 18.4693 5.60984 18.8077 6.41352C19.1462 7.2172 19.2054 8.10962 18.9762 8.95033C18.7469 9.79105 18.2421 10.5323 17.5412 11.0575C18.5715 11.5148 19.4463 12.2578 20.06 13.1969C20.6737 14.136 21.0002 15.2311 21 16.35C21 16.5224 20.9309 16.6877 20.8079 16.8096C20.685 16.9315 20.5182 17 20.3443 17C20.1703 17 20.0036 16.9315 19.8806 16.8096C19.7576 16.6877 19.6885 16.5224 19.6885 16.35C19.6884 15.383 19.3741 14.4417 18.792 13.6656C18.21 12.8895 17.3912 12.3199 16.457 12.0411L15.9901 11.9025V10.45L16.3486 10.2689C16.88 10.0021 17.3051 9.56557 17.5554 9.02981C17.8057 8.49405 17.8666 7.89031 17.7281 7.31606C17.5897 6.74181 17.26 6.23056 16.7924 5.86486C16.3248 5.49915 15.7464 5.30033 15.1508 5.30049Z" fill="currentColor" />
    ]
})

export default Sidebar;