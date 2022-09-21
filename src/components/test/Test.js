import { Button, ButtonGroup } from '@chakra-ui/react'
const ethers = require("ethers");
const { WalletService } = require("@unlock-protocol/unlock-js");
import { useProvider, useSigner } from 'wagmi';
import { unlockAddress } from '../../utils/constants';

const Test = () => {

    const provider = useProvider()
    const signer = useSigner();

    const handleDeploy = async () => {
        console.log('Deploying');
        const walletService = new WalletService(unlockAddress);
        console.log(walletService);

        await walletService.connect(provider, signer.data);

        const res = await walletService.createLock({
            //address: unlockAddress[5],
            publicLockVersion: 11,  
            name: 'test',
            maxNumberOfKeys: 1000,
            expirationDuration: 1000,
            keyPrice: '0.1',
            currencyContractAddress: '0x5c221e77624690fff6dd741493d735a17716c26b'
        }, (err, hash) => {
            console.log(err, hash)
        })

        console.log(res)
    }

    return (
        <Button colorScheme='blue' variant='solid' onClick={handleDeploy}>Deploy Lock</Button>
    )
}

export default Test;