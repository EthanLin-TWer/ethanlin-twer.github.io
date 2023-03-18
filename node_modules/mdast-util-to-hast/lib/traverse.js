/**
 * @typedef {import('mdast').Root|import('mdast').Content} MdastNode
 * @typedef {Extract<MdastNode, import('mdast').Parent>} MdastParent
 * @typedef {import('./index.js').Handler} Handler
 * @typedef {import('./index.js').H} H
 * @typedef {import('./index.js').Content} Content
 */

import {u} from 'unist-builder'

const own = {}.hasOwnProperty

/**
 * Transform an unknown node.
 *
 * @param {H} h
 * @param {MdastNode} node
 */
function unknown(h, node) {
  const data = node.data || {}

  if (
    'value' in node &&
    !(
      own.call(data, 'hName') ||
      own.call(data, 'hProperties') ||
      own.call(data, 'hChildren')
    )
  ) {
    return h.augment(node, u('text', node.value))
  }

  return h(node, 'div', all(h, node))
}

/**
 * @param {H} h
 * @param {MdastNode} node
 * @param {MdastParent | null} parent
 */
export function one(h, node, parent) {
  const type = node && node.type
  /** @type {Handler} */
  let fn

  // Fail on non-nodes.
  if (!type) {
    throw new Error('Expected node, got `' + node + '`')
  }

  if (own.call(h.handlers, type)) {
    fn = h.handlers[type]
  } else if (h.passThrough && h.passThrough.includes(type)) {
    fn = returnNode
  } else {
    fn = h.unknownHandler
  }

  return (typeof fn === 'function' ? fn : unknown)(h, node, parent)
}

/**
 * @template {MdastNode} Node
 * @param {H} h
 * @param {Node} node
 * @returns {Node}
 */
function returnNode(h, node) {
  return 'children' in node ? {...node, children: all(h, node)} : node
}

/**
 * @param {H} h
 * @param {MdastNode} parent
 */
export function all(h, parent) {
  /** @type {Array<Content>} */
  const values = []

  if ('children' in parent) {
    const nodes = parent.children
    let index = -1

    while (++index < nodes.length) {
      const result = one(h, nodes[index], parent)

      if (result) {
        if (index && nodes[index - 1].type === 'break') {
          if (!Array.isArray(result) && result.type === 'text') {
            result.value = result.value.replace(/^\s+/, '')
          }

          if (!Array.isArray(result) && result.type === 'element') {
            const head = result.children[0]

            if (head && head.type === 'text') {
              head.value = head.value.replace(/^\s+/, '')
            }
          }
        }

        if (Array.isArray(result)) {
          values.push(...result)
        } else {
          values.push(result)
        }
      }
    }
  }

  return values
}
