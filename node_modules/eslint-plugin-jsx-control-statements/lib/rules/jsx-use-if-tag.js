/**
 * @fileoverview Use If tag instead of ternary operator
 * @author Vivek Kumar Bansal
 * @copyright 2015-present Vivek Kumar Bansal. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {
        ConditionalExpression: function(node) {
            if (node.alternate.type === "JSXElement" || node.consequent.type === "JSXElement") {
                context.report(node, "Ternary operator used. Use 'If' tag instead.");
            }
        }
    };
};

module.exports.schema = [];
