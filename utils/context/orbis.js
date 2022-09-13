import { useState, useEffect, createContext, useContext } from "react"
import { Orbis } from '@orbisclub/orbis-sdk'
import { useAccount } from "wagmi";

let orbis = new Orbis();

const orbisContext = createContext();

export const OrbisProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const { address, isConnected } = useAccount();

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

        //const test = await orbis.getProfile(data[0].did);

        //console.log('test', test);

        //console.log('Data', data)

        //TODO
        if (error) {
            console.error(error);
        }

        //No user in Orbis
        if (data.length == 0) {
            //setCreatingProfile(true);
            return;
        }

        setUser(data[0]);

    }

    useEffect(() => {
        if (isConnected) {
            console.log('Getting orbis for', address);
            getOrbis();
        }
    }, [address])

    return (
        <orbisContext.Provider value={{orbis, user, getOrbis}}>
            {children}
        </orbisContext.Provider>
    )
}

export const useOrbis = () => useContext(orbisContext);

/*
const useOrbisUser = () => {

    const [user, setUser] = useState(null);
    const { address, isConnected } = useAccount();

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

        //TODO
        if (error) {
            console.error(error);
        }

        //No user in Orbis
        if (data.length == 0) {
            //setCreatingProfile(true);
            return;
        }

        setUser(data[0]);

    }

    useEffect(() => {
        if (isConnected) {
            console.log('Getting orbis for', address);
            getOrbis();
        }
    }, [address])

    return (user);
}
*/