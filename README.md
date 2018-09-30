# bitcoin-read-only-wallet-nodejs

CLI tool to generate a readable transaction from an xpub/ypub address that's exported from a Bitcoin wallet such as a Trezor or Ledger.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing


```
git clone https://github.com/Jasonvdb/bitcoin-read-only-wallet-nodejs.git

npm install

```

## Running

```

node index.js -p <xpub/ypub>

```

## Limitations

- Currently only supports segwit addresses.
- API throtteling. Prints "Making coffee ☕" when waiting before attempting call again.

## Built With

[BitcoinJS](https://github.com/bitcoinjs/bitcoinjs-lib) - A javascript Bitcoin library for node.js and browsers.
