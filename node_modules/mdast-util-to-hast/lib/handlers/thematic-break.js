/**
 * @typedef {import('mdast').ThematicBreak} ThematicBreak
 * @typedef {import('hast').Element} Element
 * @typedef {import('../index.js').H} H
 */

/**
 * @param {H} h
 * @param {ThematicBreak} [node]
 */
export function thematicBreak(h, node) {
  return h(node, 'hr')
}
