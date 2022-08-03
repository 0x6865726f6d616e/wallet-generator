import { from, Observable, tap } from 'rxjs'
import * as inquirer from 'inquirer'
import dayjs from 'dayjs'
import { WalletGenerator } from './wallet-generator'
import { saveObjectToFile } from './utils'

interface Answers {
  generateWalletAmount: number
  generateWalletSuffix: string
}

const ask$ = (): Observable<Answers> => from(inquirer.prompt([
  {
    type: 'number',
    name: 'generateWalletAmount',
    message: '请输入要生成的钱包数量:',
  },
  {
    type: 'input',
    name: 'generateWalletSuffix',
    message: '请输入要使用的后缀（或不填）:',
  }
])).pipe(
  tap(answers => {
    const {
      generateWalletAmount: amount,
      generateWalletSuffix: suffix,
    } = answers

    if (amount >= 11 || amount <= 0) {
      console.log('无效的数量')
      return
    }

    if (suffix.length >= 3) {
      console.log('无效的后缀')
      return
    }

    const generator = new WalletGenerator()

    const infos = suffix ?
      generator.generateWithSuffix(amount, suffix) :
      generator.generate(amount)

    const dirPath = 'output'
    const filePath = `${dirPath}/accounts-${dayjs().valueOf()}.json`

    const json = saveObjectToFile(infos, dirPath, filePath)

    console.log('---------------------------------------------------')
    console.log(json)
    console.log('---------------------------------------------------')

    console.log(`地址文件已保存到 ${filePath}`)
  })
)

ask$().subscribe({
  error: console.error,
})
