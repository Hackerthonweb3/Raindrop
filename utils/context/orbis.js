import { useState, useEffect, createContext, useContext } from "react"
import { Orbis } from '@orbisclub/orbis-sdk'
import { chain, useAccount, useNetwork } from "wagmi";

let orbis = new Orbis();

const orbisContext = createContext();

export const OrbisProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const { address, isConnected } = useAccount();

    const { chain } = useNetwork();

    const getOrbis = async () => {
        if (!await orbis.isConnected()) {
            const res = await orbis.connect(); //This creates an account for you (with null in data fields)

            console.log('Orbis connect:', res);

            //Error in the request
            if (res.status != 200) {

                return;
            }
        }

        const { data, error } = await orbis.getDids(address);

        //console.log('Orbis data', data);

        const actualDiD = data.filter(d => d.did.includes('eip155:' + chain.id))[0] //TODO Use polygon Did to prevent cross-chain problems

        console.log('eip155:' + chain.id)
        console.log('Actual Did', actualDiD);
        //TODO
        if (error) {
            console.error(error);
        }

        //No user in Orbis
        if (data.length == 0) {
            //setCreatingProfile(true);
            return;
        }

        setUser(actualDiD);

    }

    useEffect(() => {
        if (isConnected) {
            console.log('Getting orbis for', address);
            getOrbis();
        }
    }, [address])

    return (
        <orbisContext.Provider value={{ orbis, user, getOrbis }}>
            {children}
        </orbisContext.Provider>
    )
}

export const useOrbis = () => useContext(orbisContext);