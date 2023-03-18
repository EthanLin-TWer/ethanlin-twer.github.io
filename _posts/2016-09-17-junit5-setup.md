---
category: 翻译
tags: JUnit 5, unit test
title: 「译」JUnit 5 系列：环境搭建
---

2015年11月，[Junit Lambda](http://junit.org/junit4/junit-lambda.html) 团队发布了该项目的 [第一版原型](http://blog.codefx.org/libraries/junit-lambda-prototype/) 。此后，该项目把名称改成了 JUnit 5 并独立了出来，随后在2016年2月份的时候发布了一个 alpha 版本。本篇打算以一系列文章，简短地探索一下以下几个方面：

> 原文地址：[http://blog.codefx.org/libraries/junit-5-setup/](http://blog.codefx.org/libraries/junit-5-setup/)  
> 原文日期：15, Feb, 2016  
> 译文首发：[ Linesh 的博客：「译」JUnit 5 系列：环境搭建](http://blog.linesh.tw/#/posts/2016-09-17-junit5-setup)  
> 我的 Github：[http://github.com/linesh-simplicity](http://github.com/linesh-simplicity)

* [环境搭建][JUnit 5: Setup]
* [基础入门][JUnit 5: Basics]
* [架构体系][JUnit 5: Architecture]
* [扩展模型（Extension Model)][JUnit 5: Extension Model]
* [条件断言][JUnit 5: Conditions]
* 注入
* [动态测试][JUnit 5: Dynamic Tests]
* ...

（如果不喜欢看文章，你可以[戳这里看我的演讲](http://blog.codefx.org/past-talks/)，或者[看一下最近的 vJUG 讲座](https://www.youtube.com/watch?v=ct9sIsrnE9Y)，或者[我在 DevoxxPL 上的 PPT](https://www.youtube.com/watch?v=oG80XZUN1lQ)。

本篇将介绍 JUnit 5 的环境搭建，看完之后你应该能够使用新的 API 来撰写测试，并且使用你喜欢的 IDE 或构建工具来跑这些测试了。

## 概述

本系列文章都基于 Junit 5发布的先行版 [Milestone 2][User guide: M2]。它可能会有变化。如果有新的里程碑（milestone）版本发布，或者试用版正式发行时，我会再来更新这篇文章。

这里要介绍的多数知识你都可以在 [JUnit 5 用户指南][User guide: M2] 中找到（这个链接指向的是先行版 Milestone 2，想看的最新版本文档的话请戳[这里][User guide: Current]），并且指南还有更多的内容等待你发掘。下面的所有代码都可以在 [我的 Github](https://github.com/CodeFX-org/demo-junit-5) 上找到。

## 目录

* 第一个测试
* 运行测试
    * 使用 JUnit 4 runner
    * IDE 的支持
    * 构建工具的支持
    * 命令行支持也不赖
* 向下兼容性
* 回顾
* 分享&关注

## 第一个测试

支持测试撰写的 API 包含在` junit-jupiter-api` 包中。在构建工具中引入这个包，就行了。这就是全部，你就可以开始写测试了。

* Group ID: `org.junit.jupiter`
* Artifact ID: `junit-jupiter-api`
* Version: `5.0.0-M2`

我们来写[第一个测试](https://github.com/CodeFX-org/demo-junit-5/blob/master/src/test/java/org/codefx/demo/junit5/HelloWorldTest.java)吧，此处简单最好：

```java
package org.codefx.demo.junit5;
 
import org.junit.jupiter.api.Test;
 
class HelloWorldTest {
 
	@Test
	void helloJUnit5() {
		System.out.println("Hello, JUnit 5.");
	}
 
}
```    

看起来怎样？没 `public` ，感觉帅气不？这里我不会太深入细节讲解，不过[下一篇][JUnit 5: Basics]我会深入讨论下这个（以及其他的一些基础）。请别急，接着往下看。

## 运行测试

JUnit 5 是一代全新的测试框架，不过工具内置的支持则还未完全跟上。好在目前已有简易的方法来运行 JUnit 5 及其测试。

### 使用 JUnit 4 runner

JUnit 团队提供了一个 `JunitPlatform` [runner](http://www.codeaffine.com/2014/09/03/junit-nutshell-test-runners/)，可以使用它在 Junit 4 上运行 JUnit 5 的测试。这个 runner 在另一个包下，因此你也必须将它加入到你的项目中：

* Group ID: `org.junit.platform`
* Artifact ID: `junit-platform-runner`
* Version: `1.0.0-M2`

这个 runner 最终会调用 Junit 引擎，后者才是真正运行 Junit 5 测试的部分。引擎也是在不同的包下，你也必须将它加入到项目中：

* Group ID: `org.junit.jupiter`
* Artifact ID: `junit-jupiter-engine`
* Version: `5.0.0-M2`

要运行项目中所有的测试，为它们创建一个测试套件是最简单的做法：

```java

package org.codefx.demo.junit5;
 
import org.junit.platform.runner.JUnitPlatform;
import org.junit.platform.runner.SelectPackages;
import org.junit.runner.RunWith;
 
@RunWith(JUnitPlatform.class)
@SelectPackages({ "org.codefx.demo.junit5" })
public class TestWithJUnit5 { }
```

不过请注意，这个类必须是一个 JUnit 4 的测试类，也即是说它必须遵循 [一般的命名规范](http://stackoverflow.com/a/6178629/2525313)，并且必须是 `public` 的。`@SelectPackages` 注解会把包当做一个有层级的结构，因此它会负责跑 `org.codefx.demo.junit5` 开头的包下的所有测试。

至此所有工作都完成了！你的 IDE 和构建工具应该都能运行这个 `@RunWith(JUnitPlatform.class)` 注解的测试类了，它会负责跑所有的 JUnit 5 的新测试。

不过在 JUnit 5 被完全支持之前，一些特性可能还不能工作，比如 IDE 无法运行单独的测试等。不过目前为止，这是我发现的最简单并且在多平台下均工作良好的方案了。

### IDE 的支持 

Intellij IDEA [2016.2](https://blog.jetbrains.com/idea/2016/07/intellij-idea-2016-2-is-here/) 开始 [对 JUnit 5 有了基本的支持](https://blog.jetbrains.com/idea/2016/08/using-junit-5-in-intellij-idea)。尽管支持还不是很完美，并且还需时刻关注 JUnit 5 的发展，不过毕竟最基本的支持有了，现在使用 JUnit 5 已经简单得多了。

Eclipse 方面团队 [仍在着手于内置支持的开发](https://bugs.eclipse.org/bugs/show_bug.cgi?id=488566)。

### 构建工具的支持

JUnit 团队在为构建工具提供 JUnit 5 支持的基础上已经做了大量的工作，比如提供与 JUnit 4 的兼容等。目前，我们已经有了一个可以工作的 Gradle 插件和 Maven Surefire 插件。这两个项目都计划在接下来的时间里交给各自的社区去开发和维护。

在如何集成这两个构建工具（[Gradle](https://github.com/junit-team/junit5-samples/blob/master/junit5-gradle-consumer)和[Maven](https://github.com/junit-team/junit5-samples/tree/master/junit5-maven-consumer)）的插件上，已经各有一个示例代码库。更多细节请前往 [官方用户指南](http://junit.org/junit5/docs/5.0.0-M1/user-guide/#running-tests-build) 。

### 命令行支持也不赖

如果你觉得你就想静静地跑个测试，上面介绍的 IDE 和构建工具都太复杂了，那么建议你试下这个 [控制台 launcher](http://junit.org/junit5/docs/5.0.0-M1/user-guide/#running-tests-console-launcher)，它支持你直接在命令行运行测试。要使用它，请 [下载这个 zip 包](https://repo1.maven.org/maven2/org/junit/platform/junit-platform-console/1.0.0-M2/junit-platform-console-1.0.0-M2.zip)。

遗憾的是，它 [还需要你做些配置](https://github.com/junit-team/junit5/issues/155)，而非拿来即用的。你需要将上面提到的两个包 `junit-jupiter-api` 和 `junit-jupiter-engine` 移动到 `lib` 目录下，并编辑 `bin` 下执行脚本的 classpath 使其指向你的 `lib` 目录：`CLASSPATH=$APP_HOEM/lib/*`。这样该 launcher 才能运行。

不考虑其他依赖的话，这个执行脚本大概长得像这样：

```bash
# run all tests
junit-platform-console -p ${path_to_compiled_test_classes} -a
# run a specific test
junit-platform-console
	-p ${path_to_compiled_test_classes}
	org.codefx.demo.junit5.HelloWorldTest
```

## 向下兼容性

你可能注意到了，JUnit 5 启用了新的包名：`org.junit.jupiter`、`org.junit.platform` 和 `org.junit.vintage` （这个包我们尚未谈到）。我们[待会][JUnit 5: Architecture]再讨论它们的含义，现在我们只需知道，这意味着你可以在一个项目中使用不同的 JUnit 版本，这就够了。

允许在同个项目中使用多个版本的 JUnit 来进行测试，这使得你能缓缓迁移到 JUnit 5上。关于迁移，我们在探讨 [JUnit 新的架构][JUnit 5: Architecture] 时会再回顾这个话题。

通过异常（exceptions）于 JUnit 交互的测试库，诸如 Hamcrest 和 AssertJ 等，易燃可以在 JUnit 的新版本下工作。这里有个使用 Mockito 和 AssertJ 写的 [`HelloWorldTest`](https://github.com/CodeFX-org/demo-junit-5/blob/master/src/test/java/org/codefx/demo/junit5/HelloWorldTest.java) 测试，有兴趣的同学可以看下。

## 回顾

在这篇 JUnit 5 环境搭建的文章中，我们介绍了 `junit-jupiter-api` 和 `junit-jupiter-engine` 两个包，在项目中使用了 `junit-platform-runner` ，写了第一个最简单的测试用例，并将它作为 JUnit 4 测试套件的一部分运行了起来。

[下篇文章][JUnit 5: Basics] 我会讨论使用 JUnit 5 撰写测试的一些基础知识。


[User guide: M2]: http://junit.org/junit5/docs/5.0.0-M2/user-guide/
[User guide: Current]: http://junit.org/junit5/docs/current/user-guide/
[JUnit 5: Setup]: http://blog.linesh.tw/#/posts/2016-09-17-junit5-setup
[JUnit 5: Basics]: http://blog.linesh.tw/#/posts/2016-09-17-junit5-basics
[JUnit 5: Architecture]: http://blog.linesh.tw/#/posts/2016-09-17-junit5-architecture
[JUnit 5: Extension Model]: http://blog.linesh.tw/#/posts/2016-09-17-junit5-extension-model
[JUnit 5: Conditions]: http://blog.linesh.tw/#/posts/2016-09-17-junit5-conditions
[JUnit 5: Injection]: http://blog.linesh.tw/#/posts/2016-09-17-junit5-injection
[JUnit 5: Dynamic Tests]: http://blog.linesh.tw/#/posts/2016-09-17-junit5-dynamic-tests
