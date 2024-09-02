# Voting dApp
```
Create a voting dApp to cast votes, delegate and query results on chain
Request voting tokens to be minted using the API
(bonus) Store a list of recent votes in the backend and display that on frontend
(bonus) Use an oracle to fetch off-chain data
Use an oracle to fetch information from a data source of your preference
Use the data fetched to create the proposals in the constructor of the ballot
```
### Voting dApp integration guidelines
- [x] Build the frontend using Scaffold ETH 2 as a base
- [x] Build the backend using NestJS to provide the Mint method
- [x] Implement a single POST method
- [x] Request voting tokens from API
- [x] Use these tokens to interact with the tokenized ballot
- [x] All other interactions must be made directly on-chain

### Getting Started
Make sure you have your .env file up-to-date. Running the backend api's:
```shell 
cd backend
npm install
npm run start:dev
```
Running the frontend scaffold eth 2:
```shell 
cd frontend
yarn install
yarn start
```
## Group 2

| Unique id | Discord username    |
| --------- | ------------------- |
| RAAzLF    | @GRAVER 👾                |
| 2SyBp0    | @wackozacco        |
| 10exgX    | @δαλλασκατ    |
| r5YSqY    | @imchrismayfield          |
| HhHAQw    | @swooz                |
| Pok9XD    | @Timster            |
| T5zGzt    | @Carl Youngblood            |

## Report

Our group collaborated on the dapp functionality. Our repo requires that the TOKEN_ADDRESS and BALLOT_ADDRESS
you want to visualize be set in the .env file. The dapp allows you to delegate votes, deploy a new tokenized
ballot, and cast your vote on the ballot. A possible future improvement would be to traverse prior blockchain
transactions to infer all previously deployed contracts and then display their results in the dapp.

## References
token contract: 0x3c9d658a9b358cf1985bc52c5476229e8b186f1f


