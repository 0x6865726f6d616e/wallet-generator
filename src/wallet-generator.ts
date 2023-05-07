import { BigNumber, ethers } from 'ethers'
import * as crypto from 'node:crypto'
import * as secp256k1 from '@noble/secp256k1'
import * as sha3 from '@noble/hashes/sha3'

export interface WalletInfo {
  address: string
  publicKey: string
  privateKey: string
}

export class WalletGenerator {
  constructor() {
  }

  generate(amount: number): WalletInfo[] {
    return new Array(amount).fill(0).map(() => this.generateOne())
  }

  generateWithSuffix(amount: number, suffix: string): WalletInfo[] {
    return new Array(amount).fill(0).map(() => this.generateOneWithSuffix(suffix))
  }

  generateOne(): WalletInfo {
    const wallet = new ethers.Wallet(crypto.randomBytes(32))

    return {
      address: wallet.address,
      publicKey: wallet.publicKey,
      privateKey: wallet.privateKey,
    }
  }

  generateOneWithSuffix(suffix: string): WalletInfo {
    suffix = suffix.toLowerCase()

    let i = 0

    while (true) {
      i++

      const info = this.generateRandomOneFast()

      if (ethers.utils.hexlify(info.address).endsWith(suffix)) {
        const walletInfo: WalletInfo = {
          privateKey: ethers.utils.hexlify(info.privateKey),
          publicKey: ethers.utils.hexlify(info.publicKey),
          address: ethers.utils.getAddress(ethers.utils.hexlify(info.address))
        }

        console.log(i, walletInfo.address, walletInfo.privateKey)

        return walletInfo
      }
    }
  }

  generateWithUint256Suffix(amount: number, suffix: number): WalletInfo[] {
    return new Array(amount).fill(0).map(() => this.generateOneWithUint256Suffix(suffix))
  }

  generateOneWithUint256Suffix(suffix: number): WalletInfo {
    const digits = suffix.toString().length

    let i = 0

    while (true) {
      i++

      const info = this.generateRandomOneFast()
      const address = info.address
      const addressUint256 = BigNumber.from(address)

      if (addressUint256.mod((10 ** digits)).eq(suffix)) {
        const walletInfo: WalletInfo = {
          privateKey: ethers.utils.hexlify(info.privateKey),
          publicKey: ethers.utils.hexlify(info.publicKey),
          address: ethers.utils.getAddress(ethers.utils.hexlify(info.address))
        }

        console.log(i, walletInfo.address, walletInfo.privateKey)

        return walletInfo
      }
    }
  }

  private generateRandomOneFast(): {
    privateKey: Uint8Array
    publicKey: Uint8Array
    address: Uint8Array
  } {
    const privateKey = crypto.randomBytes(32)
    const publicKey = secp256k1.getPublicKey(privateKey)
    const address = sha3.keccak_256(publicKey.slice(1)).slice(12)

    return {
      privateKey,
      publicKey,
      address
    }
  }
}
