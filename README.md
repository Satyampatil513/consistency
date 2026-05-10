# Consistify 🔗

> **Blockchain-powered consistency tracker that rewards you for staying on track.**

Consistify is a habit accountability system built on the **Flow blockchain**. You commit to spending a set number of hours per day on a specific website, a browser extension passively verifies your behavior, and smart contracts automatically reward you with **ConsisTokens** when you complete your challenge — no manual check-ins, no honor system.

---

## Table of Contents

- [Overview](#overview)
- [How It Works](#how-it-works)
- [Architecture](#architecture)
- [Smart Contracts](#smart-contracts)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)

---

## Overview

Most habit trackers rely on self-reporting. Consistify doesn't. It combines:

- A **Chrome extension** that silently tracks your real time on any website
- A **React web app** where you create on-chain goals and view your progress
- A **Node.js server** that bridges the extension and the frontend in real time
- **Flow blockchain smart contracts** that store your goals and mint reward tokens when you succeed

When you complete every day of your challenge at or above your daily target, the smart contract calculates your reward (`noOfDays / 2` tokens) and mints ConsisTokens directly into your Flow wallet.

---

## How It Works

```
[Chrome Extension]
  tracks time on sites
        │
        │  POST every 5 min
        ▼
[Node.js Backend :3001]
  stores data, queries blockchain
        │                  │
        │ WebSocket         │ FCL queries
        ▼                  ▼
[React Frontend]      [Flow Blockchain]
  shows live stats     stores goals & tokens
        │                  ▲
        └── transactions ──┘
```

### Step-by-Step

1. **Connect Wallet** — Open the React web app and connect your Flow wallet via FCL.
2. **Create a Goal** — Enter a URL (e.g., `coursera.org`), the number of challenge days, and your required daily hours. This is written to the blockchain via the `consistency.cdc` contract.
3. **Install the Extension** — The Chrome extension runs in the background, tracking time spent on every website.
4. **Passive Verification** — Every 5 minutes, the extension syncs your browsing data to the local backend server. The server broadcasts this to the React frontend over WebSocket.
5. **Daily Recording** — When you hit your daily target, the frontend triggers a blockchain transaction to record that day's progress.
6. **Earn Rewards** — Once all days are complete and every day met the target, the smart contract mints ConsisTokens to your wallet automatically.

---

## Architecture

| Layer | Technology | Responsibility |
|---|---|---|
| Smart Contracts | Cadence (Flow) | Store goals, record daily values, mint reward tokens |
| Frontend | React, Chart.js, FCL | Wallet auth, goal creation, live progress dashboard |
| Backend | Node.js, Express, WebSocket | Bridge between extension ↔ frontend, FCL blockchain queries |
| Browser Extension | Chrome Extension (MV2), Vanilla JS | Real-time website time tracking, notifications, site blocking |
| Token | ConsisToken (Flow fungible token) | Reward currency — 10M total supply, minted on goal completion |

---

## Smart Contracts

### `consistency.cdc`

The core contract. Stores per-user, per-URL consistency goals on the Flow blockchain.

| Field | Description |
|---|---|
| `noOfDays` | Total days in the challenge |
| `dataArray` | Array of daily recorded values |
| `target` | Minimum daily threshold to pass a day |
| `currentDay` | Reference date for the current tracking day |
| `reward` | Tokens earned on completion |

**Key functions:**

- `createAcc(days, target, startDate)` — Creates a new goal for an account and URL
- `appendValue(value)` — Records a day's progress; evaluates completion on every write
- `delete(url)` — Removes a goal from the user's account
- `show(address)` — Returns all active goals for a given address

**Reward formula:**
```
reward = noOfDays / 2
```

### `consistoken.cdc`

A custom fungible token contract on Flow. Follows the standard Vault pattern.

- `Vault` resource — holds a user's token balance; supports `withdraw()` and `deposit()`
- `VaultMinter` resource — mints new tokens and deposits them into recipient vaults
- Initial supply: **10,000,000 ConsisTokens**
- Total supply increases each time a user earns a reward

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v14+
- [Flow CLI](https://docs.onflow.org/flow-cli/install/)
- Chrome browser (for the extension)
- A Flow testnet account and wallet

### 1. Clone the repository

```bash
git clone https://github.com/Satyampatil513/consistency.git
cd consistency
git checkout Final
```

### 2. Install dependencies

```bash
npm install
```

### 3. Deploy smart contracts to Flow testnet

```bash
cd contracts
flow init   # if not already initialized
flow project deploy --network testnet
```

Update the contract addresses in `flow.json` and in the FCL config inside `src/App.js` to match your deployed contract addresses.

### 4. Start the backend server

```bash
cd server
node index.js
# Server runs on http://localhost:3001
```

### 5. Start the React frontend

```bash
# From the project root
npm start
# Opens at http://localhost:3000
```

### 6. Load the Chrome extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select the `extension/` folder from this repository
5. The Consistify extension icon will appear in your toolbar

---

## Project Structure

```
consistency/
├── contracts/
│   ├── consistency.cdc       # Core goal-tracking smart contract
│   ├── consistoken.cdc       # ConsisToken fungible token contract
│   └── flow.json             # Flow project configuration
│
├── extension/                # Chrome browser extension
│   ├── manifest.json         # Extension manifest
│   ├── index.html            # Popup UI
│   ├── block.html            # Site-blocking page
│   ├── options.html          # Settings page
│   ├── scripts/
│   │   ├── background.js     # Core time tracking logic
│   │   ├── activity.js       # Activity data management
│   │   ├── block.js          # Site blocking logic
│   │   ├── storage.js        # Local storage helpers
│   │   ├── ui.js             # Popup UI logic
│   │   └── webact.js         # Web activity tracking
│   └── style/                # Extension CSS
│
├── server/
│   └── index.js              # Express + WebSocket backend server
│
├── src/                      # React frontend
│   ├── App.js                # Main app component (wallet, goals, dashboard)
│   ├── UrlComponent.js       # Per-URL tracking display
│   ├── support/
│   │   └── graph.js          # Chart/graph utilities
│   └── cadence/
│       ├── script/           # FCL read scripts (fetch goals, rewards, etc.)
│       └── transaction/      # FCL write transactions (create, update, delete goals)
│
├── public/                   # Static assets
├── package.json
└── README.md
```

---

## Tech Stack

- **Blockchain:** Flow, Cadence smart contracts, FCL (Flow Client Library)
- **Frontend:** React 18, Chart.js, react-chartjs-2
- **Backend:** Node.js, Express, express-ws (WebSocket), Axios
- **Extension:** Chrome Extension Manifest V2, Vanilla JS, D3.js (charts), jQuery (clock picker)
- **Styling:** Custom CSS

---

## License

MIT
