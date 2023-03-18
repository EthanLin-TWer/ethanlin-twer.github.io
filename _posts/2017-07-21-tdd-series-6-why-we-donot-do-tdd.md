---
title: TDD 周报（六）：「结语 - 我们为什么不用 TDD」
---

这些东西本来没有意义的。不过既然都记录了，就不带情绪地记录在这好了。上个项目带给我的成长是，用平和的心态面对阻力，同时加强个人能力修炼。不要在意微不足道的声音，进程的方向是对的。学习 TDD，一定就要看创始人的书、演讲，接下来的学习方向大概是：

* [Test Driven Development *by* Kent Beck](https://book.douban.com/subject/1229924/)
* [Growing Object-Oriented Software, Guided by Tests *by* Steve Freeman](https://book.douban.com/subject/4156589/)
* [Is TDD Dead Series *in* Youtube](https://www.youtube.com/watch?v=z9quxZsLcfo&list=PLJb2p0qX8R_qSRhs14CiwKuDuzERXSU8m)
* [My summary on TDD](https://github.com/linesh-simplicity/TDD-methodology-and-deliberate-practice)
* some more other origin stuff if any

---

* 唯快不破 - 写测试反而更慢了
* 快速反馈 - 我去浏览器看也很快速反馈啊，一般我都用双屏，一半是 chrome 一半是 webstorm，可快速了。不就写个 reducer 嘛，对不对我还看不出来吗
* 进度紧 - 没时间写。以后再补吧
* 测试有价值 - 有数据铁证如山吗？我就是觉得没必要
* 测试让总体开发变快 - 有数据铁证如山吗？我就是觉得更慢了
* 测试先行 - 掌握了思想就行了，事物都有两面性，肯定还是要具体情况具体分析
* 敏捷 - 不能为了敏捷而敏捷，我们这个项目就是不适合使用 TDD，必须裁剪
* 任务列表法 - 我脑子转的快，记得牢，干事情利索，根本不需要任务列表。再说了，工作方法千万种，任务列表法不一定适合我

我看到的现象是：

* 不写测试 - 没有测试覆盖 - 回归成本大 - 卡做完后不敢重构 - 只能不断往上加 `if-else` - 质量不好 - bug 增多 - 修 bug 变紧急 - 质量不好无法收敛 bug - 只能往上继续堆代码 - 越来越紧急
* 后写测试 - 测试容易测实现而非业务 - 测试脆弱 - 一改代码测试就挂 - 测试不是我写的我不想修 - 进度又紧 - skip 测试 - 没有测试覆盖 - 回归成本大 - 卡做完后不敢重构 - 只能不断往上加 `if-else` - 质量不好 - bug 增多 - 修 bug 变紧急 - 质量不好无法收敛 bug - 只能往上继续堆代码 - 越来越紧急
* 后面重构 - 一段时间后 - context 流失需要重新回忆 - 需要整理所有回归点 - 没有自动化测试时可能需要 QA 回归 - effort 超过1人天 - 无法说服客户进行重构 - 我又不想加班 - 不重构了

说白了都是人的问题和能力问题。

再来看看邮件组里，更有技术性一些的讨论：

* 「We don't want to do TDD because it takes longer than actually building the implementation（不做 TDD 因为比不写测试时多花了时间。我马上就能写出实现，为啥要让我写测试？）」
* 「The task is too simple to qualify the value of writing test for it.（活儿太简单了，写测试冗余成本太高。）」
* 「TDD drives to quick and dirty design without deep consideration.（TDD 驱动出来的设计都太粗糙，经不住考验。）」
* 「We are on a very tight deadline so we won't write any tests now, but we'll come back later and add the tests once delivery pressure gets better.（进度太紧，根本没有写测试的时间。等压力小点了，我们再回来添加测试。）」
* 「I don't know how to write (proper) test. And I don't bother learning how to do it.（我不知道怎么写好的测试。说实在的我也不想学。）」
* 「We have a dedicated QA team responsible for testing the system.（我们有伟大的 QA 团队，当他们不存在？）」
* 「I will write tests when free...（测试嘛，我有空了就写…）」
* 「So many stories and have no time for writing tests...（别黑要脸哈哈哈）」
* 「If I write tests, certainly I will work late and cannot go home on time...（写测试肯定就得加班了…你看从羽…）」
* 「Let's just get it built, we'll go back and add the tests once we have it right.（你说的对，不过咱别想这么多，先实现了，搞完需求后再回来加测试，好不老铁？）」针对这个，M*s 有一段看法，挺不错的：

> So there's a fundamental belief that the purposes of tests is to validate what you've built, as opposed to help you build more quickly. This is tied to a lack of appreciation for how much a thing changes as you implement it, and how tests make this easier.
> 这种看法的根源在于，人们深信测试只是用来验证产品代码的正确性，而非帮助你更快地写出产品代码。这是缺乏敬畏的，忘记了代码实现路途变化多端的需求，以及测试帮忙应对了多少变化。

* 「But for me there is something more fundamental here. I find TDD makes me go faster than without tests, because it greatly reduces the amount of debugging I have to do.（TDD 更本质的是其思维方式。我觉得对我来说 TDD 比不写测试更快，因为调试时间大大减少了。）」
* 「There is something more fundamental. TDD is more about task breaking down. It reduces complexity of problem.（TDD 更本质的依然是其思维方式。TDD 的前提是任务分解，通过此法降低了问题的复杂度。一次做一件事。）」看嘛，知名人士看到的都是思维方式
* 「The bitterness of poor quality remains long after the sweetness of low price is forgotten. - 本杰明 富兰克林」
* 「It always drives me insane when I hear these sorts of arguments.  Yes, when you don't know how to do it, it takes longer.  News flash... that's true of everything in life.（每次听到这些争论我都会有情绪。你说你不知道怎么做，学起来花的时间更长。生活不就是这样的么，学啥不需要花时间？）」握个爪呗。性情中人

还有一些非常有价值的长篇大论，分别讲了「后面再加测试的不可能性」（Later equals never）、「设计能力」、「一般编程方式与 TDD」一些方面。非常有价值。我觉得搬运的东西比我自己写的价值大多了，厉害的人好多。以下是不负责翻译版：

> I think the idea of going back to do something is a common thread in projects of all types.  
>  
> The way I've looked at this is to demonstrate that there is a cognitive illusion happening.  When people defer effort in our brains we also completely remove the effort from the equation.  So therefore, while doing something now might take certain effort we almost assume that the effort in the future will somehow be less, almost nothing.
> 
> We also assume that the situation and environment would have changed so that the constraints and pressures under which we make the decision today will be gone at this future point.  A future point which is often unspecified.  Related is the assumption that they will get commitment to focus on this deferred work.  
> 
> In reality the situation and environment doesn't change.  Today's pressures are replaced with tomorrows pressures.  There's no future period where delivery suddenly doesn't matter and everyone can take a break.  Also complexity and effort _increase_ over time, not decrease.  This is because context is completely lost and has to be regained which again increases effort.  Also the deferral of effort means other down stream implementations are effected thus increasing complexity.  You also have to 'undo' a degree of the existing implementation thus also increasing overall effort.
> 
> Overall the reality is that that deferred work is very unlikely to happen and if it does it's going to be a significantly bigger and harder task to get done.
> 
> The trick is to get people to reason through their proposals so that they take all these things on board.  I find that doing a planning exercise, at sometime in the future, where you get people to estimate the effort required to go back and do the deferred work.  Introduce things like recapturing context, and undoing existing work.  Once that estimate comes out get the team to describe the conditions under which they'll need to do that work.
> 
> What I've found, when doing this exercise, is people realise the effort is far greater than they thought and takes longer than they thought and the likelihood of them ever getting the guarantees to commit to it are smaller than they thought. -P.G.Moss

我觉得任何项目中，抱持着「我们以后再回去做某事」的想法，对项目来说一般都是风险，甚至危害。

我认为，这里面发生的了**认知上的错觉**。当我们在大脑里把工作推迟时，同时也把它所需的成本从方程中完全移除了。与其做一些当下肯定需要成本的事情，我们这样麻醉自己：这个事情放到后面做，应该就会简单一些，甚至到时就不需要任何开销了。

我们同时默认假设，到了以后，现状与外在环境会改变，因此面临的限制和压力相比当下也会减少。我们通常不知道这个以后是多久的以后。我们能知道的是，以后，我们就能专注在这些工作上，因此现在先推迟吧。

现实是，现状不会改变，外在环境也不会改变。当下有压力，到时也会有压力。你希望有一段时间，所有的交付压力都降低了，大家都能休息一下重构重构代码。这样的以后是不会发生的。并且，复杂度和成本会**增加**，而非降低。因为到了「以后」，上下文完全消失了，你必须重新回忆搜集，这是成本增加的来源之一。其次，推迟了的工作，会影响所有下游系统的实现，这同样增加了复杂度。想「撤销」这些已有的实现，同样增加了总的成本。

也即是说，推迟了的工作不太可能再被拾起；即便可能，那时再做的成本只是徒然增加了，而非你所想象的那样会减少。完成它更难了。

怎么样让别人意识到这个错误的认识假设呢？我发现，在后面的某个时间节点，带领大家做一些计划练习会有帮助。让大家试着自己去估算，推迟工作并在以后去完成的成本会有多少。引导大家去思考「重新搜集上下文」、「撤销已有实现」等工作的成本。估算完成以后，让团队自己估算，要重新捡起这些工作需要多少成本，需要什么环境才能办到。

我的经验是，做完这个练习的团队都会意识到，以后再做远比现在做的成本高得多，也因此，以后再做这个承诺实现的可能性比他们预想的要小得多。 - P.G.Moss

> I never really understood how you can be faster without tests. If I'm building a website, am I going to fire up the entire webserver, login and and click through the pages to see if the code I just added actually works?
>  
> That being said, there is a minimum understanding of software design required to be able to do TDD I found in my experience. I have seen people writing the craziest kind of tests, from testing constructors to using reflection to capture method arguments to see if the correct lambda has been passed to a method, etc. 
> 
> I guess a friendly request to read through the GOOS book and (for the 95% of db-in/db-out work we do) an understanding of hexagonal architecture (there's actually a recent video of Alistair himself talking about the subject) should help people get a better understanding of why a long time ago in de 90s people decided that it is probably a good idea to do some form of TDD. And I don't really care if it's strictly test-first, I also sometimes write a bit of implementation first and then add the test, but I already know what that test is going to look like. The important thing is to work in small increments where you add production code accompanied by a test that validates if that code actually works.
> 
> PS: I don't get the whole fuss about the #noTDD article, all I'm reading there is that the guy writes bad code and TDD doesn't prevent him from writing bad code (or make him write better code) so he claims TDD has failed as he can write bad code faster without tests. - J.Soeters

我从来无法理解，不写测试怎么可能快于写测试。比方说，我在写一个网页，为了验证我写的代码是否工作，难道我要启动整个 web 服务器、登录然后点很多下鼠标才能到我需要测试的页面去？

话虽如此，在我的经验中，要做好 TDD 是需要对软件设计有个基本认知的。我看到有些人写的测试简直疯狂，有给构造函数写测试的，有用反射来获取方法参数，以检验是否传入了正确的 lambda 函数的，诸如此类。

恕我冒昧地推荐一些资料： [GOOS 一书]() 以及（给我们所做的大部分的数据库操作）对 [hexagonal 架构](http://alistair.cockburn.us/Hexagonal+architecture) 的基本了解（最近 Alistair 本人有个[专题视频](https://www.youtube.com/watch?v=th4AgBcrEHA)），它们可能可以让你了解，为何远在90年代前人们就觉得，某种形式的 TDD 是必要的。是否测试先行，我觉得无所谓，我有时也会先写一些实现，再添加测试来覆盖。前提是，写测试前我就已经知道测试会长啥样了。背后真正重要的是，你需要**小步前进**。每当你写了一些产品代码，你总需要一个测试（或其他什么）来验证代码是否写对了。

PS. 邮件组里各位在讨论什么我其实没有全部读完，我看到的是，有人写了一些不好的代码，TDD 未能阻止他继续写不好的代码（或说促使他写得稍微好一些）。于是这老哥就说，TDD 根本没用，因为他觉得写（这样的坏）代码，不用测试根本快多了。 - J.Soeters

> I find it perfectly understandable that people don't see TDD as something they can use themselves to work more effectively.
>  
> I worked in software development for 10 years before I worked in a team where agile engineering practices were used properly (TDD, CI, pairing, etc.). I'd read the XP books, but I didn't know anybody who actually worked that way, or knew how to do it.
> 
> Reading about XP practices and trying to figure out how to do it on your own is frustrating. The codebase you're working on has messy dependencies that make it hard to write decent tests. You don't even know *how* to write a decent test, how to use mocks properly, how to refactor, etc. Trying to work it out on your own feels like you're just screwing around rather than getting work done.
> 
> At the end of the day, if you've worked in most software development teams even today, these practices are just something that you hear about other people doing. They sound ok in theory. But you know very few people who work that way in real life. Most people you work with get along perfectly fine coding the normal way. - K.Morris

我表示十分理解，为什么人们不觉得 TDD 是一项可以让他们作为个人，工作更加高效的技术。

在我接触到真正把敏捷的这些工程实践（TDD、持续集成、结对编程，等等）做得很好的团队之前，我在其他的公司做了10年的软件开发。我是读了有关 XP（极限编程）的书，但实际工作中，我从未见过真正这样工作，或者知道怎样实践 极限编程 的人。

读 XP 的实践然后自己去摸索实践，是个非常痛苦的过程。通常实际的情况是，你当前工作的代码库有着混乱纠结的依赖，想写书本上介绍的那种简单纯净的测试，根本不可能。很多情况下，你自己连如何写简单的测试都不知道。不知道怎么用 mock，不知道怎么重构…确实，自己去探索，感觉反而更乱了，还不如马上把活干完。

倒腾到最后，就像对绝大多数的团队来说一样，你对这些实践也只是有所耳闻。你知道有这么个东西。它理论上听起来很棒。不过你觉得，在实际工作中，没几个人是这么做的。大多数人还是用他们所习惯的那种方式编程，并且日子如常，并没什么问题。 - K.Morris

## Github 上的读者评论和交流

> 我

写的太好了。

最近看《娱乐至死》，看奕含的绝笔，慢慢有一个价值观产生：形式本身与内容同等重要。它的一个推论是，要做正确的事情。此处应该 @macdao 

大家可能以为，思想（真理、道理）是一个实在存在的东西，只是用什么方式来表达它的问题，但它是存在的。那些想法存在于你的脑里，不管你是用写博客、和人交谈、录制视频、发社交媒体，它都是不变的一个思想，传播途径只是一个媒介，思想与媒介无关。《娱乐至死》告诉大家，错了。用什么方式表达不仅重要，而且影响你要表达的内容本身。

书里花大篇幅对比电视时代与印刷术时代，不同媒介本身对传播内容带来的不同。印刷术时代我们以书本为主要的交流途径，书本的表达方式是注重逻辑、事实、精心准备。而电视时代，我们首先看讲者的颜值高不高，播音者的声音是否吸引人，电视节目不容许思考，一个节目如果嘉宾现场花上5分钟准备论据以反驳对手，一定没人看这样的节目。我们的时间如此重要，以至于每时每刻都在刷信息，刷朋友圈，刷微博，一个手指滑上去就是好几个人一天的生活，我们忙到没时间花5分钟，停下来，等一个人将他的想法组织成思路。图像时代不需要阐述，不需要逻辑，只需要图。色彩鲜艳的图、让人若有所思的图、恍然大悟的图。人们没有时间进行深入阅读，就产生种种方便法门，比如抓人眼球的标题、目录清晰一眼5秒就能看清的文章、重点都帮你加粗标出的中心思想。种种这些，都是一个信息媒介所选择、所隐喻。你怎么还能说内容本身是独立于媒介存在的呢？

用奕含的话来讲，一个体系精巧，写出许多好的作品，思想真的不能说是不 **美** 的，本来应该是思无邪的艺术家，本人却虐打妻子，强暴女性。你要说艺术跟人品分开谈论，还是这样的艺术本身就是赝品，是一种巧言令色？

上面，使用 markdown 加粗、使用空格隔开突出的「美」字，也是一种表达方式，也是一种隐喻。而我慢慢觉得，这种表达方式也是我所舒服的。

所以回到 TDD 这个问题上，美静那天说，反正我们在分支上开发的代码最后都要合成一个提交，你自己在分支上进行小步提交是否觉得累？为什么不节省一下，大步一点，再大步一点？反正最后都只会变成一个提交，只要那个提交信息是详细的就行了。我回答，首先我觉得「分支开发」「合并提交」就不是正确的事情，只是因为项目现状使然；其次「节省」本身不是毫无成本，这种表达方式本身的隐喻是，小步提交是多余的，部分敏捷实践是多余可裁剪的，它鼓励你大步一点更大步一点地提交。这个隐喻本身是危险的，是错误的，是开发者自己技能不够熟练、实践不够持续集成所致，而不是实践本身的问题。所以，如果你真的感觉敏捷实践（以及其他任何东西）是有益（亲身确认是真的有益）的、正确的，就应该坚持。所以说要做正确的事情，对似乎无害的俭省实践说**不**。

> 吕立青

在历经一个只有一周时间的小程序项目之后，我也想趁此机会做一个总结：

是的，这个小项目完全没有测试，当然也就完全没有 TDD。

> 本想说「痛并快乐着」，但我依然觉得痛苦居多。

作为一个经验依然“弱鸡”的人来说，在没有完成项目之前，甚至不知道哪些是痛苦，哪些是可以改进的，哪些又是凭借运气得以顺利惊险度过，哪些又是靠着神队友快速fix快速调整。

只有回过头来回顾、思考，才得以发现哪些地方是自身原因、哪些是准备/积累不够充分、哪些是当下context不得已的最佳实践方式。是啊，在那样的情况下，最佳实践竟然成了一种不得已，不得已的方式竟然是最佳实践。也许吧，能解决问题的实践，才是最佳实践。

举个🌰，如果某天地震了，你说“不，我要换上最好的跑步装备，打开~~百度~~（先搭 VPN 再 Google）地图查下最佳逃跑路线”，再用最优雅、最快捷的方式跑出来。

“是的，有可能你确实最后跑得比别人快；但也有比较凄惨、夸张的情况就是，没有了跑步的机会。”

“其实最后生死，不还是靠天靠地靠运气，有可能你跑得快，刚好前面电线杆掉下来砸到你；有可能你跑得慢，房子却因为旁边的大楼挡住而没有倒下。”

其实还是分两个角度看：

1. 提前做好准备（配好 VPN，WebStorm 等一切基础设施，练习打字速度和快捷键，当然还有纯文本 Taking…）
2. 该跑的时候尽情跑，不要再想 `1.`

还有一个角度就是，软件开发毕竟是团队协作，必然有人快有人慢，关键在于「尽力而为」；只有为自己努力才会尽力而为，也只有尽力而为才不会奖励惩罚，利弊自规。

然后就是「周期性」，我依然觉得最有用的敏捷实践其实是「回顾」，且每个迭代所带出来的节奏性。而精益创业的核心逻辑是缩短 “Build-Measure-Learn” 的周期，不再以**时间**（2 weeks）维度为划分，更关注**价值**（yes or no）的节奏性。

从以往的 C/S 架构到 B/S 架构也好，从现在的 App 到小程序也好，商品/服务的内容或许并没有发生变化，但是触达用户提供价值的路径是真的缩短了，从而能够更快验证价值的可 valuable，价值的节奏性或许就在于「快速试验、快速失败」。

回到 TDD，上面总结下来可以对应到 4 个角度：

1. productive: 提前配置好测试环境、练习坏味道与重构手法、熟悉IDE和快捷键。（做效率工具狂人，优化一切 Infrastructure，包括 触达/调用知识库（包括问人）的速度。）
2. focus: 写测试的时候就专心写测试；重构的时候就专心改代码；小步提交和单分支开发都是专注的体现。
3. cycle: 「红-绿-重构」周期性所带来的节奏感，会让人**感觉**起来很“快”，比debug更快，反馈的信心。
4. value: TDD 能够减少浪费就是一种价值，在于试探性得去发现不可行性，缩短了验证周期（站在调用/使用者的角度）。

当然咯，以上其实都是很**个人**或者说是很**产品**的，而没有太多触及到「团队」，不追求技术卓越的人，不在乎 `1.`；不考虑产品价值的人，必然也就不在乎 `4.`；

这么说来，我觉得 Scrum 其实很适合三靠谱这样稳定求增长，只需要交付团队完成任务的情况，因为借助于**manage**（IPM 和 KPI）辅以（~~走流程化~~的 Retro）就足以让团队变得稳步前进，算是做到了 `2.` 和 `3.`。而厉害的团队或者其实不需要那么注重 manage，只需要关键时刻 **lead** （预测未来方向、及时调整方向）即可。

上述 **management** 潜在的危机当然就是缺乏创新，三靠谱从 Scrum 切换成 SAFE 或者有这方面的考虑。（虽然我也不知道SAFE是什么，但是我觉得 EDGE 还是很有用的。）

其实有点儿类似于从 KPI 切换成 OKRs，之前一直不太理解 OKRs，但是听完一个音频明白了 OKRs 的应用场景也就有所顿悟，原来其核心也在于 Lead 的人有所不同，普通人还是 KPI 机制来得实在有用。改天我再来反思反思。

> 我

当然，讨论 TDD 这个事情简单的前提一定还是「个人的」。它和团队的 TDD 是两个不同向度的事情，团队推广略去不谈，但个人的 TDD 完全是可以自由随时练习打磨的技能。

「价值」这个大出发点我觉得你说得很好。我理解「价值」的普适意义比较强，并且不同的阶段可能呈现出不同的价值。比如你举的地震的例子（我懂国内产品交付的节奏），这个时候「先活下来」的价值显然已经盖过「活得好好的」这个事情。所以说，**「价值」这个东西应该是指导一切的思想**，而不是哪些具体了又再具体的实践；应该是视不同的阶段采用多种不同的工具（比如问人，比如砍需求，比如其他非技术的手段）来达到当前的价值点，而不是不管进度交付人员等制约我都说要把这些实践做到💯。

有了价值这个盖子再来看 TDD（及其他敏捷实践）以及效率工具的意义，我觉得是：

1. **日常积累**；出现要命场景时，你仍然可以跑得快一点、稳一点
2. 迫使「价值驱动」的视角：没价值的代码一行不多写
3. **快**。快在反馈速度快，以测试做为完成、重构成败的唯一标准，省去了大量不确定性的手动验证
4. **回归**。测试是项目发展必须的，主要体现在支持重构、保护已有功能上

说到团队上的东西。最近有个感想，就是觉得「流程」这套东西体现出来的假设，就是保护弱者。对于一个（大的）组织来说，如果大多数人无法真正灵活运用敏捷实践来达到快速验证价值的目的，那么将这些灵活的实践具体化成为可衡量的实践和指标，无疑对组织来说是高效的，尽管牺牲了一些灵活性。当组织对创新、快速验证的需求并不强烈时，这样的模型也就越有效。换句话说，当你越不敏捷时，你就能在公司活得越好。它是个相互塑造的关系…

噢，突然想到「策略性 TDD」 这个东西。就是我现在还蛮享受的一个状态，开始觉得自己可以裁剪一些东西，比如 T 不了的代码，还是可以紧紧抓住**快速验证反馈、小步验证**这个点找其他的办法手动验证（反馈速度），比如重点 TDD 逻辑比较复杂的代码（业务价值高），比如 tasking 其实可以在想好大面的基础上做补充和细化…其实说白了就是 `效率 = 价值 / 时间`，可以调的变量有很多，对高价值的代码做策略性的投入，其实觉得更有效率，工作更舒服。

一周的代码库用不用长期维护还另说呢…能撸出来就很赞了。
