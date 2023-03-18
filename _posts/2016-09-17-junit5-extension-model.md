---
category: 翻译
tags: JUnit 5, unit test
title: 「译」JUnit 5 系列：扩展模型（Extension Model）
---

「译」JUnit 5 系列：扩展模型（Extension Model）

> 原文地址：[http://blog.codefx.org/design/architecture/junit-5-extension-model/](http://blog.codefx.org/design/architecture/junit-5-extension-model/)  
> 原文日期：11, Apr, 2016  
> 译文首发：[ Linesh 的博客：「译」JUnit 5 系列：扩展模型（Extension Model）](http://blog.linesh.tw/#/posts/2016-09-17-junit5-extension-model)  
> 我的 Github：[http://github.com/linesh-simplicity](http://github.com/linesh-simplicity)

## 概述

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

* JUnit 4 的扩展模型
    * Runners（运行器）
    * Rules（规则）
    * 现状
* JUnit 5 的扩展模型
    * 扩展点
    * 无状态
    * 应用扩展
    * 自定义注解
* 例子
* 回顾总结
* 分享&关注

「译者注：本篇的 Runner，统一译为“运行器”；Rule，统一译为“规则”。虽不一定完全达义，但语义未损失太多。在每小节第一次出现处会以中英标注，其后全部使用中文。」

## JUnit 4 的扩展模型

我们先来看看 JUnit 4 中是如何实现扩展的。在 JUnit 4 中实现扩展主要是通过两个，有时也互有重叠的扩展机制：运行器（Runners）和规则（Rules）。

### 运行器（Runners）

[测试运行器](https://github.com/junit-team/junit4/wiki/Test-runners)负责管理诸多测试的生命周期，包括它们的实例化、setup/teardown 方法的调用、测试运行、异常处理、发送消息等。在 JUnit 4 提供的运行器实现中，它负责了这所有的事情。

在 JUnit 4 中，扩展 JUnit 的唯一方法是：创建一个新的运行器，然后使用它标记你新的测试类：`@Runwith(MyRunner.class)`。这样 JUnit 就会识别并使用它来运行测试，而不会使用其默认的实现。

这个方式很重，对于小定制小扩展来说很不方便。同时它有个很苛刻的限制：一个测试类只能用一个运行器来跑，这意味着你不能组合不同的运行器。也即是说，你不能同时享受到两个以上运行器提供的特性，比如说不能同时使用 Mockito 和 Spring 的运行器，等。

### 规则（Rules）

为了克服这个限制，JUnit 4.7 中引入了[规则](https://github.com/junit-team/junit4/wiki/Rules)的概念，它是指测试类中特别的注解字段。 JUnit 4 会把测试方法（与一些其他的行为）包装一层传给规则。规则因此可以在测试代码执行前后插入，执行一些代码。很多时候在测试方法中也会直接调规则类上的方法。

这里有一个例子，展示的是 [temporary folder](http://junit.org/junit4/javadoc/latest/org/junit/rules/TemporaryFolder.html) （临时文件夹）规则：

```java
public static class HasTempFolder {
	@Rule
	public TemporaryFolder folder= new TemporaryFolder();
 
	@Test
	public void testUsingTempFolder() throws IOException {
		File createdFile= folder.newFile("myfile.txt");
		File createdFolder= folder.newFolder("subfolder");
		// ...
	}
}
```

因为 `@Rule` 注解的存在，JUnit 会先把测试方法 `testUsingTempFolder` 包装成一个可执行代码块，传给 `folder` 规则。这个规则的作用是执行时， 由 `folder` 创建一个临时目录，执行测试，测试完成后删除临时目录。因此，在测试内部可以放心地在临时目录下创建文件和文件夹。

当然还有其他的规则，比如允许你[在 Swing 的事件分发线程中执行测试](http://blog.schauderhaft.de/2010/08/15/use-cases-for-junit-rules/) 的规则，负责连接和断开数据库的规则，以及[让运行过久的测试直接超时](http://junit.org/junit4/javadoc/latest/org/junit/rules/Timeout.html)的规则等。

规则特性其实已经是个很大的改进了，不过仍有局限，它只能在测试运行之前或之后定制操作。如果你想在此之外的时间点进行扩展，这个特性也无能为力了。

### 现状

总而言之，在 JUnit 4 中存在两种不同的扩展机制，两者均各有局限，并且功能还有重叠的部分。在 JUnit 4 下编写干净的扩展是很难的事。此外，即使你尝试组合两种不同的扩展方式，通常也不会一帆风顺，有时它可能根本不按照开发者期望的方式工作。

![](http://7xqu8w.com1.z0.glb.clouddn.com/junit-5-extension-model.jpg)

## JUnit 5 的扩展模型

Junit Lambda 项目成立伊始便有几点[核心准则](https://github.com/junit-team/junit5/wiki/Core-Principles)，其中一条便是“扩展点优于新特性”。这个准则其实也就是新版本 JUnit 中最重要的扩展机制了——并非唯一，但无疑是最重要之一。

### 扩展点

JUnit 5 扩展可以声明其主要关注的是测试生命周期的哪部分。JUnit 5 引擎在处理测试时，它会依次检查这些扩展点，并调用每个已注册的扩展。大体来说，这些扩展点出现次序如下：

* 测试类实例 后处理
* BeforeAll 回调
* 测试及容器执行条件检查
* BeforeEach 回调
* 参数解析
* 测试执行前
* 测试执行后
* 异常处理
* AfterEach 回调
* AfterAll 回调

（如果上面有你觉得不甚清晰或理解的点，请不用担心，我们接下来会挑其中的一些来讲解。）

每个扩展点都对应一个接口。接口方法会接受一些参数，一些扩展点所处生命周期的上下文信息。比如，被测实例与方法、测试的名称、参数、注解等信息。

一个扩展可以实现任意个以上的接口方法，引擎会在调用它们时传入相应的上下文信息作为参数。有了这些信息，扩展就可以放心地实现所需的功能了。

### 无状态

这里我们需要考虑一个重要的细节：引擎对扩展实例的初始化时间、实例的生存时间未作出任何规约和保证，因此，扩展必须是无状态的。如果一个扩展需要维持任何状态信息，那么它必须使用 JUnit 提供的一个[仓库（store）](http://junit.org/junit5/docs/5.0.0-M1/api/org/junit/jupiter/api/extension/ExtensionContext.Store.html)来进行信息读取和写入。

这样做的原因有几个：

* 扩展的初始化时机和方式对引擎是未知的（每个测试实例化一次？每个类实例化一次？还是每次运行实例化一次？）。
* JUnit 不想额外维护和管理每个扩展创建的实例。
* 如果扩展之间想要进行通信，那么无论如何 JUnit 都必须提供一个数据交互的机制。

### 应用扩展

创建完扩展后，接下来需要做的就仅仅是告诉 JUnit 它的存在。这可以通过在需要使用该扩展的测试类或测试方法上添加一个 `@ExtendWith(MyExtension.class)` 简单实现。

其实，还有另一种更简明的方式。不过要理解那种方式，我们必须先看一下 JUnit 的扩展模型中还有哪些内容。

### 自定义注解

 JUnit 5 的 API 大部分是基于注解的，而且引擎在检查注解时还做了些额外的工作：它不仅会查找字段、类、参数上应用的注解，还会注解上的注解。引擎会把找到的所有注解都应用到被注解元素上。注解另一个注解可以通过所谓的[元注解](https://en.wikibooks.org/wiki/Java_Programming/Annotations/Meta-Annotations)做到，酷的是 Junit 提供的所有注解都说得上是元注解了。

它的意义在于，JUnit 5 中我们就能够创建并组合不同的注解了，并且它们具备组合多个注解特性的能力：

```java

/**
 * We define a custom annotation that:
 * - stands in for '@Test' so that the method gets executed
 * - has the tag "integration" so we can filter by that,
 *   e.g. when running tests from the command line
 */
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Test
@Tag("integration")
public @interface IntegrationTest { }
```

这个自定义的“集成测试”注解 `@IntegrationTest` 可以这样使用：

```java
@IntegrationTest
void runsWithCustomAnnotation() {
    // this gets executed
    // even though `@IntegrationTest` is not defined by JUnit
}
```

进一步我们可以为扩展使用更简明的注解：

```java
@Target({ ElementType.TYPE, ElementType.METHOD, ElementType.ANNOTATION_TYPE })
@Retention(RetentionPolicy.RUNTIME)
@ExtendWith(ExternalDatabaseExtension.class)
public @interface Database { }
```

现在我们可以直接使用 `@Database` 注解了，而不需要再声明测试应用了特定的扩展 `@ExtendWith(ExternalDatabaseExtension.class)`。并且由于我们把注解类型 `ElementType.ANNOTATION_TYPE` 也添加到扩展支持的目标类型中去了，因此该注解也可以被我们或他人进一步的使用、组合。

## 例子

假设现在有个场景，我想量化一下测试运行花费的时间。首先，可以先创建一个我们想要的注解：

```java
@Target({ TYPE, METHOD, ANNOTATION_TYPE })
@Retention(RetentionPolicy.RUNTIME)
@ExtendWith(BenchmarkExtension.class)
public @interface Benchmark { }
```

注解声明其应用了 `BenchmarkExtension` 扩展，这是我们接下来要实现的。TODOLIST 如下：

* 计算所有测试类的运行时间，在所有测试执行前保存其起始时间
* 计算每个测试方法的运行时间，在每个测试方法执行前保存其起始时间
* 在每个测试方法执行完毕后，获取其结束时间，计算并输出该测试方法的运行时间
* 在所有测试类执行完毕后，获取其结束时间，计算并输出所有测试的运行时间
* 以上操作，仅对所有注解了 `@BenchMark` 的测试类或测试方法生效

最后一点需求可能不是一眼便能发现。如果一个方法并未注解 `@Benchmark` 注解，它有什么可能被我们的扩展处理？ 一个语法上的原因是，如果一个扩展被应用到了一个类上，那么它默认也会应用到类中的所有方法上。因此，如果我们的需求是计算整个测试类的运行时间，但不需具体到类中每个单独方法的运行时间时，类中的测试方法就必须被手动排除。这点我们可以通过单独检查每个方法是否应用了注解来做到。

有趣的是，需求的前四点与扩展点中的其中四个是一一对应的：*BeforeAll*、*BeforeTestExecution*、*AfterTestExecution* 与 *AfterAll*。因此我们要做的任务便是实现这四个对应的接口。具体实现很简单，把上面说的翻译成代码即是：

```java
public class BenchmarkExtension implements
		BeforeAllExtensionPoint, BeforeTestExecutionCallback,
		AfterTestExecutionCallback, AfterAllExtensionPoint {
 
	private static final Namespace NAMESPACE =
			Namespace.of("BenchmarkExtension");
 
	@Override
	public void beforeAll(ContainerExtensionContext context) {
		if (!shouldBeBenchmarked(context))
			return;
 
		writeCurrentTime(context, LaunchTimeKey.CLASS);
	}
 
	@Override
	public void beforeTestExecution(TestExtensionContext context) {
		if (!shouldBeBenchmarked(context))
			return;
 
		writeCurrentTime(context, LaunchTimeKey.TEST);
	}
 
	@Override
	public void afterTestExecution(TestExtensionContext context) {
		if (!shouldBeBenchmarked(context))
			return;
 
		long launchTime = loadLaunchTime(context, LaunchTimeKey.TEST);
		long runtime = currentTimeMillis() - launchTime;
		print("Test", context.getDisplayName(), runtime);
	}
 
	@Override
	public void afterAll(ContainerExtensionContext context) {
		if (!shouldBeBenchmarked(context))
			return;
 
		long launchTime = loadLaunchTime(context, LaunchTimeKey.CLASS);
		long runtime = currentTimeMillis() - launchTime;
		print("Test container", context.getDisplayName(), runtime);
	}
 
	private static boolean shouldBeBenchmarked(ExtensionContext context) {
		return context.getElement()
				.map(el -> el.isAnnotationPresent(Benchmark.class))
				.orElse(false);
	}
 
	private static void writeCurrentTime(
			ExtensionContext context, LaunchTimeKey key) {
		context.getStore(NAMESPACE).put(key, currentTimeMillis());
	}
 
	private static long loadLaunchTime(
			ExtensionContext context, LaunchTimeKey key) {
		return (Long) context.getStore(NAMESPACE).remove(key);
	}
 
	private static void print(
			String unit, String displayName, long runtime) {
		System.out.printf("%s '%s' took %d ms.%n", unit, displayName, runtime);
	}
 
	private enum LaunchTimeKey {
		CLASS, TEST
	}
}

「译者：啊这代码让人心旷神怡。」
```

上面代码有几个地方值得留意。首先是 `shouldBeBenchmarked` 方法，它使用了 JUnit 的 API 来获取当前元素是否（被元）注解了 `@Benchmark` 注解；其次， `writeCurrentTime` / `loadLaunchTime` 方法中使用了 Junit 提供的 store 以写入和读取运行时间。

[源代码在 Github 上](https://github.com/CodeFX-org/demo-junit-5/tree/master/src/main/java/org/codefx/demo/junit5)可以找到。

下篇博文我会探讨条件执行的测试以及参数注入部分的内容，同时为你展示如何使用其对应的扩展点。如果你已经迫不及待了，那么请先参考[这篇博客](http://www.codeaffine.com/2016/04/06/replace-rules-in-junit5/)，它展示了将应用了两个规则（条件性禁用测试 及 临时目录）的 Junit 4 测试改装成 JUnit 5 测试的方法。

## 总结回顾

通过本文我们了解到，在创建整洁、强大及可组合的扩展上，JUnit 4 提供的运行器和规则特性不够理想。为了超越这些限制，JUnit 5 引入了一个更通用的概念：扩展点。它允许自定义的扩展主动声明，它需要在一个测试的什么节点上去介入。同时，我们还看到如何使用元注解来轻松地自定义注解。

我希望听到你的想法和反馈。

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
