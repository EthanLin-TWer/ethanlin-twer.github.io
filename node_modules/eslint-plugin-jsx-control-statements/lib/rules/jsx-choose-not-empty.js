/**
 * @fileoverview <Choose> tag must not be empty
 * @author Vivek Kumar Bansal
 * @copyright 2015-present Vivek Kumar Bansal. All rights reserved.
 */
"use strict";

var utils = require("../utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    function isWhenComponent(child) {
        return child.type === "JSXElement" && child.openingElement.name.name === "When";
    }

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {
        JSXOpeningElement: function(node) {
            if (!utils.isChooseComponent(node)) return node;

            var children = utils.filterChildren(node.parent.children);

            if (children.length === 0) {
                context.report(node, "'Choose' tag must not be empty.");
            }

            if (children.filter(isWhenComponent).length === 0) {
                context.report(node, "'Choose' tag must have atleast one 'When' tag.");
            }
        }
    };
};

module.exports.schema = [];
