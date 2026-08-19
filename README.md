# Consistify

**🏆 Winner, Cognizance '24** (IIT Roorkee's flagship tech fest)

A dApp that puts your money where your habits are. Set a daily target, lock it to your Flow wallet, and log your progress each day — hit the target every day for the full streak and a smart contract pays out the reward. Miss a day and you get nothing. No app, no friend group, no willpower required — just an immutable contract enforcing the deal you made with yourself.

## How it works

1. **Connect your wallet** via Flow Client Library (FCL) — no signup, no backend auth.
2. **Create a target**: pick a URL/habit identifier, a number of days, an hourly target, and lock it on-chain.
3. **Log progress daily**: submit today's value against the target.
4. **Get paid automatically**: the contract checks every logged day against the target — if every single day cleared the bar, it releases the reward. One bad day and the streak (and the payout) is void.

All of this state — targets, daily logs, current streak day, reward — is tracked per-account, per-habit, directly in the smart contract on Flow. There's no database to trust; the chain is the source of truth.

## Tech stack

- **Smart contracts**: [Cadence](https://developers.flow.com/cadence) on [Flow](https://flow.com) — `contracts/consistency.cdc` holds the core streak-tracking logic (`createAcc`, `appendValue`, `show`); `contracts/ConsisToken.cdc` is the fungible-token contract behind the reward payout.
- **Frontend**: React + [`@onflow/fcl`](https://developers.flow.com/tools/clients/fcl-js) for wallet auth and transaction/script execution, [Chart.js](https://www.chartjs.org/) for visualizing progress.
- **Network**: deployed and tested against Flow Testnet.

## Project layout

```
contracts/                     Cadence contracts (streak logic + token)
  consistency.cdc
  ConsisToken.cdc
  flow.json                    Contract/account/network config for the Flow CLI
src/
  App.js                       Main UI — connect wallet, create target, log/view progress
  cadence/
    transaction/                Cadence transactions (create target, update daily value)
    script/                     Cadence scripts (read target, streak, reward, urls)
  support/graph.js               Chart.js progress visualization
```

## Getting started

### Prerequisites

- Node.js and npm
- [Flow CLI](https://developers.flow.com/tools/flow-cli/install) (`flow init`, `flow deploy`)
- A Flow wallet (e.g. [Blocto](https://blocto.io) or the [Flow Dev Wallet](https://developers.flow.com/tools/flow-dev-wallet) for local testing)

### Run the contracts

```bash
cd contracts
flow init          # sets up local emulator config if you don't already have flow.json
flow emulator start
flow deploy         # deploy consistency.cdc and ConsisToken.cdc to the emulator/testnet
```

Update `contracts/flow.json` with your own account address/key before deploying to testnet or mainnet — don't reuse the sample account in this repo.

### Run the app

```bash
npm install
npm start
```

Opens at [http://localhost:3000](http://localhost:3000). The app is preconfigured (in `src/App.js`) to talk to Flow Testnet and the Flow FCL Discovery wallet UI — update the contract address there if you deploy your own instance of the contracts.

Other scripts: `npm test` (test runner), `npm run build` (production build).
