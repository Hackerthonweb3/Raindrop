import { useEffect, useState } from "react";
import { subgraphURLs } from "../constants";

export const useLock = (data) => {

    const [lock, setLock] = useState();

    const getLock = async () => {
        console.log('Getting locks from subgraph...', data);

        let got = false;

        const subgraphData = await fetch(subgraphURLs[data.chain], {
            method: 'POST',
            contentType: 'application/json',
            body: JSON.stringify(
                {
                    query: `{
                            locks(where: {address: "${data.address}"}) {
                                name
                                address
                                price
                                createdAtBlock
                            }
                        }`
                }
            )
        })
        const l = (await subgraphData.json()).data.locks[0]
        if (l) {
            l.chain = data.chain;
            setLock(l);
            got = true;
        }

        if (!got) { //To avoid changing profiles and having the same lock
            setLock(null)
        }
    }

    useEffect(() => {
        if (!data) return;
        getLock();
    }, [data])

    return lock;
}