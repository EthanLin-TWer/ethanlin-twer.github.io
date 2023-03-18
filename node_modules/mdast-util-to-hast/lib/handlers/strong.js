/**
 * @typedef {import('mdast').Strong} Strong
 * @typedef {import('../index.js').H} H
 */

import {all} from '../traverse.js'

/**
 * @param {H} h
 * @param {Strong} node
 */
export function strong(h, node) {
  return h(node, 'strong', all(h, node))
}
