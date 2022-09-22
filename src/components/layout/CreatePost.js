import { Flex, Input, Textarea, Text, RadioGroup, Radio, Spacer, Button, Image, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import { useOrbis } from "../../utils/context/orbis";
import { FileUploader } from "react-drag-drop-files";
import { useWeb3Storage } from "../../utils/hooks/web3storage";
import { raindropGroup } from "../../utils/constants";
import { useLock } from "../../utils/hooks/subgraphLock";
import { utils } from "ethers";
import Blockies from 'react-blockies';

const CreatePost = ({ withPicture = false, popUp = false, setCreatingPost, getPosts }) => {

    const [active, setActive] = useState(popUp);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [postVisibility, setPostVisibility] = useState('public');
    const [picture, setPicture] = useState();
    const [publishing, setPublishing] = useState(false);

    const { address } = useAccount();
    const { orbis, user } = useOrbis();
    const { chain } = useNetwork();
    const client = useWeb3Storage();
    const lock = useLock(address);

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

        //Upload image to IPFS
        if (picture) {
            try {
                const cid = await client.put([picture], { wrapWithDirectory: false })
                postData.data = {
                    cover: cid
                }
                console.log('Picture uploaded');
            } catch (err) {
                //TODO handle err
                console.error(err);
                return;
            }
        }

        let res;
        if (postVisibility == 'fans') { //Gated post
            res = await orbis.createPost(postData, {
                type: 'token-gated',
                chain: chain.name.toLowerCase(),
                contractType: 'ERC721',
                contractAddress: lock.address,
                minTokenBalance: "1" //Only 1 NFT as key
            })
        } else { //Public post
            res = await orbis.createPost(postData)
        }

        console.log('Orbis response', res);
        setPublishing(false);
        setActive(false);
        emptyData()
        getPosts && getPosts();
    }
    
    const emptyData = () => {
        setText('');
        setPicture(null);
        setTitle('');
    }

    const handleFile = (file) => {
        setPicture(file);
    }

    console.log(picture);

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
                            (user && user.pfp ?
                                <Image maxH='50px' src={'https://' + user.pfp + '.ipfs.w3s.link'} />
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

                <FileUploader width='100%' handleChange={handleFile} types={["JPG", "PNG", "GIF"]}>
                    <Flex
                        my='20px'
                        cursor='pointer'
                        alignItems='center'
                        w='100%'
                        borderRadius='25px'
                        px='50px'
                        py='30px'
                        flexDirection='column'
                        backgroundColor={picture ? 'gray' : 'white'} 
                        display={active ? 'flex' : 'none'}
                        border='1px dashed #D5D5D5'
                    >
                        {/*TODO add icon */}
                        <Button px='30px' size='xs' colorScheme='brandLight' color='brand.500'>{picture ? picture.name : 'Drop or select file'}</Button>
                        <Text fontSize='xs' color='#848484'>Any JPG, PNG, GIF</Text>
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
                        {/*TODO disable Fans only if not creator with tooltip to CTA to become one */}
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
                        loadingText='Publishing'
                    >Publish</Button>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default CreatePost;