import Header from "../components/Header";
import { ChakraProvider, Flex, Text, Image, Button, Input, Box } from '@chakra-ui/react'
import { useState } from "react";

//background: linear-gradient(90deg, #0085AB 0%, #2CB2C3 34.2%, #F9D520 69.77%, #D1D922 102.6%);

const RainbowText = {
  background: 'linear-gradient(90deg, #0085AB 0%, #2CB2C3 34.2%, #F9D520 69.77%, #D1D922 102.6%)',
  webkitBackgroundClip: 'text',
  webkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textFillColor: 'transparent'
}

const Card = (props) => {
  return (
    <Flex
      alignItems='center'
      flexDirection='column'
      maxW='25vw'
      h='100%'
      p='30px'
      border='3px solid black' //Change later for gradients
      //sx={{ border: '3px solid', borderImageSource: 'linear-gradient(90deg, #0085AB 0%, #2CB2C3 34.2%, #F9D520 69.77%, #D1D922 102.6%)' }}
      //boxShadow='0px 4px 4px rgba(0, 0, 0, 0.25)'
      borderRadius='25px'
    >
      <Image src={props.icon} />
      <Text fontSize='2xl' align='center'>{props.title}</Text>
      <div style={{ borderBottom: 'solid 1px ' + props.color, width: '60%', margin: '10px 0' }} />
      <Text fontSize='xl' align='center'>{props.description}</Text>
    </Flex >
  )
}

const searchOptions = ['Artist', 'Music', 'Video', 'Designers', 'Podcast']

export default function Home() {

  const [creators, setCreators] = useState(407); //407 for testing
  const [amount, setAmount] = useState('6,183,232'); //for testing
  const [selected, setSelected] = useState(0);

  return (
    <ChakraProvider>
      <Header />
      <Flex alignItems='center' height='80vh'>
        <Flex justifyContent='space-evenly' w='100%'>
          <div style={{ height: '100%' }}>
            <Text fontSize='4xl' maxW='40vw' fontWeight='bold'>
              Fans are currently supporting {creators} creators with ${amount} of USDC
            </Text>
          </div>
          <Image src='Raindrop.svg' maxH='250px' />
        </Flex>
      </Flex>

      <Flex alignItems='center' justifyContent='center' flexDirection='column'>
        <Image src='TopCreators.svg' />
        <Button borderRadius='20px' colorScheme='blue' w='12%'>See more</Button>
      </Flex>
      <Image src='Ellipse.svg' position='absolute' top='1100px' zIndex='-1' />

      <Flex mt='150px' alignItems='center' flexDirection='column'>
        <Text>Check out These</Text>
        <Text fontSize='3xl'>Popular Profiles</Text>
        <Flex alignItems='center' justifyContent='space-between' w='100%' p='0 20px'>
          <Text> X </Text>
          <Image src='profile1.svg' maxH='550px' />
          <Image src='profile1.svg' maxH='550px' />
          <Image src='profile1.svg' maxH='550px' />
          <Text> X </Text>
        </Flex>
      </Flex>

      <Flex alignItems='center' justifyContent='center' mt='150px' w='100%' sx={{ position:'relative', overflow: 'hidden' }}>
        <Flex flexDirection='column' alignItems='center'>
          <Text
            fontWeight='bold'
            maxW='400px'
            fontSize='4xl'
            align='center'
            sx={RainbowText}
          >Our goal is to improve the creator economy</Text>
          <Image src='Squiggle.svg' maxW='250px' />
        </Flex>
        {/*Need shapes to be centered*/}
        <Image src='Shapes.svg' position='absolute' maxW='120vw' />
      </Flex>

      <Flex flexDirection='column' alignItems='center' mt='100px'>
        <div style={{ borderBottom: 'solid 2px rgba(191, 236, 231, 1)', width: '40%' }} />

        {/*<Text mt='40px' fontSize='3xl' fontWeight='bold'>Proud Sponsors</Text>*/}
        <Image src='SponsorLogos.png' maxW='60vw' minW='200px' m='40px 0' />

        <div style={{ borderBottom: 'solid 2px rgba(191, 236, 231, 1)', width: '40%' }} />
      </Flex>

      <Flex alignItems='center' justifyContent='space-around' m='100px 20px 0 20px' h='100%'>
        <Card
          icon='Fingerprint.svg'
          color='blue'
          title='Data ownership with no middle man'
          description='Own your data and never be a victim to content fraud. Users with verified wallets will have transparency of ownership.' />
        <Card
          icon='Checkmark.svg'
          color='blue'
          title='Flexible digital service subscriptions'
          description='Creators can easily implement digital services, from subscriptions to micropayments for virutal goods. Issue NFTs that grant membership for any period of time.' />
        <Card
          icon='Clock.svg'
          color='blue'
          title='Receive rewards from fans in real time!'
          description='Creators will receive steady revenue with low transaction fees and no waiting time. Real time payments!' />
      </Flex>

      <Flex alignItems='center' flexDirection='column' mt='150px'>
        <Text
          fontWeight='bold'
          fontSize='4xl'
          align='center'
          sx={RainbowText}
          mb='15px'
        >
          Great privacy for all users on the platform
        </Text>
        <div style={{ borderBottom: 'solid 2px rgba(191, 236, 231, 1)', width: '70%' }} />
        <Flex justifyContent='space-between' alignItems='center' maxW='70vw'>
          <Image src='ethLogo.svg' mr='20px' height='70%' />
          <Flex flexDirection='column'>
            <Text fontSize='2xl' fontWeight='bold'>Token gated content</Text>
            <Text fontSize='xl'>Creators have the ability to token gate their premium content that is only accessible by fans financially supporting their work.</Text>
          </Flex>
          <Image src='LockedPost.png' />
        </Flex>
        <div style={{ borderBottom: 'solid 2px rgba(191, 236, 231, 1)', width: '70%' }} />
      </Flex>

      <Flex alignItems='center' flexDirection='column' mt='100px'>
        <Text
          fontSize='4xl'
          fontWeight='bold'
          sx={RainbowText}
          mb='40px'
        >POWER TO THE PEOPLE!!</Text>
        <Image src='people.png' mb='20px' />
        <Input
          placeholder='Search for creators'
          colorScheme='blue'
          maxW='40%'
          borderRadius='38px'
        //border='1.3px solid rgba(0,133,171,1)'
        />
        <Flex
          justifyContent='space-around'
          alignItems='center'
          minW='40%'
          mt='20px'
          px='10px'
          py='5px'
          borderRadius='38px'
          border='1.3px solid rgba(0, 133, 171, 1)'
        >
          {searchOptions.map((option, i) =>
            <Box
              cursor='pointer'
              borderRadius='25px'
              px='20px'
              py='5px'
              key={i}
              backgroundColor={selected == i ? 'rgba(0, 133, 171, 1)' : 'none'}
              color={selected == i ? 'white' : 'black'}
              onClick={() => setSelected(i)}
            >{option}</Box>)}
        </Flex>
      </Flex>

      <Flex alignItems='center' flexDirection='column' mt='80px'>
        <Flex alignItems='center' w='55%' justifyContent='space-around'>
          <Text
            fontSize='5xl'
            fontWeight='bold'
            sx={RainbowText}
            pb='10px'
            style={{ borderBottom: 'solid 2px rgba(191, 236, 231, 1)' }}
          >Our Roadmap</Text>
          <Image src='p1arrow.svg' maxW='300px' mt='100px' />
        </Flex>
      </Flex>
    </ChakraProvider >
  )
}