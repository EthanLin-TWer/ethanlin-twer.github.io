/**
 * @typedef {import('mdast').Paragraph} Paragraph
 * @typedef {import('../index.js').H} H
 */

import {all} from '../traverse.js'

/**
 * @param {H} h
 * @param {Paragraph} node
 */
export function paragraph(h, node) {
  return h(node, 'p', all(h, node))
}
