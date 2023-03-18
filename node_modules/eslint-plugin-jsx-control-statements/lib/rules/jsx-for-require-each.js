/**
 * @fileoverview For tag must have each attribute
 * @author Vivek Kumar Bansal
 * @copyright 2015-present Vivek Kumar Bansal. All rights reserved.
 */
"use strict";

var utils = require("../utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {
        JSXOpeningElement: function(node) {
            var attributes = node.attributes,
                attr = utils.findAttr(attributes, "each");

            if (!utils.isForComponent(node)) return;

            if (attr) {
                var scope = context.getScope();
                scope.through = scope.through.filter(function(v) {
                    return attr.value.value !== v.identifier.name;
                });
                return;
            }

            context.report(node, "'For' tag must have a 'each' attribute.");
        }
    };
};

module.exports.schema = [];
