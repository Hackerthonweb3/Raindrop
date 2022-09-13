import { Flex, Text, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { useState } from "react";
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
    const [price, setPrice] = useState('');

    const { user, orbis, getOrbis } = useOrbis();
    const { address } = useAccount();

    const provider = useProvider()
    const signer = useSigner();
    const { chain } = useNetwork();

    const handleSave = async () => {

        const subgraphData = await fetch(subgraphURLs[chain.id], {
            method: 'POST',
            contentType: 'application/json',
            body: JSON.stringify(`
            {
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
                  LockManagers {
                    id
                    lock {
                      id
                    }
                    address
                  }
                }
              }
            `)
        })

        console.log('Subgraph data', subgraphData);

        //Save Profile
        if (tab == 0) {
            if (username == '') {
                //TODO set error message
                return;
            }

            const res = await orbis.updateProfile({
                username: username,
                //description: 'Test description aaaaa'
                data: {
                    membershipAddress: '0xTesting'
                }
            })
            console.log('Orbis response', res);

            if (res.status != 200) {
                //TODO error handling
                console.error(res);
            }

            getOrbis();
            props.setEditing(false); //Close popup
        }

        //Save Membership
        if (tab == 1) {
            if (price == '' || price < 0) {
                //TODO set error message
                return;
            }

            //TODO check if create or update membership

            console.log('Deploying');
            const walletService = new WalletService(unlockAddress);
            console.log(walletService);

            await walletService.connect(provider, signer.data);

            console.log('Connected')

            const tx = await walletService.createLock({
                //address: unlockAddress[5],
                publicLockVersion: 11,
                name: 'test',
                maxNumberOfKeys: 0,
                expirationDuration: time,
                keyPrice: ethers.utils.parseEther(price).toString(),
                currencyContractAddress: currencies[chain.id]
            }, (err, hash) => {
                console.log(err, hash)
            })

            console.log(tx)
        }

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
                p='30px'
                borderRadius='26px'
                sx={{
                    background: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(90deg, #0085AB 0%, #2CB2C3 34.2%, #F9D520 69.77%, #D1D922 102.6%) border-box',
                    border: '3px solid transparent',
                }}
                flexDirection='column'
            >
                <Text fontSize='3xl' fontWeight='bold'>Edit Profile</Text>

                <Flex alignItems='flex-start'>
                    <Text onClick={() => setTab(0)} cursor='pointer' fontWeight='bold' mr='40px' py='3px' borderColor='brand.400' color={tab == 0 ? 'brand.400' : 'black'} borderBottom={tab == 0 ? '3px solid' : 'none'}>Profile</Text>
                    <Text onClick={() => setTab(1)} cursor='pointer' fontWeight='bold' py='3px' borderColor='brand.400' color={tab == 1 ? 'brand.400' : 'black'} borderBottom={tab == 1 ? '3px solid' : 'none'}>Membership</Text>
                </Flex>

                {tab == 0 &&
                    <Flex flexDirection='column' borderRadius='7px' backgroundColor='white' my='15px' p='25px' boxShadow='0px 2px 9px 0px rgba(0, 0, 0, 0.25)'>
                        <Text fontSize='xl' fontWeight='bold'>Customize Profile</Text>

                        <FormControl mt='20px'>
                            <FormLabel>Name</FormLabel>
                            <Input
                                variant='filled'
                                placeholder="Username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
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
                    <Button mr='10px' onClick={handleSave}>Create/Update membership</Button>
                    <Button onClick={() => props.setEditing(false)}>Cancel</Button>
                </Flex>
            </Flex>
        </Flex >
    )
}

export default EditProfile;