# cf2md

[![GitHub Actions](https://github.com/rx-ts/cf2md/workflows/CI/badge.svg)](https://github.com/rx-ts/cf2md/actions/workflows/ci.yml)
[![Codecov](https://img.shields.io/codecov/c/github/rx-ts/cf2md.svg)](https://codecov.io/gh/rx-ts/cf2md)
[![Codacy Grade](https://img.shields.io/codacy/grade/5f6d6b90f972435393fb8c2eb49deafc)](https://www.codacy.com/gh/rx-ts/cf2md)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Frx-ts%2Fcf2md%2Fmain%2Fpackage.json)](https://github.com/plantain-00/type-coverage)
[![npm](https://img.shields.io/npm/v/cf2md.svg)](https://www.npmjs.com/package/cf2md)
[![GitHub Release](https://img.shields.io/github/release/rx-ts/cf2md)](https://github.com/rx-ts/cf2md/releases)

[![David Peer](https://img.shields.io/david/peer/rx-ts/cf2md.svg)](https://david-dm.org/rx-ts/cf2md?type=peer)
[![David](https://img.shields.io/david/rx-ts/cf2md.svg)](https://david-dm.org/rx-ts/cf2md)
[![David Dev](https://img.shields.io/david/dev/rx-ts/cf2md.svg)](https://david-dm.org/rx-ts/cf2md?type=dev)

[![Conventional Commits](https://img.shields.io/badge/conventional%20commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![changesets](https://img.shields.io/badge/maintained%20with-changesets-176de3.svg)](https://github.com/atlassian/changesets)

Transform from confluence flavored HTML to Markdown with enhanced features.

## TOC <!-- omit in toc -->

- [Usage](#usage)
  - [Install](#install)
  - [CLI](#cli)
  - [API](#api)
- [Changelog](#changelog)
- [License](#license)

## Usage

### Install

```sh
# npm
npm i -g cf2md

# pnpm
pnpm i -g cf2md

# yarn
yarn global add cf2md
```

### CLI

```plain
Usage: cf2md [options] [input]

Arguments:
  input                Input HTML codes

Options:
  -V, --version        output the version number
  -i, --input <path>   Input HTML file
  -o, --output <path>  Output Markdown file
  -h, --help           display help for command
```

### API

```js
import fs from 'fs'
import { cf2md } from 'cf2md'

// string
const markdown = cf2md(html)

// stream
cf2md(fs.createReadStream(htmlFile)).pipe(fs.createWriteStream(mdFile))
```

## Changelog

Detailed changes for each release are documented in [CHANGELOG.md](./CHANGELOG.md).

## License

[MIT][] © [JounQin][]@[1stG.me][]

[1stg.me]: https://www.1stg.me
[jounqin]: https://GitHub.com/JounQin
[mit]: http://opensource.org/licenses/MIT
