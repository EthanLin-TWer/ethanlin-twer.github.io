/**
 * @typedef {import('mdast').PhrasingContent} PhrasingContent
 * @typedef {import('unist-util-is').AssertPredicate<PhrasingContent>} AssertPredicatePhrasing
 */

import {convert} from 'unist-util-is'

/**
 * @type {AssertPredicatePhrasing}
 */
// @ts-ignore hush, it’s fine!
export const phrasing = convert([
  'break',
  'delete',
  'emphasis',
  'footnote',
  'footnoteReference',
  'image',
  'imageReference',
  'inlineCode',
  'link',
  'linkReference',
  'strong',
  'text'
])
