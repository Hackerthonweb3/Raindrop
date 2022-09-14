import { Flex, Text, FormControl, FormLabel, Input, Button, useToast, Textarea, Box } from "@chakra-ui/react";
import { useState } from "react";
import { useAccount, useNetwork, useProvider, useSigner } from 'wagmi';

//TODO set lazy
const ethers = require("ethers");
const { WalletService } = require("@unlock-protocol/unlock-js");
import { unlockAddress, time, currencies } from '../../utils/constants';
import { useOrbis } from "../../utils/context/orbis";
import { useWeb3Storage } from "../../utils/hooks/web3storage";
import { FileUploader } from "react-drag-drop-files";

const EditProfile = (props) => {

    const [tab, setTab] = useState(0);
    const [username, setUsername] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [cover, setCover] = useState(null);

    const { user, orbis, getOrbis } = useOrbis();
    const { address } = useAccount();

    const provider = useProvider()
    const signer = useSigner();
    const { chain } = useNetwork();
    const client = useWeb3Storage();

    const toast = useToast();

    const handleSave = async () => {

        //Save Profile
        if (tab == 0) {

            let newData = {}

            if (profilePicture) {
                newData.pfp = await client.put([profilePicture], {
                    wrapWithDirectory: false
                });

                console.log('Stored file with cid:', newData.pfp);
            } else if (user.details.profile?.pfp) {
                newData.pfp = user.details.profile.pfp;
            }

            if (cover) {
                newData.cover = await client.put([cover], {
                    wrapWithDirectory: false
                });

                console.log('Stored file with cid:', newData.cover);
            } else if (user.details.profile?.cover) {
                newData.cover = user.details.profile.cover;
            }

            if (username != '') {
                newData.username = username;
            } else if (user.username) {
                newData.username = user.username;
            }

            if (description != '') {
                newData.description = description;
            } else if (user.details.profile?.description) {
                newData.description = user.details.profile.description;
            }

            console.log('New data', newData);

            const res = await orbis.updateProfile(newData)

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

            if (!props.lock) {
                console.log('Deploying');
                const walletService = new WalletService(unlockAddress);
                console.log(walletService);

                await walletService.connect(provider, signer.data);

                console.log('Connected')

                const tx = await walletService.createLock({
                    //address: unlockAddress[5],
                    publicLockVersion: 11,
                    name: user.username + "  Raindrop", //Adding raindrop to be able to use it in subgraph (user could have other locks for other stuff)
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

                //TODO mint yourself an NFT (necessary to decrypt your own posts lol)
                const key = await walletService.grantKey({
                    lockAddress: '',
                    recipient: address
                })

                console.log(tx)
                //TODO reload data
            }
        }

    }

    const test = async () => {
        const walletService = new WalletService(unlockAddress);
        console.log(walletService);

        await walletService.connect(provider, signer.data);

        const key = await walletService.grantKey({
            lockAddress: '0xe86652Af35caC36535eb73625363d6CBcC4f4f09',
            recipient: address,
        }, (err, txHash) => {
            console.log('Tx hash', txHash);
        })

        console.log('Key', key); //key is the tokenId returned
    }

    const handleProfilePicture = (file) => {
        console.log('Files', file);
        setProfilePicture(file)
    }

    const handleCover = (file) => {
        console.log('Cover', file);
        setCover(file)
    }

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
                            <FileUploader handleChange={handleProfilePicture} types={["JPG", "PNG"]}>
                                <Flex
                                    cursor='pointer'
                                    py='20px'
                                    border='1px solid'
                                    borderColor='brand.500'
                                    borderRadius='10px'
                                    w='50%'
                                    mx='auto'
                                    flexDirection='column'
                                    alignItems='center'
                                    backgroundColor={profilePicture ? 'gray' : 'white'}
                                >
                                    <Text fontWeight='semibold' noOfLines={2} w='60%' color='brand.500' align='center'>Add new profile photo</Text>
                                </Flex>
                            </FileUploader>

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

                            <FileUploader handleChange={handleCover} types={["JPG", "PNG"]}>
                                <Flex border='1px solid #E6E6E6' borderRadius='10px' p='8px' w='60%'>
                                    Add cover image
                                </Flex>
                            </FileUploader>

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
                    <Button borderRadius='10px' mr='10px' px='50px' colorScheme='brand' onClick={test}>TEST</Button>
                    <Button borderRadius='10px' mr='10px' px='50px' colorScheme='brand' onClick={handleSave}>{tab == 0 ? 'Save' : (!props.lock ? 'Create membership' : 'Update membership')}</Button>
                    <Button borderRadius='10px' px='50px' colorScheme='brandLight' color='brand.500' onClick={() => props.setEditing(false)}>Cancel</Button>
                </Flex>
            </Flex>
        </Flex >
    )
}

export default EditProfile;