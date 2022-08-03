import { from, Observable, tap } from 'rxjs'
import * as inquirer from 'inquirer'
import dayjs from 'dayjs'
import fs from 'fs'
import { WalletGenerator } from './wallet-generator'

interface Answers {
  generateWalletAmount: number
}

const ask$ = (): Observable<Answers> => from(inquirer.prompt([
  {
    type: 'number',
    name: 'generateWalletAmount',
    message: '请输入要生成的钱包数量:',
  }
])).pipe(
  tap(answers => {
    const walletGenerator = new WalletGenerator()
    const { generateWalletAmount } = answers
    const walletInfos = walletGenerator.generate(generateWalletAmount)

    const json = JSON.stringify(walletInfos, null, 2)

    const dirPath = 'output'
    const filePath = `${dirPath}/accounts-${dayjs().valueOf()}.json`

    fs.mkdirSync(dirPath, { recursive: true })
    fs.writeFileSync(filePath, json, { encoding: 'utf-8' })

    console.log('---------------------------------------------------')
    console.log(json)
    console.log('---------------------------------------------------')

    console.log(`地址私钥文件已保存到 ${filePath}`)
  })
)

ask$().subscribe({
  error: console.error,
})
