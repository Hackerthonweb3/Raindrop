import { Flex, Text, Image, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useOrbis } from "../../utils/context/orbis";
import { useNavigate } from "react-router-dom";
//import LitJsSdk from 'lit-js-sdk'

const PostPreview = ({ post, isMember, price, handleSubscribe }) => {

    const [unencrypted, setUnencrypted] = useState();
    const [date, setDate] = useState();
    const [decrypting, setDecrypting] = useState(false);

    const { orbis } = useOrbis();
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/app/profile/' + post.creator_details.metadata.address);
    }

    const decryptBody = async () => {
        //if (post.content.title == 'Trying fans only post') { return } //TESTING, TODO DELETE for Production
        console.log('ismember', isMember);
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
            console.error('Decryption error', e);
        }
        setDecrypting(false);
    }


    useEffect(() => {
        if (post.content.encryptedBody) { // Gated content
            decryptBody();
        }
        setDate(new Date(post.timestamp * 1000));
    }, [])

    return (
        <Flex
            //border='1px solid'
            //borderColor='brand.500'
            maxW='100%'
            w='100%'
            alignItems='center'
            flexDirection='column'
            boxShadow='0px 4px 4px rgba(0,0,0,0.25)'
            pb='10px'
        //p='15px'
        >
            <Flex alignItems='center' justifyContent='space-between' w='100%' px='20px' py='15px'>
                <Flex alignItems='center' cursor='pointer' onClick={handleProfileClick}>
                    <Image mr='10px' maxH='50px' src={post.creator_details?.profile?.pfp && 'https://' + post.creator_details.profile.pfp + '.ipfs.w3s.link'} />
                    <Text fontWeight='bold'>{post.creator_details?.profile?.username || "No username??"}</Text>
                </Flex>
                <Text fontSize='sm' color='#AEAEAE'>{date?.toLocaleDateString()}</Text>
            </Flex>

            {post.content.data && post.content.data.cover &&
                <Flex
                    alignItems='center'
                    w='100%'
                    flexDirection='column'
                    position='relative'
                >
                    <Image
                        src={'https://' + post.content.data.cover + '.ipfs.w3s.link'}
                        filter={post.content.encryptedBody && !unencrypted && 'blur(5px) brightness(60%)'}
                        w='100%'
                        maxH='400px'
                    />
                    {post.content.encryptedBody && !unencrypted &&
                        <Flex w='50%' position='absolute' flexDirection='column' top='10%'>
                            <Image src='/lock.svg' h='60px' />
                            <Text mt='10px' color='white' align='center' fontWeight='bold' fontSize='large'>Unlock this post by becoming a member</Text>
                            {price && handleSubscribe && <Button onClick={handleSubscribe} mt='15px' size='sm' colorScheme='brand'>{`Join now for  $${price} per month`}</Button>}
                        </Flex>
                    }
                </Flex>
            }

            <Flex alignItems='center' mt='10px'>
                <Text position='absolute' left='15px' fontSize='xs' color='rgba(0, 0, 0, 0.2)'>Send tip (Coming soon)</Text>
                <Text fontSize='xs' color='#AEAEAE'>{date?.toLocaleDateString()}</Text>
                <Text position='absolute' right='15px' fontSize='xs' color='rgba(0, 0, 0, 0.7)'>{post.content.encryptedBody ? (unencrypted ? 'Unlocked' : 'Locked') : 'Unlocked'}</Text>
            </Flex>
            <Text fontWeight='bold' >{post.content.title}</Text>
            <Text
                color='#A2A2A2'
                w='60%'
                align='center'
                mt='10px'
            >{post.content.encryptedBody ? (unencrypted || (decrypting ? 'Decrypting...'/*TODO fix with nonmembers*/ : "Locked")) : post.content.body}</Text>

            <Flex mt='20px' alignItems='center' justifyContent='space-between' w='40%'>
                <Text fontSize='xs' color='brand.500'>{post.count_replies} Comments</Text>
                <Text fontSize='xs' color='brand.500'>{post.count_likes} Likes</Text>
            </Flex>
        </Flex>
    )
}

export default PostPreview;

/*
        const lit = new LitJsSdk.LitNodeClient({ debug: false });
        await lit.connect();

        //const authSig = JSON.parse(localStorage.getItem("lit-auth-signature"));

        const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "goerli" });

        console.log('AuthSig', authSig);

        console.log('access co', JSON.parse(post.content.encryptedBody.accessControlConditions))

        const test = [
            {
                contractAddress: "0xe86652af35cac36535eb73625363d6cbcc4f4f09",
                standardContractType: "ERC721",
                chain: "goerli",
                method: "balanceOf",
                parameters: [
                    ":userAddress"
                ],
                returnValueTest: {
                    comparator: ">=",
                    value: "1"
                }
            }
        ]

        //"[{"contractAddress":"0xe86652af35cac36535eb73625363d6cbcc4f4f09","standardContractType":"ERC721","chain":"goerli","method":"balanceOf","parameters":[":userAddress"],"returnValueTest":{"comparator":">=","value":1}}]"
        //"The access control conditions you passed in do not match the ones that were set by the condition creator for this encryptedSymmetricKey."


        const symmetricKey = await lit.getEncryptionKey({
            accessControlConditions: test, //JSON.parse(post.content.encryptedBody.accessControlConditions),
            toDecrypt: post.content.encryptedBody.encryptedSymmetricKey,
            authSig: authSig,
            chain: 'goerli'
        })

        console.log('res', symmetricKey)

        //"[{\"contractAddress\":\"0xe86652af35cac36535eb73625363d6cbcc4f4f09\",\"standardContractType\":\"ERC721\",\"chain\":\"goerli\",\"method\":\"balanceOf\",\"parameters\":[\":userAddress\"],\"returnValueTest\":{\"comparator\":\">=\",\"value\":\"1\"}}]"

        //"Expecting Array type for parameter named accessControlConditions in Lit-JS-SDK function getEncryptionKey(), but received "String" type instead. value: [{"contractAddress":"0xe86652af35cac36535eb73625363d6cbcc4f4f09","standardContractType":"ERC721","chain":"goerli","method":"balanceOf","parameters":[":userAddress"],"returnValueTest":{"comparator":">=","value":1}}]"

        //const { data, error } = await orbis.decryptPost(post.content);


        "[
            {"contractAddress":"0xe86652af35cac36535eb73625363d6cbcc4f4f09",
            "standardContractType":"ERC721",
            "chain":"goerli",
            "method":"balanceOf",
            "parameters":[":userAddress"],
            "returnValueTest": {
                "comparator":">=",
                "value":1}
            }
        ]"*/