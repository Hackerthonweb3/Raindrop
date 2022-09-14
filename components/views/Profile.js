import { Flex, Button, Text, Image } from "@chakra-ui/react"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import { subgraphURLs } from "../../utils/constants";
import { useOrbis } from "../../utils/context/orbis";
import CreatePost from "../layout/CreatePost";

//TODO dynamic
import EditProfile from "../layout/EditProfile";
import PostPreview from "../layout/PostPreview";

//If no props.address, assume it My Profile
const Profile = () => {

    const router = useRouter();

    const [tab, setTab] = useState(0);
    const [editing, setEditing] = useState(false);
    const [lock, setLock] = useState();
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState();
    const [isMember, setIsMember] = useState(false); //Default to false

    const { address: myAddress } = useAccount();

    //TODO add ENS compatibility
    const usingAddress = router.query.profile || myAddress

    const { user: myUser, orbis } = useOrbis()
    const { chain } = useNetwork();

    const getUserData = async () => {
        const { data, error } = await orbis.getDids(usingAddress);

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

    const getLock = async () => {
        console.log('Getting locks from subgraph...');
        const subgraphData = await fetch(subgraphURLs[chain.id], {
            method: 'POST',
            contentType: 'application/json',
            body: JSON.stringify(
                {
                    query: `{
                        locks(where: {owner: "${usingAddress}", name_contains: "Raindrop"}) {
                        id
                        name
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

        const l = (await subgraphData.json()).data.locks[0]
        setLock(l)
        if (l) {
            await checkMembership(l)
        }
        getPosts();
    }

    const getPosts = async () => {
        if (!user) { return }
        console.log('Getting posts from Orbis...')
        const { data, error } = await orbis.getPosts({
            did: user.did
        })

        setPosts(data);
    }

    const checkMembership = async (l) => {
        //console.log('Getting Membership from subgraph...', lock, myAddress);
        const subgraphData = await fetch(subgraphURLs[chain.id], {
            method: 'POST',
            contentType: 'application/json',
            body: JSON.stringify(
                {
                    query: `{
                        locks(where: {address: "${l?.address || lock.address}"}) {
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

    useEffect(() => {
        getLock();
    }, [user])

    useEffect(() => {
        if (usingAddress != myAddress) {
            getUserData();
        } else {
            setUser(myUser);
        }
    }, [])

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
                backgroundColor='white'
                zIndex={1}
            >
                <Button display={myAddress == usingAddress ? 'normal' : 'none'} onClick={() => setEditing(true)} colorScheme='brand' borderRadius='70px' px='40px'>Edit Profile</Button>
            </Flex>


            <Flex
                w='60%'
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
                    <Flex flexDirection='column' alignItems='center' position='absolute' left='30px'>
                        <Text borderRadius='7px' py='4px' px='8px' border='1px solid' borderColor='brand.500'>$5.00</Text>
                        <Text mt='5px' color='#ADADAD'>Per Month</Text>
                    </Flex>

                    {/*Center profile*/}
                    <Flex flexDirection='column' alignItems='center'>
                        <Image zIndex={2} boxSize='100px' src={user && user.details.profile && 'https://' + user.details.profile.pfp + '.ipfs.w3s.link'} />
                        <Text mt='5px' fontWeight='bold' fontSize='large'>{user && (user.username || usingAddress)}</Text>
                        {lock && <Text>Creator</Text>}
                        <Text w='100%' align='center' pb='20px'>{user && user.details.profile && user.details.profile.description || "No description found"}</Text>
                    </Flex>

                    <Flex flexDirection='column' alignItems='center' position='absolute' right='30px'>
                        <Text borderRadius='7px' py='4px' px='8px' border='1px solid' borderColor='brand.500' fontWeight='semibold'>$500.00</Text>
                        <Text mt='5px' color='#ADADAD'>Earned USDC</Text>
                    </Flex>

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
                    <div>
                        {usingAddress == myAddress && <CreatePost lock={lock} />}

                        {posts.length > 0 && posts.map((post, i) => <PostPreview key={i} post={post} member={isMember} />)}
                    </div>
                }

                {tab == 1 &&
                    <div>
                        Hello
                    </div>
                }

            </Flex>



            {editing && <EditProfile setEditing={setEditing} lock={lock} />}
        </Flex >
    )
}

export default Profile;