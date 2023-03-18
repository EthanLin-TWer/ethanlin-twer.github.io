---
category: 翻译
tags: JUnit 5, unit test
title: 「译」JUnit 5 系列：架构体系
---

现在，我们已经知道了 [如何配置 JUnit 5 环境][JUnit 5: Setup] 及 [如何写一些测试][JUnit 5: Basics]，接下来就来看一点封面下的内容吧。本篇我们将讨论 JUnit 5 的架构体系，以及它之成形如此的原因。

> 原文地址：[http://blog.codefx.org/design/architecture/junit-5-architecture/](http://blog.codefx.org/design/architecture/junit-5-architecture/)  
> 原文日期：29, Mar, 2016  
> 译文首发：[ Linesh 的博客：「译」JUnit 5 系列：架构体系][JUnit 5: Architecture]  
> 我的 Github：[http://github.com/linesh-simplicity](http://github.com/linesh-simplicity)

## 概述

本文章是这个 JUnit 5 系列的一部分：

* [环境搭建][JUnit 5: Setup]
* [基础入门][JUnit 5: Basics]
* [架构体系][JUnit 5: Architecture]
* [扩展模型（Extension Model)][JUnit 5: Extension Model]
* [条件断言][JUnit 5: Conditions]
* 注入
* [动态测试][JUnit 5: Dynamic Tests]
* ...

（如果不喜欢看文章，你可以[戳这里看我的演讲](http://blog.codefx.org/past-talks/)，或者[看一下最近的 vJUG 讲座](https://www.youtube.com/watch?v=ct9sIsrnE9Y)，或者[我在 DevoxxPL 上的 PPT](https://www.youtube.com/watch?v=oG80XZUN1lQ)。

本系列文章都基于 Junit 5发布的先行版 [Milestone 2][User guide: M2]。它可能会有变化。如果有新的里程碑（milestone）版本发布，或者试用版正式发行时，我会再来更新这篇文章。

这里要介绍的多数知识你都可以在 [JUnit 5 用户指南][User guide: M2] 中找到（这个链接指向的是先行版 Milestone 2，想看的最新版本文档的话请戳[这里][User guide: Current]），并且指南还有更多的内容等待你发掘。下面的所有代码都可以在 [我的 Github](https://github.com/CodeFX-org/demo-junit-5) 上找到。

## 目录

* JUnit 4 
* JUnit 5
    * 分离的关注点
    * JUnit 5 的重新组织
    * 架构及体系
    * API 生命周期
* Open test alliance
* 回顾总结
* 分享&关注

## JUnit 4

除了 Hamcrest，JUnit 4没有任何外部依赖，其所有的功能都被打包在一个构件（artifact）中。这完全违反了单一职责原则，它被提供给开发者、IDE、构建工具、其他测试框架、其他扩展等使用，不同的使用者，依赖的都是一个同样的构件。

而在这其中，只有开发者能——或者说曾经能——以最干净的方法来使用它。他们通常只需要 JUnit 的公共 API，不需要管其他的。非常好。

但生态圈中的其他成分则不是这样使用 JUnit：测试框架、扩展，特别是 IDE 和构建工具的开发者，他们需要深入到 JUnit 的深处，到它的细枝末节：非 public 的类、内部 API，甚至 private 字段。它们的正常工作极大地依赖于 JUnit 的实现细节。这使得 JUnit 维护团队不能轻易地修改框架的这些内部实现，因此团队的开发进度受到了很大的影响。

当然，这些工具的开发者们也并非有意为之。为了实现那些我们十分喜爱的特性，他们不得不使用内部的 API，因为 JUnit 4 并没有提供相应的 API：一个强大到足以满足工具开发者们需求的 API。

Junit Lambda 团队开始着手于 JUnit 5 的开发，希望能让这一切变得明朗起来。

## JUnit 5

### 分离的关注点

退一步想，我们不难辨识出，这里至少有两个不同的关注点需要分离：

1. 一个支持测试代码撰写的 API
2. 一个识别测试、运行测试的机制

再仔细思考一下第二点，我们可能会问，“哪些测试？”这个当然是指 Junit 测试。“我知道，但具体是哪些版本的测试呢？”呃…“还有，具体是指什么类型的测试？”好吧，你让我给你……“只能跑那些老版本的 `@Test` 注解的测试么？有没有其他新的方法来运行测试呢？……”行行行，都给我闭嘴！听我讲着。

为了进一步将待识别测试的类型 与 实际运行它们 这两个关注点解耦，上面的第二点需要细分：

1. 一个支持测试代码撰写的 API
2. 一个识别测试、运行测试的机制
    1. 一个识别、运行特定类型（比如，JUnit 5测试的机制）
    2. 另一套协调上述机制的机制
    3. 上两者之间的 API

### JUnit 5 的重新的组织

识别出这两个关注点以后，“作为平台的 JUnit ”（用于运行我们的测试）和“作为工具的 JUnit ”（用于撰写我们的测试）这两个概念的分离就清晰了。为了完成这个彻底的分离，JUnit 团队决定将 JUnit 5 分成三个子项目：

**JUnit Jupiter**  
包含了我们用于撰写测试的 API（关注点1），以及一个能理解测试代码的引擎（关注点2.1）。

**JUnit Platform**  
提供了一套统一的 API 以运行测试，及基于 API 之上的一套工具（关注点2.2和2.3）。

**JUnit Vintage**  
 提供了一套引擎，用以在 JUnit 5 中运行 JUnit 3 和 JUnit 4 的测试（关注点2.1）。

### 架构与体系

JUnit 5 的架构体系完全是遵循这个关注点分离思想的产物：

**junit-jupiter-api(1)**  
开发者用于撰写测试的 API，包含了我们在[JUnit 5 的基础知识][JUnit 5: Basics]一节中所提及的所有注解、断言等。

**junit-platgorm-engine(2.3)**  
包含了一套所有测试引擎都必须实现的 API。这样，不同的测试引擎之间可以通过统一的接口被调用。引擎可以跑正常的 JUnit 测试，但也可以实现不同的引擎用以执行其他框架写成的测试，如 [TestNG](http://testng.org/doc/index.html)、[Spock](https://github.com/spockframework/spock)、[Cucumber](https://cucumber.io/) 等。

**junit-jupiter-engine(2.1)**  
**junit-platform-engine** API 的一个实现，专门用于执行 JUnit 5 撰写的测试。

**junit-vintage-engine(2.1)**  
**junit-platform-engine** API 的一个实现，专门用于执行 JUnit 3 或 JUnit 4 撰写的测试。过去，JUnit 4 的构件 **junit-4.12** 充当了两个角色：它既是开发人员用于实现测试的 API，又包含了用以执行测试的核心组件。这个引擎，可以认为是低版本的 JUnit 3/4 与 JUnit 5 之间的一个适配器。

**junit-platform-launcher(2.2)**  
这部分使用了一个服务加载器 `ServiceLoader` 来发现测试引擎，并协调不同实现之间的执行。它提供了一个 API 给 IDE 和构建工具，使得它们能够与测试执行过程交互，比如，运行单个的测试、搜集测试结果并展示等。

听起来怎样，很酷吧。

![](http://7xqu8w.com1.z0.glb.clouddn.com/junit-5-architecture.png)

这部分架构对于我们生态链前端的使用者来说基本是透明的。我们的项目只需要引入一个用于编写测试的 API 依赖，其余的组件让工具去操心即可。

### API 生命周期

现在来说说那些大家都在使用的内部 API。JUnit 5 团队希望这个问题也能得到解决，为此给 JUnit 的 API 设立了生命周期。这里，我将[源码](https://github.com/junit-team/junit5/blob/master/junit-platform-commons/src/main/java/org/junit/platform/commons/meta/API.java)中给出的部分解释截取于此。

**内部 API（internal）**  
不允许被 JUnit 开发者之外的任何人使用。这部分 API 可能被移除，并且不会事先通知。

**已过时（Deprecated）**  
不应该再被使用的 API，它们可能在下次小版本发布时被移除。

**实验阶段（Experimental）**  
为一些新的、实验阶段的特性所使用的 API，这些新特性可能会或已经被公开使用并接受反馈中。  
可以使用，但要谨慎。这些 API 未来可能被提升至 **维护中** 或 **稳定** 级别，但也可能不带提前通知就被移除。

**维护中（Maintained）**  
使用该 API 的特性，至少在该大版本的下一个小版本发布时不会发生向后不兼容的改变。如果未来有移除维护中 API 的计划，它会先被打回到 **已过时** 阶段。

**稳定（Stable）**  
使用该 API 的特性，至少在下个大版本发布之前不会发生向后不兼容的改变。

JUnit 对外公开的类都带有一个 `@API(usage)` 注解，其中 `usage` 是上面几个值中的其中一个。团队希望这能给 API 的调用方以充足的信息，即他们所使用的 API 处于什么生命周期中，同时，也希望给每个团队以自由，让他们决定是否改变或移除过时 API 。

## Open Test Alliance

其实还有一件事。Junit 5 的体系结构使得 IDE 和构建工具能够将其作为中间层，以运行所有类型的测试框架（前提是该框架实现了其对应的引擎）。这样的话，工具本身就不需要去实现框架相关的测试支持，它们只需要使用一套统一的借口，即可实现测试发现、测试执行和结果收集。

是嘛，真的可以吗？

失败的测试，通常使用异常来描述。但不同的测试框架和断言库之间并无一个统一的接口。相反，它们通常实现了各自不同的版本（常见的是继承 `AssertionError` 或 `RuntimeException` ）。这就使得不同框架间的互操作变得更加复杂，也使得工具之间无法简单使用一套统一的接口。

为了解决这个问题，Junit Lambda 团队又分出来一个独立的项目，[The Open Test Alliance for the JVM](https://github.com/ota4j-team/opentest4j)。这是它们的提议：

> 基于 JUnit Lambda 团队近来与来自Eclipse、Gradle 及 Intellij 等 IDE 和构建工具开发者所展开的讨论，我们呼吁要建立这样一个开源项目：它用于提供一套基于 JVM的 测试库与测试框架 间的最小公共接口集。
> 
> 项目主要目标是，为各测试框架（如 JUnit、TestNG、Spock 等）和三方断言库（Hamcrest、Assert 等）提供一个公共的异常集合。有了这个集合，IDE 和构建工具就可以一个统一的接口对所有测试过程——如对失败断言、失败假言判定的处理、对测试执行过程的可视化、在 IDE 中生成测试结果报告等——进行处理。

截止目前，该项目的呼吁似乎并未引起太多重视，或说是基本未得到重视。如果你觉得这是个好的想法，你可以通过一些方式来支持，比如向你经常使用的测试框架维护者发出声音。

## 回顾总结

本篇我们介绍了 JUnit 5 的架构设计，它将原有的 API 分成了两部分：编写测试部分的 API 和 执行测试的引擎。这个引擎进一步地被切分成三个部分：一个解析测试代码的 API、一个测试执行器（launcher），和一些支持不同测试框架的引擎实现。这样开发者只需要为项目引入 API 部分的依赖（用于编写测试），而测试框架的开发者们则只需要实现引擎部分的 API（其他工作已经由 JUnit 处理了），构建工具方面也只需要实现 launcher API以协调测试执行。

[下篇文章][JUnit 5: Extension Model]将会介绍 JUnit 5 的可拓展性。敬请期待。

---

[User guide: M2]: http://junit.org/junit5/docs/5.0.0-M2/user-guide/
[User guide: Current]: http://junit.org/junit5/docs/current/user-guide/
[JUnit 5: Setup]: http://blog.linesh.tw/#/posts/2016-09-17-junit5-setup
[JUnit 5: Basics]: http://blog.linesh.tw/#/posts/2016-09-17-junit5-basics
[JUnit 5: Architecture]: http://blog.linesh.tw/#/posts/2016-09-17-junit5-architecture
[JUnit 5: Extension Model]: http://blog.linesh.tw/#/posts/2016-09-17-junit5-extension-model
[JUnit 5: Conditions]: http://blog.linesh.tw/#/posts/2016-09-17-junit5-conditions
[JUnit 5: Injection]: http://blog.linesh.tw/#/posts/2016-09-17-junit5-injection
[JUnit 5: Dynamic Tests]: http://blog.linesh.tw/#/posts/2016-09-17-junit5-dynamic-tests
