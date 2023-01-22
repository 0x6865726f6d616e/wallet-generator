import { Wallet } from 'ethers'

export interface WalletInfo {
  address: string
  publicKey: string
  privateKey: string
}

export class WalletGenerator {
  constructor () {}

  generate (amount: number): WalletInfo[] {
    return new Array(amount).fill(0).map(() => this.generateOne())
  }

  generateWithSuffix (amount: number, suffix: string): WalletInfo[] {
    return new Array(amount).fill(0).map(() => this.generateOneWithSuffix(suffix))
  }

  generateOne (): WalletInfo {
    const wallet = Wallet.createRandom()

    return {
      address: wallet.address,
      publicKey: wallet.publicKey,
      privateKey: wallet.privateKey,
    }
  }

  async generateOneAsync (): Promise<WalletInfo> {
    const wallet = Wallet.createRandom()

    return {
      address: wallet.address,
      publicKey: wallet.publicKey,
      privateKey: wallet.privateKey,
    }
  }

  generateOneWithSuffix (suffix: string): WalletInfo {
    while (true) {
      const walletInfo = this.generateOne()

      if (walletInfo.address.slice(-1 * suffix.length) === suffix) {
        return walletInfo
      }
    }
  }

  async generateOneWithSuffixAsync (suffix: string): Promise<WalletInfo> {
    while (true) {
      const walletInfo = this.generateOne()

      if (walletInfo.address.slice(-1 * suffix.length) === suffix) {
        return walletInfo
      }
    }
  }
}
