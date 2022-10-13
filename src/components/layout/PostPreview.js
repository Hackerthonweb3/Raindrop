import { Flex, Text, Image, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useOrbis } from "../../utils/context/orbis";
import { useNavigate } from "react-router-dom";
import formatAddress from "../../utils/formatAddress";
import Blockies from 'react-blockies';
import { utils } from "ethers";
import { LikeIcon, LikeIconFill } from "../Icons";
import { LockIcon, UnlockIcon } from "@chakra-ui/icons";

//isMember is received from when loading from Profile, so we skip the check
const PostPreview = ({ post, isMember, price, handleSubscribe }) => {

    const [unencrypted, setUnencrypted] = useState();
    const [date, setDate] = useState();
    const [decrypting, setDecrypting] = useState(false);
    const [liked, setLiked] = useState(false);

    const { orbis, user } = useOrbis();
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/app/profile/' + post.creator_details.metadata.address);
    }

    const handleLike = async () => {
        setLiked(true);
        post.count_likes += 1;
        await orbis.react(post.stream_id, 'like')
    }

    const decryptBody = async () => {
        console.log('isMember', isMember)
        if (isMember != undefined && !isMember) { return }

        setDecrypting(true);
        console.log('Decrypting...')
        try {
            const res = await orbis.decryptPost(post.content)
            if (res.status == 200) {
                console.log('Decrypted')
                setUnencrypted(res.result);
            }
        } catch (e) {
            //console.error('Decryption error', e);
        }
        setDecrypting(false);
    }

    const getReaction = async () => {
        let { data } = await orbis.getReaction(post.stream_id, user.did);

        if (data && data.type == 'like') {
            setLiked(true);
        }
    }

    useEffect(() => {
        getReaction();
    }, [])

    useEffect(() => {
        if (post.content.encryptedBody) { // Gated content
            decryptBody();
        }
        setDate(new Date(post.timestamp * 1000));
    }, [isMember])

    return (
        <Flex
            maxW='100%'
            w='100%'
            alignItems='center'
            flexDirection='column'
            boxShadow='0px 4px 4px rgba(0,0,0,0.25)'
            pb='10px'
        >
            <Flex alignItems='center' justifyContent='space-between' w='100%' px='20px' py='15px'>
                <Flex alignItems='center' cursor='pointer' onClick={handleProfileClick}>
                    {post.creator_details?.profile?.pfp ?
                        <Image maxH='50px' src={post.creator_details.profile.pfp} />
                        :
                        <Blockies seed={utils.getAddress(post.creator_details?.metadata?.address)} scale={4} />
                    }
                    <Text ml='10px' fontWeight='bold'>{post.creator_details?.profile?.username || formatAddress(post.creator_details?.metadata?.address)}</Text>
                </Flex>
                <Text fontSize='sm' color='#AEAEAE'>{date?.toLocaleDateString()}</Text>
            </Flex>

            {post.content.data && (post.content.data.cover || post.content.data.video) &&
                <Flex
                    alignItems='center'
                    w='100%'
                    flexDirection='column'
                    position='relative'
                    minH='200px'
                    maxH='400px'
                >
                    {post.content.data.cover &&
                        <Image
                            src={post.content.data.cover}
                            filter={post.content.encryptedBody && !unencrypted && 'blur(5px) brightness(60%)'}
                            w='100%'
                            maxH='400px'
                            alt='Images may take a minute to load, reload if necessary'
                            fit='cover'
                        />
                    }
                    {post.content.data.video &&
                        ((post.content.encryptedBody && !unencrypted) ?
                            <Flex w='100%' h='200px' backgroundColor='#AEAEAE'></Flex>
                            :
                            <iframe
                                style={{ width: '100%', maxHeight: '400px', height: '100%' }}
                                src={"https://lvpr.tv?v=" + post.content.data.video.playbackId}
                                frameborder="0"
                                allowfullscreen
                                allow="encrypted-media"
                                sandbox="allow-scripts"
                            >
                            </iframe>
                        )
                    }
                    {post.content.encryptedBody && !unencrypted &&
                        <Flex w='50%' position='absolute' flexDirection='column' top='10%'>
                            <Image src='/lock.svg' h='60px' />
                            <Text textShadow='1px 1px #000' mt='10px' color='white' align='center' fontWeight='bold' fontSize='large'>Unlock this post by becoming a member</Text>
                            {price && handleSubscribe && <Button onClick={handleSubscribe} mt='15px' size='sm' colorScheme='brand'>{`Join now for  $${price} per month`}</Button>}
                        </Flex>
                    }
                </Flex>
            }

            <Flex alignItems='center' mt='10px'>
                <Text position='absolute' left='15px' fontSize='xs' color='rgba(0, 0, 0, 0.2)'>Send tip (Coming soon)</Text>
                <Text fontSize='xs' color='#AEAEAE'>{date?.toLocaleDateString()}</Text>
                <Flex position='absolute' right='15px' alignItems='center'>
                    {post.content?.encryptedBody && (unencrypted
                        ? <UnlockIcon boxSize={2} color='rgba(0, 0, 0, 0.5)'/>
                        : <LockIcon boxSize={2} color='rgba(0, 0, 0, 0.5)'/>
                    )}
                    <Text ml='3px' fontSize='xs' color='rgba(0, 0, 0, 0.7)'>{post.content.encryptedBody ? (unencrypted ? 'Unlocked' : 'Locked') : 'Public Post'}</Text>
                </Flex>
            </Flex>
            <Text fontWeight='bold' >{post.content.title}</Text>
            <Text
                color='#A2A2A2'
                w='60%'
                align='center'
                mt='10px'
            >{post.content.encryptedBody
                ? (unencrypted || (decrypting ? 'Decrypting...'/*TODO fix with nonmembers*/ : post.content.data?.preview ? post.content.data.preview + '...' : "Locked"))
                : post.content.body}
            </Text>

            {post.content.encryptedBody && !unencrypted && !decrypting &&
                <Text color='#6A6A6A' align='center'>Subscribe to see full post</Text>
            }

            <Flex mt='20px' alignItems='center' justifyContent='space-between' w='40%'>
                <Flex alignItems='center' cursor='pointer' onClick={handleLike}>
                    <Text fontSize='xs' color='brand.500'>{post.count_replies} Comments</Text>
                    <Image src='/comment.svg' ml='5px' boxSize={3} />
                </Flex>
                <Flex alignItems='center' cursor='pointer' onClick={handleLike}>
                    {liked
                        ?
                        <>
                            <Text fontSize='xs' color='brand.500'>{post.count_likes == 1 ? post.count_likes + ' Like' : post.count_likes + ' Likes'}</Text>
                            <LikeIconFill fill='brand.500' ml='5px' boxSize={3} />
                        </>
                        :
                        <>
                            <Text fontSize='xs' color='brand.500'>{post.count_likes == 1 ? post.count_likes + ' Like' : post.count_likes + ' Likes'}</Text>
                            <LikeIcon color='brand.500' ml='5px' boxSize={3} />
                        </>
                    }
                </Flex>
            </Flex>
        </Flex>
    )
}

export default PostPreview;