/**
 * @fileoverview Extends generic eslint no-undef rule with custom logic for <For> and <With> statements.
 * @author Alex Gilleran
 *
 * Version of https://github.com/eslint/eslint/blob/master/lib/rules/no-undef.js that filters out variables created
 * by JSX Control Statements for statements.
 */
"use strict";

var utils = require("../utils");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Checks if the given node is the argument of a typeof operator.
 * @param {ASTNode} node The AST node being checked.
 * @returns {boolean} Whether or not the node is the argument of a typeof operator.
 */
function hasTypeOfOperator(node) {
    var parent = node.parent;

    return parent.type === "UnaryExpression" && parent.operator === "typeof";
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var options = context.options[0];
    var considerTypeOf = options && options.typeof === true || false;

    return {
        "Program:exit": function(/* node */) {
            var globalScope = context.getScope();

            globalScope.through.forEach(function(ref) {
                var identifier = ref.identifier;

                if (!considerTypeOf && hasTypeOfOperator(identifier)) {
                    return;
                }

                // Recurse up the tree of ancestors.
                var thisElement = identifier;
                while (thisElement.parent) {
                    thisElement = thisElement.parent;

                    // If this ancestor is a <For> element...
                    if (thisElement.type === "JSXElement" && utils.isForComponent(thisElement.openingElement)) {
                        // Index the <For>'s attributes by name.
                        var attrMap = thisElement.openingElement.attributes.reduce(function(result, attr) {
                            var map = result; // reassign this to appease eslint.
                            map[attr.name.name] = attr;
                            return result;
                        }, {});

                        // If the undefined variable is specified in "each" or "index", that's fine - ignore it.

                        // if (attrMap.each.value.value === identifier.name || attrMap.index.value.value === identifier.name) {

                        var attrIndex = attrMap.index;
                        var attrEach = attrMap.each;
                        var identifierName = identifier.name;
                        if ((attrEach && attrEach.value.value === identifierName) || (attrIndex && attrIndex.value.value === identifierName)) {
                            return;
                        }
                    }

                    // If this ancestor is a <With> element...
                    if (thisElement.type === "JSXElement" && utils.isWithComponent(thisElement.openingElement)) {
                        var someAttr = thisElement.openingElement.attributes.some(function(attr) {
                            return attr.name.name === identifier.name;
                        });
                        if (someAttr) {
                            return;
                        }
                    }
                }

                context.report({
                    node: identifier,
                    message: "'{{name}}' is not defined.",
                    data: identifier
                });
            });
        }
    };
};

module.exports.schema = [
    {
        "type": "object",
        "properties": {
            "typeof": {
                "type": "boolean"
            }
        },
        "additionalProperties": false
    }
];
