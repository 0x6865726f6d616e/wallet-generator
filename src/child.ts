import { WalletGenerator, WalletInfo } from './wallet-generator'

export interface MainRequest {
  suffix: string
}

export interface ChildResponse {
  walletInfo: WalletInfo
}

console.log(`Worker ${process.pid} started`)

process.on('message', (request: MainRequest) => {
  const { suffix } = request

  if (suffix) {
    const generator = new WalletGenerator()
    const walletInfo = generator.generateOneWithSuffix(suffix)

    const response: ChildResponse = { walletInfo: walletInfo }
    process.send!(response)
  }
})




