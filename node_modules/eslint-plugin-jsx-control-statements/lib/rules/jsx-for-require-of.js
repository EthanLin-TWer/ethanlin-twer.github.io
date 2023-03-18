/**
 * @fileoverview For tag must have of attribute
 * @author Vivek Kumar Bansal
 * @copyright 2015-present Vivek Kumar Bansal. All rights reserved.
 */
"use strict";

var utils = require("../utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    function hasOfAttr(decl) {
        return utils.isAttr(decl, "of");
    }

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {
        JSXOpeningElement: function(node) {
            var attributes = node.attributes;

            if (!utils.isForComponent(node) || attributes.some(hasOfAttr)) {
                return;
            }

            context.report(node, "'For' tag must have a 'of' attribute.");
        }
    };
};

module.exports.schema = [];
