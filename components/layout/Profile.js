import { Flex, Spacer, Button, Text, Image, propNames } from "@chakra-ui/react"
import { useState } from "react";
import { useAccount } from "wagmi";
import { useOrbis } from "../../utils/context/orbis";
import { useOrbisUser } from "../../utils/hooks/orbisHooks";

//TODO dynamic
import EditProfile from "../EditProfile";

//If no props.address, assume it My Profile
const Profile = (props) => {

    const [editing, setEditing] = useState(false);
    const { address } = useAccount();

    const usingAddress = props.address || address

    const { user } = props.address ? useOrbisUser(usingAddress) : useOrbis()

    const handleEditProfile = () => {
        setEditing(true);
    }

    return (
        <Flex w='100%' h='100%' alignItems='center' flexDirection='column'>
            <Flex p='30px' h='30%' w='100%' borderBottom='1px solid' borderColor='brand.400' alignItems='flex-end'>
                <Flex alignItems='center' flexDirection='column' maxH='80%'>
                    <Image boxSize='45%' src='mock.png' />
                    <Text>{user.username || usingAddress}</Text>
                </Flex>
                {/*TODO Only if self profile:*/}
                <Spacer />
                <Button onClick={handleEditProfile}>Edit Profile</Button>
            </Flex>

            {editing && <EditProfile setEditing={setEditing} />}
        </Flex>
    )
}

export default Profile;