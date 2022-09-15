# 🤝 **Web3 Patreon**

---

[![GitHub deployments](https://img.shields.io/github/deployments/Hackerthonweb3/Web3_Patreon/production?label=deployment&logo=vercel&style=flat-square&color=00a550&logoColor=00a550)](https://w3p.vercel.app)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/Hackerthonweb3/Web3_Patreon/Build%20Pipeline?logo=github&style=flat-square&color=00a550&logoColor=00a550)](https://github.com/Hackerthonweb3/Web3_Patreon/actions/workflows/pipeline.yml)

Try out the demo, which [is hosted live here!](https://raindrop-gold.vercel.app/)

## 🚀 **Statement**

**We are eager to continue the project after the hackathon in order to actually launch it in the world.**


## 🎬 **Pitch & Live Demo (Video)**

Raindrop offers creators a decentralized alternative to platform subscriptions sites like Patreon or Onlyfans. We help creators access web3 technology to better connect with fans.

<p align='center'>
    <a href='https://www.youtube.com/embed/MgAR8_WMgeE'>
        <img src="https://www.youtube.com/watch?v=NflOaU6Kgss">
    </a>
</p>

## 💬 **Problem**

-   The tools creators use to engage with fans force them to be tied to certain platforms. Centralized membership platforms like Patreon and Onlyfans have too much power over content creators. Risks include:
    -   Legacy payment methods with little flexibility
    -   Being censored or de-platformed
    -   User data is not portable. Migrating content and fan base to different platforms is difficult.

## 💡 **Solution**

-   **Build tools for creators to connect and engage with their fan base directly.**

    -   **1. Data Portability**
        -   Creators content and fan base can be migrated to other platforms
    -   **2. Membership community made easy**
        -   Create communities at the touch of a button. Minimum knowledge of development is required to use Web3 technologies.
    -   **3. Real time and transparent data visualization**
        -   Visualization of on-chain data to help creators understand their communities.

## 🤔 **How We made **

### 1. Technological Implementation

#### Tech Stack

-   Front-End: NextJS, React, Typescript, Rainbowkit/Wagmi
-   Contracts: Solidity
-   Back-End: Ceramic, Orbis, IPFS
-   Technologies: We are deployed on Polygon. We have ERC for test.
-   ZK: Sismo

#### Use of Polygon：Deployed to Polygon to mint Subscription NFT

-   Why Polygon?：**The Web3 social experience must be as fast and cheap as Web2. Also, identity is about privacy. We thought Polygon, where ZK technology and other technologies are used, would be a good match for this as well.**
-   Detail Implementation：**The app consists in 2 smart contracts, one is an implementation of ERC1155 from Openzeppelin, with the Ownable library to manage permissions, the other is a simple ERC1155 factory, called "CreatorFactory" to deploy instances for each new registered creator, those instances keep track of patron subscriptions, expiry times, and tiers edition (tiers are not available in the frontend, but the contract has the feature)**

smart contracts verifications for polygonscan:
-> [link](https://mumbai.polygonscan.com/address/0x0bcb61720c92e4e573e573daef8dc295d30a3ffb#code)
-> [link](https://mumbai.polygonscan.com/address/0x5887d5a7f9722fb2508fe7e9c93ac05fdbbc64ba#code)

#### Use of Sismo：We used Sismo for attestation of creator

-   What is Sismo?：Sismo is a modular Attestations Protocol focused on decentralization, privacy and usability.
-   Why Sismo?：**When a fan becomes a fan of a creator or decides to pay for a subscription, they are always concerned about the creator's track record. However, in the traditional world, creators could lie; in the Web3 world, it is easier to prove track record because data can be put on the on-chain, but the problem at this time was that creators had to expose their own Wallet Address. Sismo solved this problem by allowing creators to prove their achievements in the form of badges without exposing their wallet addresses.**
-   Detail Implementation：

#### Use of IPFS：We used IPFS to store the user's Avatar data and metadata

-   Why IPFS?：IPFS is stable and secure because of it's distributed structure
-   Detail Implementation： Upload images format for creators



#### Use of Orbis.SDK on Ceramic：For Gated community to discuss with your best creators & connect with your followers.

-   What is Orbis.SDK on Ceramic：Ceramic is a mutable datastore tied to a DID, a wrapper for the Ceramic/Lit protocol that complements Ceramic and allows developers to focus on UI/UX.
-   Why Orbis.SDK on Ceramic?：Orbis offers UX benefits of not having to deal with wallet popups every time you post, follow, share etc. It should make for a much smoother experience for creators and collectors.
-   Detail Implementation：


### 3. Potential Impact

#### ① It will be a direct relationship between creators and subscribers.

-   No platform to determine what content will or will not be allowed, no opaque algorithm to determine what content will rise or fall, and no inter-party payment platform that can withhold payments from creators based on arbitrary policy changes will accelerate the creator economy by coming into existence.

#### ② Creators will be able to focus more on their creative activities.

-   With traditional subscriptions, Twitch determines the subscription price and revenue sharing. If Twitch decides to cut back on compensation to creators, there is no easy way to move your community to another platform. With an Subscription NF, the NFT with the community is yours. No platform dictates how you interact with your fans.

#### ③ A great alternative to existing web2 platforms!

Having a well designed app/front-end giving creators the ability to token gate their premium content for it to be consume only by the fans financially supporting their work seems like a great alternative to existing web2 platforms!



## 📓 **Appendix**

### 5. Our Product Roadmap

#### ① Enhance the UX of creators' submissions by making them compatible with a variety of content formats, including text, video, photos, and audio.

How creative and unique:

-   Having a well designed app/front-end giving creators the ability to token gate their premium a variety of decentralized contents by Livepeer, IPFS etc for it to be consume only by the fans financially supporting their work seems like a great alternative to existing web2 platforms!

#### ② Adding a variety of utilities to the Subscription NFT will support a steady income for creators.

How creative and unique

-   There are numerous mechanics to align incentives for collectors and service providers like Scarce, Tiered Time-limited, Revokable, Refundable, Resettable, Locked up, Burned, Staked, Soulbound, Price-controlled Held custody of. However, there is still no platform that makes these easy for anyone to use.

#### ③ Launch on Mobile App like iOS and Android

How creative and unique:

-   To make Web3Social's products a product market fit for consumers, it is necessary to achieve a better UX, and a mobile experience is essential to this. There are only a few projects in the industry that are able to combine data portability and mobile.

### 6. What We Learned

-   That Ceramic and Orbis can save time in developing Web3Social.
-   Subscription NFT's Potential

### 7. Team Members：Efforts were made from South America, Europe, the United States, and Japan. All are scheduled for ongoing development

-   Hidetaka Ko | Product Manager | We have been developing and operating Japan’s largest homestay matching service for 4 years as CEO/Co-Founder.
-   Asiya | Full Stack Software Engineer | I’m a SWE based between LA/NY, good with front end, like to build things.
-   O_t | Full Stack Software Engineer | In blockchain space since 2013, full stack+solidity developer and investor, co-organizer Ethereum Meetup Spain.
-   Taiki Ikeda | UI Designer | Fluent in English and Japanese.

### 8. Resourses

-   [Figma](https://www.figma.com/file/YJ8RSB0YWbRDTGxbsXVwdj/map?node-id=40%3A2)
-   [Notion](https://miro.com/app/board/uXjVOhnqrMI=/?share_link_id=453224520787)
-   [Miro](https://miro.com/app/board/uXjVOhnqrMI=/)
-   [Polygonscan①](https://mumbai.polygonscan.com/address/0x0bcb61720c92e4e573e573daef8dc295d30a3ffb#code)
-   [Polygonscan②](https://mumbai.polygonscan.com/address/0x5887d5a7f9722fb2508fe7e9c93ac05fdbbc64ba#code)
-   Medium:Coming soon
-   WhitePaper:Coming soon
