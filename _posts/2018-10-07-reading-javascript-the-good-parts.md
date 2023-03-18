---
title: 《JavaScript 语言精髓》导读
category: 读书笔记
---

重温经典。这本书告诉你，什么是不好的 JavaScript，这与知道什么是精华的 JavaScript 一样重要。正所谓非彼无我，非我无所取。

## 目录

* 导读
* 语言基本要素
* 精华
* 糟粕

## 导读

这次读这本书可谓是带着目的而来。国庆在家给自己接下来定了学习计划：要深入了解 JavaScript 这门语言。另外，我也不是编程语言圣战中的一名教徒，工作三年之余，除了胜任手上的工作以外，也有更高的学习要求：**了解技术本质**、**了解技术价值观**、**了解技术史**。所以，除了了解 JavaScript 这门语言的好坏外，也是要从编程语言这个视角，了解一门语言的基本要素，以及不同语言间的异同，为日后打好基础。基于这个思路，这本书尝试回答的问题正是我所需要的：

1.  JavaScript 的基本语言要素
2.  JavaScript 的精华
3.  JavaScript 的毒瘤和糟粕（以下统称糟粕，区分其差异不是本次阅读的目的）

基本语言要素，可以迁移到其他语言的学习上去；精华，值得仔细学习，我开了一些文章；糟粕可以直接用一份 ESLint/prettier 规则来描述。重点在于学习精华，糟粕了解后用上 ESLint 忘掉即可。

## 语言基本要素

* 语法要素：空格、注释、标识符、数字、字符串、语句、表达式、字面量等
* 三大编程结构（顺序、条件、循环）
* 数据结构：
  * 类型：弱类型
  * 种类：基本类型 / 对象 / 数组
* 函数：代码复用、组合、模块化、信息隐藏
* 继承：代码复用
* API
* 元编程

语法要素不详细讲，在学习其他编程语言时可以迁移；三大编程结构应该是任何编程语言都应该具备的功能了；弱类型、函数、继承都是 JavaScript 的精华所在，放在精华一节说；至于 API，揉在弱类型一节讲；元编程是大学毕业设计的时候种下的一个种子，可惜这本书中这个主题体现不多，故也略去为敬。

## 精华

看完书，总结了一下，JS 的精华大概就这三点：

* 弱类型 & JSON/array literal
* 函数
* 继承

### 弱类型

弱类型意味着很多事，一是写代码的时候你可以不用在意类型了，开发快；二是更优雅的表达力；三是更有表达力的继承方案的可能性（在继承一小节谈）。当然，类型系统对于编译期的问题发现也是很有价值的，在重构的时候也能给 IDE 提供更多的帮助。但作者认为，靠类型系统发现的 bug，不多也不大，相比起来类型系统就太重量，而弱类型是兼顾表达力和项目价值的优雅方案。

JS 有哪些类型呢？一言以蔽之，除了三种基本类型，其他都是对象。包括函数也是对象。基本类型有 `string`、`boolean`、`number` 三种，其他的诸如对象字面量、数组、正则表达式、日期对象、原型对象等，都是 `object` 类型的对象。

![JavaScript Data Types](https://i.stack.imgur.com/L1tYe.png)

与 Java 这门强类型语言做对比，它的 String、Array、Map 都是类型，为了具有类型的方法，不得不使用一个类，有时仅需要存取数据时就显得多余。相比之下，JS 创建字符串、对象和数组就简单得多了，见下面代码段。可不要习以为常，直接写 `{}` `[]` 创建对象和数组的写法是 JS 所支持，带来了极度轻量的便利。其中起源于 JS 的对象结构 JSON（JavaScript Object Notation）更是成了一种通用的数据交换格式。

```javascript
const human = {
  name: 'Lao Wang',
  age: 35,
  ready: true,
}
const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31]
```

### 函数

JavaScript 里面函数是一等公民。这意味着啥呢？一等公民表示，函数也与普通数据类型一样了，可以作函数参数被传递、可以做返回值。这意味着函数式编程变得可能了，意味着闭包技术这种基于函数级别的轻量级数据封装方案变得可能了，柯里化也变得可能了，这一切带来的是更灵活的封装、数据操作能力。甚至它使 JavaScript 得以用一种轻量的方式来实现继承。这也是我当时喜欢上 JavaScript 的原因。

函数也是其他任意语言中的基本要素，下面从**基本语法要素**，以及上面提到的**函数式**、**闭包**、**柯里化**等方面提一下精华点。

#### 基本要素

* 语法（`function` 关键字、函数名、函数参数、函数体、返回值）
* 函数调用模式：JS 里复杂且灵活的地方，下面详述
* 参数对象 `argument`：它只是个伪数组，有点毛病，ES6 以后就应该弃用了
* 作用域：有函数作用域，ES6 以后才有块作用域。现在基本完美
* 递归：[ES6 以后将部署尾递归优化写入规范](http://www.ruanyifeng.com/blog/2015/04/tail-call.html)
* 闭包：函数级别的信息隐藏、模块化方案。在 Java 中同样的事必须用一个静态内部类才能实现
* 回调：延伸到 `callback`、`Promise`、`async/await` 等一些东西。书里没讲，我也不讲
* 柯里化：业务应用常见模式

#### 函数调用模式

很遗~~jing~~憾~~xi~~，在 JS 中一个函数可能有很多的调用方式。函数体反正都是要执行的，**唯一区别在于 this 引用如何被初始化**的问题。我们一共有 4 种方案，由于太多，废弃掉第三种和第四种。一般写业务代码，第一二种调用是最常见的。

|  函数调用模式  |               形式                |          this 绑定           |                       适用场景                       |
| :------------: | :-------------------------------: | :--------------------------: | :--------------------------------------------------: |
|    方法调用    |         `object.method()`         |   被调用的对象 `object` 上   | 对象实例的方法调用。既成其对象，说明必维护了内部状态 |
|    函数调用    |            `method()`             | 全局对象 `window` / `global` |        不需要对象状态的函数。应全采用箭头函数        |
|  构造函数调用  |      `new Object().method()`      |  被创建的 `Object` 实例对象  |                  bug 之源，应当抛弃                  |
| apply 模式调用 | `method.apply(target, arguments)` |   绑定到传入的 `target` 上   |                似乎有用，其实完全没用                |

其中：

* 第二种方案，由于 `this` 引用不会被正确初始化，因此一是尽量用于不维护内部状态的函数，二是应全部应用箭头函数，它修复了 `this` 引用的 bug
* 抛弃第三种方案，一是因为一旦忘记用 `new` 运算符，`this` 会直接绑定到全局对象，并且无任何编译期和运行期的提示；二是因为没有任何使用场景。做类继承时应该全用 ES6 的 `class` API
* 第四种方案，一开始以为有两个场景会用到：写框架代码时、做柯里化时。后来自己一写，发现实现柯里化不需要使用 `apply`；而框架代码，至今未见使用场景，故留作疑问

#### 函数式

函数式是一种高阶的声明式编程范式，相对于「怎么做」，它让你得以以「做什么」的方式写代码，既有强的表达力，又有低的编写成本。当然，对维护者的代码能力提出了要求。

使用函数式的目标就是，看到 `for-in`、`for-of`、`forEach` 就要考虑是否可以用函数式去代替。

```javascript
// from:
let result = []
for (let i = 0; i > people.length; i++) {
  const person = people[i]
  result.push({ age: person.age, name: person.name })
}
// to:
let persons = people.map(({ age, name }) => ({ age, name }))

// from:
let teenagers = []
for (let person in people) {
  if (person.age < 25) {
    teenagers.push(person)
  }
}
// to:
const teenagers = people.filter(({ age }) => age < 25)

// from:
const people = {
  Jack: { age: 25, gender: 'male' },
  Maria: { age: 20, gender: 'female' },
}
const result = []
Object.keys(people).forEach((name) => {
  result.push({
    name,
    age: people[name].age,
    gender: people[name].gender,
  })
})
// to:
const result = Object.entries(people).map(([name, { age, gender }]) => ({
  name,
  age,
  gender,
}))
```

#### 闭包

闭包实质上是留存变量、可访问性控制的一个方案，它比 Java 类级别的 private 控制粒度更小。在 JS 中只能利用函数级作用域来做访问控制：

```javascript
const incrementer = (function() {
  let count = 0
  return () => {
    return ++count
  }
})()
```

#### 柯里化

假定读者有一定 JS 基础，都已经知道柯里化是啥了。这里回答有啥用的问题：对于多个参数的方法，可先部分应用相同的参数，然后再对不同的部分进行定制、调用，以达到复用、定制的目的。项目出现过这样的场景，可以认为是一个二阶柯里化：

```javascript
const sendTrackRequest = (userId, siteId, generalParams, extraParams) => {}
const trackPageView = (userId, siteId, generalParams) => {
  return (action, url) => {
    const pageViewParams = { action, url }
    return sendTrackRequest(userId, siteId, generalParams, pageViewParams)
  }
}
const trackEvent = (userId, siteId, generalParams) => {
  return (category, action, eventName, eventArgs = {}) => {
    const eventParams = { category, action, eventName, eventArgs }
    return sendTrackRequest(userId, siteId, generalParams, eventParams)
  }
}
```

一个通用的柯里化函数实现如下。第 6 行的代码参考了[这个写法](https://github.com/mqyqingfeng/Blog/issues/42#issuecomment-411428875)，其余是自己写的。

```javascript
const curry = (func) => {
  return function continueCurry(...args) {
    if (args.length >= func.length) {
      return func(...args)
    }
    return (...next) => continueCurry(...args, ...next)
  }
}
```

### 继承

继承的本质，是为了实现「代码复用」，并且通常是数据+行为的复用。不同于 Java 这样的强类型语言，JavaScript 没有类，也没有强类型的束缚，因此它得以实现一套更加清爽、更加简洁的继承体系。当然，这套方案就是大家所熟知的原型继承。

就方案来讲，ES6 提供的 `class` 语法糖是目前最完美的 API 了。不过虽然它长得很像 Java 的类，但其实它根本就不是类，底下的实现还是完全用的原型继承。关于继承相关的东西，另起了两篇博客进行了详尽的探究：

* https://blog.linesh.tw/#/post/2018-10-18-javascript-prototypal-inheritance
* https://blog.linesh.tw/#/post/2018-10-21-deep-dive-into-babel-inheritance

## 糟粕

原书中把 JavaScript 不好的东西分两种：毒瘤和糟粕。简而言之，毒瘤就是一无是处的特性，应该用都不用；糟粕是那些有时很有用，有时又很坑的特性，这样的特性更要规避，因为你只有深入思考阅读才能知道功能正常还是坑，这违反编程语言应该直接、表达力强的价值观。在这里，具体区分不是重点，我列出来一些书里提到的糟粕特性，这些特性**都不要用**就对了。

|       糟粕       | 建议 |                      规避方法                       |
| :--------------: | :--: | :-------------------------------------------------: |
|     全局变量     |  ❌  |   NodeJS 每个文件都有自己的作用域，部分解决此问题   |
|      伪数组      |  ❌  |          用 ES6 的参数解构代替 `argument`           |
|      `eval`      |  ❌  |          lint 工具无效；注入攻击；降低性能          |
|   缺少块的语句   |  ❌  |                  使用 ESLint 禁止                   |
|   自动插入分号   |  ❌  |         使用 ESLint 禁止一些易出 bug 的写法         |
|    `continue`    |  ❌  | ESLint `no-continue`: 任何 `continue` 都应该重构掉  |
|  类型的包装对象  |  ❌  | ESLint: `no-new-wrappers`: 使用基本类型、`{}`等替代 |
|      `void`      |  ❌  |              ESLint: `no-void`: 没场景              |
|  `==` && 假值表  |  ❌  |  ESLint: `eqeqeq`: 一律用 `===`/`!==` 避免类型转换  |
| `new Function()` |  ❌  |  一旦忘记，`this`就会绑定到全局对象，且无任何提示   |
|      无模块      |  --  | 已有 import/export、CommonJS、UMD 等模块化解决方案  |

这些东西，其实就只是学习用。在项目中，必须要用一个 ESLint 和 prettier 来加以规范，一个是你很难始终记住所有的规则，一个是你不能保证所有人都能始终遵守。于是，我自己写了个 [ESLint 规则](https://github.com/linesh-simplicity/eslint-config-javascript-the-good-parts)，用来在自己的个人项目中使用。

关于代码风格这事，作为一个洁癖患者我必须多说两句。我一直是把代码当程序员的「作品」来看，就好像小说之于其作者、音乐词曲之于作曲者，都是精雕细琢、明心见性的东西，容不得半点马虎。就好比《黄金时代》之于王小波，好比《燕窝》之于吴青峰。它的美，不仅来源于内容，而且在于内容的表达形式。经常有人认为，内容是独立于形式之外的，内容好就行，形式怎样都不会影响内容。[《娱乐至死》](https://book.douban.com/subject/26319730/)告诉大家，错了。媒介（形式）不仅影响内容，媒介还选择内容。媒介即隐喻。

> 写出《黄金时代》前，我从未觉得自己写得好。——王小波
>
> 完美一字不差。——《燕窝》，吴青峰

所以最后，这本书的所有糟粕、推荐写法，归总下来就是这样一份 ESLint 规则了。学完忘掉，用上这份 rule。就是对我个人学习成果最大的效益了。

```javascript
module.exports = {
  env: { es6: true },
  plugins: ["import"],
  rules: {
    // variables
    "one-var": "never",
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
    "arrow-body-style": "error",
    "func-style": "error",
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
    "enforce-methods-use-this": "error",

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
    "no-caller": "error",
    "no-sequences": "error",
    "no-cond-assign": "error",
    "no-empty-return": "error",
    "no-implied-eval": "error",
    "no-global-assign": "error",
    "no-useless-escape": "error",
    "no-implicit-globals": "error",
    "no-unneeded-ternary": "error",
    "no-console": "warning",

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
```
