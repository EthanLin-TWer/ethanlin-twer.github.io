/**
 * @typedef {import('mdast').Heading} Heading
 * @typedef {import('../index.js').H} H
 */

import {all} from '../traverse.js'

/**
 * @param {H} h
 * @param {Heading} node
 */
export function heading(h, node) {
  return h(node, 'h' + node.depth, all(h, node))
}
