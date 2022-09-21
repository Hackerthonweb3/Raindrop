import { Input, Button } from '@chakra-ui/react'
import { Orbis } from '@orbisclub/orbis-sdk'
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router'

let orbis = new Orbis();

const Test2 = () => {

    const address = useAccount();
    const [profile, setProfile] = useState('')
    const router = useRouter();

    const connectOrbis = async () => {
        if(await orbis.isConnected()) {return;}
        const res = await orbis.connect();

        console.log(res);
    }

    const handleSend = async () => {
        const res = await orbis.getDids(address)
        console.log(res);
        //const a = await orbis.updateProfile({
        //    username: 'Test1',
        //    description: 'Test description aaaaa'
        //})
        //console.log(a);
        const ue = await orbis.getProfilesByUsername('Test1')
        console.log(ue);
    }

    useEffect(() => {
        connectOrbis();
    }, [])

    return(
        <div>
            <Input htmlSize={4} width='auto' value={profile} onChange={e=>setProfile(e.target.value)} />
            <Input htmlSize={4} width='auto' />
            <Button onClick={handleSend}>Send</Button>
            <Button onClick={()=>router.push('App')}>PUSH</Button>
        </div>
    )
}

export default Test2;