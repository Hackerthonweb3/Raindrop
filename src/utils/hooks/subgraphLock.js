import { useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import { subgraphURLs } from "../constants";

export const useLock = (address) => {

    const [lock, setLock] = useState();

    const { chain } = useNetwork();

    const getLock = async () => {
        console.log('Getting locks from subgraph...');

        //TODO loop for all supported chains to be able to be multichain
        const subgraphData = await fetch(subgraphURLs[chain.id], {
            method: 'POST',
            contentType: 'application/json',
            body: JSON.stringify(
                {
                    query: `{
                        locks(where: {owner: "${address}", name_contains: "Raindrop"}) {
                        id
                        name
                        address
                        price
                        creationBlock
                        tokenAddress
                        expirationDuration
                        maxNumberOfKeys
                        version
                        totalSupply
                        }
                    }`
                }
            )
        })

        const l = (await subgraphData.json()).data.locks[0]
        
        if (l) {
            l.chain = chain.id;

            console.log('Lock', l);
            setLock(l);
        }
    }

    useEffect(() => {
        getLock();
    }, [address])

    return lock;
}