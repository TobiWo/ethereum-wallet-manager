# Ethereum Wallet Manager

Tool to create new or manage existing EVM (Ethereum Virtual Machine) based EOA (Externally Owned Account) wallets.

It is recommended to go offline before running the script just to be 100% sure that nobody can catch your mnemonic phrase. If you even need more security also restart the PC before going online since your mnemonic will be stored within the PCs memory during runtime.

## What you can do

1. Create a fresh mnemonic and wallet
1. Retrieve public and private key and encrypted keystore json for provided mnemonic
1. Create new or manage existing mnemonc/wallet for different EVM chains by using custom derivation paths
1. Load multiple accounts (public/private keys) for one mnemonic while using different derivation paths
1. Retrieve public and private key for provided encrypted keystore json

### Note

In general a mnemonic is the representation of an hd wallet which includes hundreds of public/private keys (accounts). However, this tool only logs one public and private key for a created/loaded mnemonic currently, based on the [derivation path](https://help.myetherwallet.com/en/articles/5867305-hd-wallets-and-derivation-paths) ([see todo](#todo)). **If you need a different account you can provide a different derivation path with altered path components. E.g. MetaMask uses the address index component of the derivation path to load multiple accounts for one mnemonic. Therefore the base path, which is "m/44'/60'/0'/0/0", can be altered to "m/44'/60'/0'/0/1" to retrieve the second account like it is loaded while using MetaMask.**

## Requirements

* only tested with NodeJS 20.9.0 LTS

## Prerequisites

1. Install latest NodeJS version from [here](https://nodejs.org/en/download/).
2. Open Terminal/CMD/Powershell and navigate to root folder of this repository.
3. type `npm install` and press enter

## Usage

Type `npm run start`, press enter and follow instructions on screen.

Note: **CLOSE YOUR TERMINAL/CMD/POWERSHELL BEFORE GOING ONLINE AGAIN**

## TODO

* Add possibility to retrieve multiple or specific (based on index) public and private keys for hd wallet
