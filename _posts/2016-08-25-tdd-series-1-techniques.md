---
title: TDD的迷思（一）：技艺篇
---

本章简要讨论使用TDD对软件开发所能带来的益处，给出了TDD作为一门技艺的修习技巧和手法。如还有篇幅~~心情和精力~~，会再讨论各处可能遇到的疑惑和解决方案。关于为什么要使用TDD、TDD的使用场景，请见本系列第二篇：意义篇；关于TDD的一些其他声音，请见本系列第三篇：撕逼篇。本篇讨论TDD使用Java作为编程语言。

## 从红绿循环说起

![](http://7xqu8w.com1.z0.glb.clouddn.com/tdd.png)

说起TDD，这个经典的红绿循环想必不陌生。简单来说，就是先根据需求，写一个会挂的测试，然后再写最小的实现代码实现它。必要的时候重构，不断重复这个过程直至需求完成、代码整洁。看似很简单，其中细节却很多。比如，从一个最基本的问题思考起：“需求”这么高层的概念，最终如何落实为一个具体的单元测试？这种对应关系从何而来？

### tasking

答案很简单，有鸿沟，就消除之。无非是通过大而化小、分而治之的方法：先将需求划分为多个较小的“功能/特性”（feature），再对这些粒度稍小的特性制定验收标准：一组或多组测试。这一（多）组测试都必须具有明确的输入和输出，有了输入和输出，对应下来恰好就是一个具体的测试用例。这个分而治之的过程，在TDD中就叫tasking。

tasking是将需求转化为可量化的单元测试的一种思维方式与方法论。在实际操作中，可能还有许多细节上的问题。以我的经验，逻辑顺序从上到下分别为：

1. 按照什么标准/依据来划分feature？
2. feature之间是否可能有依赖？若有，是否能有克服办法？若无，是否有方法论做到如此完美？
3. feature之间有无技术上的优先级？
4. 测试驱动与提前设计之间的关系。以不走极端的方式来讲，测试与设计都是需要的。那么设计什么时候进行？设计在TDD中所占比重，是否与开发者个人经验、信心，甚至需求类型均有关？

这些问题虽是细节，但细节处见功力。本小节先只回答如何将需求对应到一个个单元测试——即通过tasking——这个问题，至于操作细节如何处理，会在后面的小节讲解。下面我们要讲下一个问题：红绿循环。

### red-green-refactor

有了需求，有了单元测试，我们就可以进行红绿循环了。这个阶段又有两个细节上的问题，但回答却是开放的：

* 红-绿循环的步子？有时一两个单元测试，其实现差别可能就是一个`if-else`。我很有信心代码一定正确，此时我的TDD步子可以迈大一些么？
* 重构的时机是什么？我们说“必要的时候重构”，那么什么是必要的时候？

## 寻幽探微——TDD的深处

### feature的划分标准

尚未探索。说是要“正交”，至于怎么个正交法，我还需要研究。目前，我只能先回答，按照做事的逻辑顺序，凭直觉划分。

### feature间的依赖

假设我们已经tasking出来几个任务，那么任务之间的开发次序呢？假设任务A依赖于任务B，那么我们如何识别出这种依赖，并保证我们先实现任务A呢？答案是，**我们不需要提前识别依赖关系，单元测试只测试一个单元，与该单元无关的依赖可以mock掉**。

#### 举个简单的栗子：ThoughtWorks POS Machine练习

ThoughtWorks有一个[POS机练习](https://github.com/trotyl/pos-machine)，要求读入一些商品的信息，最后打印出一个小票。针对这个需求，我做的[tasking](https://github.com/linesh-simplicity/TDD-series-pos-machine/blob/master/TODOLIST.md)是这样的：

```markdown
* [ ] 读入商品信息(json -> [other format])
* [ ] 读入打折清单(json)
* [ ] 读入客户购买商品信息
* [ ] 进行优惠计算
   * [ ] 计算总价
   * [ ] 计算优惠
* [ ] 打印小票
```

这里有一个细节：**它按照一个逻辑上的顺序来task，而非按照具体的实现**（比如在MVC的架构下，把需求依照三层架构依样分出三个task等，不要怕跨层，不要怕全栈），这可以确保我们在task的时候尽量保持在同一个抽象层级，而不会陷入具体的实现细节。

> 扎爷：当然，熟悉了TDD的节奏以后，你可以游走在测试与实现之间没有挂碍，测试时想到实现细节，实现时想到测试。但这是进阶水平。

这里我认为业务价值最高的部分是能优惠与总价计算部分，因此我打算最先实现这个模块。不过问题来了，这个时候必要的依赖都还没有实现：商品对象尚未出现，拿不到总价；优惠列表尚未读入，拿不到商品应享优惠。这是不是意味着我们要放弃当前任务，先去实现读取优惠的模块？回答否定。优惠和总价计算模块，最核心的功能就是计算总价/优惠，商品对象怎么来，是否享用优惠，不是这个模块所关心的内容，可以mock掉。最后写出来的代码会是这样，只测我们这个模块的功能：

```java
	@Test
	public void should_return_60_cents_when_two_3_dollar_apple_offered_90_percent_discount() {
		Goods apple = new Goods("apple", 3.00);
		given(promotionManager.isProductOfferedPercentageDiscount(apple)).willReturn(true);
		
		double discount = calculator.calculateDiscount(2, apple);
		
		assertThat(discount, is(0.60));
	}
```

把握好这种节奏感：只测模块相关的内容，把外部的依赖mock掉。这很有利于我们聚焦于当前模块，进而有次序有节奏地完成系统的其他部分，而不会在TDD的过程迷失方向，不会出现诸如在controller测试中连接了真实的数据库、在service测试中同样调真实的数据库，或者在controller中真实地去调mapper等现象。

#### 真实的例子：一个典型Spring Boot + Spring MVC架构的REST风格的API调用

> 把最近项目上的需求包装一下，形成下面的例子。

假设你现在正在JetBrains下的Intellij IDEA团队工作，团队即将发布一个大版本的更新：2016.12.32.future，现在你们需要做一个quick start guide，数据可以全部由后端提供，前端只是负责简单的渲染。于是，现在后端需要向前端提供一个类似 `/idea/{version}/{category}` 格式的API，前端将用其渲染目录树。这个API的实现大概构思如下：

```java
@RestController
@RequestMapping("/idea")
public class DocumentationController {
	@Autowired private DocumentationService documentationService;
	@Autowired private ResponseMapper mapper;
	
	@RequestMapping(value = "{version}/{category}", method = GET)
	public Category getCategory(@PathVariable String version, @PathVariable category) {
		// 1. retrieve all topics under specific category of a specific version intellij from documentationService;
		// 2. map the retrieved json response to domain object;
		// 3. return the mapped object
	}
}
```

很显然，这个API要做的事就是：使用service从数据库中取回数据、使用mapper将取得的数据进行适当处理映射、返回映射后的对象，Spring会负责将我们的对象转换成json，这个不需我们操心。这里几乎涉及了一个正常的后端请求处理流程会过的所有层：控制器层、服务层、数据库层，还有一些mapping的工作，那么具体到我们这个controller，我们如何对它进行TDD呢？难道所有的层级我都要真实调用并确认结果才能保证安全感吗？难道所有的依赖我都得先去实现吗？很显然，这样我们就做成了集成测试，既会混淆我们真正的测试目标（控制器的逻辑），又会使得耗时比一般的单元测试高出10倍甚至百倍，影响开发体验。那么我们所说的测试目标——controller——它的功能是什么呢？稍加整理，不难发现，其实就是注释中提到的三个事情：

1. 确保使用正确的参数（version和category）调用了documentationService，并取得返回数据
2. 确保使用service返回的数据作为参数，调用了mapper对其进行转换，并得到一个对象
3. 确保返回了mapper转换得到的对象

很多时候这个地方我们容易迷惑的点，在于真的去调service，service又真的去连接数据库，真的去做mapping。但在控制器层，service是如何取得数据的、mapper又是如何处理返回数据的，其实现controller不需关心，controller自身的逻辑，其实只是组合手上的service和mapper，确保它们以特定的参数与次序被正确调用，并如实返回结果而已。有同学可能会有疑惑：关键功能都mock了~~我还测个毛啊~~这样的测试还有什么意义？没错，似乎service和mapper部分功能是真正涉及数据的，是核心功能，但我也没有说不去测service和mapper啊，相反，在service层和mapper我会采取相应的测试策略去对它们进行覆盖；那么，controller这层的测试有什么意义，读者不妨思考，下面这个测试中的一些断言如果去掉，其测试的内容变成了什么，是否可能有遗漏的点，加不加断言有什么区别：

```java
@Test
public void should_call_service_and_use_mapper_to_process_fetched_data_when_category_api_is_called() throws ...{
	given(documentationService.getCategory("4.2.4", "startguide")).willReturn(mockCategory);
	given(mapper.mapCategory(mockCategory)).willReturn(new Category().withName("startguide").topics("installation", "user-interface", "completion", "shortcuts");

	Category category = controller.getCategory("4.2.4", "startguide");
	
	verify(documentationService, times(1)).getCategory("4.2.4", "startguide");
	verify(mapper, times(1)).mapCategory(mockCategory);
	assertThat(category.getName(), is("startguide"));
	assertThat(category.getTopics(), is(/* installation, user-interface, completion, shortcuts */));
}
```

恭喜你，现在你成功地拿到了来自Intellij后端的返回，祝发布会一切顺利！！

```
/idea/4.2.4/startguide
{
	"version": "4.2.4", 
	"category": "startguide",
	"topics": [
		"installation", "user-interface", "completion", "shortcuts"
	]
}
```

### feature的优先级

有了前节讲解的mock技术，使用得当，我们可以从技术上解决几乎大部分依赖的问题。因此，我先实现哪个feature都是技术可行的。个人偏好，是优先实现从业务角度讲价值最大的feature。这个问题似乎比较开放，见仁见智。

### 测试驱动与提前设计

又是一个大的话题。也许我可以先邀请 @林波 @滕老板 来回答一下~>_<~我决定等我看过Kent Beck的《测试驱动开发》和滕老板译的《领域驱动设计》再来补这个坑。

### 红绿循环的步子——一个个写太慢了！

上面提出的迷惑是，我~~没有蛋，不怕扯着~~TDD的步子能迈大点儿不？我的回答是，当然可以。但前提是什么，是你对TDD这门技艺、节奏乃至于你要实现的代码都已经有了一定程度的掌握（foresee），你清楚自己处于什么阶段，清楚自己测了什么，没测什么，目标是什么。

### 重构的信号

这是一个好问题。我有一个自己的重构列表，尚在补充之中。目前简单说来，就两点：

* __硬编码常量__
* __重复代码__
* 其他《重构》一书中提到的味道

首先要弄清楚一个问题，重复代码中的重复意味着什么呢？存在重复的逻辑。因为这些代码在处理一些相同的事情。为什么要在编写下一个测试之前重构它？因为，测试代码与产品代码之间存在依赖关系，不可能改动其中一处时能够不改动另外一处。那么在编写下一个测试用例之前重构成功能尽可能单一的代码，就可能使下次测试用例所需要修改的代码量最少。这个道理，在业务加需求你回过来修改自己的代码时，感受最明显。

这个味道在你最小实现的时候必然会出现，那么必须保证你这坨代码工作完以后一定是干净的。同时，实践中在遗留代码上工作就不是这样的玩法了，此时我们可能需要先加测试再重构，当然这是后话，见后文与下篇。

硬编码常量如何消除呢？转换为变量。那么这个变量放在什么地方呢？无非三个地方，按出现频率与推荐程度从高到低依次为：

* 方法传入参数（parameter）
* 类字段/属性（field）
* 方法内变量（variable）

## 迷思——FAQ

### 概率与信心

啥？工程论里居然有概率？怎么听起来非常不靠谱？

### 遗留代码的TDD与重构

对于一个大型遗留项目的TDD与重构，请见本系列第二篇。
