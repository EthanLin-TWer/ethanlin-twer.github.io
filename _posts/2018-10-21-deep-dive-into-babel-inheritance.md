---
title: 深入 JavaScript 原型继承原理——babel 编译码解读
---

在[上一篇文章][]中，我们提到 ES6 的 `class` 语法糖是个近乎完美的方案，并且讲解了实现继承的许多内部机制，如 `prototype`/`__proto__`/`constructor` 等等。这篇，我们就以实际的 babel 代码为例子，来验证上节所言不虚。此外，本文还解释了 React 组件中你需要 `bind` 一下类方法的原理所在。

## 目录

* 无继承——简单的 `class` + 字段声明
* 无继承——简单的 `class` + 方法声明
* 简单继承——一层继承 + 字段覆盖
* 无继承——静态函数
* 无继承——静态变量
* 神秘的类 arrow function

## 无继承——简单的 `class` + 字段声明

先来看个最简单的例子，我们仅仅使用了 `class` 关键字并定义了一个变量：

```javascript
class Animal {
  constructor(name) {
    this.name = name || 'Kat'
  }
}
```

最后 [babel 编译出来][babel used]的代码如下。这里笔者用的是 Babel 6 的稳定版 6.26，不同版本编译出来可能有差异，但不至于有大的结构变动。

```javascript
'use strict'

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

var Animal = function Animal(name) {
  _classCallCheck(this, Animal)

  this.name = name || 'Kat'
}
```

确实十分简单，对吧。这段代码值得留意的点有两个：

一个是，使用 `class` 声明的 `Animal` 最后其实是被编译为一个函数。证明 `class` 跟类没关系，只是个语法糖。

另一个地方是，编译器帮我们插入了一个 `_classCallCheck` 函数调用，它会检查你有没有用 `new Animal()` 操作符来初始化这个函数。若有，则 `this` 会是被实例化的 `Animal` 对象，自然能通过 `animal instanceof Animal` 检查；若是直接调用函数，`this` 会被初始化为全局对象，自然不会是 `Animal` 实例，从而抛出运行时错误。这个检查，正解决了[上一篇文章][]提到的问题：如果忘记使用 `new` 去调用一个被设计构造函数的函数，没有任何运行时错误的毛病。

## 无继承——简单的 `class` + 方法声明

让我们再扩展一下例子，给它加两个方法。

```javascript
class Animal {
  constructor(name) {
    this.name = name || 'Kat'
  }

  move() {}
  getName() {
    return this.name
  }
}
```

```javascript
'use strict'

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i]
      descriptor.enumerable = descriptor.enumerable || false
      descriptor.configurable = true
      if ('value' in descriptor) descriptor.writable = true
      Object.defineProperty(target, descriptor.key, descriptor)
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps)
    if (staticProps) defineProperties(Constructor, staticProps)
    return Constructor
  }
})()

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

var Animal = (function() {
  function Animal(name) {
    _classCallCheck(this, Animal)

    this.name = name || 'Kat'
  }

  _createClass(Animal, [
    {
      key: 'move',
      value: function move() {},
    },
    {
      key: 'getName',
      value: function getName() {
        return this.name
      },
    },
  ])

  return Animal
})()
```

例子长了不少，但其实主要的变化只有两个：一是 `Animal` 被包了一层而不是直接返回；二是新增的方法 `move` 和 `getName` 是通过一个 `_createClass()` 方法来实现的。它将两个方法以 `key`/`value` 的形式作为数组传入，看起来，是要把它们设置到 `Animal` 的原型链上面，以便后续继承之用。

为啥 `Animal` 被包了一层呢，这是个好问题，但答案我们将留到后文揭晓。现在，我们先看一下这个长长的 `_createClass` 实现是什么：

```javascript
var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i]
      descriptor.enumerable = descriptor.enumerable || false
      descriptor.configurable = true
      if ('value' in descriptor) descriptor.writable = true
      Object.defineProperty(target, descriptor.key, descriptor)
    }
  }

  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps)
    if (staticProps) defineProperties(Constructor, staticProps)
    return Constructor
  }
})()
```

它是个立即执行函数，执行又返回了另一个函数。说明啥，一定用了闭包，说明里面要封装些「私有」变量，那就是 `defineProperties` 这个函数。这很好，一是这个函数只会生成一次，二是明确了这个函数只与 `_createClass` 这个事情相关。

再细看这个返回的函数，接受 `Constructor`、`protoProps` 和 `staticProps` 三个参数。`staticProps` 我们暂时不会用到，回头再讲；我们传入的数组是通过 `protoProps` 接受的。接下来，看一下 `defineProperties` 做了啥事。

它将每一个传进来的 props 做了如下处理：分别设置了他们的 `enumerable`、`configurable`、`writable` 属性。而传进来的 `target` 是 `Animal.prototype`，相当于，这个函数最后的执行效果会是这样：

```javascript
function defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    // 前面处理其实得到这样这个 descriptor 对象：
    var descriptor = {
      ...props[i],
      enumerable: false,
      configurable: true,
      writable: true,
    }
    Object.defineProperty(target, descriptor.key, descriptor)
  }
}
```

看到这里就很明白了，它就是把你定义的 `move`、`getName` 方法通过 `Object.defineProperty` 方法设置到 `Animal.prototype` 上去。[前面][上一篇文章]我们说过，`prototype` 是用来存储公共属性的。也就是说，这两个方法在你使用继承的时候，可以被子对象通过原型链上溯访问到。也就是说，我们这个小小的例子里，声明的两个方法已经具备了继承能力了。

至于 `enumerable`、`configurable`、`writable` 属性是什么东西呢，查一下[语言规范][ecmascript 2015(es6) specification]就知道了。简单来说，`writable` 为 `false` 时，其值不能通过 `setter` 改变；`enumerable` 为 `false` 时，不能出现在 `for-in` 循环中。当然，这里是粗浅的理解，暂时不是这篇文章的重点。

## 简单继承——一层继承 + 字段覆盖

```javascript
class Animal {
  constructor(name) {
    this.name = name || 'Kat'
  }
}

class Tiger extends Animal {
  constructor(name, type) {
    super(name)
    this.type = type || 'Paper'
  }
}
```

加一层继承和字段覆盖能看到啥东西呢？能看到继承底下的实现机制是怎么样的，以及它的 `constructor` 和 `__proto__` 属性将如何被正确设置。带着这两个问题，我们一起来看下编译后的源码：

```javascript
'use strict'

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    )
  }
  return call && (typeof call === 'object' || typeof call === 'function')
    ? call
    : self
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      'Super expression must either be null or a function, not ' +
        typeof superClass
    )
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  })
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass)
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

var Animal = function Animal(name) {
  _classCallCheck(this, Animal)

  this.name = name || 'Kat'
}

var Tiger = (function(_Animal) {
  _inherits(Tiger, _Animal)

  function Tiger(name, type) {
    _classCallCheck(this, Tiger)

    var _this = _possibleConstructorReturn(
      this,
      (Tiger.__proto__ || Object.getPrototypeOf(Tiger)).call(this, name)
    )

    _this.type = type || 'Paper'
    return _this
  }

  return Tiger
})(Animal)
```

相比无继承的代码，这里主要增加了几个函数。`_possibleConstructorReturn` 顾名思义，可能不是很重要，回头再读。精华在 `_inherits(Tiger, Animal)` 这个函数，我们按顺序来读一下。

```javascript
function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      'Super expression must either be null or a function, not ' +
        typeof superClass
    )
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  })
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass)
}
```

首先是一段异常处理，简单地检查了 `superClass` 要么是个函数，要么得是个 null。也就是说，如果你这样写那是不行的：

```javascript
const Something = 'not-a-function'
class Animal extends Something {}
// Error: Super expression must either be null or a function, not string
```

接下来这句代码将 `prototype` 和 `constructor` 一并设置到位，是精华。注意，这个地方留个问题：为什么要用 `Object.create(superClass.prototype)`，而不是直接这么写：

```javascript
function _inherits(subClass, superClass) {
  subClass.prototype = superClass && superClass.prototype
  subClass.prototype.constructor = { ... }
}
```

很明显，是为了避免任何对 `subClass.prototype` 的修改影响到 `superClass.prototype`。使用 `Object.create(asPrototype)` 出来的对象，其实上是将 `subClass.prototype.__proto__ = superClass.prototype`，这样 `subClass` 也就继承了 `superClass`，可以达到这样两个目的：

1.  `superClass.prototype` 原型上发生的修改都能实时反映到 `subClass` 的实例上
2.  `subClass.prototype` 上的任何修改不会影响到 `superClass.prototype`

最后，如果 `superClass` 不为空，那么将 `subClass.__proto__` 设置为 `superClass`。这是为了继承 `superClass` 的静态方法和属性。如以下的例子中，`Cat.TYPE` 能获取到 `Animal.TYPE`：

```javascript
class Animal {
  static TYPE = 'PAPER'
  static createTyping() {
    return Animal.TYPE
  }
}

class Cat extends Animal {}

console.log(Cat.TYPE)           // PAPER
console.log(Cat.createTyping()) // PAPER
```

至此，一个简单的继承就完成了。在使用了 `extends` 关键字后，实际上背后发生的事情是：

* 子「类」`prototype` 上的 `__proto__` 被正确设置，指向父「类」的 `prototype`: `subClass.prototype = { __proto__: superClass.prototype }`
* 子「类」`prototype` 上的 `constructor` 被正确初始化，这样 `instanceof` 关系能得到正确结果
* 子「类」的 `__proto__` 被指向父「类」，这样父「类」上的静态字段和方法能被子「类」继承

好，要点看完了。后面内容跟继承关系不大，但既然源码扒都扒了，我们不妨继续深入探索一些场景：

## 无继承——静态函数

看一个简单的代码：

```javascript
class Animal {
  static create() {
    return new Animal()
  }
}
```

首先要知道，这个「静态」同样不是强类型类继承语言里有的「静态」的概念。所谓静态，就是说它跟实例是没关系的，而跟「类」本身有关系。比如，你可以这样调用：`Animal.create()`，但不能这样用：`new Animal().create`。什么场景下会用到这种模式呢？比如说：

* 工厂模式或单例模式
* `Object.create`、`Object.keys` 等常用方法

既然只有通过构造函数本身去调用，而不能通过实例来调用，期望它们被绑定到函数本身上似乎很自然。我们来看看上面这段代码将被如何编译：

```javascript
'use strict'

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i]
      descriptor.enumerable = descriptor.enumerable || false
      descriptor.configurable = true
      if ('value' in descriptor) descriptor.writable = true
      Object.defineProperty(target, descriptor.key, descriptor)
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps)
    if (staticProps) defineProperties(Constructor, staticProps)
    return Constructor
  }
})()

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

var Animal = (function() {
  function Animal() {
    _classCallCheck(this, Animal)
  }

  _createClass(Animal, null, [
    {
      key: 'create',
      value: function create() {},
    },
  ])

  return Animal
})()
```

熟悉的函数，熟悉的配方。与本文的第二个例子相比，仅有一个地方的不同：`create` 方法是作为 `_createClass` 方法的第三个参数被传入的，这正是我们上文提到的 `staticProps` 参数：

```javascript
var _createClass = (function() {
  function defineProperties(target, props) { ... }

  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps)
    if (staticProps) defineProperties(Constructor, staticProps)
    return Constructor
  }
})()

_createClass(Animal, null, [
  {
    key: 'create',
    value: function create() {},
  },
])
```

可以看见，`create` 方法是直接被创建到 `Animal` 上的：`defineProperties(Animal, [{ key: 'create', value: function() {} }])`，最终会将函数赋给 `Animal.create`。我们的猜测并没有错误。

## 无继承——静态变量

```javascript
class Tiger {
  static TYPE = 'REAL'
}
```

还有个小例子。如果是静态变量的话，同样因为不希望在实例对象上所使用，我们会看到编译出来的代码中它是直接被设置到函数上。代码已经很熟悉，不必再讲。

```javascript
'use strict'

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

var Tiger = function Tiger() {
  _classCallCheck(this, Tiger)
}

Tiger.TYPE = 'REAL'
```

有趣的是，静态变量会不会被「子类」继承呢？这个可请读者自己做个实验，验证验证。

## 神秘的类 arrow function

写 React 的东西，一定遇见过这个问题：

```jsx harmony
class Button extends React.Component {
  constructor() {
    super()
    this.state = {
      isToggleOn: true,
    }
    // 画重点 👇👇👇👇👇👇👇👇👇👇👇👇
    // this.toggleButton = this.toggleButton.bind(this)
  }

  static propTypes = {
    text: PropTypes.string,
  }

  // ❌❌❌ Uncaught TypeError: this.setState is not a function
  toggleButton() {
    this.setState({
      isToggleOn: !this.state.isToggleOn,
    })
  }

  render() {
    return <button onClick={this.toggleButton}>Toggle Me</button>
  }
}
```

为什么会有这个问题呢？因为你扔进去的 `this.toggleButton` 函数，在 `button` 内部一定是通过 `onClick()` 这样的方式来调用的，这样的话，`this` 引用就会丢失为 `undefined`，那么 `React.Component` 上的 `setState` 就调用不到。

可以直接去 React 官方示例看看：https://codepen.io/gaearon/pen/xEmzGg?editors=0010

```javascript
class Button extends React.Component {
  ...

  // ✅✅✅ This will work!
  toggleButton = () => {
    this.setState({ ... })
  }

  ...
}
```

解决方案呢，自然也有很多种，比如引用 `@autobind`、使用 ES7 的 `::this.toggleButton`、使用箭头函数等。比如上面 👆 这种最常用的解决方案。那么同学们有没有想过这个问题，为什么这样写 `this` 应用就可以正确拿到呢？「因为箭头函数将 `this` 绑定到词法作用域的上下文中了呀~」那谁来给我解释一下这句话呢？反正我是从来没理解过这个「外层」的作用域，应该是绑定到哪里。因此，只好另辟路径，直接看源码来理解这个写法的含义。

我写了个简单的例子，足以复现这个问题：

```javascript
class Button {
  constructor() {
    this.value = 1
  }

  increment = () => {
    this.value += 2
  }

  render() {
    const onClick = this.increment
    onClick()
  }
}
```

当我们调用 `render()` 时，`increment()` 这样的调用方式会使 `this` 引用无法被初始化，这也正是我们传入的 `onClick` 在 React 中会被调用的方式。而上图的 `increment` 写法可以重新拯救失去的 `this` 引用！让我们来看看源代码，一探究竟。

```javascript
'use strict'

var _createClass = (function() {})()
function _classCallCheck(instance, Constructor) {}

var Button = (function() {
  function Button() {
    var _this = this

    _classCallCheck(this, Button)

    this.increment = function() {
      _this.value += 2
    }

    this.value = 1
  }

  _createClass(Button, [
    {
      key: 'render',
      value: function render() {
        var increment = this.increment
        increment()
      },
    },
  ])

  return Button
})()
```

我略去了大家耳熟能详的代码，只留下关键的部分。可以看到，编译后的代码中，**对 `Button` 实例的 `this` 引用被闭包保存了下来**！这种写法，与以前我们 `var that = this` 的写法是一致的，我也终于理解「不再需要 that 引用了」以及各种语焉不详的作用域啊最外层变量啊这些理论。其实，就是 `this` 引用会始终被绑定到构造函数上，而这底下是通过闭包实现的。只是把你以前手写的代码自动化生成而已。

在本文的第二个例子中，我们留意到 `Animal()` 构造函数被额外包了一层，当时不得其解。看到这里，我们也许可以理解它的意图：就是为了将你在类中编写的箭头函数做个闭包，将 `this` 引用存储下来，以做后用。

[上一篇文章]: https://blog.linesh.tw/#/post/2018-10-18-javascript-prototypal-inheritance
[babel used]: https://babeljs.io/repl/#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=Q&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=true&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Ces2017%2Creact%2Cstage-0%2Cstage-3&prettier=false&targets=&version=6.26.0&envVersion=
[ecmascript 2015(es6) specification]: https://www.ecma-international.org/ecma-262/6.0/#sec-property-attributes
