---
description: 一份较完整的Spring MVC部分的翻译文档，请戳mvc.linesh.tw
title: Spring MVC官方文档翻译稿发布
---

这份翻译终于大概可以发布第一版可读的原型。几天在国内一些网站推广了一下，有点分散，于是决定在大本营这里放一份完整的发布稿，相当于是官方声明了，哈哈。既然是官方声明，那么官方这里倒是可以给点bouns，说说翻译过程的想法，以及最近一些情况。

首先以下是发表在[OSC](http://my.oschina.net/u/1581831/blog/700769)/[CSDN](http://blog.csdn.net/codecleaner/article/details/51758452)/[Iteye](http://sodagreen-simplicity.iteye.com/admin/blogs/2307252)/[博客园](http://www.cnblogs.com/natasha-yarovenko/p/5616369.html)/[掘金](https://gold.xitu.io/entry/576e56962e958a00572bdb38/detail)/[v2ex](http://www.v2ex.com/t/288717#reply34)/[segmentfault](https://segmentfault.com/a/1190000005854194)/[Githuber](http://ask.githuber.cn/t/spring-mvc-4-2-4-release/1539/1)上的原文。


> ![](http://7xqu8w.com1.z0.glb.clouddn.com/spring-logo.png)
>
> 前后经过九个月，我翻译的Spring MVC官方4.2.4版本中文文档可以发布第一个较为完整的版本了。译文上尽量做到准确并且符合中文习惯，让人能读懂，能理解。现全文发布如下，也希望它能够给出其价值，并收到反馈。
>
> * 七牛主站：[mvc.linesh.tw](http://mvc.linesh.tw)
> * 备份镜像：[一个奇怪的域名](http://7xvpsh.com1.z0.glb.clouddn.com/)（主站不稳定时使用）
> * [Gitbook原站](https://linesh.gitbooks.io/spring-mvc-documentation-linesh-translation/content/)（墙内访问较慢，且不太稳定）
>
> 阅读过程任何想法、建议、吐槽、强迫症~~不给译者狂点100个赞就浑身不舒服~~、觉得赞、觉得不赞，无论关于翻译、技术、样式等，请让我知道。你可以：
>
> * [来Github赞我~~被消费一个~~](https://github.com/linesh-simplicity/translation-spring-mvc-4-documentation)
> * 在Gitbook讨论里[给我留言](https://www.gitbook.com/book/linesh/spring-mvc-documentation-linesh-translation/discussions)
> * 在Github里给这个项目提[issue](https://github.com/linesh-simplicity/gitbook-translation-spring-mvc-documentation/issues)
> * 在Github里给这个项目提[pull request](https://github.com/linesh-simplicity/translation-spring-mvc-4-documentation/pulls)
> * [在文档上进行即时评论](http://mvc.linesh.tw)：在gitbook文档上，鼠标划过任何段落右侧，浮现`+`号时点击即可评论
> * 邮箱：linesh.simpcity@gmail.com
>
> ![](http://7xqu8w.com1.z0.glb.clouddn.com/spring-mvc-documentation-translation-project-snapshot.png)
>
> ## 翻译过程，文本无关的思考
>
> 在翻译上仍在摸索，有自己的想法，体现到译本中，读者也许可以发现一些痕迹。这种种理念，如果要排个优先级，那么我觉得是：
>
> 1. 符合中文习惯。看起来像机翻不能要，名词乱翻误导读者不能要，长句复杂句太多不能要
> 2. 准确传达原意。这点原本是最重要的，但让位于符合中文习惯，是因为如果译本有机翻痕迹，给人的品质感和可信度就降低了
> 3. 更准确和更优雅的翻译风格。
>
> 软件开发的脚步一直在前进。发展尤其火和快的应数前端，各式样的MV*框架（Angular/React/Vue.js）、包管理（npm/bower）、构建工具（webpack/gulp/grunt）不胜其数，展示了前端所见即所得的强大魅力。与这股前后端分离趋势相适应的呢，后端也在提RESTful、MicroService这些东西。我对后端感兴趣，也希望能克服一些不舒适去学习前端的东西，一些UI实在使人愉悦。
>
> 另外呢，翻译和推广翻译又是两回事。翻译的时候自然希望译文受到大家喜欢和关注，但昨天在各大平台推广的时候呢，又发现什么样的题目和图片能更吸引读者眼球。后端在社群里相对前端确实没有那么可视化，很多模式、框架、架构等讨论起来流于文字，要是还不注重UI和representation的话，确实光看到题目就直接pass掉了。在活跃的社区呢，也看到了一些现象，大家现在想要看什么东西？
>
> * 从Android代码中来记忆23种设计模式
> * 15款你可能不知道的精致Mac应用
> * 100个弹框设计小结
> * 5款高效的原型设计工具
> * [Android名企面试题及涉及知识点整理](https://github.com/Mr-YangCheng/ForAndroidInterview)
>
> 资源太过丰富，导致我们学习浅尝辄止，这已经是一个许多人提过的问题。看到有人为我们总结了几点几点，一下就看完了，或者集合了什么资源，下意识点个赞，收藏一下（特别是还有这种[收藏插件](https://chrome.google.com/webstore/detail/better-bookmark/pniopfmciclllcpockpkgceikipiibol)），就完了。点赞收藏的成本很低，但这样确定不是在朝着抵抗力最低的路径在走吗？不是在放弃自己思考的权利么？难道不是在成为被平台消费的用户？看完了这些东西，我真的就提高了吗？
>
> 我反省的恰是这个。Bob Martin在《程序员的自我修养》一书中说，“那些在过去50年中来之不易的理念，绝大部分在今天仍像过去一样富有价值，甚至宝贵了”。在翻译的过程，我对MVC和Spring所提供的AOP、IOC、设计模式，以及Servlet 3.0规范一些东西，感觉有深挖的价值。里面是一些更为根本的代码功底和工程理念，非表层框架变迁所及。
>
> 推广之初，本是希望这个译本能被多多star，反省及此，又希望自己不要被消费，同时希望各位不要被我所消费。什么是有有益的，什么是自己需要的，什么工具能让自己更有效率，就去看，去用。其余形式应无所住。
>
> 以上。如此译本亦将脱离我而去。
>
> -- 2016年06月28日

这个翻译项目从2015年9月份最早开始，中间停产了3个月，端端续续更新了1个月后，中间又停产了3个月左右，后来不知道为什么，又产生了坚持下去的偏执。所以最主要的部分都是半个月前翻出来的。这样的作息严格来说其实不太健康，不过最近一段时间在技术学习选择上出现了一点小迷惘，因此没事给自己找事情做，我觉得也无可厚非。而且，这个阶段并非全无价值。

![](http://7xqu8w.com1.z0.glb.clouddn.com/spring-mvc-documentation-contribution-traffic.png)

入职11个月~~我真的没有在数日子~~，感觉上是进入了一个舒适区，项目、技术，和反馈。这个译本初稿的完成，其实也是我想对这段时间做个告别，重新出发。翻译项目会进入维护阶段，每天有一点规律的时间来维护。除此以外，在这个迷惘的过程中，似乎也渐渐对自己的定位有了一些思考，对想做什么，要做什么，也因此可能有了一些想法。

~~以下内容纯属想太多~~

逐渐发现，IT行业的工作里，我们所聊“技术”，其指向可能不同。尤其公司所需的技术与个人喜欢的技术有时并不重合，至少对我来说不甚重合。这其间关系与重叠自不赘述，但基本学习方向会分为企业级技术和个人技术来学。接下来主要的事情有：

* **速度和基本功**。主要是规律、刻意地练习打字、快捷键、TDD、code kata。熊叔叔说的好，这些东西内化成下意识，才能更高效地思考其他
* **professionalism**。项目上，作为一名ThoughtWorker的专业，要继续修炼
* **企业级开发**。主要是想学习Java、Spring MVC/Boot、DevOps、Angular、React等构建稳定、可伸缩的企业系统的技术能力
* **个人开发**。对于个人项目而言，最有用的莫非 **数据** 和 **展示** 两方面。因此，一些轻量级的语言工具会很有助益。这一块我想学有JavaScript、CSS（做展示）、脚本、Python（写爬虫）、CI（持续集成），以及一些提高效率的工具
* **行业业务**。比如现在客户的业务，就可以刻意学习提高
