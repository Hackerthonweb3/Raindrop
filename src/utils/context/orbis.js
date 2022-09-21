import { useState, useEffect, createContext, useContext } from "react"
import { Orbis } from '@orbisclub/orbis-sdk'
import { useAccount, useNetwork } from "wagmi";

let orbis = new Orbis();

const orbisContext = createContext();

export const OrbisProvider = ({ children }) => {

    const [welcome, setWelcome] = useState(false);
    const [user, setUser] = useState(null);
    const { address, isConnected } = useAccount();

    const { chain } = useNetwork();

    const getOrbis = async () => {
        if (!await orbis.isConnected()) {

            const { data, error } = await orbis.getDids(address);
            
            if(data.length == 0) { //Means new user. Though not necesarilly as they could already have orbis accounts elsewhere
                console.log('NEW USER');
                const res = await orbis.connect(); //This creates an account for you (with null in data fields)
                console.log('Orbis connect:', res);
                getUser();
                setWelcome(true);
                return;
            }

            console.log('Data', data);
            
            const orbisChain = Number(data[0].did.split(':')[3])
            
            
            //TODO not let them login without changing chains
            if (orbisChain != chain.id) {
                console.log('REQUIRE TO CHANGE CHAINS TO ', orbisChain);
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x' + orbisChain.toString(16) }]
                })
            }
            
            const res = await orbis.connect(); //This creates an account for you (with null in data fields)
            
            console.log('Orbis connect:', res);
            
            //Error in the request
            if (res.status != 200) {

                return;
            }
        }
        getUser();
    }
    
    const getUser = async () => {
        const { data, error } = await orbis.getDids(address);
        
        console.log('Data', data);
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
        <orbisContext.Provider value={{ orbis, user, getOrbis, welcome, setWelcome }}>
            {children}
        </orbisContext.Provider>
    )
}

export const useOrbis = () => useContext(orbisContext);