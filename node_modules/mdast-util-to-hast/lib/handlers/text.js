/**
 * @typedef {import('mdast').Text} Text
 * @typedef {import('../index.js').H} H
 */

import {trimLines} from 'trim-lines'
import {u} from 'unist-builder'

/**
 * @param {H} h
 * @param {Text} node
 */
export function text(h, node) {
  return h.augment(node, u('text', trimLines(String(node.value))))
}
