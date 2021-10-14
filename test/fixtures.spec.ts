import fs from 'fs'
import path from 'path'
import { URL } from 'url'

import { cf2md } from 'cf2md'

describe('fixtures', () => {
  const __dirname = path.dirname(new URL(import.meta.url).pathname)

  const fixturesDir = path.join(__dirname, 'fixtures')
  const fixtures = fs.readdirSync(fixturesDir)
  for (const fixture of fixtures) {
    if (!fixture.endsWith('.html')) {
      continue
    }

    const fixtureFile = path.resolve(fixturesDir, fixture)

    it(`${fixture} should work as expected`, async () => {
      const input = await fs.promises.readFile(fixtureFile, 'utf8')
      const output = await cf2md(input)
      expect(output).toMatchSnapshot()
    })

    it(`${fixture} stream should work as expected`, () => {
      const input = fs.createReadStream(fixtureFile)
      const output = cf2md(input)
      expect(output).toBeTruthy()
      output.pipe(fs.createWriteStream(fixtureFile.replace(/\.html$/, '.md')))
    })
  }
})
