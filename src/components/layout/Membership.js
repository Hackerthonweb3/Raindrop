import { Flex, Text, Image, Button } from "@chakra-ui/react";
import { CHAIN_NAMES } from "../../utils/constants";

const Membership = ({ self = false, price, username, lock, creatorDescription, member = false, handleSubscribe, exclusivePostCount }) => {

    if (lock) {
        return (
            <Flex flexDirection='column' w='100%' alignItems='center'>
                <Text fontWeight='bold' mt='10px'>MEMBERSHIP</Text>
                <Image />
                <Text fontSize='small' fontWeight='semibold'>${price}</Text>
                <Text fontSize='xs' color='#505050B2'>PER MONTH</Text>
                {lock && <Text>On {CHAIN_NAMES[lock.chain]}</Text>}

                {!self && lock && !member && <Button onClick={handleSubscribe} mt='20px' borderRadius='25px' px='40px' colorScheme='brandLight' color='brand.500'>Subscribe for ${price}/month</Button>}
                <Text mt='20px' fontSize='2xl' fontWeight='bold'>About {username}</Text>
                <Text align='center' px='20px'>{creatorDescription}</Text>

                <Text fontSize='large' mt='30px' fontWeight='bold'>Advantages of fans</Text>
                <Flex alignItems='center' justifyContent='space-around' my='20px'>
                    <Flex flexDirection='column' alignItems='center'>
                        <Text fontSize='xl' fontWeight='bold' color='brand.500'>{exclusivePostCount}</Text>
                        <Text color='brand.500'>Exclusive posts</Text>
                    </Flex>
                </Flex>
            </Flex>
        )
    } else {
        return (
            <Flex flexDirection='column' w='100%' alignItems='center'>
                <Text fontWeight='bold' mt='10px'>Not a Creator</Text>
            </Flex>
        )
    }
}

export default Membership;