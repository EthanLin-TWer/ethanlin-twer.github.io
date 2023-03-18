/**
 * @fileoverview When tag must have condition attribute
 * @author Vivek Kumar Bansal
 * @copyright 2015-present Vivek Kumar Bansal. All rights reserved.
 */
"use strict";

var utils = require("../utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    function hasConditionAttr(decl) {
        return utils.isAttr(decl, "condition");
    }

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {
        JSXOpeningElement: function(node) {
            var attributes = node.attributes;

            if (!utils.isWhenComponent(node) || attributes.some(hasConditionAttr)) {
                return;
            }

            context.report(node, "'When' tag must have a 'condition' attribute.");
        }
    };
};

module.exports.schema = [];
