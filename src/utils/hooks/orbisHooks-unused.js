import { useState, useEffect } from "react"
import { useOrbis } from "../context/orbis";

/*export*/ const useOrbisUser = (address) => {

    const [user, setUser] = useState(null);
    const { orbis } = useOrbis();

    const getUser = async () => {
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
        //if (isConnected) {
        console.log('Getting orbis for', address);
        getOrbis();
        //}
    }, [])

    return ({ user });
}