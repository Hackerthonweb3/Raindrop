

//TODO when connext supports mainnet
export const handleSubscribe = async (lock, orbis, user) => { //lock.address, lock.chain

    /*/Change to Creator's lock chain
    if (currentChain != lock.chain) {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x' + lock.chain.toString(16) }]
        })
    }
    */

    const paywallConfig = {
        locks: {
            [lock.address]: {
                network: Number(lock.chain),
                persistentCheckout: false
                // recurringPayments: 1
            }
        },
        // title: lock.name,
        // pessimistic: true
    }

    window.unlockProtocol && window.unlockProtocol.loadCheckoutModal(paywallConfig)

    //TODO check if paid

    //Set following in orbis to true;
    await orbis.setFollow(user.did, true);

    //TODO fallback, use Unlock checkout?
}