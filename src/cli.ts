import fs from 'fs'
import path from 'path'
import { Readable } from 'stream'
import { URL } from 'url'

import { program } from 'commander'

import { cf2md } from './index.js'

export interface Cf2MdOptions {
  input?: string
  output?: string
}

const __dirname = new URL('.', import.meta.url).pathname

const { input, output } = program
  .version(
    (
      JSON.parse(
        fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8'),
      ) as {
        version: string
      }
    ).version,
  )
  .argument('[input]', 'Input HTML codes')
  .option('-i, --input <path>', 'Input file')
  .option('-o, --output <path>', 'Output file')
  .parse(process.argv)
  .opts<Cf2MdOptions>()

let inputStream = input
  ? fs.createReadStream(input)
  : program.args.length > 0
  ? Readable.from(program.args)
  : null

if (process.stdin.isTTY || process.env.STDIN === '0') {
  if (!inputStream) {
    console.error('No input file or argument')
    program.help()
  }
} else if (!inputStream) {
  inputStream = process.stdin
}

cf2md(inputStream).pipe(output ? fs.createWriteStream(output) : process.stdout)
