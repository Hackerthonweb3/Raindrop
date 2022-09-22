import { Flex, Text, Image, Button } from "@chakra-ui/react";
import { CHAIN_NAMES } from "../../utils/constants";

const Membership = ({ self = false, price, username, lock }) => {

    return (
        <Flex flexDirection='column' w='100%' alignItems='center'>
            <Text fontWeight='bold' mt='10px'>MEMBERSHIP</Text>
            <Image />
            <Text fontSize='small' fontWeight='semibold'>${price}</Text>
            <Text fontSize='xs' color='#505050B2'>PER MONTH</Text>
            {lock && <Text>{CHAIN_NAMES[lock.chain]}</Text>}
            {/*A description TODO */}

            <Text fontSize='2xl' fontWeight='bold'>About {username}</Text>
            {/*Another description TODO */}
            <Text fontSize='large' fontWeight='bold'>Advantages of fans</Text>
            <Flex alignItems='center' justifyContent='space-around'>
                <Flex flexDirection='column' alignItems='center'>
                    <Text fontSize='xl' fontWeight='bold' color='brand.500'>246{/*TODO*/}</Text>
                    <Text color='brand.500'>Exclusive posts</Text>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default Membership;