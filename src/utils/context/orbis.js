import { useState, useEffect, createContext, useContext } from "react"
import { Orbis } from '@orbisclub/orbis-sdk'
import { useAccount } from "wagmi";

let orbis = new Orbis();

const orbisContext = createContext();

export const OrbisProvider = ({ children }) => {

    const [welcome, setWelcome] = useState(false);
    const [user, setUser] = useState(null);
    const [gettingUser, setGettingUser] = useState(false);
    const [signing, setSigning] = useState(false);
    const [connecting, setConnecting] = useState(false); //Defaults true to have the logging in screen by default
    const { address, isConnected } = useAccount();

    const getOrbis = async () => {
        setConnecting(true);
        if (!await orbis.isConnected()) {
            setConnecting(false);

            setSigning(true);
            const res = await orbis.connect_v2({
                lit: true,
                provider: window.ethereum
            });
            setSigning(false);

            console.log('Orbis connect:', res);

            //Error in the request
            if (res.status != 200) {
                console.error(res);
                return;
            }
        }
        getUser();
    }

    const getUser = async () => {
        setGettingUser(true);
        console.log('Getting user')
        const { data, error } = await orbis.getDids(address);

        //TODO
        if (error) {
            setGettingUser(false)
            console.error(error);
            return;
        }

        //No user in Orbis
        if (data.length == 0) {
            setGettingUser(false)
            return;
        }

        setUser(data[0]);
        setGettingUser(false)
    }

    useEffect(() => {
        if (isConnected) {
            getOrbis();
        }
    }, [address])

    return (
        <orbisContext.Provider value={{ orbis, user, getOrbis, welcome, setWelcome, gettingUser, signing, connecting }}>
            {children}
        </orbisContext.Provider>
    )
}

export const useOrbis = () => useContext(orbisContext);