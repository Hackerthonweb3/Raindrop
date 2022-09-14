import { useEffect, useState } from 'react';
import { Web3Storage } from 'web3.storage'
import { web3API } from '../constants';
//DELETE

export const useWeb3Storage = () => {
    const [client, setClient] = useState();

    //console.log('Client', client)

    useEffect(() => {
        setClient(makeStorageClient());
    }, [])

    return (client)
}

const makeStorageClient = () => {
    console.log('Creating web3.storage client');
    return new Web3Storage({ token: web3API })
}

//bafybeigqqccjwfe66hqe62fl3sl6zh3mbjl2f2fjq7kvigu2ipnmi7hxsq
//https://ipfs.io/ipfs/bafybeigqqccjwfe66hqe62fl3sl6zh3mbjl2f2fjq7kvigu2ipnmi7hxsq