---
title: 敏捷五问（一）：为什么我们要做原子、小步提交
---

「因为敏捷培训是这么讲的呀」~

人们通常会说，因为做小步的原子提交有以下几个好处：

* 随便抓出一个 commit 都是可以完成本地构建的
* 看提交信息方便看出一组高度相关的变更，甚至还有 [使你的 Git 历史讲故事](https://murze.be/atomic-commits-telling-stories-with-git)
* 非常方便回滚
* 随便抓出一个 commit 都是可以发布的

首先，任意 commit 都可以完成本地构建这是基本要求，但大步 commit 当然也可以完成这个事情。剩下的一些问题，我们再来追问一下：

> 为啥我要让我的 git 历史讲故事？我想让它讲啥故事？


> 我会经常回滚提交吗？

> 我真的有在天天发布吗？

---

* https://www.git-tower.com/learn/git/ebook/en/command-line/appendix/best-practices
* https://stackoverflow.com/questions/38155592/atomic-commits-best-practice
* https://murze.be/atomic-commits-telling-stories-with-git
* https://www.wikiwand.com/en/Atomic_commit
* https://www.freshconsulting.com/atomic-commits/
* https://seesparkbox.com/foundry/atomic_commits_with_git
* https://hearrain.com/git-zui-jia-shi-jian-:-yuan-zi-xing-ti-jiao-atomic-commits
