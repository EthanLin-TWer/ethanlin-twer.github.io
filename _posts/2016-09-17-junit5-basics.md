---
category: 翻译
tags: JUnit 5, unit test
title: 「译」JUnit 5 系列：基础入门
---

上周我们刚刚[搭建好了 JUnit 5 的环境][JUnit 5: Setup]，现在我们可以写测试了。这节就让我们来写它几个吧！

> 原文地址：[http://blog.codefx.org/libraries/junit-5-basics/](http://blog.codefx.org/libraries/junit-5-basics/)  
> 原文日期：25, Feb, 2016  
> 译文首发：[ Linesh 的博客：「译」JUnit 5 系列：基础入门](http://blog.linesh.tw/#/posts/2016-09-17-junit5-basics)  
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

* 设计哲学
* JUnit 5预备：
    * 包可见性
    * 测试的生命周期
        * @Test
        * Before 和 After
        * 禁用测试
        * 测试类的生命周期
    * 断言
        * 常规断言
        * 扩展断言
    * 假言/判定（Assumptions）
    * 测试嵌套
    * 测试命名
* 回顾
* 分享&关注

## 设计哲学

新的[架构设计][JUnit 5: Architecture]（这个我们日后聊），其关注点在高扩展性。如果后面出现了什么神之测试技术（至少对我们广大 Java🐶来说很神的），它们也可能在 JUnit 5 的架构下被实现。

不过当前来说，涉及的基础知识与 JUnit 4 是非常相似的。JUnit 5 的改动并不激进，相反它的优化历程是小心翼翼，小步迭代的。因此，开发者应该会对新的 API 感到非常熟悉。至少我是这样的，我相信你也不会感觉陌生：

```java
class Lifecycle {
 
	@BeforeAll
	static void initializeExternalResources() {
		System.out.println("Initializing external resources...");
	}
 
	@BeforeEach
	void initializeMockObjects() {
		System.out.println("Initializing mock objects...");
	}
 
	@Test
	void someTest() {
		System.out.println("Running some test...");
		assertTrue(true);
	}
 
	@Test
	void otherTest() {
		assumeTrue(true);
 
		System.out.println("Running another test...");
		assertNotEquals(1, 42, "Why wouldn't these be the same?");
	}
 
	@Test
	@Disabled
	void disabledTest() {
		System.exit(1);
	}
 
	@AfterEach
	void tearDown() {
		System.out.println("Tearing down...");
	}
 
	@AfterAll
	static void freeExternalResources() {
		System.out.println("Freeing external resources...");
	}
 
}
```

是吧？这里并没有很大的改动。

## JUnit 5 预备

### 包可见性

 JUnit 5 最明显的变化应该是，不再需要手动将测试类与测试方法为 `public` 了。包可见的访问级别就足够了。当然，私有（private）访问还是不行的。我认为这个变化是合理的，也符合我们对可见性的一般直觉。

这很好！至少可以少打几个字母了。不过，我相信你也不是每次都手打这几个字母的，是吧？尽管如此还是很好，少一些关键字，你在看测试的时候也少些切换。

### 测试的生命周期

#### @Test

JUnit 中最基本的注解非 `@Test` 莫属了。它会标记方法为测试方法，以便构建工具和 IDE 能够识别并执行它们。

它的 API 和作用并没有变化，不过它不再接受任何参数了。若要测试是否[抛出异常](http://junit.org/junit4/javadoc/latest/org/junit/Test.html#expected%28%29)，你可以通过新的[断言 API ](http://blog.codefx.org/libraries/junit-5-basics/#assertions)来做到；不过就我所知，目前还没有[超时选项timeout](http://junit.org/junit4/javadoc/latest/org/junit/Test.html#timeout%28%29)的替代品。

与 JUnit 4一样，JUnit 5 会为每个测试方法创建一个新的实例。

#### Before 和 After

你可能需要执行一些代码来在测试执行前后完成一些初始化或销毁的操作。在 JUnit 5 中，有4个注解你可能会用于如此工作：

`@BeforeAll`  
只执行一次，执行时机是在所有测试和 `@BeforeEach` 注解方法之前。

`@BeforeEach`  
在每个测试执行之前执行。

`@AfterEach`  
在每个测试执行之后执行。

`@AfterAll`  
只执行一次，执行时机是在所有测试和 `@AfterEach` 注解方法之后。

因为框架会为每个测试创建一个单独的实例，在 `@BeforeAll`/`@AfterAll` 方法执行时尚无任何测试实例诞生。因此，这两个方法必须定义为静态方法。

注解了同样一个注解的不同方法，其执行次序是不可预知的，包括对继承来的方法也适用。这是开发团队经过审慎思考后的决定，即把单元测试与集成测试的关注点分开。集成测试可能需要方法间更紧密的协作，但一个单元测试不应该对其他的单元测试有所依赖。而对于集成测试——也叫场景测试——的支持，也[已在团队的计划中](https://github.com/junit-team/junit5/issues/48)。

除了名字有所不同，这几个注解与 JUnit 4 中的注解工作方式完全一样。[无独有偶](http://jasmine.github.io/2.1/introduction.html#section-Setup_and_Teardown)，[跟主流意见一致](https://www.relishapp.com/rspec/rspec-core/v/2-2/docs/hooks/before-and-after-hooks)，我也觉得这个新的命名不能说服我其必要性。[这个 issue](https://github.com/junit-team/junit5/issues/163) 下有更多的讨论。

#### 禁用测试

今儿星期五，抬头一看已经4点半，无心工作的你想回家了？完全理解，在测试上怒拍一个 `@Disabled` 注解即可。~~有良心的话~~写个忽略测试的理由是极好的，不过也可以不带此参数。

```java
@Test 
@Disabled("你丫就是存心跑不过的是不？！")
void failingTest() {
    assertTrue(false);
}
```

#### 测试类的生命周期

JUnit 团队发布的第一版原型中，包含了一个对 [测试类的生命周期](http://blog.codefx.org/libraries/junit-lambda-prototype/#Lifecycles) 的描述，有意思的是，这个特性在 alpha 版本的发布中未被加入。这个生命周期模型建议，在被测类的多个测试方法中使用一个同样的实例，因为这样我们就可以通过改变对象的状态，进而实现在多个测试方法中的交互。（我也再说一遍，这更像是 [场景测试](https://github.com/junit-team/junit5/issues/48) 要管的事。）

正如我在第一版公测时所说，这样的特性99%的场景下是有害的，只有另外1%的场合下才有真正的用处。我只能说，还好这个特性被摒弃了。想想你的单元测试，如果它们必须靠在方法间维护状态来工作，这画面简直太美我不敢看🙈。

### 断言

如果说 `@Test`、`@Before...`、`@After...` 等注解是一个测试套件的骨架，那么断言就是它的心脏。准备好测试实例、执行了被测类的方法以后，断言能确保你得到了想要的结果。否则，就说明当前测试失败了。

#### 常规断言

一般的断言，无非是检查一个实例的属性（比如，判空与判非空等），或者对两个实例进行比较（比如，检查两个实例对象是否相等）等。无论哪种检查，断言方法都可以接受一个字符串作为最后一个可选参数，它会在断言失败时提供必要的描述信息。如果提供出错信息的过程比较复杂，它也可以被包装在一个 lambda 表达式中，这样，只有到真正失败的时候，消息才会真正被构造出来。

```java

@Test
void assertWithBoolean() {
	assertTrue(true);
	assertTrue(this::truism);
 
	assertFalse(false, () -> "Really " + "expensive " + "message" + ".");
}
 
boolean truism() {
	return true;
}
 
@Test
void assertWithComparison() {
	List<String> expected = asList("element");
	List<String> actual = new LinkedList<>(expected);
 
	assertEquals(expected, actual);
	assertEquals(expected, actual, "Should be equal.");
	assertEquals(expected, actual, () -> "Should " + "be " + "equal.");
	
	assertNotSame(expected, actual, "Obviously not the same instance.");
}
```

如你所见，JUnit 5 的 API 并无太多变化。断言方法的命名是一样的，方法同样接受两个参数，分别是一个期望值与一个实际值。

期望值与实际值的传入顺序非常重要，无论是对于理解测试的内容，还是理解失败时的错误信息，但有时还是很容易弄错，这点很坑。不过仔细想想，也没什么更好的办法，除非你自己创建一个新的断言框架。既然市面上已有对应的产品如 [Hamcrest](http://hamcrest.org/JavaHamcrest/) (ugh!) 和 [AssertJ](http://joel-costigliola.github.io/assertj/) (yeah！译者表示：不太清楚这欢呼的梗在哪里)等，再浪费有限的时间去造轮子明显不值得。毕竟最重要的是保证你的断言库专注于一件事，借鉴已有实现可以节省成本。

哦对了，失败信息现在是作为最后传入的参数了。我很喜欢这个细节，因为，它让你专注于真正重要之事——那两个需被断言的值。由于拥抱了 Java 8 的缘故，真值断言方法现在也接受 [`supplier`](https://docs.oracle.com/javase/8/docs/api/java/util/function/BooleanSupplier.html) 参数了，又是一个暖心的小细节。

#### 扩展断言

除了那种一般的检查特定实例或属性的断言外，还有一些其他类型的断言。

这里要讲的第一个甚至都不是个真正的断言，它做的事就是强行让测试失败，并提供一个失败信息。

```java
@Test
void failTheTest() {
	fail("epicly");
}
```

还有 `assertAll` 方法，它接受可变数量的断言作为参数，并保证它们全部得到执行，然后再把错误信息（如果有）一并汇报出来。

```java
@Test
void assertAllProperties() {
	Address address = new Address("New City", "Some Street", "No");
 
	assertAll("address",
			() -> assertEquals("Neustadt", address.city),
			() -> assertEquals("Irgendeinestraße", address.street),
			() -> assertEquals("Nr", address.number)
	);
}
```

```
org.opentest4j.MultipleFailuresError: address (3 failures)
	expected: <Neustadt> but was: <New City>
	expected: <Irgendeinestraße> but was: <Some Street>
	expected: <Nr> but was: <No>
```

这个特性在检查对象的多个属性值时非常有用。按照一般的做法，测试在第一个断言失败时就会挂掉了，此时只有第一个出错的地方得到提示，而你无法得知其他值的断言是否成功，只好再跑一遍测试。

最后，我们终于有了 `assertThrows` 和 `expectThrows` 方法。两者均会在被测方法未抛出预期异常时失败。而后者还会返回抛出的异常实例，以用于后续的验证，比如，断言异常信息包含正确的信息等。

```java
@Test
void assertExceptions() {
	assertThrows(Exception.class, this::throwing);
 
	Exception exception = expectThrows(Exception.class, this::throwing);
	assertEquals("Because I can!", exception.getMessage());
}
```

### 假言/判定（Assumptions） 
假言/判定允许你仅在特定条件满足时才运行测试。这个特性能够减少测试组件的运行时间和代码重复，特别是在假言都不满足的情况下。

```java

@Test
void exitIfFalseIsTrue() {
	assumeTrue(false);
	System.exit(1);
}
 
@Test
void exitIfTrueIsFalse() {
	assumeFalse(this::truism);
	System.exit(1);
}
 
private boolean truism() {
	return true;
}
 
@Test
void exitIfNullEqualsString() {
	assumingThat(
			"null".equals(null),
			() -> System.exit(1)
	);
}
```

假言/判定适用于两种情形，要么是你希望在某些条件不满足时中止测试，要么是你希望仅当某个条件满足时才执行（部分）测试。主要的区别是，被中止的测试是以被禁用（disabled）的形式被报告，此时没有测试任何内容，因为条件得不到满足。

### 测试嵌套

在 JUnit 5 中，嵌套测试几乎不费吹灰之力。你只需要在嵌套的类上添加 `@Nested` 注解，类中的所有方法即会被引擎执行：

```java

package org.codefx.demo.junit5;
 
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
 
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
 
class Nest {
	
	int count = Integer.MIN_VALUE;
	
	@BeforeEach
	void setCountToZero() {
		count = 0;
	}
	
	@Test
	void countIsZero() {
		assertEquals(0, count);
	}
	
	@Nested
	class CountGreaterZero {
 
		@BeforeEach
		void increaseCount() {
			count++;
		}
 
		@Test
		void countIsGreaterZero() {
			assertTrue(count > 0);
		}
 
		@Nested
		class CountMuchGreaterZero {
 
			@BeforeEach
			void increaseCount() {
				count += Integer.MAX_VALUE / 2;
			}
 
			@Test
			void countIsLarge() {
				assertTrue(count > Integer.MAX_VALUE / 2);
			}
 
		}
 
	}
	
}
```

如你所见，嵌套类中的 `@BeforeEach`（及 `@AfterEach` ）注解也工作良好。不过，构造顺序似乎还未被写入文档，它们的初始化次序是从外向内的。这也让你能叠加式地为内部类准备测试数据。

如果嵌套的内部测试想要存取外部测试类的字段，那么嵌套类本身不应该是静态的。但这样一来也就禁止了静态方法的使用，因而这种场景下`@BeforeAll` 和 `@AfterAll` 方法也就无法使用了（[还是说终有他法实现？](https://github.com/junit-team/junit5/issues/166)）

你可能有疑惑，嵌套的内部测试类有什么用。个人而言，我用内部类来[渐进测试接口](https://github.com/CodeFX-org/LibFX/blob/3ec42447a99cbac33642cef35d0e522f7b595435/src/test/java/org/codefx/libfx/collection/tree/stream/StackTreePathTest.java)，其他人则多用于保持测试类[短小专注](http://www.petrikainulainen.net/programming/testing/writing-clean-tests-small-is-beautiful/)。后者同时也有一个经典的例子来说明，[例子由 JUnit 团队提供](https://junit-team.github.io/junit5/#nested-tests)，它测试了一个栈：

```java
class TestingAStack {
 
    Stack<Object> stack;
    boolean isRun = false;
 
    @Test
    void isInstantiatedWithNew() {
        new Stack<Object>();
    }
 
    @Nested
    class WhenNew {
 
        @BeforeEach
        void init() {
            stack = new Stack<Object>();
        }
 
        // some tests on 'stack', which is empty
 
        @Nested
        class AfterPushing {
 
            String anElement = "an element";
 
            @BeforeEach
            void init() {
                stack.push(anElement);
            }
 
            // some tests on 'stack', which has one element...
 
        }
    }
}
```

在上面的例子中，栈的状态改变会反映到内层的测试类中，其中内部类又基于自身的场景执行了一些测试。

### 测试命名

JUnit 5 提供了一个注解 `@DisplayName`，它用以为开发者提供更可读的测试类和测试方法信息。

上面的 stack 测试例子加上该注解以后就变成这样：

```java
@DisplayName("A stack")
class TestingAStack {
 
    @Test
    @DisplayName("is instantiated with new Stack()")
    void isInstantiatedWithNew() { /*...*/ }
 
    @Nested
    @DisplayName("when new")
    class WhenNew {
 
        @Test
        @DisplayName("is empty")
        void isEmpty() { /*...*/ }
 
        @Test
        @DisplayName("throws EmptyStackException when popped")
        void throwsExceptionWhenPopped() { /*...*/ }
 
        @Test
        @DisplayName("throws EmptyStackException when peeked")
        void throwsExceptionWhenPeeked() { /*...*/ }
 
        @Nested
        @DisplayName("after pushing an element")
        class AfterPushing {
 
            @Test
            @DisplayName("it is no longer empty")
            void isEmpty() { /*...*/ }
 
            @Test
            @DisplayName("returns the element when popped and is empty")
            void returnElementWhenPopped() { /*...*/ }
 
            @Test
            @DisplayName(
                    "returns the element when peeked but remains not empty")
            void returnElementWhenPeeked(){ /*...*/ }
        }
    }
}
```

这是一份TDDer 看了会感动，[BDD](http://dannorth.net/introducing-bdd/)er 看了会流泪的测试结果输出。

![](http://7xqu8w.com1.z0.glb.clouddn.com/junit-5-basics-testing-a-stack.png)


## 回顾

差不多就这些了，恭喜你终于读完了。我们匆匆过完了 JUnit 5 的基本特性，现在，你应该了解了所有写测试的必备知识了：包括如何为方法添加生命周期注解（`@[Before|After][All|Each]`、如何注解测试方法本身（`@Test`）、如何嵌套测试（`@Nested`）、如何给测试一个好信息（`@DisplayName`），你也应该能了解断言和假言判定是如何工作的了（基本上与前版无异）。

不过这可还没完！我们还没聊到 [测试方法的条件执行][JUnit 5: Conditions]，没聊到非常酷的 [参数注入][JUnit 5: Injection] ，以及 [JUnit 5 的扩展机制][JUnit 5: Extension Model] 和 [架构体系][JUnit 5: Architecture] 呢。放心，这真的是最后了，这些话题我们会一个月后再聊，现在你可以先休息一下啦。

敬请期待下集！

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
