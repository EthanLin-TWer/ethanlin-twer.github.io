/**
 * @typedef {import('mdast').Delete} Delete
 * @typedef {import('../index.js').H} H

 */

import {all} from '../traverse.js'

/**
 * @param {H} h
 * @param {Delete} node
 */
export function strikethrough(h, node) {
  return h(node, 'del', all(h, node))
}
