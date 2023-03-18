# mdast-util-phrasing

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

Check if a [mdast][] [node][] is [phrasing content][phrasing].

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c):
Node 12+ is needed to use it and it must be `import`ed instead of `require`d.

[npm][]:

```sh
npm install mdast-util-phrasing
```

## Use

```js
import {phrasing} from 'mdast-util-phrasing'

phrasing({
  type: 'paragraph',
  children: [{type: 'text', value: 'Alpha'}]
}) // => false

phrasing({
  type: 'strong',
  children: [{type: 'text', value: 'Delta'}]
}) // => true
```

## API

This package exports the following identifiers: `phrasing`.
There is no default export.

### `phrasing(node)`

Check if the given value is a phrasing element.

###### Parameters

`node` (`*`) — Value to check, typically a [node][].

###### Returns

`boolean` — whether `node` is [phrasing content][phrasing].

## Security

Use of `mdast-util-phrasing` does not involve [**hast**][hast], user content,
or change the tree, so there are no openings for
[cross-site scripting (XSS)][xss] attacks.

## Related

*   [`hast-util-phrasing`](https://github.com/syntax-tree/hast-util-phrasing)
    — check if a hast node is phrasing content
*   [`unist-util-is`](https://github.com/syntax-tree/unist-util-is)
    — check if a node passes a test

## Contribute

See [`contributing.md` in `syntax-tree/.github`][contributing] for ways to get
started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Victor Felder][author]

<!-- Definitions -->

[build-badge]: https://github.com/syntax-tree/mdast-util-phrasing/workflows/main/badge.svg

[build]: https://github.com/syntax-tree/mdast-util-phrasing/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/mdast-util-phrasing.svg

[coverage]: https://codecov.io/github/syntax-tree/mdast-util-phrasing

[downloads-badge]: https://img.shields.io/npm/dm/mdast-util-phrasing.svg

[downloads]: https://www.npmjs.com/package/mdast-util-phrasing

[size-badge]: https://img.shields.io/bundlephobia/minzip/mdast-util-phrasing.svg

[size]: https://bundlephobia.com/result?p=mdast-util-phrasing

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/syntax-tree/unist/discussions

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://draft.li

[contributing]: https://github.com/syntax-tree/.github/blob/HEAD/contributing.md

[support]: https://github.com/syntax-tree/.github/blob/HEAD/support.md

[coc]: https://github.com/syntax-tree/.github/blob/HEAD/code-of-conduct.md

[mdast]: https://github.com/syntax-tree/mdast

[node]: https://github.com/syntax-tree/mdast#nodes

[phrasing]: https://github.com/syntax-tree/mdast#phrasingcontent

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[hast]: https://github.com/syntax-tree/hast
