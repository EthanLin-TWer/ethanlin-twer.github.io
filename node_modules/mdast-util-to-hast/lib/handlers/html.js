/**
 * @typedef {import('mdast').HTML} HTML
 * @typedef {import('../index.js').H} H
 */

import {u} from 'unist-builder'

/**
 * Return either a `raw` node in dangerous mode, otherwise nothing.
 *
 * @param {H} h
 * @param {HTML} node
 */
export function html(h, node) {
  return h.dangerous ? h.augment(node, u('raw', node.value)) : null
}
