/**
 * @typedef {import('mdast').Link} Link
 * @typedef {import('hast').Properties} Properties
 * @typedef {import('../index.js').H} H
 */

import {normalizeUri} from 'micromark-util-sanitize-uri'
import {all} from '../traverse.js'

/**
 * @param {H} h
 * @param {Link} node
 */
export function link(h, node) {
  /** @type {Properties} */
  const props = {href: normalizeUri(node.url)}

  if (node.title !== null && node.title !== undefined) {
    props.title = node.title
  }

  return h(node, 'a', props, all(h, node))
}
