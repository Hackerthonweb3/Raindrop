import { Flex, Modal, ModalContent, ModalOverlay, Text, Image, Button } from "@chakra-ui/react"
import { utils } from "ethers";
import { useState } from "react";
import { useOrbis } from "../../utils/context/orbis"
import Blockies from 'react-blockies';
import { CheckIcon } from "@chakra-ui/icons";

const ProfileChooser = ({ setOpen, createConversation }) => {

    const [followings, setFollowings] = useState([]);
    const [chosen, setChosen] = useState([]);

    const { orbis, user } = useOrbis();

    const getFollowing = async () => {
        const { data } = await orbis.getProfileFollowing(user.did)
        console.log('Following', data);
        setFollowings(data);
    }

    const choose = (i) => {
        if (chosen.includes(i)) {
            const newChosen = chosen.filter(c => c != i)
            setChosen(newChosen);
        } else {
            setChosen([...chosen, i]);
        }
    }

    const handleConfirm = () => {
        setOpen(false);
        if(chosen.length > 0){
            const recipientData = chosen.map(c => followings[c].details)
            createConversation(recipientData)
        }
    }

    useState(() => {
        if (user) {
            getFollowing();
        }
    }, [user])

    return (
        <Modal isOpen onClose={() => setOpen(false)}>
            <ModalOverlay />

            <ModalContent>
                <Flex p='20px' flexDirection='column' alignItems='center'>
                    <Text mb='10px' fontWeight='bold' fontSize='2xl'>Select User(s):</Text>
                    {followings.length > 0 && followings.map((following, i) =>
                        <ProfilePreview
                            key={i}
                            profile={following.details}
                            chosen={chosen.includes(i)}
                            choose={() => choose(i)}
                        />
                    )}

                    <Flex alignSelf='end' mt='20px'>
                        <Button borderRadius='10px' px='50px' colorScheme='brandLight' color='brand.500' onClick={() => setOpen(false)}>Cancel</Button>
                        <Button
                            borderRadius='10px'
                            ml='10px'
                            px='50px'
                            colorScheme='brand'
                            onClick={handleConfirm}
                        >Confirm</Button>
                    </Flex>
                </Flex>

            </ModalContent>
        </Modal>
    )
}

const ProfilePreview = ({ profile, chosen, choose }) => {

    return (
        <Flex w='100%' alignItems='center' cursor='pointer' onClick={choose} userSelect='none'>
            {profile.profile?.pfp ?
                <Image maxH='50px' src={profile.profile.pfp} />
                :
                <Blockies seed={utils.getAddress(profile.metadata.address)} scale={4} />
            }
            <Text fontWeight='bold' fontSize='xl' ml='8px'>{profile.profile.username || profile.metadata.ensName || profile.metadata.address}</Text>
            {chosen && <CheckIcon justifySelf='flex-end' ml='auto' color='brand.500' />}
        </Flex>
    )
}

export default ProfileChooser;