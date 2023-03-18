/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('hast').Text} Text
 * @typedef {import('mdast').Break} Break
 * @typedef {import('../index.js').H} H
 */

import {u} from 'unist-builder'

/**
 * @param {H} h
 * @param {Break} node
 * @returns {Array<Element|Text>}
 */
export function hardBreak(h, node) {
  return [h(node, 'br'), u('text', '\n')]
}
