import { Flex, Text, FormControl, FormLabel, Input, Button, useToast, Textarea, Image, Checkbox, Box, ModalBody, ModalContent, Modal, ModalOverlay } from "@chakra-ui/react";
import { useState } from "react";
import { useAccount, useNetwork, useProvider, useSigner } from 'wagmi';
import { unlockAddress, time, CURRENCIES, raindropGroup, CHAIN_NAMES, EXPLORERS, DECIMALS } from '../../utils/constants';
import { useOrbis } from "../../utils/context/orbis";
import { useWeb3Storage } from "../../utils/hooks/web3storage";
import FileUploader from "./FileUploader";
import { ethers } from "ethers";
const { WalletService } = require("@unlock-protocol/unlock-js");

const EditPopup = (props) => {

    const [tab, setTab] = useState(0);

    return (
        <Modal isOpen scrollBehavior='outside' onClose={() => props.setEditing(false)}>
            <ModalOverlay />
            <ModalContent background='transparent' boxShadow='none' my='20px'>
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
                    maxW='700px'
                    w='60vw'
                    position='absolute'
                    left='50%'
                    transform='translate(-50%)'
                >
                    <Text fontSize='3xl' fontWeight='bold'>Edit Profile</Text>

                    <Flex alignItems='flex-start' mt='10px'>
                        <Text onClick={() => setTab(0)} cursor='pointer' fontWeight='bold' mr='40px' py='3px' borderColor='brand.400' color={tab == 0 ? 'brand.400' : 'black'} borderBottom={tab == 0 ? '3px solid' : 'none'}>Profile</Text>
                        <Text onClick={() => setTab(1)} cursor='pointer' fontWeight='bold' py='3px' borderColor='brand.400' color={tab == 1 ? 'brand.400' : 'black'} borderBottom={tab == 1 ? '3px solid' : 'none'}>Membership</Text>
                    </Flex>

                    {tab == 0 &&
                        <EditProfile setEditing={props.setEditing} />
                    }

                    {tab == 1 &&
                        <EditMembership lock={props.lock} setEditing={props.setEditing} setGrantingKey={props.setGrantingKey} setMinting={props.setMinting} />
                    }

                </Flex>
            </ModalContent>
        </Modal>
    )
}

export const EditMembership = ({ lock, cancelButton = true, border = true, setEditing, setMinting, setGrantingKey }) => {

    const [price, setPrice] = useState('');
    const [creatorDescription, setCreatorDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const provider = useProvider()
    const signer = useSigner();
    const { chain } = useNetwork();
    const { user, orbis } = useOrbis();
    const { address } = useAccount();
    const toast = useToast();

    const doToast = (hash) => {
        toast({
            position: 'bottom-right',
            isClosable: true,
            render: () => (
                <Box cursor='pointer' onClick={() => window.open(EXPLORERS[chain.id] + hash)} backgroundColor='brand.600' color='white' p='10px' borderRadius='7px'>
                    Click me to see your transaction
                </Box>
            ),
        })
    }

    const handleSave = async () => {
        if (creatorDescription == '' && (price == '' || price < 0)) { //No new data
            //TODO set error message
            return;
        }

        setLoading(true);

        let createdLockAddress;

        if (price != '' && price > 0) {
            if (!lock) { //Create Lock //TODO require username to create Lock ??
                console.log('Deploying');
                const walletService = new WalletService(unlockAddress);

                await walletService.connect(provider, signer.data);

                try {
                    createdLockAddress = await walletService.createLock({
                        publicLockVersion: 11, //TODO check if needed
                        name: (user.username || address) + " Raindrop", //Adding raindrop to be able to use it in subgraph (user could have other locks for other stuff)
                        maxNumberOfKeys: ethers.constants.MaxUint256.toString(),
                        expirationDuration: time,
                        keyPrice: price.toString(), //walletService already transforms to wei
                        currencyContractAddress: CURRENCIES[chain.id]
                    }, (err, hash) => {
                        console.log('Minting, tx hash:', hash);
                        setEditing(false);
                        setMinting(true);
                        doToast(hash)

                        if (err) {
                            //TODO handle error
                            setMinting(false);
                            setLoading(false);
                        }
                    })
                } catch (err) {
                    //TODO handle error
                    setMinting(false);
                    setLoading(false);
                    return;
                }

                console.log('Minted', createdLockAddress);

                //Set their membership true in Orbis
                const orbisRes = await orbis.setGroupMember(raindropGroup, true);
                if (orbisRes.status != 200) {
                    console.error('Error joining group', orbisRes);
                }

                //Mint yourself an NFT (necessary to decrypt your own posts)
                console.log('Granting key...');
                setGrantingKey(true);
                try {
                    const key = await walletService.grantKey({
                        lockAddress: createdLockAddress,
                        recipient: address,
                        expiration: ethers.constants.MaxUint256 //No expiration for owner
                    }, (err, hash) => {
                        doToast(hash)

                        if (err) {
                            //TODO handle error
                            console.log('ERROR granting key', err);
                            setMinting(false);
                            setLoading(false);
                        }
                    })
                    console.log('Key granted', key);
                } catch (err) {
                    //TODO handle error
                    console.log('Error granting key', err);
                    setMinting(false);
                    setLoading(false);
                    setGrantingKey(false);
                    return;
                }

                setLoading(false);
                setMinting(false);
                setGrantingKey(false);
            } else { //Update membership
                console.log('Updating', lock.address);

                //Check you're in the right network
                if (chain.id != lock.chain) {
                    setLoading(false);
                    alert('Make sure you are in the right chain. Then try again')
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x' + lock.chain.toString(16) }]
                    })
                    return;
                }

                const walletService = new WalletService(unlockAddress);

                await walletService.connect(provider, signer.data);

                console.log('Connected')

                try {
                    await walletService.updateKeyPrice({
                        lockAddress: lock.address,
                        keyPrice: price.toString() //walletService already transforms to wei
                    }, (err, hash) => {
                        doToast(hash)

                        if (err) {
                            console.log('ERROR updating price', err);
                        }
                    })

                } catch (err) {
                    setLoading(false);

                    //Just for Mumbai as it has issues
                    if (chain.id == 80001 && err.message.includes('topichash')) {
                        toast({
                            position: 'bottom-right',
                            status: 'success',
                            description: `Membership ${lock ? 'updated' : 'created'}! Please wait a few seconds and reload to reflect changes`
                        })
                        return;
                    }
                    console.error('Error updating price', err);
                    return;
                }

            }
        }

        //Update data
        let newData = {};
        newData = { ...user.details.profile }
        if (user.username) {
            newData.username = user.username;
        }

        //If new description, update
        if (creatorDescription != '') {
            newData.data['creatorDescription'] = creatorDescription
        }

        //Add the Lock address to their Orbis data
        if (createdLockAddress) {
            newData.data['locks'] = {
                address: createdLockAddress,
                chain: chain.id
            }
        }

        if (createdLockAddress || creatorDescription != '') {
            const orbisRes = await orbis.updateProfile(newData);
            console.log('Updated Oribs data', orbisRes);
        }

        setLoading(false);
        setEditing && setEditing(false); //Close popup
        toast({
            position: 'bottom-right',
            status: 'success',
            description: `Membership ${lock ? 'updated' : 'created'}! Please wait a few seconds and reload to reflect changes`
        })
    }

    return (

        <Flex flexDirection='column' alignItems='center'>
            <Flex flexDirection='column' w='100%' borderRadius={border ? '7px' : 'none'} backgroundColor='white' my='15px' p='25px' boxShadow={border ? '0px 2px 9px 0px rgba(0, 0, 0, 0.25)' : 'none'}>
                <Text fontSize='xl' fontWeight='bold'>Customize Membership</Text>

                <FormControl mt='20px'>
                    <FormLabel fontWeight='semibold'>Monthly price</FormLabel>
                    <Input
                        variant='filled'
                        placeholder={lock ? ethers.utils.formatUnits(lock.price, DECIMALS[lock.chain]) + ' USDC' : "Monthly price"}
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        type='number'
                    />
                    <FormLabel mt='20px' fontWeight='semibold'>Membership Description <span style={{ color: '#848484' }}>(optional)</span></FormLabel>
                    <Textarea
                        variant='outline'
                        placeholder="Add a brief description of what it is you do."
                        value={creatorDescription}
                        onChange={e => setCreatorDescription(e.target.value)}
                        resize='vertical'
                        h='60px'
                    />
                    <Flex alignItems='center' mt='20px'>
                        <Checkbox defaultChecked />
                        <Text ml='10px'>My content is suitable for people under 18</Text>
                    </Flex>
                </FormControl>
            </Flex>
            {!lock && <Text mt='10px' mb='5px' color='gray' fontSize='sm' align='center' w='100%'>You'll create your membership in {CHAIN_NAMES[chain.id]}</Text>}
            <Flex>
                {cancelButton &&
                    <Button borderRadius='10px' px='50px' colorScheme='brandLight' color='brand.500' onClick={() => setEditing(false)}>Cancel</Button>
                }
                <Button
                    borderRadius='10px'
                    ml={cancelButton ? '15px' : 'none'}
                    px='50px'
                    colorScheme='brand'
                    onClick={handleSave}
                    isLoading={loading}
                    loadingText='Waiting for transaction'
                >{!lock ? 'Create membership' : 'Update membership'}</Button>
            </Flex>
        </Flex>
    )
}

const EditProfile = (props) => {

    const [username, setUsername] = useState('');
    const [description, setDescription] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [cover, setCover] = useState(null);
    const [saving, setSaving] = useState(false);
    const [draggingPfp, setDraggingPfp] = useState(false);

    const client = useWeb3Storage();
    const { user, orbis, getOrbis } = useOrbis();

    const handleProfilePicture = (file) => {
        file.url = URL.createObjectURL(file) //To be able to display on input
        setProfilePicture(file)
    }

    const handleCover = (file) => {
        console.log('Cover', file);
        setCover(file)
    }

    const handleSave = async () => {
        setSaving(true);

        let newData = {}

        if (profilePicture) {
            const pfpCid = await client.put([profilePicture], {
                wrapWithDirectory: false
            });

            newData.pfp = 'https://' + pfpCid + '.ipfs.w3s.link';

            console.log('Stored file with cid:', newData.pfp);
        } else if (user.details.profile?.pfp) {
            newData.pfp = user.details.profile.pfp;
        }

        if (cover) {
            const coverCid = await client.put([cover], {
                wrapWithDirectory: false
            });

            newData.cover = 'https://' + coverCid + '.ipfs.w3s.link';

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

        setSaving(false);
        getOrbis(); //TODO fix to manually change username in orbis context
        props.setEditing(false); //Close popup
    }

    return (
        <Flex flexDirection='column' alignItems='center' userSelect='none'>
            <Flex
                w='100%'
                flexDirection='column'
                borderRadius='7px'
                backgroundColor='white'
                my='15px'
                p='25px'
                boxShadow='0px 2px 9px 0px rgba(0, 0, 0, 0.25)'
            >
                <Text fontSize='xl' fontWeight='bold'>Customize Profile</Text>

                <FormControl mt='10px'>
                    <FormLabel fontWeight='semibold'>Name</FormLabel>
                    <Input
                        variant='filled'
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <FormLabel mt='20px' fontWeight='semibold' textAlign='center'>Profile photo</FormLabel>

                    <Flex mx='auto' w='50%'>
                        <FileUploader setFile={handleProfilePicture} accept='image/*' setDragging={setDraggingPfp}>
                            <Flex
                                cursor='pointer'
                                py='10px'
                                border='1px solid'
                                borderColor='brand.500'
                                borderRadius='10px'
                                w='100%'
                                alignSelf='center'
                                minH='150px'
                                flexDirection='column'
                                alignItems='center'
                                justifyContent='center'
                                backgroundColor={(profilePicture || draggingPfp) ? 'gray.400' : 'white'}
                                backgroundImage={profilePicture ? profilePicture.url : null}
                                backgroundPosition='center'
                                backgroundSize='cover'
                            >
                                <Image src='/camera.svg' mb='10px' />
                                <Text
                                    fontWeight='semibold'
                                    noOfLines={2}
                                    w='60%'
                                    color='brand.500'
                                    align='center'
                                >{profilePicture ? profilePicture.name : 'Add new profile photo'}</Text>
                            </Flex>
                        </FileUploader>
                    </Flex>

                    <FormLabel mt='20px' fontWeight='semibold'>Profile description</FormLabel>
                    <Textarea
                        variant='filled'
                        placeholder="Add a brief description of who you are."
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        resize='vertical'
                        h='60px'
                    />
                    <FormLabel mt='20px' fontWeight='semibold'>Cover image</FormLabel>

                    <FileUploader setFile={handleCover} accept='image/*'>
                        <Flex
                            cursor='pointer'
                            border='1px solid #E6E6E6'
                            borderRadius='10px'
                            p='8px'
                            w='100%'
                            backgroundColor={cover ? 'gray.400' : 'white'}
                        >
                            <Image src='/img.svg' mr='10px' />
                            {cover ? cover.name : 'Add cover image'}
                        </Flex>
                    </FileUploader>
                    {/** TODO fix pixel recommended size
                        <Text fontSize='sm' color='#848484' mt='5px'>Recommended size XXX by XXX pixels</Text>
                        */}
                </FormControl>
            </Flex>

            <Flex w='100%' alignItems='center' justifyContent='flex-end'>
                <Button borderRadius='10px' px='50px' colorScheme='brandLight' color='brand.500' onClick={() => props.setEditing(false)}>Cancel</Button>
                <Button
                    borderRadius='10px'
                    ml='10px'
                    px='50px'
                    colorScheme='brand'
                    onClick={handleSave}
                    isLoading={saving}
                    loadingText='Saving'
                >Save</Button>
            </Flex>
        </Flex>
    )
}

export default EditPopup;