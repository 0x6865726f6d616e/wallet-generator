import { WalletGenerator, WalletInfo } from './wallet-generator'
import * as os from 'node:os'
import * as childProcess from 'node:child_process'
import { ChildResponse, MainRequest } from './child'
import * as path from 'path'
import { saveObjectToFile } from './utils'
import dayjs from 'dayjs'
import { from, Observable, tap } from 'rxjs'
import inquirer from 'inquirer'

interface Answers {
  generateMethod: number
  generateWalletAmount: number
  generateWalletSuffix: string
}

const ask$ = (): Observable<Answers> => from(
  inquirer.prompt([
    {
      type: 'number',
      name: 'generateMethod',
      message: '请输入生成方式（0：地址后缀；1：Uint256尾数）',
      default: 0,
    },
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
  ]))
  .pipe(
    tap(async answers => {
      const {
        generateMethod: number,
        generateWalletAmount: amount,
        generateWalletSuffix: suffix,
      } = answers

      if (amount >= 99999 || amount <= 0) {
        console.log('无效的数量')
        return
      }

      if (suffix.length > 6) {
        console.log('无效的后缀')
        return
      }

      const infos: WalletInfo[] = []

      if (amount === 1) {
        infos.push(await generateOne(suffix))
      } else {
        const generator = new WalletGenerator()

        if (suffix.length > 6) {
          console.log('无效的后缀')
          return
        }

        infos.push(...suffix ?
          answers.generateMethod === 0 ? generator.generateWithSuffix(amount, suffix) : generator.generateWithUint256Suffix(amount, parseInt(suffix)) :
          generator.generate(amount))
      }

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

const generateOne = async (suffix: string): Promise<WalletInfo> => {
  const startTime = new Date()

  console.log(startTime, `start`)

  const numCPUs = Math.floor(os.cpus().length - 1)

  const children: childProcess.ChildProcess[] = []

  let walletInfo: WalletInfo | undefined = undefined

  for (let i = 0; i < numCPUs; i++) {
    const child = childProcess.fork(path.join(__dirname, 'child.js'))

    child.on('message', (response: ChildResponse) => {
      walletInfo = response.walletInfo

      console.log(walletInfo)

      const endTime = new Date()

      console.log(endTime, 'end', endTime.valueOf() - startTime.valueOf())

      children.forEach(y => y.kill('SIGINT'))
    })

    children.push(child)
  }

  const request: MainRequest = {suffix: suffix}

  for (const child of children) {
    child.send(request)
  }

  while (true) {
    await delay(1000)

    if (walletInfo) {
      break
    }
  }

  return walletInfo!
}

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
