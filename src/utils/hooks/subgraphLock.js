import { useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import { subgraphURLs, SUPPORTED_CHAINS } from "../constants";

export const useLock = (address) => {

    const [lock, setLock] = useState();

    const getLock = async () => {
        console.log('Getting locks from subgraph...');

        for (const chain of SUPPORTED_CHAINS) {
            const subgraphData = await fetch(subgraphURLs[chain], {
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
                l.chain = chain;
                setLock(l);
                break;
            }
        }

    }

    useEffect(() => {
        getLock();
    }, [address])

    return lock;
}