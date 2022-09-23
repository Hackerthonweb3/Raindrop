import { Flex, Button, Text, Image } from "@chakra-ui/react"
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { useAccount, useNetwork } from "wagmi";
import { CHAIN_NAMES, DECIMALS, raindropGroup, subgraphURLs } from "../../utils/constants";
import { useOrbis } from "../../utils/context/orbis";
import { useLock } from "../../utils/hooks/subgraphLock";
import CreatePost from "../layout/CreatePost";
import Blockies from 'react-blockies';

//TODO dynamic
import EditPopup, { EditMembership } from "../layout/EditProfile";
import Membership from "../layout/Membership";
import PostPreview from "../layout/PostPreview";
import formatAddress from "../../utils/formatAddress";
import Minting from "../layout/Minting";
import { AddIcon } from "@chakra-ui/icons";

const Profile = () => {

    const { address: myAddress } = useAccount();
    const { profileAddress: usingAddress } = useParams();

    const [searchParams, setSearchParams] = useSearchParams()

    const [myProfile, setMyProfile] = useState(usingAddress.toLowerCase() == myAddress.toLowerCase());
    const [tab, setTab] = useState(0);
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState();
    const [isMember, setIsMember] = useState(null);
    const [minting, setMinting] = useState(false);
    const lock = useLock(ethers.utils.getAddress(usingAddress));

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
        console.log('Getting User posts:', user, isMember);
        if (!user) { return }
        const { data, error } = await orbis.getPosts({
            did: user.did,
            context: raindropGroup
        })

        setPosts(data);
    }

    const checkMembership = async () => {
        if (myProfile) {
            setIsMember(true);
            return;
        }
        if (!lock) {
            setIsMember(false);
            return
        }
        console.log('Getting Membership from subgraph...')//, lock, myAddress);
        const subgraphData = await fetch(subgraphURLs[lock.chain], {
            method: 'POST',
            contentType: 'application/json',
            body: JSON.stringify(
                {
                    query: `{
                        locks(where: {address: "${lock.address}"}) {
                            keys(where:{owner: "${myAddress.toLowerCase()}"}) {
                              keyId
                            }
                          }
                    }`
                }
            )
        })

        const res = (await subgraphData.json()).data
        console.log('Membership', res.locks[0].keys.length > 0)
        setIsMember(res.locks[0].keys.length > 0);
        //setLock((await subgraphData.json()).data.locks[0])
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
            pessimistic: true
        }

        //TODO change localhost
        const uri = 'https://app.unlock-protocol.com/checkout?redirectUri=' + 'https://raindrop-gold.vercel.app/' + location.pathname + '&paywallConfig=' + encodeURIComponent(JSON.stringify(paywallConfig));
        window.location.href = uri;
    }

    useEffect(() => {
        if (user && isMember != null) {
            getPosts();
        }
    }, [isMember, user])

    useEffect(() => {
        checkMembership()
        console.log('Lock', lock);
    }, [lock, myProfile])

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

    return (
        <Flex w='100%' h='100%' alignItems='center' flexDirection='column' ml='250px'>
            <Flex //Cover Image
                position='relative'
                minH='250px'
                maxH='250px'
                w='100%'
                borderBottom='1px solid'
                borderColor='brand.400'
                alignItems='center'
                justifyContent='center'
                backgroundImage={user && user.details.profile && 'url(https://' + user.details.profile.cover + '.ipfs.w3s.link)'} //TODO add default cover if no cover
                backgroundSize='cover'
                backgroundPosition='center'
                backgroundColor={(user && user.details.profile && user.details.profile.cover) ? 'white' : '#C0C0C0'}
                cursor={(myProfile && user && user.details.profile && !user.details.profile.cover) && 'pointer'}
                onClick={() => { if (myProfile && user && user.details.profile && !user.details.profile.cover) { setEditing(true) } }}
                zIndex={1}
            >
                {user && user.details.profile && !user.details.profile.cover &&
                    <AddIcon color='white' boxSize={10}/>
                }
                <Button position='absolute' right='30px' bottom='30px' display={myProfile ? 'normal' : 'none'} onClick={() => setEditing(true)} colorScheme='brand' borderRadius='70px' px='40px'>Edit Profile</Button>
            </Flex>


            <Flex
                w='55%'
                alignItems='center'
                flexDirection='column'
                //h='70%'
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
                    <Flex mt='15px' flexDirection='column' alignItems='center' position='absolute' left='30px'>
                        <Text borderRadius='7px' py='4px' px='8px' border='1px solid' borderColor='brand.500'>{lock ? '$' + ethers.utils.formatUnits(lock.price, DECIMALS[lock.chain]) : 'N/A'}</Text>
                        <Text mt='5px' color='#ADADAD'>Per Month</Text>
                    </Flex>

                    {/*Center profile*/}
                    <Flex zIndex={2} flexDirection='column' alignItems='center'>
                        {user && user.details.profile && user.details.profile.pfp ?
                            <Image boxSize='100px' src={'https://' + user.details.profile.pfp + '.ipfs.w3s.link'} />
                            :
                            <Blockies seed={ethers.utils.getAddress(usingAddress)} scale={10} />
                        }
                        <Text mt='5px' fontWeight='bold' fontSize='large'>{user && (user.username || formatAddress(usingAddress))}</Text>
                        {lock && <Text>Creator</Text>}
                        <Text w='100%' align='center' pb='20px'>{user && user.details.profile && user.details.profile.description || "No description found"}</Text>
                    </Flex>

                    {myProfile ?
                        <Flex mt='15px' flexDirection='column' alignItems='center' position='absolute' right='30px'>
                            <Text borderRadius='7px' py='4px' px='8px' border='1px solid' borderColor='brand.500' fontWeight='semibold'>$N/A</Text>
                            <Text mt='5px' color='#ADADAD'>Earned USDC</Text>
                        </Flex>
                        :
                        lock && !isMember &&
                        <Flex mt='15px' flexDirection='column' alignItems='center' position='absolute' right='30px'>
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

                        {posts.length > 0 && posts.map((post, i) => <PostPreview key={i} post={post} isMember={isMember} handleSubscribe={handleSubscribe} price={lock ? ethers.utils.formatEther(lock.price) : null} />)}
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
                                    price={ethers.utils.formatEther(lock.price)}
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
                                    />
                                </Flex>

                        )
                        :
                        <Membership
                            price={lock && ethers.utils.formatEther(lock.price)}
                            username={user && user.username}
                            lock={lock || null}
                            creatorDescription={user && user.details?.profile?.data?.creatorDescription}
                            member={isMember}
                            exclusivePostCount={posts.filter(p => p.content.encryptedBody).length}
                            handleSubscribe={handleSubscribe}
                        />
                    )
                }

            </Flex>

            {minting && <Minting />}

            {searchParams.get('editing') && <EditPopup setEditing={setEditing} lock={lock} setMinting={setMinting} />}
        </Flex >
    )
}

export default Profile;