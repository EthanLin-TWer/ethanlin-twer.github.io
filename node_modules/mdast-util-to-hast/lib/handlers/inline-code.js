/**
 * @typedef {import('mdast').InlineCode} InlineCode
 * @typedef {import('../index.js').H} H
 */

import {u} from 'unist-builder'

/**
 * @param {H} h
 * @param {InlineCode} node
 */
export function inlineCode(h, node) {
  return h(node, 'code', [u('text', node.value.replace(/\r?\n|\r/g, ' '))])
}
