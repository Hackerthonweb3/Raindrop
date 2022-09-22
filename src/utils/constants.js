
export const unlockAddress = {
    5: { //Goerli
        unlockAddress: '0x627118a4fB747016911e5cDA82e2E77C531e8206',
    },
    137 : { //Polygon
        unlockAddress: '0xE8E5cd156f89F7bdB267EabD5C43Af3d5AF2A78f'
    },
    10: { //Optimism
        unlockAddress: '0x99b1348a9129ac49c6de7F11245773dE2f51fB0c'
    },
    80001: { //Mumbai (Polygon Testnet)
        unlockAddress: '0x1FF7e338d5E582138C46044dc238543Ce555C963'
    }
}

export const CHAIN_NAMES = {
    5: 'Goerli',
    137: 'Polygon',
    10: 'Optimism',
    80001: 'Mumbai'
}

//Time of Unlock protocol
export const time = 2592000 //30days in secs

export const currencies = {
    5: '0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60', //Goerli DAI (Gotten on Uniswap)
    137: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', //Polygon USDC
    10: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607', //Optimism USDC
    80001: '0xe11A86849d99F524cAC3E7A0Ec1241828e332C62' //Mumbai
}

export const subgraphURLs = {
    5: 'https://api.thegraph.com/subgraphs/name/unlock-protocol/goerli',
    137: 'https://api.thegraph.com/subgraphs/name/unlock-protocol/polygon',
    10: 'https://api.thegraph.com/subgraphs/name/unlock-protocol/optimism',
    80001: 'https://api.thegraph.com/subgraphs/name/unlock-protocol/mumbai'
}

export const raindropGroup = 'kjzl6cwe1jw145te4josrvatq42gthq9dbifn2lwm8f6z2mqpmlvvueaanu0y8f'//'kjzl6cwe1jw14bdvi6eqt69eevrxkjc42wmi985s1siqhg4rt40rl1zrz529h5y'

export const SUPPORTED_CHAINS = [5, 137, 10, 80001]; //TODO remove Goerli for production

//Test API for MVP. Change to either UCAN or backend upload
export const web3API = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEJjNWUwMWRlZjYzODA5ODkxNUEyOGE5RDk1RmYzMjZCMjhjQ0I4YTQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjMwNDA3MTM3NTMsIm5hbWUiOiJSYWluZHJvcFRlc3QifQ.Fauph35Ws8Ovh2PnKqxexV9uviiOfVNBxV-uowBW0b8'
