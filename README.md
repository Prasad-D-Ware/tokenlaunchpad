# Token Launchpad

A decentralized application for creating and minting custom tokens on the Solana blockchain using the SPL Token 2022 standard.

## Features

- Create your own custom tokens with metadata
- Set token name, symbol, and decimals
- Upload custom token images via URL
- Mint additional tokens to any address you own
- Connect with Solana wallets using wallet-adapter
- Built on Solana's Devnet

## Tech Stack

- React + Vite
- @solana/web3.js - Core Solana integration
- @solana/spl-token - Token 2022 program interactions
- @solana/wallet-adapter - Wallet connectivity

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Solana wallet (Phantom, Solflare, etc.)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/tokenlaunchpad.git
cd tokenlaunchpad
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Connect your Solana wallet
2. Choose "LAUNCH TOKEN" to create a new token:
   - Enter name, symbol, metadata URL, decimals, and initial supply
   - Click "Create Token" to deploy your token
3. Choose "MINT TOKENS" to mint additional tokens:
   - Enter the mint address of your token
   - Enter the amount to mint
   - Click "Mint Token"

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Built with Solana's SPL Token 2022 program
- Uses the Solana wallet adapter for wallet connectivity
