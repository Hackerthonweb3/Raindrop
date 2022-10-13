import { Button, Flex, Image, Input, Skeleton, Text } from "@chakra-ui/react";
import { utils } from "ethers";
import { useEffect, useRef, useState } from "react";
import ProfileChooser from "../components/layout/ProfileChooser";
import { useOrbis } from "../utils/context/orbis";
import Blockies from 'react-blockies';
import { ChatIcon } from "@chakra-ui/icons";
import formatAddress from "../utils/formatAddress";

const Messages = () => {

    const [choosingRecipients, setChoosingRecipients] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);

    const { orbis, user } = useOrbis()

    const getConversations = async () => {
        const { data } = await orbis.getConversations({ did: user.did });
        setConversations(data);
        console.log('Conversations', data);
    }

    const createConversation = async (recipientsData) => {

        const dids = recipientsData.map(r => r.did);

        const res = await orbis.createConversation({
            recipients: dids
        })

        if (res.status != 200) {
            console.error('Error creating conv', res.result);
            return;
        }

        console.log('Conversation created', res);

        //Add manually new conversation as Orbis doesn't update it if there are no msgs
        setConversations([{
            stream_id: res.doc,
            context: null,
            recipients: [
                // user.did,
                ...dids
            ],
            recipients_details: [
                ...recipientsData
            ]
        }, ...conversations])
    }

    useEffect(() => {
        if (user) {
            getConversations();
        }
    }, [user])

    return (
        <Flex w='100%' h='100%' alignItems='center' ml='250px'>
            <Flex
                flexDirection='column'
                h='100%'
                alignItems='center'
                w='30%'
                minW='250px'
                maxW='300px'
                overflowY='scroll'
                borderRight='1px solid'
                borderColor='brand.500'
            >
                <Button onClick={() => setChoosingRecipients(true)} my='20px'>Start Conversation</Button>
                {conversations.length > 0 && conversations.map((conv, i) =>
                    <ConversationPreview selected={selectedConversation == i} key={i} conv={conv} select={() => setSelectedConversation(i)} selfDid={user.did} />
                )}
            </Flex>

            <Flex w='100%' h='100%'>
                {selectedConversation != null &&
                    <Conversation conversationId={conversations[selectedConversation].stream_id} />
                }
            </Flex>

            {choosingRecipients && <ProfileChooser setOpen={setChoosingRecipients} createConversation={createConversation} />}
        </Flex>
    )
}

const ConversationPreview = ({ conv, select, selfDid, selected }) => {

    const [recipientData, setRecipientData] = useState(null);

    useEffect(() => {
        //TODO implement groups. Right just 1st receipient that's not self
        setRecipientData(conv.recipients_details.filter(c => c.did != selfDid))
    }, [])

    return (
        <Flex py='10px' alignItems='center' w='100%' px='10px' onClick={select} cursor='pointer' userSelect='none' backgroundColor={selected ? 'lightgray' : 'none'}>
            {recipientData != null && (recipientData[0].profile?.pfp ?
                <Image maxH='50px' src={recipientData[0].profile.pfp} />
                :
                <Blockies seed={utils.getAddress(recipientData[0].metadata.address)} scale={5} />
            )}
            {recipientData && <Text fontWeight='bold' fontSize='xl' ml='8px'>{recipientData[0].profile?.username || recipientData[0].metadata.ensName || formatAddress(recipientData[0].metadata.address)}</Text>}
        </Flex>
    )
}

const Conversation = ({ conversationId }) => {

    const [encryptedMessages, setEncryptedMessages] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const { orbis, user } = useOrbis();

    const getMessages = async () => {
        console.log('Getting messages')
        const { data: orbisMessages } = await orbis.getMessages(conversationId);

        //Only decrypt if new messages
        //Have to get length like this because of how React manages callbacks in setInterval
        setEncryptedMessages(_messages => {
            if (orbisMessages.length > _messages.length) {
                setMessages(msgs => [...Array(orbisMessages.length - _messages.length), ...msgs])
                decryptMessages(orbisMessages, orbisMessages.length - _messages.length);
                return orbisMessages;
            } else {
                return _messages
            }
        })
    }

    const decryptMessages = async (orbisMessages, amount) => {
        console.log('Decrypting messages');

        let arr = [];

        for (let i = 0; i < amount; i++) {
            arr.push(orbis.decryptMessage(orbisMessages[i].content))
        }
        const newM = (await Promise.all(arr)).map(x => x.result);

        setMessages(_msgs => [...newM, ...(_msgs.slice(newM.length))])

        console.log('Decrypted messages');
    }

    const sendMessage = async (e) => {
        e && e.preventDefault(); //On click enter
        console.log('Sending to conv', conversationId);

        //Add the new message temporarily TODO add timestamp
        setEncryptedMessages(_encr => [{ creator_details: user.details }, ..._encr])
        setMessages(_msgs => [newMessage, ..._msgs]);
        setNewMessage('');

        const res = await orbis.sendMessage({
            conversation_id: conversationId,
            body: newMessage
        })

        if (res.status != 200) {
            console.error('Error sending message', res.result);
            return;
        }
    }

    useEffect(() => {
        setMessages([]);
        setEncryptedMessages([]);
        getMessages();
        const interval = setInterval(getMessages, 5000); //Check every 5 seconds
        return (() => {
            clearInterval(interval);
        })
    }, [conversationId])

    //TODO manage overflows

    return (
        <Flex
            w='100%'
            h='100%'
            flexDirection='column'
            position='relative'
            pt='60px'
        >
            <Flex
                w='100%'
                h='100%'
                mb='100px'
                pb='20px'
                overflowY='scroll'
                flexDirection='column-reverse'
            // justifyContent='flex-end'
            >
                {encryptedMessages.length > 0 && encryptedMessages.map((m, i) =>
                    <Message msg={m} decrypted={messages[i]} key={i} selfDid={user.did} />
                )}
            </Flex>

            <Flex alignItems='center' w='100%' h='100px' p='20px' borderTop='1px solid' borderColor='brand.500' position='absolute' bottom='0'>
                <form onSubmit={sendMessage} style={{ width: '100%' }}>
                    <Input userSelect='none' value={newMessage} onChange={e => setNewMessage(e.target.value)} type='text' placeholder='Write a message' borderRadius='27px' />
                </form>
                <ChatIcon color='brand.500' boxSize={5} ml='20px' cursor='pointer' onClick={sendMessage} />
            </Flex>
        </Flex>
    )
}

const Message = ({ msg, decrypted, selfDid }) => {

    return (
        <Flex
            w='100%'
            p='8px'
            alignItems='start'
            flexDirection={msg.creator_details.did == selfDid ? 'row-reverse' : 'row'}
            transition='translate 500ms'
        >
            {msg.creator_details.profile?.pfp ?
                <Image maxH='40px' maxW='40px' src={msg.creator_details.profile.pfp} />
                :
                <Blockies seed={utils.getAddress(msg.creator_details.metadata.address)} scale={4} />
            }
            <Flex mx='20px' backgroundColor='brand.500' py='10px' px='20px' borderRadius='20px' maxW='300px'>
                {decrypted
                    ? <Text color='white'>{decrypted}</Text>
                    : <Skeleton height='20px' w='100px' />
                }
            </Flex>
        </Flex>
    )
}

export default Messages;