import { useState, useEffect, createContext, useContext } from "react"
import { Orbis } from '@orbisclub/orbis-sdk'
import { useAccount, useNetwork } from "wagmi";
import { SUPPORTED_CHAINS } from "../constants";

let orbis = new Orbis();

const orbisContext = createContext();

export const OrbisProvider = ({ children }) => {

    const [welcome, setWelcome] = useState(false);
    const [user, setUser] = useState(null);
    const [gettingUser, setGettingUser] = useState(false);
    const [signing, setSigning] = useState(false);
    const [connecting, setConnecting] = useState(true); //Defaults true to have the logging in screen by default
    const [orbisChain, setOrbisChain] = useState(null);
    const { address, isConnected } = useAccount();

    const { chain } = useNetwork();

    const createUser = async () => {
        console.log('NEW USER');
        setSigning(true);
        const res = await orbis.connect(); //This creates an account for you (with null in data fields)
        setSigning(false);
        console.log('Orbis connect:', res);
        getUser();
        setWelcome(true);
    }

    const getOrbis = async () => {
        setConnecting(true);
        if (!await orbis.isConnected()) {
            setConnecting(false);

            //Check if chain connected is supported
            if(!SUPPORTED_CHAINS.includes(chain.id)) {
                console.log('Unsupported chain!')
                return;
            }

            const { data, error } = await orbis.getDids(address);

            if(error){
                console.error(error);
                return;
            }
            
            if(data.length == 0) { //Means new user. Though not necesarilly as they could already have orbis accounts elsewhere
                createUser();
                return;
            }
            
            //Get Orbis dids that are in supported chains
            const validData = data.filter(x => SUPPORTED_CHAINS.includes(Number(x.did.split(':')[3])));

            console.log('Data', data[0].did.split(':')[3]);
            console.log('Valid Data', validData);
            
            //If not, create an Orbis user for Raindrop in supported chain
            if(validData.length == 0){
                createUser();
                return;
            }

            //Take the first element in the array (Default user)
            const _orbisChain = Number(validData[0].did.split(':')[3])

            setOrbisChain(_orbisChain)
            
            //TODO not let them login without changing chains
            if (_orbisChain != chain.id) {
                console.log('REQUIRE TO CHANGE CHAINS TO ', _orbisChain);
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x' + _orbisChain.toString(16) }]
                })
            }
            
            setSigning(true);
            const res = await orbis.connect(); 
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
        
        console.log('Data', data);
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
        <orbisContext.Provider value={{ orbis, user, getOrbis, welcome, setWelcome, orbisChain, gettingUser, signing, connecting }}>
            {children}
        </orbisContext.Provider>
    )
}

export const useOrbis = () => useContext(orbisContext);