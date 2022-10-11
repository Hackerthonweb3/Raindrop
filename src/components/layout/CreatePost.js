import { Flex, Input, Textarea, Text, RadioGroup, Radio, Spacer, Button, Image, Tooltip } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useOrbis } from "../../utils/context/orbis";
import { FileUploader } from "react-drag-drop-files";
import { useWeb3Storage } from "../../utils/hooks/web3storage";
import { CHAIN_NAMES, raindropGroup, subgraphURLs } from "../../utils/constants";
import { useLock } from "../../utils/hooks/subgraphLock";
import { ethers, utils } from "ethers";
import Blockies from 'react-blockies';
import { getUploadURL, uploadFile } from "../../utils/livepeer";
import { sendNotification } from "../../utils/epns";
import { UploadIcon } from "../Icons";

const notify = async (username, title, lock, img) => {
    return; //TODO fix

    //Get subscribers
    const res = await fetch(subgraphURLs[lock.chain], {
        method: 'POST',
        contentType: 'application/json',
        body: JSON.stringify(
            {
                query: `{
                    locks(where: {id:"${lock.address}"}) {
                        keys{
                          owner {
                            address
                          }
                        }
                      }
                }`
            }
        )
    })

    //Get addresses
    const keys = (await res.json()).data.locks[0].keys
    const addresses = keys.map(k => ('eip155:80001:' + ethers.utils.getAddress(k.owner.address)))

    //Notify
    sendNotification(username + ' just posted', title, addresses, img || null)
}

const CreatePost = ({ withPicture = false, popUp = false, setCreatingPost, getPosts }) => {

    const [active, setActive] = useState(popUp);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [postVisibility, setPostVisibility] = useState('public');
    const [file, setFile] = useState();
    const [loadingText, setLoadingText] = useState('Publishing');
    const [publishing, setPublishing] = useState(false);

    const { address } = useAccount();
    const { orbis, user } = useOrbis();
    const client = useWeb3Storage();
    const lock = useLock(user?.details?.profile?.data?.lock || null);

    const handlePublish = async () => {
        if (text == '' || title == '') {
            //TODO handle error msg
            return;
        }

        setPublishing(true);
        console.log('Publishing', title);

        const postData = {
            title: title,
            body: text,
            context: raindropGroup
        }

        let cid; //Image IPFS
        if (file) {
            if (file.type == 'video/mp4') { //Upload video to Livepeer
                setLoadingText('Uploading video');
                const vid = await uploadVideo();
                postData.data = {
                    video: {
                        id: vid.id,
                        playbackId: vid.playbackId
                    }
                }
            } else { //Upload image to IPFS
                try {
                    setLoadingText('Uploading Image');
                    cid = await client.put([file], { wrapWithDirectory: false })
                    postData.data = {
                        cover: 'https://' + cid + '.ipfs.w3s.link'
                    }
                    console.log('Picture uploaded');
                } catch (err) {
                    //TODO handle err
                    console.error(err);
                    return;
                }
            }
        }

        setLoadingText('Publishing Post');

        let res;
        if (postVisibility == 'fans') { //Gated post
            res = await orbis.createPost(postData, {
                type: 'token-gated',
                chain: CHAIN_NAMES[lock.chain].toLowerCase(),
                contractType: 'ERC721',
                contractAddress: lock.address,
                minTokenBalance: "1" //Only 1 NFT as key
            })
        } else { //Public post
            res = await orbis.createPost(postData)
        }

        console.log('Orbis response', res);
        notify(user?.username || address, title, lock, user && user.details.profile && user.details.profile.pfp ? user.details.profile.pfp : null)

        setPublishing(false);
        setActive(false);
        emptyData()
        getPosts && getPosts();
    }

    const emptyData = () => {
        setLoadingText('Publishing');
        setText('');
        setFile(null);
        setTitle('');
    }

    const handleFile = (_file) => {
        setFile(_file);
    }

    const uploadVideo = async () => {
        const { url, asset } = await getUploadURL();
        console.log('Livepeer URL', url);
        await uploadFile(url, file);
        return (asset);
    }

    useEffect(() => {
        if(lock){ //To default fans if there's a lock
            setPostVisibility('fans')
        }
    }, [lock])

    return (
        <Flex
            w='100%'
            px='20px'
            py='10px'
            flexDirection='column'
            alignItems='center'
            borderBottom='1px solid'
            borderColor='brand.500'
            transform='100ms'
        >
            <Flex
                w='100%'
                alignItems='center'
                flexDirection='column'
                position='relative'
            >
                <Flex w='100%' >
                    <Flex position='absolute' left='0'>
                        {withPicture &&
                            (user && user.details.profile?.pfp ?
                                <Image maxW='50px' maxH='50px' src={user.details.profile.pfp} />
                                :
                                <Blockies seed={utils.getAddress(address)} scale={4} />
                            )
                        }
                    </Flex>
                    <Input ml={withPicture ? '60px' : '0'} display={!active && 'none'} mb='10px' fontSize='xl' value={title} onChange={e => setTitle(e.target.value)} placeholder='Title' variant='flushed' />
                </Flex>
                <Textarea
                    ml={active ? '0' : (withPicture ? '120px' : '0')}
                    id='postTextArea'
                    value={text}
                    onChange={e => setText(e.target.value)}
                    w='100%'
                    h='10px'
                    variant='unstyled'
                    placeholder="Create new post..."
                    onClick={() => { setActive(true) }}
                    resize={active ? 'vertical' : 'none'}
                    size='md'
                />

                <FileUploader width='100%' handleChange={handleFile} types={["JPG", "PNG", "GIF", "MP4"]}>
                    <Flex
                        my='20px'
                        cursor='pointer'
                        alignItems='center'
                        w='100%'
                        borderRadius='25px'
                        px='50px'
                        py='30px'
                        flexDirection='column'
                        backgroundColor={file ? 'gray' : 'white'}
                        display={active ? 'flex' : 'none'}
                        border='1px dashed #D5D5D5'
                    >
                        <UploadIcon color='black' boxSize={6} mb='4px' />
                        <Button px='30px' size='xs' colorScheme='brandLight' color='brand.500'>{file ? file.name : 'Drop or select file'}</Button>
                        <Text fontSize='xs' color='#848484'>Any JPG, PNG, MP4, GIF</Text>
                    </Flex>
                </FileUploader>


                <Flex flexDirection='row' display={active ? 'flex' : 'none'} w='100%' alignItems='center'>
                    <Text>Who can see this post?</Text>
                    <Spacer />
                    <RadioGroup onChange={setPostVisibility} value={postVisibility} maxW='50%'>
                        <Radio value='public'>Public</Radio>
                        <Tooltip label='Go to My Profile to set up your membership' isDisabled={lock != undefined} hasArrow={true} shouldWrapChildren mt='2'>
                            <Radio ml='10px' value='fans' isDisabled={lock == undefined}>Fans only</Radio>
                        </Tooltip>
                    </RadioGroup>
                </Flex>
                <Flex mt='20px' alignSelf='flex-end'>
                    <Button
                        display={active ? 'inline' : 'none'}
                        color='brand.500'
                        onClick={() => {
                            if (popUp) {
                                setCreatingPost(false);
                                emptyData()
                            } else {
                                setActive(false);
                                emptyData()
                            }
                        }}
                        mr='10px'
                        borderRadius='10px'
                        px='40px'
                        colorScheme='brandLight'
                    >Cancel</Button>
                    <Button
                        display={active ? 'inline' : 'none'}
                        onClick={handlePublish}
                        borderRadius='10px'
                        px='40px'
                        w='auto'
                        colorScheme='brand'
                        isLoading={publishing}
                        loadingText={loadingText}
                    >Publish</Button>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default CreatePost;