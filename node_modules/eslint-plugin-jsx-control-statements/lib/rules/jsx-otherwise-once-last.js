/**
 * @fileoverview <Otherwise> tag (inside <Choose>), if provided must be used only once and must be last
 * @author Vivek Kumar Bansal
 * @copyright 2015-present Vivek Kumar Bansal. All rights reserved.
 */
"use strict";

var utils = require("../utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    function isOtherwiseComponent(child) {
        return child.type === "JSXElement" && child.openingElement.name.name === "Otherwise";
    }

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {
        JSXOpeningElement: function(node) {
            if (!utils.isChooseComponent(node)) return node;

            var children = utils.filterChildren(node.parent.children),
                otherwiseComponents = children.filter(isOtherwiseComponent);

            if (otherwiseComponents.length > 1) {
                context.report(node, "'Choose' tag must have only one 'Otherwise' tag.");
            }


            if (otherwiseComponents.length === 1 && !isOtherwiseComponent(children[children.length - 1])) {
                context.report(node, "'Otherwise' tag must be last child.");
            }
        }
    };
};

module.exports.schema = [];
