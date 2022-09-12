import Header from "../components/Header";
import { ChakraProvider, Flex, Text, Image, Button, Input, Box, Spacer, Checkbox } from '@chakra-ui/react'
import { useState } from "react";
import Footer from "../components/Footer";
import { theme } from '../utils/theme';

//background: linear-gradient(90deg, #0085AB 0%, #2CB2C3 34.2%, #F9D520 69.77%, #D1D922 102.6%);

const RainbowText = {
  background: 'linear-gradient(90deg, #0085AB 0%, #2CB2C3 34.2%, #F9D520 69.77%, #D1D922 102.6%)',
  webkitBackgroundClip: 'text',
  webkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textFillColor: 'transparent',
  fontSize: '5xl',
  fontWeight: 'bold'
}

const RainbowTextRed = {
  background: 'linear-gradient(90deg, #0085AB 0%, #2CB2C3 25.34%, #F9D520 50.34%, #D1D922 74.48%, #FF701F 100%)',
  webkitBackgroundClip: 'text',
  webkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textFillColor: 'transparent'
}

const Card = (props) => {
  return (
    <Flex
      alignItems='center'
      alignSelf='stretch'
      justifyContent='left'
      flexDirection='column'
      maxW='25vw'
      p='30px'
      sx={{
        background: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(90deg, #0085AB 0%, #61BB99 100%) border-box',
        border: '3px solid transparent',
      }}
      boxShadow='0px 18px 19px 0px rgba(0, 0, 0, 0.35)'
      borderRadius='25px'
    >
      <Image src={props.icon} />
      <Text mt='15px' fontSize='3xl' align='center' fontWeight='600'>{props.title}</Text>
      <div style={{ borderBottom: 'solid 1px ' + theme.colors.brand[400], width: '60%', margin: '10px 0' }} />
      <Text fontWeight='500' fontSize='xl' color='gray.400' align='center'>{props.description}</Text>
    </Flex >
  )
}

const RoadmapBox = (props) => {

  //rgba(191, 236, 231, 1)
  return (
    <Flex
      p='40px'
      border='6px solid rgba(191, 236, 231, 1)'
      borderRadius='110px'
      w='40%'
      mx='150px'
      my='30px'
      boxShadow='0px 4px 4px rgba(0, 0, 0, 0.25), inset 0px 17px 110px #BFECE7'
      //position='relative'
      //left='40px'
      flexDirection='column'
      alignItems='center'
      backgroundColor='white'
    >
      <Text
        fontWeight='bold'
        w='80%'
        align='center'
        mb='20px'
        fontSize='2xl'
        borderBottom='1px solid rgba(191, 236, 231, 1)'
      >{props.title}</Text>
      <Box>
        {props.text.map((text, i) =>
          <Flex key={i}>
            <Checkbox mr='10px' isChecked={props.completed > i} isReadOnly={true} />
            <Text>
              {text}
            </Text>
          </Flex>
        )}
      </Box>
    </Flex>
  )
}

const searchOptions = ['Artist', 'Music', 'Video', 'Designers', 'Podcast']
const phase1 = ['Text', 'Image', 'Movie', 'Rich Text Editor', 'Audio', 'NFT', 'Questionnaire', 'Live streaming token distribution', 'Private creator video messaging', 'Added Support for Creator Groups']
const phase2 = ['Subscription NFT', 'Giveaways', 'Tiered Time-limited', 'Revokable', 'Refundable', 'Resettable', 'Locked up', 'Burned', 'Staked', 'Soulbound', 'Price-controlled', 'Held custody of', 'Multi membership plan']
const phase3 = ['Notification for contents', 'Comment for Posts', 'Private Direct Messaging', 'Mobile App']
const phase4 = ['Polygon', 'Optimism', 'Oasis', 'SKALE Network', 'Aurora', 'Cronos', 'etc...']

export default function Home() {

  const [creators, setCreators] = useState(407); //407 for testing
  const [amount, setAmount] = useState('6,183,232'); //for testing
  const [selected, setSelected] = useState(0);

  return (
    <ChakraProvider theme={theme}>
      <Header />
      <Flex alignItems='center' height='80vh'>
        <Flex justifyContent='space-evenly' w='100%'>
          <div style={{ height: '100%' }}>
            <Text fontFamily='inter' fontSize='5xl' maxW='40vw' fontWeight='bold'>
              Fans are currently supporting <span style={{ color: 'rgba(0, 133, 171, 1)' }}>{creators}</span> creators with <span style={{ color: 'rgba(0, 133, 171, 1)' }}>${amount}</span> of USDC
            </Text>
          </div>
          <Image src='Raindrop.svg' maxH='250px' />
        </Flex>
      </Flex>

      <Flex alignItems='center' justifyContent='center' flexDirection='column'>
        <Image src='TopCreators.svg' />
        <Button borderRadius='20px' colorScheme='brand' w='12%'>See more</Button>
      </Flex>
      <Image w='100vw' src='Ellipse.svg' position='absolute' top='1150px' zIndex='-1' />

      <Flex mt='80px' alignItems='center' flexDirection='column'>
        <Text fontFamily='inter' color='white'>Check out these</Text>
        <Text fontSize='4xl' mb='20px' color='brand.400' pb='5px' fontWeight='bold' borderBottom='3px solid rgba(0, 133, 171, 1)'>Popular Profiles</Text>
        <Flex alignItems='center' justifyContent='space-between' w='100%' p='0 20px'>
          <div style={{ cursor: 'pointer', marginLeft: '20px', transform: 'rotate(45deg)', width: '30px', height: '30px', borderBottom: '5px solid #F9D520', borderLeft: '5px solid #F9D520' }} />
          <Image src='profile1.svg' maxH='550px' />
          <Image src='profile1.svg' maxH='550px' />
          <Image src='profile1.svg' maxH='550px' />
          <div style={{ cursor: 'pointer', marginRight: '20px', transform: 'rotate(225deg)', width: '30px', height: '30px', borderBottom: '5px solid #F9D520', borderLeft: '5px solid #F9D520' }} />
        </Flex>
      </Flex>

      <Flex
        alignItems='center'
        justifyContent='center'
        mt='150px'
        w='100%'
        sx={{ position: 'relative', overflow: 'hidden' }}
        backgroundImage='Shapes.svg'
        backgroundPosition='center'
        backgroundRepeat='no-repeat'
        backgroundSize='100%'
      >
        <Flex flexDirection='column' alignItems='center'>
          <Text
            fontWeight='bold'
            align='center'
            sx={RainbowText}
            maxW='40vw'
            noOfLines={2}
          >Our goal is to improve the creator economy</Text>
          <Image src='Squiggle.svg' maxW='250px' />
        </Flex>
        {/*Need shapes to be centered
        <Image src='Shapes.svg' position='absolute' left='-220px' maxW='120vw' />
  */}
      </Flex>

      <Flex flexDirection='column' alignItems='center' mt='100px' backgroundColor='transparent'>
        <div style={{ borderBottom: 'solid 2px rgba(191, 236, 231, 1)', width: '50%' }} />

        {/*<Text mt='40px' fontSize='3xl' fontWeight='bold'>Proud Sponsors</Text>*/}
        <Image src='SponsorLogos.png' maxW='60vw' minW='200px' m='40px 0' />

        <div style={{ borderBottom: 'solid 2px rgba(191, 236, 231, 1)', width: '50%' }} />
      </Flex>

      {/**

      <Flex
        flexDirection='column'
        backgroundImage='Background.svg'
        backgroundPosition='center'
        backgroundSize='100% 110%'
        //backgroundAttachment='fixed'
        backgroundRepeat='no-repeat'
      >
    */}
      <Flex
        flexDirection='column'
        backgroundImage='Circles.svg'
        backgroundPosition='center'
        backgroundSize='120% 100%'
        //backgroundAttachment='fixed'
        backgroundRepeat='no-repeat'
      >

        <Flex
          alignItems='center'
          justifyContent='space-around'
          m='0 20px'
          pt='200px'
        >
          <Card
            icon='Fingerprint.svg'
            title='Data ownership with no middle man'
            description='Own your data and never be a victim to content fraud. Users with verified wallets will have transparency of ownership.' />
          <Card
            icon='Checkmark.svg'
            title='Flexible digital service subscriptions'
            description='Creators can easily implement digital services, from subscriptions to micropayments for virutal goods. Issue NFTs that grant membership for any period of time.' />
          <Card
            icon='Clock.svg'
            title='Receive rewards from fans in real time!'
            description='Creators will receive steady revenue with low transaction fees and no waiting time. Real time payments!' />
        </Flex>

        <Flex alignItems='center' flexDirection='column' mt='150px'>
          <Text
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

        <Flex alignItems='center' flexDirection='column' mt='100px' pb='80px'>
          <Text
            sx={RainbowText}
            mb='40px'
          >POWER TO THE PEOPLE!!</Text>
          <Image
            src='people.png'
            mb='20px'
          //boxShadow='0px 52px 38px 51px rgba(171, 225, 225, 0.25)'
          //sx={{filter:'drop-shadow(0px 52px 50px rgba(171, 225, 225, 0.25))'}}
          //backgroundColor='transparent'
          />
          <Input
            placeholder='Search for creators'
            colorScheme='brand'
            maxW='45%'
            borderRadius='38px'
          //border='1.3px solid rgba(0,133,171,1)'
          />
          <Flex
            justifyContent='space-around'
            alignItems='center'
            minW='45%'
            mt='20px'
            px='15px'
            py='10px'
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
                backgroundColor={selected == i ? 'brand.400' : 'none'}
                color={selected == i ? 'white' : 'black'}
                onClick={() => setSelected(i)}
              >{option}</Box>)}
          </Flex>
        </Flex>

      </Flex>

      <Flex
        flexDirection='column'
        backgroundImage='RoadmapBackground.svg'
        backgroundPosition='center'
        backgroundSize='120% 100%'
        //backgroundAttachment='fixed'
        backgroundRepeat='no-repeat'
      >

        <Flex alignItems='center' flexDirection='column'>
          <Flex alignItems='center' w='55%' justifyContent='space-around'>
            <Text
              sx={RainbowText}
              pb='10px'
              style={{ borderBottom: 'solid 2px rgba(191, 236, 231, 1)' }}
            >Our Roadmap</Text>
            <Image src='p1arrow.svg' maxW='300px' mt='100px' />
          </Flex>
        </Flex>

        <Flex>
          <Spacer />
          <RoadmapBox title='Support for a variety of content formats' text={phase1} completed={3} />
        </Flex>
        <Flex>
          <RoadmapBox title='Support numerous mechanics to align incentives for creators and fans' text={phase2} completed={1} />
          <Flex flexDirection='column' justifyContent='space-between'>
            <Image src='p2arrow.svg' maxH='200px' mt='20px' />
            <Image src='p3arrow.svg' maxH='200px' />
          </Flex>
        </Flex>
        <Flex>
          <Spacer />
          <RoadmapBox title='Fan Engagement' text={phase3} completed={0} />
        </Flex>
        <Flex>
          <RoadmapBox title='Multi-Chain Support' text={phase4} completed={2} />
          <Image src='p2arrow.svg' maxH='200px' mt='20px' />
        </Flex>
        <Flex alignItems='center' justifyContent='center' pt='160px'>
          <Image src='p4arrow.svg' maxH='200px' mt='20px' position='absolute' left='22vw' />
          <Button
            colorScheme='yellow'
            color='white'
            mr='10px'
            variant='solid'
            borderRadius='20px'
            boxShadow='0px 17px 46px rgba(0, 0, 0, 0.25)'
            px='60px'
          //onClick={handleConnect}
          >Get started</Button>
        </Flex>

        <Flex justifyContent='center' mt='150px' pb='100px'>
          <Flex
            alignItems='center'
            justifyContent='space-around'
            w='65%'
            py='15px'
            px='20px'
            border='7px solid transparent'
            borderRadius='27px'
            sx={{
              background: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(90deg, #0085AB 0%, #2CB2C3 34.2%, #F9D520 69.77%, #D1D922 102.6%) border-box',
              border: '3px solid transparent',
            }}
            boxShadow='0px 4px 4px rgba(0, 0, 0, 0.25)'
            backgroundColor='white'
          >
            <Text sx={RainbowTextRed} fontSize='3xl'>Low transaction fees</Text>
            <div style={{ borderRight: '1px solid rgba(0, 133, 171, 1)', height: '70%' }} />
            <Text fontSize='xl' maxW='40%' ontWeight='500' align='center' color='gray.400' >Content creators pay little to nothing on transaction fees by using multi L2 chains
              (Polygon, Cronos, Celo, Gnosis)</Text>
          </Flex>
        </Flex>


      </Flex>

      <Flex
        flexDirection='column'
        backgroundImage='url("Ellipse2.svg")'
        backgroundPosition='center top'
        backgroundSize='cover'
        alignItems='center'
        justifyContent='space-around'
        h='190vh'
      >

        <Flex
          justifyContent='center'
        //pt='250px'
        //pb='300px'
        //pb='330px'
        //sx={{ transform: 'rotate(180deg)' }}
        >
          <Image src='Calendar.png' maxH='500px' mr='50px' />
          <Flex flexDirection='column'>
            <Text color='white' fontSize='3xl' borderBottom='4px solid white'>How it works</Text>
            <Text color='rgba(0, 133, 171, 1)' fontSize='xs' mb='10px'>Only takes 2 minutes</Text>
            <Flex alignItems='center'>
              <Image src='membership.svg' maxH='50%' mr='10px' />
              <Text color='white' fontSize='2xl'>Choose a membership</Text>
            </Flex>
            <Flex alignItems='center'>
              <Image src='signup.svg' maxH='60%' mr='10px' />
              <Text color='white' fontSize='2xl'>Sign up</Text>
            </Flex>
            <Flex alignItems='center'>
              <Image src='payment.svg' maxH='50%' mr='10px' />
              <Text color='white' fontSize='2xl'>Add payment method</Text>
            </Flex>
            <Flex alignItems='center'>
              <Image src='benefits.svg' maxH='60%' mr='10px' />
              <Text color='white' fontSize='2xl'>Get benefits</Text>
            </Flex>
          </Flex>
        </Flex>

        {/*<Image src='Ellipse3.svg' position='absolute' zIndex='-1' />*/}

        <Flex
          //pt='370px'
          //pb='200px'
          alignItems='center'
          justifyContent='center'
        //backgroundImage='Ellipse3.svg'
        //backgroundPosition='bottom'
        //backgroundRepeat='no-repeat'
        >
          <Image src='Raindrops.png' position='absolute' left='120px' maxH='400px' />
          <Flex flexDirection='column' alignItems='center'>
            <Text fontSize='4xl' color='white' mb='20px' maxW='60%' align='center'>Join hundreds of other creators on Raindrop</Text>
            <Button w='50%' borderRadius='100px' mb='15px' fontSize='3xl' py='10px' h='auto' color='brand.400' colorScheme='brandLight' fontWeight='normal'>Support Creators</Button>
            <Button w='50%' borderRadius='100px' fontSize='3xl' py='10px' h='auto' fontWeight='normal' colorScheme='brand.400' border='3px solid rgba(209, 241, 238, 1)' color='rgba(209, 241, 238, 1)' >Contact Us</Button>
          </Flex>
          <Image src='iPhone13.png' position='absolute' right='10px' maxW='400px' overflow='hidden' />
        </Flex>
      </Flex>

      <Footer />
    </ChakraProvider >
  )
}