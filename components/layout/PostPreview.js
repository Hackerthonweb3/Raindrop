import { Flex, Text, Image, propNames } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import { useOrbis } from "../../utils/context/orbis";
import { subgraphURLs } from "../../utils/constants";
//import LitJsSdk from 'lit-js-sdk'

const PostPreview = ({ post, member, lockAddress }) => {

    const [unencrypted, setUnencrypted] = useState();
    const [isMember, setIsMember] = useState(member);

    const { orbis } = useOrbis();
    const { address } = useAccount();
    const { chain } = useNetwork();

    const checkMembership = async () => {
        console.log('Getting Membership from subgraph...');
        const subgraphData = await fetch(subgraphURLs[chain.id], {
            method: 'POST',
            contentType: 'application/json',
            body: JSON.stringify(
                {
                    query: `{
                        locks(where: {address: "${lockAddress}"}) {
                            keys(where:{owner: "${address.toLowerCase()}"}) {
                              keyId
                            }
                          }
                    }`
                }
            )
        })

        console.log('Subgraph res', await subgraphData.json());
        //setLock((await subgraphData.json()).data.locks[0])

        //TODO set member
    }

    const decryptBody = async () => {
        if (post.content.title == 'Trying fans only post') { return } //TESTING, DELETE for Production
        //console.log('Attempting to decrypt', post.content)
        //TODO set decryptingState to show a loading thing

        try {
            const res = await orbis.decryptPost(post.content)
            if (res.status == 200) {
                setUnencrypted(res.result);
            }
        } catch (e) {
            console.error('Decryption error', e);
        }
    }

    useEffect(() => {
        console.log('Member', isMember);
        if (post.content.encryptedBody) { // Gated content
            if (isMember != undefined) {
                if (isMember) {
                    decryptBody();
                }
            } else { //If isMember == null
                console.log('Have to check membership', isMember);
                checkMembership(); //This will call decrypt body if user is member
            }
        }
    }, [])

    return (
        <Flex
            //border='1px solid'
            //borderColor='brand.500'
            w='100%'
            alignItems='center'
            flexDirection='column'
            p='15px'
        >
            {post.content.data && post.content.data.cover && <Image src={'https://' + post.content.data.cover + '.ipfs.w3s.link'} filter={post.content.encryptedBody && !isMember && 'blur(8px)'} />}
            <Text>{post.content.title}</Text>
            {post.content.encryptedBody ? (isMember ? (unencrypted || "Decrypting...") : "Locked") : post.content.body}
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