import { Wallet } from 'ethers'

interface WalletInfo {
  address: string
  publicKey: string
  privateKey: string
}

export class WalletGenerator {
  constructor () {}

  generate (amount: number): WalletInfo[] {
    return new Array(amount).fill(0).map(() => this.generateOne())
  }

  generateOne (): WalletInfo {
    const wallet = Wallet.createRandom()

    return {
      address: wallet.address,
      publicKey: wallet.publicKey,
      privateKey: wallet.privateKey,
    }
  }
}
