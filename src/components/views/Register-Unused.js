import { Flex, Text, FormControl, FormLabel, FormHelperText, Input } from "@chakra-ui/react";

const Register = () => {

    return (
        <Flex h='100vh' w='100vw' justifyContent='center' alignItems='center' flexDirection='column'>
            <Text fontWeight='bold' align='center' maxW='30%' fontSize='4xl'>Join the Raindrop community in seconds...</Text>
            <Text align='center' fontSize='l' maxW='30%' mt='20px' color='#848484'>First, please enter your legal name. Then choose
                a user name you perfer to be called.
                We’ll never share your legal name publicly.</Text>

            <FormControl maxW='40%' mt='30px' isRequired>
                <FormLabel>First Name</FormLabel>
                <Input />
                <FormLabel>Last Name</FormLabel>
                <Input />
                <FormLabel>Username</FormLabel>
                <Input />
            </FormControl>
        </Flex>
    )
}

export default Register;