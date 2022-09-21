import { Flex, Button, Text, Image } from "@chakra-ui/react"
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { useAccount, useNetwork } from "wagmi";
import { raindropGroup, subgraphURLs } from "../../utils/constants";
import { useOrbis } from "../../utils/context/orbis";
import { useLock } from "../../utils/hooks/subgraphLock";
import CreatePost from "../layout/CreatePost";
import Blockies from 'react-blockies';

//TODO dynamic
import EditPopup, { EditMembership } from "../layout/EditProfile";
import Membership from "../layout/Membership";
import PostPreview from "../layout/PostPreview";

const Profile = () => {

    const [searchParams, setSearchParams] = useSearchParams()

    const [myProfile, setMyProfile] = useState(false);
    const [tab, setTab] = useState(0);
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState();
    const [isMember, setIsMember] = useState(null);
    const { profileAddress: usingAddress } = useParams();
    const lock = useLock(ethers.utils.getAddress(usingAddress));

    const { address: myAddress } = useAccount();
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
        console.log('Getting User posts:', user);
        if (!user) { return }
        const { data, error } = await orbis.getPosts({
            did: user.did,
            context: raindropGroup
        })

        setPosts(data);
    }

    const checkMembership = async () => {
        if (!lock) {
            return
        }
        console.log('Getting Membership from subgraph...')//, lock, myAddress);
        const subgraphData = await fetch(subgraphURLs[chain.id], {
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
        const payWallConfig = {
            locks: {
                [lock.address]: {
                    network: lock.chain
                    // recurringPayments: 1
                }
            },
            title: lock.name
        }

        //TODO change localhost
        const uri = 'https://app.unlock-protocol.com/checkout?redirectUri=' + 'localhost:3000' + location.pathname + '&paywallConfig=' + encodeURIComponent(JSON.stringify(payWallConfig));
        window.location.href = uri;
    }

    useEffect(() => {
        if (user && isMember != null) {
            getPosts();
        }
    }, [isMember, user])

    useEffect(() => {
        checkMembership()
    }, [lock])

    useEffect(() => {
        if (usingAddress.toLowerCase() != myAddress.toLowerCase()) {
            getUserData();
            setMyProfile(false);
        } else {
            setMyProfile(true);
            setUser(myUser);
        }
    }, [usingAddress])

    return (
        <Flex w='100%' h='100%' alignItems='center' flexDirection='column' ml='250px'>
            <Flex //Cover Image
                p='30px'
                minH='250px'
                maxH='250px'
                w='100%'
                borderBottom='1px solid'
                borderColor='brand.400'
                alignItems='flex-end'
                justifyContent='end'
                backgroundImage={user && user.details.profile && 'url(https://' + user.details.profile.cover + '.ipfs.w3s.link)'} //TODO add default cover if no cover
                backgroundSize='cover'
                backgroundPosition='center'
                backgroundColor={(user && user.details.profile && user.details.profile.cover) ? 'white' : 'gray'}
                cursor={(myProfile && user && user.details.profile && !user.details.profile.cover) && 'pointer'}
                onClick={() => { if (myProfile && user && user.details.profile && !user.details.profile.cover) { setEditing(true) } }}
                zIndex={1}
            >
                <Button display={myProfile ? 'normal' : 'none'} onClick={() => setEditing(true)} colorScheme='brand' borderRadius='70px' px='40px'>Edit Profile</Button>
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
                        <Text borderRadius='7px' py='4px' px='8px' border='1px solid' borderColor='brand.500'>{lock ? '$' + ethers.utils.formatEther(lock.price) : 'N/A'}</Text>
                        <Text mt='5px' color='#ADADAD'>Per Month</Text>
                    </Flex>

                    {/*Center profile*/}
                    <Flex zIndex={2} flexDirection='column' alignItems='center'>
                        {user && user.details.profile && user.details.profile.pfp ?
                            <Image boxSize='100px' src={'https://' + user.details.profile.pfp + '.ipfs.w3s.link'} />
                            :
                            <Blockies seed={usingAddress} scale={10} />
                        }
                        <Text mt='5px' fontWeight='bold' fontSize='large'>{user && (user.username || usingAddress)}</Text>
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
                        {myProfile && <CreatePost lock={lock} />}

                        {posts.length > 0 && posts.map((post, i) => <PostPreview key={i} post={post} isMember={isMember} handleSubscribe={handleSubscribe} price={ethers.utils.formatEther(lock.price)} />)}
                    </div>
                }

                {tab == 1 &&
                    (myProfile
                        ?
                        (
                            lock
                                ?
                                <Membership self price={ethers.utils.formatEther(lock.price)} username={user && user.username} />
                                :
                                <Flex pb='40px'>
                                    <EditMembership lock={lock} cancelButton={false} border={false} />
                                </Flex>

                        )
                        :
                        <div>
                            Fan view
                        </div>
                    )
                }

            </Flex>



            {searchParams.get('editing') && <EditPopup setEditing={setEditing} lock={lock} />}
        </Flex >
    )
}

export default Profile;