/**
 * @typedef {import('mdast').Blockquote} Blockquote
 * @typedef {import('../index.js').H} H
 */

import {wrap} from '../wrap.js'
import {all} from '../traverse.js'

/**
 * @param {H} h
 * @param {Blockquote} node
 */
export function blockquote(h, node) {
  return h(node, 'blockquote', wrap(all(h, node), true))
}
