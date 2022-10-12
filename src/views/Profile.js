import { Flex, Button, Text, Image, Tooltip, Box } from "@chakra-ui/react"
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { useAccount, useContractRead, useNetwork } from "wagmi";
import { CHAIN_NAMES, DECIMALS, raindropGroup, subgraphURLs } from "../utils/constants";
import { useOrbis } from "../utils/context/orbis";
import { useLock } from "../utils/hooks/subgraphLock";
import CreatePost from "../components/layout/CreatePost";
import Blockies from 'react-blockies';

//TODO dynamic
import EditPopup, { EditMembership } from "../components/layout/EditProfilePopup";
import Membership from "../components/layout/Membership";
import PostPreview from "../components/layout/PostPreview";
import formatAddress from "../utils/formatAddress";
import Minting from "../components/layout/Minting";
import { AddIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { updateOrbisData } from "../utils/updateOrbisData";
// import { WorldIDWidget } from "@worldcoin/id";
//import { getNotifications, sendNotification, turnOnNotifications } from "../../utils/epns";

const ACTION_ID = "wid_staging_ff7fd326e9a407f6234ef5bf211f421a";

const abi = new ethers.utils.Interface(['function balanceOf(address _owner) view returns (uint)']);

const Profile = () => {

    const { address: myAddress } = useAccount();
    const { profileAddress: usingAddress } = useParams();

    const [searchParams, setSearchParams] = useSearchParams()

    const [myProfile, setMyProfile] = useState(usingAddress.toLowerCase() == myAddress.toLowerCase());
    const [tab, setTab] = useState(0);
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState();
    const [minting, setMinting] = useState(false);
    const [grantingKey, setGrantingKey] = useState(false);
    const [verified, setVerified] = useState(false);
    const lock = useLock(user?.details?.profile?.data?.lock || null);

    const { data: balance, refetch: refetchBalance } = useContractRead({
        addressOrName: lock?.address,
        contractInterface: abi,
        functionName: 'balanceOf',
        args: myAddress,
        chainId: lock?.chain
    })

    console.log('User', user);
    console.log('Lock', lock, user?.details?.profile?.data?.lock);

    const location = useLocation();

    //TODO add ENS compatibility
    const { user: myUser, orbis } = useOrbis()
    const { chain } = useNetwork();

    const setEditing = (x) => {
        if (x) {
            setSearchParams({ editing: "true" })
        } else {
            setSearchParams([])
        }
    }

    const getUserData = async () => {
        console.log('Getting user data');
        const { data, error } = await orbis.getDids(ethers.utils.getAddress(usingAddress)); //To use checksummed (UpperCased) address

        console.log('User data', data);

        //TODO
        if (error) {
            console.error(error);
        }

        //No user in Orbis
        if (data.length == 0) {
            alert('No user found');
            return;
        }

        setUser(data[0]);
    }

    const getPosts = async () => {
        if (!user) { return }
        const { data, error } = await orbis.getPosts({
            did: user.did,
            context: raindropGroup
        })

        setPosts(data);
    }

    const handleSubscribe = async () => {
        //Change to Creator's lock chain
        if (chain.id != lock.chain) {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x' + lock.chain.toString(16) }]
            })
        }

        const paywallConfig = {
            locks: {
                [lock.address]: {
                    network: Number(lock.chain),
                    persistentCheckout: false
                    // recurringPayments: 1
                }
            },
            title: lock.name,
            // pessimistic: true
        }

        window.unlockProtocol && window.unlockProtocol.loadCheckoutModal(paywallConfig)
    }

    const checkVerification = async () => {
        console.log('Checking verified')

        const nullifier_hash = user.details.profile?.data?.nullifier_hash;

        console.log('Nullhash', nullifier_hash)

        if (nullifier_hash == null) {
            return
        }

        const res = await fetch("https://developer.worldcoin.org/api/v1/precheck/" + ACTION_ID + '?nullifier_hash=' + nullifier_hash, {
            method: 'GET',
        })

        const d = await res.json();

        if (d.nullifiers.length > 0 && d.nullifiers[0].nullifier_hash == nullifier_hash) {
            setVerified(true);
            console.log('Verified');
        }
    }

    const handleVerification = async (verificationResponse) => {
        const options = {
            action_id: ACTION_ID,
            signal: myAddress,
            proof: verificationResponse.proof,
            nullifier_hash: verificationResponse.nullifier_hash,
            merkle_root: verificationResponse.merkle_root
        };

        const res = await fetch("https://developer.worldcoin.org/api/v1/verify", {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(options)
        })

        const x = await res.json()
        console.log('Worldcoin response', x);

        updateOrbisData({
            nullifier_hash: x.nullifier_hash
        }, user, orbis)

        console.log('Verified!');
        setVerified(true);
    }

    useEffect(() => {
        if (user) {
            checkVerification();
            getPosts();
        }
    }, [user])

    useEffect(() => {
        setPosts([]);
        if (usingAddress.toLowerCase() != myAddress.toLowerCase()) {
            getUserData();
            setMyProfile(false);
        } else { //MyProfile
            setMyProfile(true);
            setUser(myUser);
        }
    }, [usingAddress, myUser])

    useEffect(() => {
        console.log('Adding Listener');
        window.addEventListener('unlockProtocol.closeModal', async () => {
            console.log('Refreshing membership');
            await refetchBalance();
            getPosts();
        })
    }, [])

    return (
        <Flex w='100%' h='100%' alignItems='center' flexDirection='column' ml='250px'>
            {/*myProfile && !verified &&
                <Box
                    position='fixed'
                    right='10px'
                    bottom='10px'
                >
                    <WorldIDWidget
                        actionId={ACTION_ID}
                        signal={myAddress}
                        enableTelemetry
                        onSuccess={handleVerification}
                        onError={(error) => console.error(error)}
                    />
                </Box>
            */}
            <Flex //Cover Image
                position='relative'
                minH='250px'
                maxH='250px'
                w='100%'
                borderBottom='1px solid'
                borderColor='brand.400'
                alignItems='center'
                justifyContent='center'
                backgroundImage={user && user.details.profile && user.details.profile.cover}
                backgroundSize='cover'
                backgroundPosition='center'
                backgroundColor={(user && user.details.profile && user.details.profile.cover) ? 'white' : '#C0C0C0'}
                cursor={(myProfile && user && user.details.profile && !user.details.profile.cover) && 'pointer'}
                onClick={() => { if (myProfile && user && user.details.profile && !user.details.profile.cover) { setEditing(true) } }}
                zIndex={1}
            >
                {user && user.details.profile && !user.details.profile.cover && myProfile &&
                    <AddIcon color='white' boxSize={10} />
                }
                <Button position='absolute' right='30px' bottom='30px' display={myProfile ? 'normal' : 'none'} onClick={() => setEditing(true)} colorScheme='brand' borderRadius='70px' px='40px'>Edit Profile</Button>
            </Flex>


            <Flex
                w='60%'
                minW='450px'
                alignItems='center'
                flexDirection='column'
                border='1px solid'
                borderColor='brand.500'
                position='relative'
                top='-50px'
            >
                <Flex
                    position='relative'
                    w='100%'
                    alignItems='center'
                    justifyContent='center'
                    borderBottom='1px solid'
                    borderColor='brand.500'
                >
                    <Flex zIndex={2} mt='15px' flexDirection='column' alignItems='center' position='absolute' left='30px' top='60px'>
                        <Text borderRadius='7px' py='4px' px='8px' border='1px solid' borderColor='brand.500'>{lock ? '$' + ethers.utils.formatUnits(lock.price, DECIMALS[lock.chain]) : 'N/A'}</Text>
                        <Text mt='2px' fontSize='small' color='#ADADAD'>Per Month</Text>
                    </Flex>

                    {/*Center profile*/}
                    <Flex zIndex={2} flexDirection='column' alignItems='center'>
                        {user && user.details.profile && user.details.profile.pfp ?
                            <Image boxSize='100px' src={user.details.profile.pfp} />
                            :
                            <Blockies seed={ethers.utils.getAddress(usingAddress)} scale={10} />
                        }
                        <Text mt='5px' fontWeight='bold' fontSize='large'>{user && (user.username || formatAddress(usingAddress))}</Text>
                        {verified && //TODO align right of name
                            <Tooltip label='This user has verified its humanity'>
                                <CheckCircleIcon color='brand.500' />
                            </Tooltip>
                        }
                        {lock && <Text>Creator</Text>}
                        <Text w='100%' px='10px' align='center' pb='20px'>{user && user.details.profile && user.details.profile.description || "No description found"}</Text>
                    </Flex>

                    {myProfile ?
                        <Flex zIndex={2} mt='15px' flexDirection='column' alignItems='center' position='absolute' right='30px' top='60px'>
                            <Text borderRadius='7px' py='4px' px='8px' border='1px solid' borderColor='brand.500' fontWeight='semibold'>$N/A</Text>
                            <Text mt='5px' fontSize='small' color='#ADADAD'>Earned USDC</Text>
                        </Flex>
                        :
                        lock && (!balance?.gt(0)) &&
                        <Flex zIndex={2} mt='15px' flexDirection='column' alignItems='center' position='absolute' right='30px' top='60px'>
                            <Button colorScheme='brand' borderRadius='70px' onClick={handleSubscribe}>Subscribe</Button>
                            <Text mt='2px' fontSize='x-small' color='#ADADAD'>On {CHAIN_NAMES[lock.chain]}</Text>
                        </Flex>
                    }

                </Flex>

                <Flex
                    w='100%'
                    alignItems='center'
                    justifyContent='space-between'
                    borderBottom='1px solid'
                    borderColor='brand.500'
                >
                    <Text onClick={() => setTab(0)} cursor='pointer' color={tab == 0 ? 'brand.500' : '#ADADAD'} fontSize='xl' mx='30px' my='20px' borderBottom='1px solid'>CONTENT</Text>
                    <Text onClick={() => setTab(1)} cursor='pointer' color={tab == 1 ? 'brand.500' : '#ADADAD'} fontSize='xl' mx='30px' my='20px' borderBottom='1px solid'>MEMBERSHIP</Text>
                </Flex>

                {tab == 0 &&
                    <div style={{ width: '100%' }}>
                        {myProfile && <CreatePost lock={lock} getPosts={getPosts} />}

                        {posts.length > 0 && posts.map((post, i) => <PostPreview key={i} post={post} isMember={balance?.gt(0)} handleSubscribe={handleSubscribe} price={lock ? ethers.utils.formatUnits(lock.price, DECIMALS[lock.chain]) : null} />)}
                    </div>
                }

                {tab == 1 &&
                    (myProfile
                        ?
                        (
                            lock
                                ?
                                <Membership
                                    self
                                    price={ethers.utils.formatUnits(lock.price, DECIMALS[lock.chain])}
                                    username={user && user.username}
                                    lock={lock || null}
                                    creatorDescription={user && user.details?.profile?.data?.creatorDescription}
                                    exclusivePostCount={posts.filter(p => p.content.encryptedBody).length}
                                />
                                :
                                <Flex pb='40px'>
                                    <EditMembership
                                        lock={lock}
                                        cancelButton={false}
                                        border={false}
                                        setMinting={setMinting}
                                        setGrantingKey={setGrantingKey}
                                    />
                                </Flex>

                        )
                        :
                        <Membership
                            price={lock ? ethers.utils.formatUnits(lock.price, DECIMALS[lock.chain]) : null}
                            username={user && user.username}
                            lock={lock || null}
                            creatorDescription={user && user.details?.profile?.data?.creatorDescription}
                            member={balance?.gt(0)}
                            exclusivePostCount={posts.filter(p => p.content.encryptedBody).length}
                            handleSubscribe={handleSubscribe}
                        />
                    )
                }

            </Flex>

            {minting && <Minting grantingKey={grantingKey} />}

            {searchParams.get('editing') && <EditPopup setEditing={setEditing} lock={lock} setGrantingKey={setGrantingKey} setMinting={setMinting} />}
        </Flex >
    )
}

export default Profile;