module.exports = {
  env: {
    es6: true,
  },
  plugins: ["import"],
  rules: {
    // variables
    "one-var": ["error", "never"],
    "no-var": "error",
    "no-undef": "error",
    "no-shadow": "error",
    "no-plusplus": "error",
    "no-label-var": "error",
    "no-redeclare": "error",
    "no-undefined": "error",
    "no-unused-vars": "error",
    "no-multi-assign": "error",
    "no-use-before-define": "error",

    // references
    "prefer-const": "error",
    "no-const-assign": "error",

    // object
    "object-shorthand": ["error", "always"],
    "prefer-object-spread": "error",
    "dot-notation": "error",

    // array
    "array-callback-return": "error",
    "prefer-destructuring": [
      "error",
      {
        array: true,
        object: true,
      },
      { enforceForRenamedProperties: true },
    ],

    // string templates
    "prefer-template": "error",
    "no-useless-concat": "error",
    "template-curly-spacing": "error",

    // functions
    "no-loop-func": "error",
    "no-param-reassign": "error",
    "prefer-spread": "error",
    "prefer-rest-params": "error",
    "arrow-body-style": "warn", // this has been not very flexible
    // off for now for not playing well with generator functions
    "func-style": "off",
    "no-useless-call": "error",
    "consistent-return": "error",
    "no-extra-bind": "error",
    "no-invalid-this": "error",

    // class
    "no-useless-constructor": "error",
    "lines-between-class-members": "error",
    "no-dupe-class-members": "error",
    "no-class-assign": "error",
    "no-this-before-super": "error",
    "new-parens": "error",
    "class-methods-use-this": [
      "error",
      {
        exceptMethods: ["render"],
      },
    ],

    // module
    "no-duplicate-imports": "error",
    "import/no-mutable-exports": "error",
    "import/first": "error",

    // wrappers
    "no-new-object": "error",
    "no-array-constructor": "error",
    "no-new-wrappers": "error",
    "no-new-func": "error",

    // comments
    "spaced-comment": "error",
    "no-inline-comments": "off",

    // blocks
    "no-else-return": "error",
    "no-continue": "error",
    "default-case": "error",
    "no-unreachable": "error",

    // types
    "valid-typeof": "error",

    // programming styles
    "max-lines": [
      "off",
      {
        max: 300,
        skipBlankLines: true,
        skipComments: true,
      },
    ],
    "max-lines-per-function": [
      "off",
      {
        max: 50,
        skipBlankLines: true,
        skipComments: true,
        IIFEs: true,
      },
    ],

    // misc
    eqeqeq: "error",
    yoda: "error",
    "no-void": "error",
    "no-with": "error",
    "no-eval": "error",
    "no-empty": "error",
    "no-caller": "error",
    "no-sequences": "error",
    "no-cond-assign": "error",
    "no-implied-eval": "error",
    "no-global-assign": "error",
    "no-useless-escape": "error",
    "no-implicit-globals": "error",
    "no-unneeded-ternary": "error",
    "no-console": "warn",

    // basic prettier options
    semi: "off",
    quotes: "off",
    "max-len": "off",
    "comma-dangle": "off",
    "arrow-parens": "off",

    // prettier will handle this perfectly
    curly: "off",
    "wrap-iife": "off",
    "quote-props": "off",
    "brace-style": "off",
    "key-spacing": "off",
    "arrow-spacing": "off",
    "comma-spacing": "off",
    "space-infix-ops": "off",
    "no-multi-spaces": "off",
    "keyword-spacing": "off",
    "no-trailing-spaces": "off",
    "yield-star-spacing": "off",
    "rest-spread-spacing": "off",
    "switch-colon-spacing": "off",
    "array-bracket-spacing": "off",
    "generator-star-spacing": "off",
    "computed-property-spacing": "off",
    "no-nested-ternary": "off",
    "no-mixed-operators": "off",
    "space-before-blocks": "off",
    "prefer-arrow-callback": "off",
    "array-bracket-newline": "off",
    "array-element-newline": "off",
    "function-paren-newline": "off",
    // prettier is opinionated on this about having or not spaces before&after functions.
    // Stick to prettier to save your life on styling. It's not that bad.
    "space-before-function-paren": "off",
    "func-call-spacing": "off",

    // still validating...
    camelcase: "off",
    "no-extend-native": "off",
    "implicit-arrow-linebreak": "off",
    "new-cap": "off",
    "no-underscore-dangle": "off",
    "no-prototype-builtins": "off",
  },
}
