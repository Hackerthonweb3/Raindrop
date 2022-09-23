import * as EpnsAPI from "@epnsproject/sdk-restapi"
import { ethers } from "ethers";

//TODO move logic to backend after MVP
const PK = 'c4f42bb942734c90e87098c02cd70b8d3f1b2fb77eb6b6900af97c4b2fdc5ae7'
const privKey = '0x' + PK
const signer = new ethers.Wallet(privKey);

export const sendNotification = async (title, body, toWallets, img) => {

    if (toWallets.length > 1) {

        try {
            const response = await EpnsAPI.payloads.sendNotification({
                signer,
                type: 4,
                identityType: 2,
                notification: {
                    title: title,
                    body: body
                },
                payload: {
                    title: title,
                    body: body,
                    cta: '',
                    img: img || ''
                },
                recipients: toWallets,
                channel: 'eip155:80001:' + signer.address,
                env: 'staging'
            })

            console.log('EPNS response', response);
        } catch (err) {
            console.log('ERROR with notif', err);
        }
    } else {
        try {
            const response = await EpnsAPI.payloads.sendNotification({
                signer,
                type: 3,
                identityType: 2,
                notification: {
                    title: title,
                    body: body
                },
                payload: {
                    title: title,
                    body: body,
                    cta: '',
                    img: img || ''
                },
                recipients: toWallets[0],
                channel: 'eip155:80001:' + signer.address,
                env: 'staging'
            })

            console.log('EPNS response', response);
        } catch (err) {
            console.log('ERROR with notif', err);
        }
    }

}

export const getNotifications = async (address) => {
    const spams = await EpnsAPI.user.getFeeds({
        user: 'eip155:80001:' + address,
        spam: true,
        env: 'staging'
    });

    console.log('Spam notif', spams);
}

export const turnOnNotifications = async (address, _signer) => {
    let res;
    await EpnsAPI.channels.subscribe({
        signer: _signer.data,
        channelAddress: 'eip155:80001:' + signer.address, // channel address in CAIP
        userAddress: 'eip155:80001:' + address, // user address in CAIP
        onSuccess: () => {
            res = true;
            console.log('Opt in success', res);
        },
        onError: () => {
            res = true;
        },
        env: 'staging'
    })
    return res;
}

export const turnOffNotifications = async (address, _signer) => {
    let res;
    await EpnsAPI.channels.unsubscribe({
        signer: _signer.data,
        channelAddress: 'eip155:80001:' + signer.address,
        userAddress: 'eip155:80001:' + address,
        onSuccess: () => {
            res = true;
            console.log('Opt out success', res);
        },
        onError: () => {
            res = false;
        },
        env: 'staging'
    })
    return res;
}

export const isUserSubscribed = async (address) => {

    console.log('Channel', signer.address);

    const subscriptions = await EpnsAPI.user.getSubscriptions({
        user: 'eip155:80001:' + address,
        env: 'staging'
    });

    console.log('Subs', subscriptions);

    return (subscriptions.filter(sub => sub.channel == signer.address).length > 0)
}