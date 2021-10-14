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
    it(`${fixture} should work as expected`, async () => {
      const input = await fs.promises.readFile(
        path.resolve(fixturesDir, fixture),
        'utf8',
      )
      const output = await cf2md(input)
      expect(output).toMatchSnapshot()
      await fs.promises.writeFile(
        path.resolve(fixturesDir, fixture.replace('.html', '.md')),
        output,
      )
    })
  }
})
