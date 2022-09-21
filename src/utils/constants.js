
export const unlockAddress = {
    5: { //Goerli
        unlockAddress: '0x627118a4fB747016911e5cDA82e2E77C531e8206',
    },
    137 : { //Polygon
        unlockAddress: '0xE8E5cd156f89F7bdB267EabD5C43Af3d5AF2A78f'
    },
    10: { //Optimism
        unlockAddress: '0x99b1348a9129ac49c6de7F11245773dE2f51fB0c'
    }
}

//Time of Unlock protocol
export const time = 2592000 //30days in secs

export const currencies = {
    5: '0x5c221e77624690fff6dd741493d735a17716c26b', //Goerli
    137: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', //Polygon USDC
    10: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607' //Optimism USDC
}

export const subgraphURLs = {
    5: 'https://api.thegraph.com/subgraphs/name/unlock-protocol/goerli',
    137: 'https://api.thegraph.com/subgraphs/name/unlock-protocol/polygon',
    10: 'https://api.thegraph.com/subgraphs/name/unlock-protocol/optimism'
}

export const raindropGroup = 'kjzl6cwe1jw145te4josrvatq42gthq9dbifn2lwm8f6z2mqpmlvvueaanu0y8f'//'kjzl6cwe1jw14bdvi6eqt69eevrxkjc42wmi985s1siqhg4rt40rl1zrz529h5y'

//Test API for MVP. Change to either UCAN or backend upload
export const web3API = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEJjNWUwMWRlZjYzODA5ODkxNUEyOGE5RDk1RmYzMjZCMjhjQ0I4YTQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjMwNDA3MTM3NTMsIm5hbWUiOiJSYWluZHJvcFRlc3QifQ.Fauph35Ws8Ovh2PnKqxexV9uviiOfVNBxV-uowBW0b8'
