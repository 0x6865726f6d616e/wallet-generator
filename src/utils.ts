import fs from 'fs'

export const saveObjectToFile = (
  object: Object,
  directory: string,
  filename: string,
  replacer?: (this: any, key: string, value: any) => any,
  space: number = 2,
  encoding: BufferEncoding = 'utf-8'
): string => {
  const json = JSON.stringify(object, null, space)
  fs.mkdirSync(directory, { recursive: true })
  fs.writeFileSync(filename, json, { encoding })

  return json
}
