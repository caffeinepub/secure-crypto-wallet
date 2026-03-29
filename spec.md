# Secure Crypto Wallet

## Current State
New project. Motoko backend generated with hasWallet, biometrics, auto-lock preferences. Frontend not yet built.

## Requested Changes (Diff)

### Add
- BIP-39 seed phrase generation (12/24 words) using ethers.js / bip39 library
- Wallet derivation for ETH (m/44'/60'/0'/0/0) and ICP (Ed25519 via derivation path m/44'/223'/0'/0/0)
- AES-256 encryption of seed phrase and private keys before localStorage storage
- 6-digit PIN lock screen (required on first launch)
- Biometric authentication via Web Authentication API (WebAuthn) where supported
- Auto-lock after 2 minutes of inactivity
- PIN change functionality in settings
- Wallet dashboard: ETH + ICP balances + ERC-20 token list (simulated/mock data)
- Send screen: recipient address input + QR code scanner, supports ETH and ICP sends
- Receive screen: QR code display of wallet address (ETH and ICP), switchable
- Transaction history list with status indicators (mock data, includes ICP txns)
- Mandatory seed phrase backup confirmation step during wallet creation
- Wallet recovery flow via seed phrase import
- Settings: change PIN, biometric toggle, auto-lock timer, backup seed phrase, reset wallet
- Bottom navigation: Wallet, Send, Receive, History, Settings
- Dark theme with neon green accent, mobile-first responsive layout

### Modify
- Nothing (new project)

### Remove
- Nothing

## Implementation Plan
1. Backend: minimal Motoko actor (wallet data stays in encrypted localStorage)
2. Frontend deps: ethers.js (ETH), bip39, @dfinity/agent + @dfinity/identity (ICP), crypto-js (AES-256)
3. Screens: Lock, Setup (CreateWallet or ImportWallet), BackupConfirm, Dashboard, Send, Receive, History, Settings
4. Security layer: EncryptionService (AES-256 PIN-derived key), SecureStorage wrapper
5. Auth flow: first launch → PIN setup → wallet create/import → backup confirm → main app
6. ICP wallet: derive ICP principal/account ID from seed, display ICP balance, send/receive ICP
7. Token list: ETH, ICP, plus ERC-20 tokens (USDC, USDT, DAI as mock entries)
8. All balances and transaction history simulated with realistic mock data
9. QR scanner for Send (camera component), QR code display for Receive (qr-code component)
