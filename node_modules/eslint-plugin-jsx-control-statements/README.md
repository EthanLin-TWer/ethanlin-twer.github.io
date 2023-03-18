# ESLint-plugin-JSX-control-statements

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][deps-image]][deps-url]
[![Coverage Status][coverage-image]][coverage-url]
[![Code Climate][climate-image]][climate-url]

## Installation

Install [ESLint](https://www.github.com/eslint/eslint) either locally or globally.

```sh
$ npm install eslint
```

If you installed `ESLint` globally, you have to install React plugin globally too. Otherwise, install it locally.

```sh
$ npm install eslint-plugin-jsx-control-statements
```

## Configuration (Simple)

Add `plugins` section and specify ESLint-plugin-JSX-Control-Statements as a plugin and plugin:jsx-control-statements/recommended
to "extends"

```json
{
  "plugins": [
    "jsx-control-statements"
  ],
  "extends": ["plugin:jsx-control-statements/recommended"]
}
```

If it is not already the case you must also configure `ESLint` to support JSX.

```json
{
  "ecmaFeatures": {
    "jsx": true
  }
}
```

## Configuration (Advanced)
The plugin comes with a number of rules and an environment that sets the control statements (`<If>`, `<For>` etc) as global variables:

```js
{
  "rules": {
    "jsx-control-statements/jsx-choose-not-empty": 1,
    "jsx-control-statements/jsx-for-require-each": 1,
    "jsx-control-statements/jsx-for-require-of": 1,
    "jsx-control-statements/jsx-if-require-condition": 1,
    "jsx-control-statements/jsx-otherwise-once-last": 1,
    "jsx-control-statements/jsx-use-if-tag": 1,
    "jsx-control-statements/jsx-when-require-condition": 1,
    "jsx-control-statements/jsx-jcs-no-undef": 1,
    "no-undef": 0 // Replace this with jsx-jcs-no-undef
  },
  env: {
    "jsx-control-statements/jsx-control-statements": true
  }
}
```

### Important:

After version 7.0.0 of `eslint-plugin-react` the rule `react/jsx-no-undef` it's not checking globals by default anymore.
So you need to enable this to avoid lint errors telling that "If", "Choose", etc. are not defined. To fix this add to your
rules:

```
 {
   "rules": {
     "react/jsx-no-undef": [2, { "allowGlobals": true }]
   }
    
 }
```

# List of supported rules
* [jsx-choose-not-empty](docs/rules/jsx-choose-not-empty.md): Warn when `Choose` tag is empty or does not have at least one `When` tag as child.
* [jsx-for-require-each](docs/rules/jsx-for-require-each.md): Warn if `For` tag is missing `each` attribute. And also marks the variable as defined.
* [jsx-for-require-of](docs/rules/jsx-for-require-of.md): Warn if `For` tag is missing `of` attribute.
* [jsx-if-require-condition](docs/rules/jsx-if-require-condition.md): Warn if `If` tag is missing `condition` attribute.
* [jsx-otherwise-once-last](docs/rules/jsx-otherwise-once-last.md): Warn when `Otherwise` tag is used more than once inside `Choose` and is not last child.
* [jsx-use-if-tag](docs/rules/jsx-use-if-tag.md): Use `If` tag instead of ternary operator.
* [jsx-when-require-condition](docs/rules/jsx-when-require-condition.md): Warn if `When` tag is missing `condition` attribute.
* [jsx-jcs-no-undef](docs/rules/jsx-jcs-no-undef.md): Replaces the built-in `no-undef` rule with one that is tolerant of variables expressed in `<For>` (`each` and `index` attributes) and `<With>`. Note that to stop getting errors from `no-undef` you have to turn it off and this on.

## Credits
Thanks to @yannickcr for his awesome [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react).

## License
[MIT License](http://www.opensource.org/licenses/mit-license.php). Copyright(c) [Vivek Kumar Bansal](http://vkbansal.me/)


[npm-url]: https://npmjs.org/package/eslint-plugin-jsx-control-statements
[npm-image]: http://img.shields.io/npm/v/eslint-plugin-jsx-control-statements.svg?style=flat-square

[travis-url]: https://travis-ci.org/vkbansal/eslint-plugin-jsx-control-statements
[travis-image]: http://img.shields.io/travis/vkbansal/eslint-plugin-jsx-control-statements/master.svg?style=flat-square

[deps-url]: https://david-dm.org/vkbansal/eslint-plugin-jsx-control-statements
[deps-image]: https://img.shields.io/david/dev/vkbansal/eslint-plugin-jsx-control-statements.svg?style=flat-square

[coverage-url]: https://coveralls.io/r/vkbansal/eslint-plugin-jsx-control-statements?branch=master
[coverage-image]: http://img.shields.io/coveralls/vkbansal/eslint-plugin-jsx-control-statements/master.svg?style=flat-square

[climate-url]: https://codeclimate.com/github/vkbansal/eslint-plugin-jsx-control-statements
[climate-image]: http://img.shields.io/codeclimate/github/vkbansal/eslint-plugin-jsx-control-statements.svg?style=flat-square
