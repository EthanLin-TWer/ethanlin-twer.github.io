---
category: 翻译
tags: JUnit 5, unit test
title: 「译」JUnit 5 系列：条件测试
---

上一节我们了解了 JUnit 新的[扩展模型][JUnit 5: Extension Model]，了解了它是如何支持我们向引擎定制一些行为的。然后我还预告会为大家讲解条件测试，这一节主题就是它了。

> 原文地址：[http://blog.codefx.org/libraries/junit-5-conditions/](http://blog.codefx.org/libraries/junit-5-conditions/)  
> 原文日期：08, May, 2016  
> 译文首发：[ Linesh 的博客：「译」JUnit 5 系列：条件测试](http://blog.linesh.tw/#/posts/2016-09-17-junit5-conditions)  
> 我的 Github：[http://github.com/linesh-simplicity](http://github.com/linesh-simplicity)

条件测试，指的是允许我们自定义灵活的标准，来决定一个测试是否应该执行。条件（condition） 官方的叫法是[条件测试执行](http://junit.org/junit5/docs/current/user-guide/#conditional-test-execution)。

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

* 相关的扩展点
* 动手实现一个@Disabled 注解
* @DisabledOnOs
    * 一种简单的实现方式
    * 更简洁的API
    * 代码重构
* @DisabledIfTestFails
    * 异常收集
    * 禁用测试
    * 集成
* 回顾总结
* 分享&关注

## 相关的扩展点

还记得 [拓展点][JUnit 5: Extension Model] 一节讲的内容吗？不记得了？好吧，简单来说，JUnit 5 中定义了许多扩展点，每个扩展点都对应一个接口。你自己的扩展可以实现其中的某些接口，然后通过 `@ExtendWith` 注解注册给 JUnit，后者会在特定的时间点调用你的接口实现。

要实现条件测试，你需要关注其中的两个扩展点： `ContainerExecutionCondition` （容器执行条件）和 `TestExecutionCondition` （测试执行条件）。

```java
public interface ContainerExecutionCondition extends Extension {
 
	/**
	 * Evaluate this condition for the supplied ContainerExtensionContext.
	 *
	 * An enabled result indicates that the container should be executed;
	 * whereas, a disabled result indicates that the container should not
	 * be executed.
	 *
	 * @param context the current ContainerExtensionContext; never null
	 * @return the result of evaluating this condition; never null
	 */
	ConditionEvaluationResult evaluate(ContainerExtensionContext context);
 
}
 
public interface TestExecutionCondition extends Extension {
 
	/**
	 * Evaluate this condition for the supplied TestExtensionContext.
	 *
	 * An enabled result indicates that the test should be executed;
	 * whereas, a disabled result indicates that the test should not
	 * be executed.
	 *
	 * @param context the current TestExtensionContext; never null
	 * @return the result of evaluating this condition; never null
	 */
	ConditionEvaluationResult evaluate(TestExtensionContext context);
 
}
```

`ContainerExecutionCondition` 接口将决定容器中的测试是否会被执行。通常情况下，你使用 `@Test` 注解来标记测试，此时测试所在的类就是容器。同时，单独的测试方法是否执行则是由 `TestExecutionCondition` 接口决定的。

（这里，我说的是“通常情况下”，因为其他[测试引擎][JUnit 5: Architecture]可能对容器和测试有截然不同的定义。但一般情况下，测试就是单个的方法，容器指的就是测试类。）

嗯，基本知识就这么多。想实现条件测试，至少需要实现以上两个接口中的一个，并在接口的 `evalute` 方法中执行自己的条件检查。

## 动手实现一个@Disabled 注解

最简单的“条件”就是判断都没有，直接禁用测试。如果在方法上发现了 `@Disabled` 注解，我们就直接禁用该测试。

让我们来写一个这样的 `@Disabled` 注解吧：

```java
@Target({ ElementType.TYPE, ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
@ExtendWith(@DisabledCondition.class)
public @interface Disabled { }
```

对应的扩展如下：

```java
public class DisabledCondition
		implements ContainerExecutionCondition, TestExecutionCondition {
 
	private static final ConditionEvaluationResult ENABLED =
			ConditionEvaluationResult.enabled("@Disabled is not present");
 
	@Override
	public ConditionEvaluationResult evaluate(
			ContainerExtensionContext context) {
		return evaluateIfAnnotated(context.getElement());
	}
 
	@Override
	public ConditionEvaluationResult evaluate(
			TestExtensionContext context) {
		return evaluateIfAnnotated(context.getElement());
	}
 
	private ConditionEvaluationResult evaluateIfAnnotated(
			Optional<AnnotatedElement> element) {
		Optional<Disabled> disabled = AnnotationUtils
				.findAnnotation(element, Disabled.class);
 
		if (disabled.isPresent())
			return ConditionEvaluationResult
					.disabled(element + " is @Disabled");
 
		return ENABLED;
	}

}
```

写起来小菜一碟吧？在 JUnit [真实的产品代码](https://github.com/junit-team/junit5/blob/9e846af07b1941c50f34da733584b9d0664ec968/junit5-engine/src/main/java/org/junit/gen5/engine/junit5/extension/DisabledCondition.java)中，`@Disabled` 也是这么[实现的](https://github.com/junit-team/junit5/blob/9e846af07b1941c50f34da733584b9d0664ec968/junit5-engine/src/main/java/org/junit/gen5/engine/junit5/extension/DisabledCondition.java)。不过，有两个地方有一些细微的差别：

* 官方 `@Disabled` 注解不需要再使用 `@ExtendWith` 注册扩展，因为它是默认注册了的
* 官方 `@Disabled` 注解可以接收一个参数，解释测试被忽略的理由。它会在测试被忽略时被记录下来

使用时请注意，`AnnotationUtils` 是个内部 API。不过，官方[可能很快](https://github.com/junit-team/junit5/issues/246)就会将它提供的功能给[开放出来](https://github.com/junit-team/junit5/issues/246)。

接下来让我们写点更有意思的东西吧。

## @DisabledOnOs

如果有些测试我们只想让它在特定的操作系统上面运行，这个要怎么实现呢？

### 一种简单的实现方式

当然，我们还是从注解开始咯：

```java
@Target({ ElementType.TYPE, ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
@ExtendWith(OsCondition.class)
public @interface DisabledOnOs {
 
	OS[] value() default {};
 
}
```

这回注解需要接收一个或多个参数值，你需要告诉它想禁用测试的操作系统有哪些。 `OS` 是个枚举类，定义了所有操作系统的名字。同时，它还提供了一个静态的 `static OS determine()` 方法，你可能已经从名字猜到了，它会推断并返回你当前所用的操作系统。

现在我们可以着手实现 `OsCondition` 扩展类了。它必须检查两点：注解是否存在，以及当前操作系统是否在注解声明的禁用列表中。

```java
public class OsCondition 
		implements ContainerExecutionCondition, TestExecutionCondition {
 
	// both `evaluate` methods forward to `evaluateIfAnnotated` as above
 
	private ConditionEvaluationResult evaluateIfAnnotated(
			Optional<AnnotatedElement> element) {
		Optional<DisabledOnOs> disabled = AnnotationUtils
				.findAnnotation(element, DisabledOnOs.class);
 
		if (disabled.isPresent())
			return disabledIfOn(disabled.get().value());
 
		return ENABLED;
	}
 
	private ConditionEvaluationResult disabledIfOn(OS[] disabledOnOs) {
		OS os = OS.determine();
		if (Arrays.asList(disabledOnOs).contains(os))
			return ConditionEvaluationResult
					.disabled("Test is disabled on " + os + ".");
		else
			return ConditionEvaluationResult
					.enabled("Test is not disabled on " + os + ".");
	}

}
``` 

然后使用的时候就可以像这样：

```java
@Test
@DisabledOnOs(OS.WINDOWS)
void doesNotRunOnWindows() {
    assertTrue(false);
}
```

棒。

### 更简洁的API

但代码还可以写得更好！[JUnit 的注解是可组合的](http://blog.codefx.org/design/architecture/junit-5-extension-model/#Custom-Annotations)，基于此我们可以让这个条件注解更简洁：

```java
@TestExceptOnOs(OS.WINDOWS)
void doesNotRunOnWindowsEither() {
	assertTrue(false);
}
```

`@TestExceptionOnOs`完美的实现方案是这样的：

```java
@Retention(RetentionPolicy.RUNTIME)
@Test
@DisabledOnOs(/* 通过某种方式取得注解下的 `value` 值 */)
public @interface TestExceptOnOs {
 
	OS[] value() default {};
 
}
```

测试实际运行时， `OsCondition::evaluateIfAnnotated` 方法会扫描 `@DisabledOnOs` 注解，然后我们发现它又是对 `@TestExceptOnOs` 的注解，前面写的代码就可以如期工作了。但我不知道如何在 `@DisabledOnOs` 注解中获取 `@TestExceptOnOs` 中的`value()`值。:(（你能做到吗？）

次佳的选择是，简单地在 `@TestExceptOnOs` 注解上直接声明应用的扩展就可以了：

```java
@Retention(RetentionPolicy.RUNTIME)
@ExtendWith(OsCondition.class)
@Test
public @interface TestExceptOnOs {
 
	OS[] value() default {};
 
}
```

然后直接把 `OsCondition:evaluateIfAnnotated` 方法拉过来改改即可：

```java
private ConditionEvaluationResult evaluateIfAnnotated(
        Optional<Annotatedelement> element) {
    Optional<DisabledOnOs> disabled = AnnotationUtils
        .findAnnotation(element, DisabledOnOs.class);
    if (disabled.isPresent()) 
        return disabledIfOn(disabled.get().value());
        
    Optional<TestExceptOnOs> testExcept = AnnotationUtils
        .findAnnotation(element, TestExceptOnOs.class);
    if (testExcept.isPresent()) 
        return disabledIfOn(testExcept.get().value());
            
    return ConditionEvaluationResult.enabled("");
}
```

收工。现在我们可以如期使用这个注解了。

### 代码重构

我们还需要创建一个意义刚好相反的注解（即现在变为，当前操作系统不在提供列表时，才禁用测试），工作是类似的，但是注解名会更表意，再加入静态导入后，我们的代码最终可以整理成这样：

```java
@TestOn(WINDOWS)
void doesNotRunOnWindoesEither() {
    assertTrue(false);
}
```

还挺好看的，是不？

![](http://7xqu8w.com1.z0.glb.clouddn.com/junit-5-conditions.jpg)

「译者注：英文中condition有多个意思：“条件；空调”。作者这里配图取双关」

## @DisabledIfTestFails

我们再考虑一种场景——我保证这次可以接触更有意思的东西！假设现在有许多（集成）测试，如果其中有一个抛出了特定的异常而失败，那么其他测试也必须会挂。为了节省时间，我们希望在这种情况下直接禁用掉其他的测试。

那么我们需要做些什么工作呢？首先第一反应不难想到，我们 必须先能收集测试执行过程抛出的异常。这肯定需要在单个测试类级别的生命周期中进行处理，否则就可能因为其他测试类中抛出的异常而影响到本测试类的运行。其次，我们需要一个实现一个条件：它会检查某个特定的异常是否已被抛出过，若是，禁用当前测试。

### 异常收集

翻阅一下文档中提供的 [扩展点列表](http://blog.codefx.org/design/architecture/junit-5-extension-model/#Extension-Points)，不难发现有一项“异常处理”，看起来就是我们想要的东西：

```java
/**
 * TestExecutionExceptionHandler defines the API for Extensions that wish to react to thrown exceptions in tests.
 * 
 * [ ... ]
 */
public interface TestExecutionExceptionHandler extends ExtensionPoint { 
    /**
     * Handle the supplied throwable.
     * 
     * Implementors must perform one of the following.
     * 
     * - Swallow the supplied throwable, thereby preventing propagation
     * - Rethrow the incoming throwable as is 
     * - Throw a new exception, potenially wrapping the supplied throwable 
     *  
     * [ ... ]
     */
    void handleTestExecutionException(
        TestExtensionContext context, Throwable throwable) 
        throws Throwable;    
}
```

读完发现，我们的任务就是实现 `handleException` 方法，存储起接收到的异常并重新抛出。

你可能还记得我提过的关于扩展点和无状态的一些结论：

> 引擎对扩展实例的初始化时间、实例的生存时间未作出任何规约和保证，因此，扩展必须是无状态的。如果一个扩展需要维持任何状态信息，那么它必须使用 JUnit 提供的一个仓库（store）来进行信息读取和写入。

看来我们是必须使用这个 store 了。store 其实就是存放我们希望保存的一些东西，一个可索引的资源集合。它可以在扩展上下文对象中取得，后者会被传给大多数扩展点接口方法作为参数。不过需要注意的是，每个不同的上下文对象都有自己一个独立的 store，所以我们还必须决定使用哪个 store。

每个测试方法有一个自己的上下文对象（`TestExtensionContext`），同时，测试类也有一个自己的上下文对象（`ContainerExtensionContext`）。还记得我们的需求吗？保存测试类中任何测试方法可能抛出的异常，仅此而已。也即，我们不会保存其他测试类中抛出的异常。这样一来，容器级别的上下文 `ContainerExtensionContext` 刚好就是我们需要的了。

接下来，我们可以使用这个容器上下文，通过它来存储所有测试过程抛出的异常：

```java
private static final Namespece NAMESPACE = Namespace
    .of("org", "codefx", "CollectExceptions");
private static final String THROWN_EXCEPTIONS_KEY = "THROWN_EXCEPTION_KEY";

@SuppressWarnings("unchecked")
private static Set<Exception> getThrown(ExtensionContext context) {
    ExtensionContext containerContext = getAncestorContainerContext(context)
        .orElseThrow(IllegalStateException::new);
    retrun (Set<Exception>) containerContext
        .getStore(NAMESPACE)
        .getOrComputeIfAbsent(
            THROWN_EXCEPTIONS_KEY,
            ignoredKey -> new HashSet<>());
}

private static Optional<ExtensionContext> getAncestorContainerContext(
        ExtensionContext context) {
    Optional<ExtensionContext> containerContext = Optional.of(context);
    while (containerContext.isPresent()) 
            && !(containerContext.get() instanceof ContainerExtenstionContext)) 
        containerContext = containerContext.get().getParent();
    return containerContext;
}
```

现在存储一个异常就非常简单了：

```java
@Override
public void handleException(TestExtensionContext context, Throwable throwable) 
        throws Throwable {
    if (throwable instanceof Exception) {
        getThrown(context).add((Exception) throwable);
    throw throwable;
```

有意思的是，这个扩展还是自扩展的，没准还可以用来做数据统计呢「译者注：这句不太理解，原文 This is actually an interesting extension of its own. Maybe it could be used for analytics as well.」。不管怎样，我们需要一个public方法来拿到已抛出的异常列表：

```java
public static Stream<Exception> getThrownExceptions(
        ExtensionContext context) {
    return getThrown(context).stream();
}    
```

有了这个方法，其他的扩展就可以检查至今为止所抛出的异常列表了。

### 禁用测试

禁用测试的部分与前节所述十分类似，我们可以很快写出代码：

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@ExtendWith(DisabledIfTestFailedCondition.class)
public @interface DisabledIfTestFailedWith {

    Class <? extends Exception>[] value() default {};

}
```

注意，现在仅允许该注解被用在测试方法上。应用在测试类上也说得过去，不过我们现在先不把它复杂化。因此我们只需要实现接口`TestExecutionCondition`即可。我们先检查注解是否存在，若是，再拿到用户提供的异常类作为参数，调用 `disableIfExceptionWasThrown`。

```java
private ConditionEvaluationResult disableIfExceptionWasThrown(
        TestExtensionContext context,
        Class<? extends Exception>[] exceptions) {
    return Arrays.stream(exceptions)
            .filter(ex -> wasThrown(context, ex))
            .findAny().
            .map(thrown -> ConditionEvaluationResult.disabled(
                    thrown.getSimpleName() + "was thrown."))
            .orElseGet(() -> ConditionEvaluationResult.enabled(""));
}

private static boolean wasThrown(
        TestExtensionContext context, Class<? extends Exception> exception) {
    return CollectExceptionExtension.getThrownExceptions(context)
            .map(Object::getClass)
            .anyMatch(exception::isAssignableFrom);
}    
```

### 集成

至此为止需求完成。现在我们可以使用这个注解，在某个特定类型的异常抛出时禁用测试了：

```java
@CollectExceptions
class DisabledIfFailsTest {
    
    private static boolean failedFirst = false;
    
    @Test
    void throwException() {
        System.out.println("I failed!");
        failedFirst = true;
        throw new RuntimeException();
    }
    
    @Test
    @DisabledIfTestFailedWith(RuntimeException.class)
    void disableIfOtherFailedFirst() {
        System.out.println("Nobody failed yet! (Right?)");
        assertFalse(failedFirst);
    }
    
}
```

## 回顾总结

哇哦，本篇的代码还挺多的！不过相信到此你已经能完全理解怎么在 JUnit 5 中实现条件测试了：

* 创建一个注解，并使用 `@ExtendWith` 注解它，然后提供你自己实现的条件类
* 实现 `ContainerExecutionCondition` 或/和 `TestExecutionCondition`
* 检查测试类上是否应用了你新创建的注解
* 检查特定条件是否实现，并返回结果

除此以外，我们还看到注解之间可以组合，学到如何使用 JUnit 提供的 store 来保存数据，以及一个扩展的实现，如何通过自定义注解的加入变得更加优雅。

更多关于 ~~[旗帜](https://www.youtube.com/watch?v=_e8PGPrPlwA)~~ 扩展点的故事「译者注：原文为more fun with ~~flag~~ extension points，more fun with flags 是生活大爆炸中谢耳朵讲国旗的故事一部」，请参考下篇文章，我们会探讨关于参数注入的问题。

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
