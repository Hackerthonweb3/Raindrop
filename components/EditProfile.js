import { Flex, Text, FormControl, FormLabel, Input, Button, useToast, Textarea, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAccount, useNetwork, useProvider, useSigner } from 'wagmi';
import { subgraphURLs } from "../utils/constants";


//TODO set lazy
const ethers = require("ethers");
const { WalletService } = require("@unlock-protocol/unlock-js");
import { unlockAddress, time, currencies } from '../utils/constants';
import { useOrbis } from "../utils/context/orbis";


const EditProfile = (props) => {

    const [tab, setTab] = useState(0);
    const [username, setUsername] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [locks, setLocks] = useState();

    const { user, orbis, getOrbis } = useOrbis();
    const { address } = useAccount();

    const provider = useProvider()
    const signer = useSigner();
    const { chain } = useNetwork();

    const toast = useToast();

    const getLocks = async () => {
        console.log('Getting locks from subgraph...');
        const subgraphData = await fetch(subgraphURLs[chain.id], {
            method: 'POST',
            contentType: 'application/json',
            body: JSON.stringify(
                {
                    query: `{
                        locks(where: {owner: "${address}"}) {
                        id
                        address
                        price
                        creationBlock
                        tokenAddress
                        expirationDuration
                        maxNumberOfKeys
                        version
                        totalSupply
                        }
                    }`
                }
            )
        })

        setLocks((await subgraphData.json()).data.locks)
    }

    const handleSave = async () => {

        //Save Profile
        if (tab == 0) {
            if (username == '') {
                //TODO set error message
                return;
            }

            const res = await orbis.updateProfile({
                username: username,
                description: description
            })
            console.log('Orbis response', res);

            if (res.status != 200) {
                //TODO error handling
                console.error(res);
            }

            getOrbis(); //TODO fix to manually change username in orbis context
            props.setEditing(false); //Close popup
        }

        //Save Membership
        if (tab == 1) {
            if (price == '' || price < 0) {
                //TODO set error message
                return;
            }


            if (locks && locks.length == 0) {
                console.log('Deploying');
                const walletService = new WalletService(unlockAddress);
                console.log(walletService);

                await walletService.connect(provider, signer.data);

                console.log('Connected')

                const tx = await walletService.createLock({
                    //address: unlockAddress[5],
                    publicLockVersion: 11,
                    name: user.username,
                    maxNumberOfKeys: 0,
                    expirationDuration: time,
                    keyPrice: ethers.utils.parseEther(price).toString(),
                    currencyContractAddress: currencies[chain.id]
                }, (err, hash) => {
                    console.log(err, hash)
                    /*toast({
                        title: 'Transaction sent',
                        position: 'bottom-right',

                    })*/
                })

                console.log(tx)
            }
        }

    }

    useEffect(() => {
        getLocks();
    }, [])

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
        >
            <Flex
                backgroundColor='white'
                boxShadow='0px 4px 4px 0px rgba(0, 0, 0, 0.25)'
                py='30px'
                px='40px'
                borderRadius='26px'
                sx={{
                    background: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(90deg, #0085AB 0%, #2CB2C3 34.2%, #F9D520 69.77%, #D1D922 102.6%) border-box',
                    border: '3px solid transparent',
                }}
                flexDirection='column'
                minW='500px'
            >
                <Text fontSize='3xl' fontWeight='bold'>Edit Profile</Text>

                <Flex alignItems='flex-start' mt='10px'>
                    <Text onClick={() => setTab(0)} cursor='pointer' fontWeight='bold' mr='40px' py='3px' borderColor='brand.400' color={tab == 0 ? 'brand.400' : 'black'} borderBottom={tab == 0 ? '3px solid' : 'none'}>Profile</Text>
                    <Text onClick={() => setTab(1)} cursor='pointer' fontWeight='bold' py='3px' borderColor='brand.400' color={tab == 1 ? 'brand.400' : 'black'} borderBottom={tab == 1 ? '3px solid' : 'none'}>Membership</Text>
                </Flex>

                {tab == 0 &&
                    <Flex
                        flexDirection='column'
                        borderRadius='7px'
                        backgroundColor='white'
                        my='15px'
                        p='25px'
                        boxShadow='0px 2px 9px 0px rgba(0, 0, 0, 0.25)'
                    //w='150%'
                    >
                        <Text fontSize='xl' fontWeight='bold'>Customize Profile</Text>

                        <FormControl mt='20px'>
                            <FormLabel fontWeight='semibold'>Name</FormLabel>
                            <Input
                                variant='filled'
                                placeholder="Username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                            <FormLabel mt='20px' fontWeight='semibold' textAlign='center'>Profile photo</FormLabel>
                            <Flex cursor='pointer' py='20px' border='1px solid' borderColor='brand.500' borderRadius='10px' w='50%' mx='auto' flexDirection='column' alignItems='center'>
                                <Text fontWeight='semibold' noOfLines={2} w='60%' color='brand.500' align='center'>Add new profile photo</Text>
                            </Flex>
                            <FormLabel mt='20px' fontWeight='semibold'>Profile description</FormLabel>
                            <Textarea
                                variant='filled'
                                placeholder="Add a brief description of what it is you do."
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                resize='vertical'
                                h='100px'
                            />
                            <FormLabel mt='20px' fontWeight='semibold'>Cover image</FormLabel>
                            <Flex border='1px solid #E6E6E6' borderRadius='10px' p='8px' w='60%'>
                                Add cover image
                            </Flex>
                            <Text fontSize='sm' color='#848484' mt='5px'>Recommended size 460 by 200 pixels</Text>
                        </FormControl>
                    </Flex>
                }

                {tab == 1 &&
                    <Flex flexDirection='column' borderRadius='7px' backgroundColor='white' my='15px' p='25px' boxShadow='0px 2px 9px 0px rgba(0, 0, 0, 0.25)'>
                        <Text fontSize='xl' fontWeight='bold'>Customize Membership</Text>

                        <FormControl mt='20px'>
                            <FormLabel fontWeight='semibold'>Monthly price</FormLabel>
                            <Input
                                variant='filled'
                                placeholder="5.00 USDC" //TODO update to show actual price if membership exists
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                                type='number'
                            />
                        </FormControl>
                    </Flex>
                }

                <Flex mt='10px'>
                    <Button borderRadius='10px' mr='10px' px='50px' colorScheme='brand' onClick={handleSave}>{tab == 0 ? 'Save' : ((locks && locks.length == 0) ? 'Create membership' : 'Update membership')}</Button>
                    <Button borderRadius='10px' px='50px' colorScheme='brandLight' color='brand.500' onClick={() => props.setEditing(false)}>Cancel</Button>
                </Flex>
            </Flex>
        </Flex >
    )
}

export default EditProfile;