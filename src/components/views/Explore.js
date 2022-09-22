import { Flex, Text, Image, Button, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { raindropGroup } from "../../utils/constants";
import { useOrbis } from "../../utils/context/orbis";
import Blockies from 'react-blockies';
import { utils } from "ethers";

const Explore = () => {

    const [profiles, setProfiles] = useState([]);

    const { orbis } = useOrbis();

    const getProfiles = async () => {
        const { data, error } = await orbis.getGroupMembers(raindropGroup);

        if (!error) {
            console.log('Group members', data);
            setProfiles(data);
        }
    }

    const test = async () => {
        const orbisRes = await orbis.setGroupMember(raindropGroup, true);
    }

    useEffect(() => {
        getProfiles();
    }, [])

    return (
        <Flex w='100%' h='100%' alignItems='center' flexDirection='column' ml='250px'>
            <Text mt='50px' fontSize='3xl' fontWeight='bold'>Explore the Community</Text>
            <Flex
                w='70%'
                mt='50px'
                mb='20px'
                pt='30px'
                px='20px'
                justifyContent='space-around'
                alignItems='center'
                boxShadow='0px 2px 9px rgba(0, 0, 0, 0.25)'
                borderRadius='7px'
                flexWrap='wrap'
            >
                {profiles.length > 0 &&
                    profiles.map((profile, i) => (profile.profile_details.profile && <ProfilePreview key={i} profile={profile.profile_details.profile} address={profile.did.split(':')[4]} />))
                }
            </Flex>
            {/*<Button onClick={test}>JOIN GROUP</Button>*/}
        </Flex >
    )
}

const ProfilePreview = ({ profile, address }) => {

    const navigate = useNavigate();

    return (
        <Flex
            mb='30px'
            p='20px'
            w='42%'
            h='250px'
            justifyContent='center'
            flexDirection='column'
            alignItems='center'
            backgroundColor='white'
            borderRadius='27px'
            filter='drop-shadow(0px 17px 46px rgba(0, 0, 0, 0.25))'
        >
            {profile.pfp ?
                <Image src={'https://' + profile.pfp + '.ipfs.w3s.link'} maxW='100px' maxH='100px'/>
                :
                <Blockies seed={utils.getAddress(address)} scale={10} />
            }
            <Text my='10px' align='center' fontSize='sm' fontWeight='semibold'>{profile.description}</Text>
            <Text align='center' fontSize='large' fontWeight='semibold' borderBottom='3px solid' borderColor='brand.500'>{profile.username}</Text>
            <Button onClick={() => navigate('/app/profile/' + address)} variant='outline' px='30px' py='5px' mt='20px' fontSize='xx-small' borderRadius='27px' color='#0085AB' size='xs'>View Profile</Button>
        </Flex>
    )
}

export default Explore;