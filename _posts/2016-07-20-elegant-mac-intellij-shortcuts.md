---
title: Mac优雅的工具集——Intellij快捷键
---

本篇是我Mac优雅工具集系列下其中的一篇文章，[原文全文](https://linesh.gitbooks.io/gitbook-elegant-mac-tools-system-closure/content/index.html)托管在Gitbook上，分享了Mac系统下一些使工作变得更高效的工具。

> 在线的精简cheatsheet备查表：[intellij.linesh.tw](http://intellij.linesh.tw)  
> Github项目：[intellij-mac-frequent-keymap](https://github.com/linesh-simplicity/intellij-mac-frequent-keymap)

# Intellij Cheatsheet：成吨提高Java编程开发效率

Intellij的快捷键多而繁杂，处女座的我这一年里，拉拉杂杂也阅读了大量的文档和资料，从[官方推荐的keymap](https://resources.jetbrains.com/assets/products/intellij-idea/IntelliJIDEA_ReferenceCard_mac.pdf)到市面能看到的大多数资料和总结。结合平时的工作和个人项目经验，我尝试整理并总结其中最精华的部分，并通过这个子集总结思考与提高效率相关的思维模式和理念。于是有了这篇博客。总的来说，它讲了两个内容：

* 快捷背后的理念与思维模式
* 一套精简的Intellij快捷键核心子集

产出的价值大概有这么几方面：

* 一个[在线的cheatsheet备查表](http://intellij.linesh.tw)
* 总结了高效快捷键的一个精简子集，节省了阅读其他杂而价值不高的快捷键的时间与精力
* 总结了快捷背后的两个思维模式的转变：**更高层级的抽象** 和 **声明式使用**

## 理念与思维模式

IDE与电脑作为工具，永远是高效完成特定工作的辅助。因此我们所谓的高效有了上下文：以完成工作为主，在这个过程工具的作用是辅助工作。那么，所谓高效也即是问，如何更专注于工作本身，更高效地完成工作呢？在一系列落地的快捷键背后，这个围绕快捷键所展开的工作系统，其实质性提高工作效率的理念和思维模式本身是什么呢？我的回答是：

* 更高层次的抽象
* 声明式使用

### 更高层次的抽象

更高层次的抽象，指的是从代码、从语言本身特性的层面思考编程，而非单纯的文本或者字符串。要把思维从“把这五行代码剪切并复制到一个新的方法里”等把代码当成无意义字符的低层面活动，转变到以作为语言核心的要素和特性为单位的思考，比如类、变量、方法、重命名、重构、if-else、循环、可循环元素等。

在这方面，IDE提供的 **Live Template**、**重构(Refactoring)**、部分后向声明等，都是这种思想的产物，允许你从更高的层级（语言特性、与Java高相关的重构）来思考代码，并尽量多地向上屏蔽细节。

### 声明式使用

声明式使用，指的是直接使用你完成工作所需要的元素（类、字段、方法等），让IDE为你自动补全缺少的声明或定义。这种思想同样贯穿这本工具集的始终，以更语义化（更高阶）的操作来使用工具。

在这方面，IDE提供的 **后向声明(Postfix Auto Completion)**、**自动补全(Auto Completion)** 等，都是这种思想的产物。你不需要关注操作所在的上下文，IDE会为你补全，你需要关注的是工作和操作本身。


## 快捷键精简子集

本节主要分七个部分展开总结：生产力大杀器、语言要素生成、编辑、导航、重构、搜索、运行时。版本控制的部分未录入，原因是我倾向于使用命令行提交，而非IDE内置VCS支持。见仁见智。最后一栏是该操作在IDEA中的操作名称，可以在keymap中检索对应的action/shortcut找到。

### 生产力（Productivity）

| Operation | Mac OSX 10.5+ | Comments | Description |
|:---      |:---:        |:---:          |:---     |
| 模板补全 | ⌘+J | 插入一个符合某结构特征的模板，详解见下 | Insert live template |
| 命令查询 | ⇧+⌘+S | 以名称的形式查询某个操作或快捷键，是声明式编程思想的完美体现 | Find actions |
| 意图预测与智能帮助 | ⌥+Enter | 简单重构、移除死代码、结构调整、自动导包等| Show intention actions |

#### 模板补全（Live Template）

敲完以下模板补全的keyword之后可以直接通过tab或回车触发模板补全，$1/$2...是需要你填充的模板变量。

| Operation | Mac OSX 10.5+ Keyword | Expands to | Comments |
|:---: |:---: |:---: |:---: |
| 判空 | `ifn` | `if ($1 == null) {}` | 后向声明也有同样功能，读者可拣顺手的用 |
| 判非空 | `inn` | `if ($1 != null) {}` | |
| 创建索引循环 | `fori` | `for (int $1 = 0; $1 < $2; $1++) {}` | |
| 添加TODO | `todo` | `// TODO: $1` | 非常声明式的用法 |
| 添加Fixme | `fixme` | `// FIXME: 7/19/16 $1` | 同上 |
| 类型关系判定 | `inst` | `if ($1 instanceof $2) {} ` | |
| System.out | `sout` | `System.out.println($1); `| 必须入手的黑技能，调试打log的时候非常有用 |

#### 后向声明（Postfix Completion）

[后向声明](https://blog.jetbrains.com/idea/2014/03/postfix-completion)是JetBrains系IDE的一项新功能，旨在减少光标经常性的前后移动，提高开发效率，形成这样的编程思维：先使用元素，再考虑变量声明或结构补全。它的主要功能是根据当前元素的属性，提供可能的行为建议，例如使用if-else结构包围、判（非）空、格式化、进行类型转换等。因此，后向声明所能提供的选择视元素（主要是变量）的不同而不同。

所有元素都拥有的一些后向声明选择，仅选择我认为常用的：

| Operation | Postfix Completion Keyword | Expands To | Comments | 
|:---: |:---: |:---: |:---: |
| 变量声明 | element.`var` | `Type $name = element;` | 必备技能，声明式使用的典范 |
| 转换为类字段 | element.`field` | `private $Type element; ` | 刚发现的 |
| 将当前变量打印到输出流 | element.`sout` | `System.out.println(element);` ||
| 返回当前值 | element.`return` | `return element;` | |
| 类型转换 | element.`cast` | `(($Type) element)` | |

然后，对于特定的元素类型，有的后向声明还有非常实用的选项，比如字符串的判空、布尔值的if-else、列表的循环等等：

| ElementType | Operation | Postfix Completion Keyword | Expands To | Comments | 
|:--- |:---: |:---: |:---: |:---: |
| 字符串 | 判空 | string.`null`| `if (string == null) {}` | |
| | 判非空 | string.`notnull` | `if (string != null) {}` | |
| 整数 | 分支 | int.`switch` | `switch (int) {}` | |
| 布尔值 | 如果为真 | boolean.`if` | `if (boolean) {}` | |
| | 如果为假 | boolean.`else` | `if (!boolean) {}` | |
| | 反义 | boolean.`not` | `!boolean` | |
| 列表 | 循环元素 | lists.`for` | `for (Type element : lists) {}` | 非常常用 |
| | 带索引循环 | lists.`fori` | `for (int i = 0; i < lists.size(); i++) {}` | |


### 编辑（Editing）

| Operation | Mac OSX 10.5+ | Comments | Description |
|:---:      |:---:        |:---:          |:---     |
| 基本代码补全 | ^+Space | 一般都用这个补全，变量命名时及方法补全时常用 | Code/Completion/Basic |
| 智能补全 | ^+⇧+Space | 是否有必要记得两个快捷键？可以统一设成一个 | Code/Completion/SmartType |
| 语句补全 | ⇧+⌘+Enter | 直接补全当前语句，在括号特别多时非常有用 | Complete Current Statement |
|||||
| 从上方开始一行 | ⌥+⌘+Enter | | Start New Line Before Current |
| 从下方开始一行 | ⇧+Enter | | Start New Line |
| 上移/下移一行 | ⇧+⌥+↑/↓ | 上下移一行。一般用于以单行出现的元素，否则会破坏元素间的关系 | Move Line Up/Down |
| 上移/下移一个块 | ⇧+⌘+↑/↓ | | Move Statement Up/Down |
| 选中一个代码块 | ⌥+↑ | 常用 | Extend Selection |
| 取消代码块选中 | ⌥+↓ | | Shrink Selection |
|||||
| 重复当前行 | ⌘+D | | Duplicate Current Line or Block |
| 复制并且不删除当前行 | ⌘+C | | Edit/Copy |
| 剪切当前行并复制到粘贴板 | ⌘+X | | Edit/Cut |
| 关闭当前标签 | ⌘+W | 跟通常编辑器快捷键一致 | Edit Tabs/Close |
| 注释当前行 | ⌘+/ | 随手一注释 | Comment with Line Comment |
|||||
| 优化import | ^+⌥+O | 没啥用 | Optimize Imports |
| 格式化代码 | ⌥+⌘+L | 没啥用 | Reformat Code |

### 语言要素生成（Language Elements/Features）

| Operation | Mac OSX 10.5+ | Comments | Description |
|:---      |:---:        |:---:          |:---     |
| 测试、方法生成 | ^+Enter/ ⌘+N | 非常常用于创建测试方法、构造方法、覆写接口方法、覆写基类方法 | Code/Generate |
| 创建类、文件、目录 | ⌘+N | 常用 | Code/Generate |
| 创建override方法 | ^+O | 有用 | Override Methods |
| 创建接口方法实现 | ^+I | 有用 | Implement Methods |

### 导航（Navigation）

| Operation | Mac OSX 10.5+ | Comments | Description |
|:---:      |:---:        |:---:          |:---     |
| 转到方法/字段的声明 | ⌘+B | 调试跟代码都很常用 | Navigation/Declaration |
| 转到方法/字段的实现点 | ⌥+⌘+B | 同上，常用 | Navigation/Implementation(s) |
| 转到方法/字段类型的类定义处 | ⇧+⌘+B/ ⇧+^+B | 常由下两个快捷键取代 | Navigation/Type Declaration |
| 当前类与单元测试间跳转 | ⇧+⌘+T | 非常方便 | Navigate/Test |
|||||
| 跳转到当前类的基类 | ⌘+U | 配套食用，效果更佳 | Super Method |
| 类继承体系 | ^+H | | Type Hierarchy |
| 方法继承层次 | ⇧+⌘+H | | Method Hierarchy |
| 当前方法调用链 | ^+⌥+H || Call Hierarchy |
| 本类及所有基类方法列表 | ⌘+F12 || File Structure |
|||||
| 类/方法/字段定义的快速预览 | ⌥+Space/ ⌘+Y | 小览实现，一般可以看到方法/字段参数、返回值、前几行实现，快速的信息足够了 | Quick Definition |
| 方法文档快速预览 | ^+J | 看文档，我不常用 | Quick Documentation |
| 方法参数快速预览 | ⌘+P | 常用 | Parameter Info |
|||||
| 前一个标签 | ⇧+⌘+[ | 导航常用，不过是否能以其他方式取代，比如声明式使用类查找⌘+O等。仍在探索 | Select Previous Tab |
| 后一个标签 | ⇧+⌘+] | | Select Next Tab |
| 往上一级 | ⌥+⌘+←/ ⌘+[ | 调代码，跟方法体系时，非常有用，下同 | Navigate/Back |
| 往下一级 | ⌥+⌘+→/ ⌘+] | | Navigate/Forward |
|||||
| 转到下一个错误或警告 | F2 | 代码见红时，常用此快捷键快速定位，并配合万能快捷键⌥+Enter快速修复 | Next Highlighted Error |
| 提示错误信息 | ⌘+F1 | 不常用 | Error Description |
| 意图预测与智能帮助 | ⌥+Enter | 简单重构、移除死代码、结构调整、自动导包等| Show intention actions |
|||||
| project视图 | ⌘+1 | 有时导航项目结构时常用，不知是否有替代方案 | Other/Project |
| search/find视图 | ⌘+3 | 除了这几个，其他视图都不常用 | Other/Find |
| run视图 | ⌘+4 | 有时开关测试视图 | Other/Run |
| debug视图 | ⌘+5 | | Other/Debug |
| VCS视图 | ⌘+9 | | Other/VCS |
| terminal视图 | * ⌘+0 | 自己改过，一是和各种视图快捷键保持一致，另外是原生的⌘+F12实在有点难按 | Other/Terminal |
| 隐藏所有工具视图 | ⇧+⌘+F12 | 同时开了工程和终端视图时一键回编程页面 | Hide All Tool Windows |
|||||
| 跳转到第...行 | ⌘+L | 属于细节型的活，能少用就多思考替代方案 | Navigate/Line... |


### 重构（Refactor）

| Operation | Mac OSX 10.5+ | Comments | Description |
|:---:      |:---:        |:---:          |:---     |
| 复制类/目录等 | F5 | | Refactor/Copy |
| 移动类/目录等 | F6 | | Refactor/Move |
| 元素(类/方法/变量/…)重命名 | ⇧+F6 | 最常用的重构快捷键之一了吧 | Refactor/Rename |
| 类/方法签名修改 | ⌘+F6 | | Refactor/Change Signature |
|||||
| 字段(类级别)抽取 | ⌥+⌘+F | | Extract/Field |
| 常量(类级别)抽取 | ⌥+⌘+C | | Extract/Constant |
| 变量(方法级别)抽取 | ⌥+⌘+V | | Extract/Variable |
| 参数(方法级别)抽取 | ⌥+⌘+P | | Extract/Parameter |
| 方法抽取 | ⌥+⌘+M | 最常用的重构快捷键之一 | Extract/Method |
| 方法内联 | ⌥+⌘+N | | Refactor/Inline |


### 搜索（Searching)

| Operation | Mac OSX 10.5+ | Comments | Description |
|:---:      |:---:        |:---:          |:---     |
| 搜索 | ⌘+F | 通常快捷键 | Find/Find |
| 替换 | ⌘+R | 正则发挥作用的地方 | Find/Replace |
| 查找引用点 | ⌥+F7 | 重构或调试的时候经常用到，使用频率高 | Find/Find usages |
|||||
| 查找类 | ⌘+O | 声明式编程，使用频率很高的快捷键 | Navigate/Class |
| 查找文件 | ⇧+⌘+O | 同上，使用频率很高 | Navigate/File |
| 查找symbol | ⌥+⌘+O | 基本不用，不知道与上两者有什么区别 | Navigate/Symbol |
| 全项目文本搜索 | ⇧+⌘+F | 搜索引用点和文本出现、改bug时非常有用 | Find/Find in path |
|||||
| 查找下一个 | ⌘+G | | Find/Find Next |
| 查找上一个 | ⇧+⌘+G | | Find/Find Previous |

### 运行时（Runtime）

| Operation | Mac OSX 10.5+ | Comments | Description |
|:---:      |:---:        |:---:          |:---     |
| 编译 | ⌘+F9 | 调bug时可能是忘了编译最新代码 | Make Project |
| 运行(最近一个测试) | ^+R | 非常有用，有时可能节省在测试代码和源文件之间的切换 | Run/Run |
| 调试 | ^+D | | Run/Debug |
|||||
| 打断点/取消断点 | ⌘+F8 | | Toggle Breakpoints |
| 查看所有断点 | ⇧+⌘+F8 | | View Breakpoints |
| 跳入 | F7 | | Run/Step Into |
| 跳出 | ⇧+F8 | | Run/Step Out |
| 智能跳入(当前行多个调用时) | ⇧+F7 |
| 跳过(下一步) | F8 | | Run/Step Over |
| 求表达式值 | ⌥+F8 | | Evaluate Expression |
| 停止调试 | ⌘+F2 | | Run/Stop |
