/**
 * @typedef {import('mdast').Emphasis} Emphasis
 * @typedef {import('../index.js').H} H
 */

import {all} from '../traverse.js'

/**
 * @param {H} h
 * @param {Emphasis} node
 */
export function emphasis(h, node) {
  return h(node, 'em', all(h, node))
}
