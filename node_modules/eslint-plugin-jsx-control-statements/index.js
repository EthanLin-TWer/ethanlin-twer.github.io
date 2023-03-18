"use strict";

module.exports = {
    environments: {
        "jsx-control-statements": {
            globals: {
                "If": true,
                "Else": true,
                "For": true,
                "When": true,
                "Choose": true,
                "Otherwise": true,
                "With": true
            }
        }
    },
    rules: {
        "jsx-choose-not-empty": require("./lib/rules/jsx-choose-not-empty"),
        "jsx-for-require-each": require("./lib/rules/jsx-for-require-each"),
        "jsx-for-require-of": require("./lib/rules/jsx-for-require-of"),
        "jsx-if-require-condition": require("./lib/rules/jsx-if-require-condition"),
        "jsx-otherwise-once-last": require("./lib/rules/jsx-otherwise-once-last"),
        "jsx-use-if-tag": require("./lib/rules/jsx-use-if-tag"),
        "jsx-when-require-condition": require("./lib/rules/jsx-when-require-condition"),
        "jsx-jcs-no-undef": require("./lib/rules/jsx-jcs-no-undef")
    },
    configs: {
        recommended: {
            env: {
              "jsx-control-statements/jsx-control-statements": true
            },
            plugins: ["jsx-control-statements"],
            rules: {
                "jsx-control-statements/jsx-choose-not-empty": 1,
                "jsx-control-statements/jsx-for-require-each": 1,
                "jsx-control-statements/jsx-for-require-of": 1,
                "jsx-control-statements/jsx-if-require-condition": 1,
                "jsx-control-statements/jsx-otherwise-once-last": 1,
                "jsx-control-statements/jsx-use-if-tag": 1,
                "jsx-control-statements/jsx-when-require-condition": 1,
                "jsx-control-statements/jsx-jcs-no-undef": 1,
                "no-undef": 0
            }
        }
    }
};
