---
tags: github, 七牛, jekyll, ci, gitbook, markdown
categories: 翻译
title: 我是如何进行Spring MVC文档翻译项目的环境搭建、项目管理及自动化构建工作的
---

感兴趣的同学可以关注这个[翻译项目](https://github.com/linesh-simplicity/translation-spring-mvc-4-documentation) 、 [我的博客原文](http://blog.linesh.tw/#/posts/2016-06-26-auto-deploy-translation-to-production-using-jenkins-and-qiniu) 和 [我的Github](https://github.com/linesh-simplicity)。

![](http://7xqu8w.com1.z0.glb.clouddn.com/spring-mvc-translation-project-home-page-version-2.png "Final website of MVC translation project")

前段时间翻译的 Spring MVC 官方文档完成了第一稿，具体的地址可以访问[这里](http://mvc.linesh.tw)。这篇文章主要是总结一下这个翻译项目自开始到上线发布一个完整的生命流程，内容包括**翻译环境搭建**、**项目管理**与**自动化构建**三部分。

## 环境搭建

开始一个翻译项目，有多少事情需要我们去考虑呢？你可能会想到，一个好的编辑环境、一个组织文档章节的软件、一个漂亮的界面等……这些最终都是需要的。但是，不要忘记，最重要的出发点只有一个，就是**马上开始翻译**。工具、样式，在一开始的时候，我们希望它以轻盈的姿态出现在我们的面前，既要有最简单的 setup，又要在后面我们对项目进行管理、构建和自动化时有足够好的支持。

慢着，你说文档翻译的工作需要管理我还能理解，毕竟它是一个项目嘛，项目需要管理，这我能理解。不过…一个翻译项目还需要构建？还需要自动化？有啥好构建的？不急，这部分我会在后面慢慢道来。现在，我们先来看看，为了得到一个最顺手的翻译环境，我们需要进行一些什么基本配置。

开始翻译，我们希望直接进入内容本身，开始将一行行英文翻译成中文。这个是最核心的诉求。当然，也有一些其他的需求，比如章节间联系与组织、调调样式等。但我们不希望在开发（翻译）的时候将这些职责耦合进来，本着单一职责原则，我们把这些翻译以外的事务交给工具来处理。总结下来，一个趁手可扩展的环境应该包含：

* markdown
* 编辑器（Sublime/Atom 等）
* 版本管理（Git）
* 代码托管平台（Github）
* 章节管理工具（Gitbook）

markdown 让你的世界纯粹得只有翻译，相反你不会想在 Word 中一边翻译一边调行间距；Git 是持续集成之魂；Github 作为最大的平台提供了最丰富的资源；而 Gitbook 会帮你处理章节组织以及样式渲染，使得你可以快速开始。

### Markdown

Markdown是一种近乎完美的写作标记语言，其最大的功劳便是将写作从内容中分离出来，这个分离使你只专注于写作内容本身而不需关注内容最终的样式，极大地提高了效率及工作愉悦度。反例是 Microsoft 的 Word，你不会想一边翻译，一边调整行间距，然后接着翻译，翻了几段以后又移动鼠标将小节的标题加粗。如此往复，不仅翻译的这个思考过程（mindset）被打断，整个精神和注意力也无法集中，效率与质量也就可想而知了。

比如说，上面这段文字在markdown中写出来是这样的：

```
## 环境搭建

……本着单一职责原则，我们把这些翻译以外的事物交给工具来处理。总结下来，一个趁手可扩展的环境应该包含：

* markdown
* 编辑器（ Sublime/Atom 等）
* 版本管理（Git）
* 代码托管平台（Github）
* 章节管理工具（Gitbook）

专注于内容之所以能提高效率，因为它将翻译与写作从样式中解放了出来。你不想在 Word 中一边翻译一边调行间距。Git 是持续集成之魂……
```

说起来markdown这个名字也有点意思，一般的标记语言叫markup language。这里将up改成down，寓意着将标记语言中与内容本身无关的标记全部剔除，形成一个精简子集。本篇不是markdown用法记，不会详细介绍，具体可参考以下链接：

* [Wikipedia: Markdown](https://en.wikipedia.org/wiki/Markdown)
* [Markdown overview](https://daringfireball.net/projects/markdown/)
* [Github上最有名的Markdown Cheat Sheet仓库](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)

### Markdown编辑器

![](http://7xqu8w.com1.z0.glb.clouddn.com/atom-as-translation-project-editor.png "Use Atom as the translation project's editor")

编辑器的选择并无定式，打造一个符合自己操作习惯的编辑器也是每个程序员自己的一个工作，这里我不赘述。在Mac上，不错的markdown编辑器有Sublime 3、Atom、MacDown、Mark Editor等，可挑选适合自己的，我选择的是Atom，是因为有一个刚性的需求它能够满足：

* **与终端（terminal）的集成**

由于使用了版本管理，同时有时有拷贝文件、查看目录等需求，命令行肯定是必须随时在手的。终端方面我的选择是iTerm2+zsh，关于它们的配置和特性，可以查看这两篇文章 [Mac优雅的工具集——iTerm2篇](http://blog.linesh.tw/#/posts/2016-03-11-elegant-mac-iterm2) 和 [Mac优雅的工具集——oh-my-zsh篇](http://blog.linesh.tw/#/posts/2016-03-13-elegant-mac-oh-my-zsh)。对如何在Mac上构建一个优雅的工具集有兴趣的同学，也可以前往Gitbook看看我正在写的这个系列：[关于优雅地使用Mac OS的理念、想法、工具与实践集](https://linesh.gitbooks.io/gitbook-elegant-mac-tools-system-closure/content/index.html)。

### 版本管理 Git

![](http://7xqu8w.com1.z0.glb.clouddn.com/git-logo.png "Git Logo")

Git作为版本管理的意义也不赘言，要做持续集成、版本回滚必须要有一个 vcs。你肯定不想自己的工作区最后变成这样：

![](http://7xqu8w.com1.z0.glb.clouddn.com/word-as-version-manager.jpeg "Word As version control will suck")

对于 Git 还不是很熟悉的同学可以参考下面我给出的链接了解。另外，zsh下的Git可以配一下自动补全，加上它自带的 git 插件，相当于一个全球通用的 alias。具体配置非常简单，可以来[这里](http://blog.linesh.tw/#/posts/2016-03-13-elegant-mac-oh-my-zsh)看一下最终的效果。

* [Git - 简易指南](http://www.bootcss.com/p/git-guide/)
* [廖雪峰的官方网站：史上最浅显易懂的Git教程](http://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000/)
* [A Visual Git Reference](http://marklodato.github.io/visual-git-guide/index-en.html)

### 代码托管平台 Github

![](http://7xqu8w.com1.z0.glb.clouddn.com/github-homepage.png "Github Homepage")

Github是 ~~世界上最大的同性交友平台~~ 一个代码托管平台，有着繁荣的生态圈和平台资源。在这个平台上，我可以给翻译项目一个`README.md`文件，为阅读的人做简单的介绍以及引流，同时它可与CI、Gitbook等工具完美集成，其内置的issue、pull-request功能还能与Zenhub结合，直接当成trello来进行项目管理之用。相关的工具下一节会介绍。

### 写书专用工具 Gitbook

上文提到了翻译内容与样式的分离。实际上在这里样式这部分就是由Gitbook自带的渲染引擎来负责的。此外，Gitbook还能帮助你管理整个书的目录结构、章节生成、搜索、词汇表、站点构建与生成等，同时它也有较为丰富的插件生态。这一切只需要你进行少量的配置。其低学习成本与高效益，使它成为了我进行翻译编排首先的工具。

你只需要在书的根目录下运行`gitbook init`命令，它就会生成下图所示的一个目录结构：

```
.
├── README.md
└── SUMMARY.md
```

## 项目管理

项目管理方面的需求，主要是有时会有想法出现，希望增加什么特性，或者想到什么问题不想马上修，那么最好是有一个TODOLIST可以随时记录下来，并且能被方便地检索到。这方面的需求，怎么解决呢？

### issue + zenhub

![](http://7xqu8w.com1.z0.glb.clouddn.com/zenhub-as-issue-tracker.png "Use Zenhub As Issue tracker")

Github内置的issue功能已经好用到爆，再加上专为Github issue功能定制的[Zenhub](https://www.zenhub.com/)简直就是活生生把issue当成trello来用。一些内置特性如下，稍加体验即可满足所有小型项目管理上的需求：

* issue可以通过commit sha直接与相关的单次提交关联，还可以 [通过提交信息来引用、关闭issue](https://help.github.com/articles/closing-issues-via-commit-messages/)
* issue中支持GFM(Github Flavored Markdown)，可以直接使用todolist的语法
* 通过Command/Ctrl+V可以直接在留言中上传截图
* 可以为issue添加标签（tag）、类别（pipeline, 如正在做、还没做、已完成等）
* 可以为issue估点、指定负责人、燃尽图，简直就是为敏捷实践而生，不过在这个翻译项目中用不到这些，毕竟自己给自己估点没什么意思

![](http://7xqu8w.com1.z0.glb.clouddn.com/github-flavored-markdown-todolist.png "Github flavored markdown todolist")

## 自动化构建

自动化什么的构建？这还要从本翻译稿的托管平台——Gitbook——说起。gitbook是一个绝好的写作平台，官方也通过Webhooks提供了与Github的集成，只要你把代码`git push`到远端仓库，Gitbook就会自动拉取仓库中的内容，按照特定的格式为书本构建站点。过大概2到3分钟，你就可以在[Gitbook](https://linesh.gitbooks.io/spring-mvc-documentation-linesh-translation/content/)上看到自己最新的更新已经到书上了。一切看起来都十分美好，一键提交与部署。但是有一个最大的问题：**Gitbook在国内的速度不行，轻则卡顿，重则整站被墙刷不出页面**。

这种情况下，我决定将整个翻译同时迁移到七牛上。七牛的CDN在国内速度名声在外，用来托管静态站点再好不过~~只需要拍两张身份证正反双面的照片上传等待审核即可~~。迁移也很简单，因为gitbook生成的静态站点其实就是`_book`文件夹，只需要把这个文件夹下的全部东西放到七牛空间上去，在使用`index.html`作为入口就可以了。但是，问题又来了：

* 七牛网站上无法上传文件夹。就算可以，我也无法忍受每次都要手动将文件夹拖上去
* 每次仓库有更新，都需要将最新的内容同步到七牛空间上，并覆盖旧版本的同名文件
* 第二步的操作还不能通过githook+shell的方式来做，因为整个过程的耗时会使`git push`的反馈周期变长，从而使得我更不倾向于频繁提交，影响翻译体验

解决方案也很简单：

* 第一条，寻找七牛的[SDK](http://developer.qiniu.com/resource/official.html#tool)，通过命令行进行上传
* 第二条，既然不能，[细想]也没必要在本地做，那么就在远端做好了。远端在哪里呢？ **CI/Pipeline** 啊，这样构建站点、同步文件等工作都可以并行进行了，既不会阻碍本地开发速度，也不是翻译时需要考虑的问题，我还是只需要像以前一样`git push`提交代码即可，站点从构建到最终上线，都有CI在负责

想法出来了，在实施的时候还是走了一些弯路的。这些折腾过程在此无法深表，只有可能带过~~程序员们都懂的~~。在CI的选择上，我选择了Jenkins 2.0，原因比较纯粹，最近项目上在使用Jenkins 2.0，我刚好当是练手。至此文章成笔之时，我仍在考察其他选择，比如travis-ci，看起来UI和配置都简单许多，这部分可能是后文了。下面会简单介绍~~折腾~~搭建Jenkins 2.0作为本翻译项目CI的步骤和关键节点。

### Jenkins下载、安装与启动

话说Jenkins不愧为CI/CD领域的先锋，这个产品每周都会发一个小版本（目前最新是2.11）。Jenkins 2.0的安装，可以通过直接下载安装包的方式下载，在Mac上也可以通过`brew install jenkins`来下载安装。安装完成后，运行`jenkins`即可在`localhost:8080`启动一个本地的jenkins。

![](http://7xqu8w.com1.z0.glb.clouddn.com/jenkins-pipeline-home-page.png "Jenkins home page")

### 注册一个七牛开发者账号

![](http://7xqu8w.com1.z0.glb.clouddn.com/qiniu-home-page.png "Qiniu Home Page")

流程十分简单，免费用户可以有一个空间，有一定的流量限制，不过通常来说对于只有一个空间需求的用户来说，这样的流量应该不会超吧。由于我已经超过了一个空间的需求，同时我又有配置独立域名的需求，所以需要更多的权限。流程也很简单，进行实名认证、填写身份证、上传本人及身份证正反面照片各一张~~本人不需拍反面~~，最后保证账户里有最少10元即可。

### Jenkins：新建一个类型为pipeline的项目

pipeline搭建起来了，接下来我们需要捋一捋前面说到的两个步骤：构建站点、上传站点文件到七牛空间。细分下来，主要是有以下的task要做：

* 引入必要的依赖
* 构建站点
* 同步到七牛

#### 使用NPM，引入gitbook/gitbook-cli/qiniu

![](http://7xqu8w.com1.z0.glb.clouddn.com/npm-home-page.png "Npm home page")

我们想要构建站点，必然使用gitbook的命令行工具；要使用七牛的命令行，也必然引入相应的工具。这里我走过一些弯路，比如尝试将七牛工具以插件形式引入到Jenkins job中来，但是2.0以后，我们更倾向于使用脚本来描述构建工作，而非将Jenkins单纯当作一个转存/转储的工作区间并为该workspace零散地写一些适配脚本。因此，在pipeline类型的项目就不存在每个job特定的配置空间，若想使用插件，配置起来有些麻烦。于是，最后我决定使用七牛的npm包（肯定是有的），并通过NPM来管理所有依赖。以下是一个`package.json`文件需引入的依赖：

```json
{
   ...
   "devDependencies": {
        "gitbook": "^3.1.1",
        "gitbook-cli": "^2.3.0",
        "qiniu": "^6.1.11"
    },
    ...
}
```

另外，需要注意的是，Gitbook的渲染引擎已经升级到v3.1.1版本，与Legacy v2.6.7版引擎相比，主要的区别是[v3支持多个部分(part)的文章](https://github.com/GitbookIO/gitbook/blob/master/docs/pages.md)、默认关闭了目录中章节前的数字等。其中multipart的部分有些[小bug](https://github.com/GitbookIO/gitbook/issues/1301)但还可以忍受，但是默认关闭的目录数字则需要通过以下的配置给设置回来。在`book.json`文件中：

```json
{
   "gitbook": ">=3.1.0",
   "pluginsConfig": {
      "theme-default": {
         "showLevel": true
      }
   }
}
```

#### 构建站点

简单地运行命令`gitbook build`即可生成站点目录。最后的构建脚本[Jenkinsfile.groovy](https://github.com/linesh-simplicity/translation-spring-mvc-4-documentation/blob/master/Jenkinsfile.groovy)如下所示：

```groovy
node ('main') {
    stage 'Pull latest changes from SCM'
    git([
        url: 'git@github.com:linesh-simplicity/translation-spring-mvc-4-documentation.git',
        branch: 'master'
    ])

    stage 'Download dependencies: Gitbook/Gitbook-cli/Qiniu'
    sh 'npm install'

    stage 'Build book serving directory through Gitbook'
    sh 'gitbook build --gitbook=3.1.1'

    stage 'Upload production _book to Qiniu through their API'
    sh './jenkins/sync-book-to-qiniu.sh'
}
```

#### 上传文件到七牛

使用七牛的命令行工具进行文件上传，需要配置一些东西，主要是要同步的本地目录、七牛的Access key和Secret Key等，示例代码则可以从七牛SDK的官网上参考。我最后完成的这份同步脚本[sync-book-to-qiniu.js](https://github.com/linesh-simplicity/translation-spring-mvc-4-documentation/blob/master/jenkins/sync-book-to-qiniu.js)如下所示，其中完成了 **准备本地同步目录** 、 **排除不同步文件** 、 **指定覆盖上传策略** 等工作：

```js
const qiniu  = require("qiniu");
const glob   = require('glob');
const crypto = require('crypto-js')

const ignoredFiles = [
    'Jenkinsfile.groovy',
    'sync-book-to-qiniu.js',
    'sync-book-to-qiniu.sh',
    'mvc-origin.md',
    'package.json'
];

// node ./jenkins/sync-book-to-qiniu.js $ACCESS_KEY $SECRET_KEY
const qiniuAccessKey = process.argv.slice(2, 3);
const qiniuSecretKey = process.argv.slice(3);

// Prepare Qiniu configuration options
qiniu.conf.ACCESS_KEY = qiniuAccessKey.toString(crypto.enc.Utf8);
qiniu.conf.SECRET_KEY = qiniuSecretKey.toString(crypto.enc.Utf8);
const bucket = 'mvc-linesh-tw';

glob.sync('_book/**/*.*', {}).filter(filename => {
    for (let ignored of ignoredFiles) {
        if (filename.endsWith(ignored)) return false;
    }
    return true;
}).forEach(filepath => {
    const resource_key_in_qiniu_api = filepath.substring('_book/'.length, filepath.length);
    // ':' means allow override upload. For further details refer to offical API docs
    const policyToken = new qiniu.rs.PutPolicy(bucket + ":" + resource_key_in_qiniu_api).token();
    uploadFile(policyToken, resource_key_in_qiniu_api, filepath)
})

function uploadFile(uptoken, key, localFile) {
    let extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(uptoken, key, localFile, extra, function(error, response) {
        if(!error) {
            console.log('[Success] File uploaded: ' + response.key);
        } else {
            console.log(error);
        }
    });
}
```

同行们求review代码啊～

### 避免提交七牛的AK和SK

AK(Access Key)和SK(Secret Key)是七牛分配给注册开发者的一对密钥，不能泄露，否则其他人得到了就可以对你的七牛空间进行任意操作。但是，你要把构建工作自动化，就必须这段脚本提交到github上，同时CI还要能从你的代码中读出正确的AK和SK，这要如何做到呢？回答是，通过CI提供的接口，由pipeline将参数注入到你的代码中。这样，AK和SK就被保存在了pipeline上，别人无权对其进行访问。在Jenkins CI上，这是通过一个[EnvInject插件](https://wiki.jenkins-ci.org/display/JENKINS/EnvInject+Plugin)来做到的，在travis-ci中则更加简单，直接设置。

![](http://7xqu8w.com1.z0.glb.clouddn.com/jenkins-envinject-plugin.png "Jenkins EnvInject Plugin")

![](http://7xqu8w.com1.z0.glb.clouddn.com/travis-ci-env-setting.png "Travis CI environment variables settings")

### 使用travis-ci进行自动化构建

![](http://7xqu8w.com1.z0.glb.clouddn.com/travis-home-page.png "Travis home page")

——本小节为2016-07-06日添加

如今我已经把本项目的构建从Jenkins迁移到travis-ci上去了，原因是travis-ci是一个online的CI，界面更漂亮，配置也更为容易。在构建步骤上，与通过Jenkins的构建大同小异：

* 设置好必要的环境（node.js, npm等，因为Jenkins是在本地跑，不存在这些问题，travis上需要小配，也非常简单）
* 通过npm安装必要的依赖（qiniu，gitbook等，也简单，跑一下安装即可）
* 通过gitbook将站点目录构建出来
* 配置好加密的AK/SK，并在构建脚本中获取
* 将构建目录上传到七牛

大部分步骤与使用Jenkins时并无二样。与Jenkins的JOB模型不同的是，travis整个核心的构建阶段只有两个：`install`和`script`，即安装依赖和执行脚本。每个阶段都有前后的拦截点，你可以在前后做些必要的操作。此外，对于依赖安装，travis还提供了缓存的功能。只需要在项目下放置一个`.travis.yml`文件即可触发整个构建。这个脚本的核心部分大致如下，没有中文注释，代码自注释：

```
language: node_js
node_js:
    - '6.1'
cache:
    directories:
        - node_modules
before_install:
    - npm install -g gitbook-cli
install:
    - npm install
script:
    - gitbook build
    - ./travis/sync-book-to-qiniu.sh
```

另一个问题是AK和SK的问题，在Jenkins的方式是通过环境变量(env variables)的方式注入。不过现在travis不在本地，不敢这么玩了，虽然travis也提供了环境变量的注入，但毕竟把AK/SK上传到travis的服务器上了。好在travis提供了加密API，即你可以在本地先加密你的AK/SK，然后将这个加密后的值上传到配置文件中。travis执行构建的时候自动帮你解密回来，同时其他人也无法看到你的敏感数据。具体命令如下：

```
travis encrypt "ACCESS_KEY=value_without_bash_escape_characters" --add
travis encrypt "SECRET_KEY=if_there_is_special_characters_you_need_to_escape_them" --add
```

## 总结

![](http://7xvpsh.com1.z0.glb.clouddn.com/running-jenkins-pipeline.png "Running jenkins pipeline")

![](http://7xqu8w.com1.z0.glb.clouddn.com/travis-upload-final-success-view.png "Travis final success view")

呼呼，最后看到这个图的时候还是很激动的，所有的部署工作都成功了。那么也是时候结束了，本篇文章总结起来，讲了三方面的内容：

* 如何准备和搭建让翻译工作更加专注和高效的环境和工具，如markdown/atom/gitbook/git/github等
* 如何使用github的issue和zenhub来辅助管理翻译项目中的待办事项和协作
* 如何使用CI工具Jenkins/travis将整个站点的构建和发布自动化，提高翻译和部署效率


—— 2016-07-01

## Bonus：Marketing

哎呀bonus，其实说不清是彩蛋还是坏蛋了，主要是聊聊文章和推广吧。一开始推广的时候是地毯式地发，与吕靖所发平台有略微不同。发的平台有 [OSC](http://my.oschina.net/lineshtw/blog/704441) / [CSDN](http://blog.csdn.net/codecleaner/article/details/51808331) / [Iteye](http://sodagreen-simplicity.iteye.com/admin/blogs/2308678) / [博客园](http://www.cnblogs.com/natasha-yarovenko/p/5634661.html) / [掘金](https://gold.xitu.io/entry/5777f8395bbb50005948d9bb/detail) / [v2ex](http://www.v2ex.com/t/289735) / [segmentfault](https://segmentfault.com/a/1190000005858229) / [Githuber](http://ask.githuber.cn/t/spring-mvc/1547)一共8个地方，再后来便对此事有所厌倦，感觉短短两天让我的状态一直是在坐等点赞，真是需要戒断的欲望。

不过，还是从各个平台的推广当中初步学习到推广的一些细节和方法论，以便日后推广时有的放矢，节约精力。方法论总结起来，有4点；小细节总结起来，有其他3点。

### 方法论

* **流量分析**。通过数据可以拿到不同平台带来的流量差别，从而不同平台可以有不同的推广力度，合理分配资源
* **用户质量与数据**。视文章内容不同、平台偏好题材不同、平台主流用户不同，推广带来的效果也不同。所谓“效果”，可以浏览数、浏览时间、点赞数、评论数、相关链接点击数等数据来衡量
* **自动化发布**。第一点中提到的平台差异，其实有一点伪命题。如果能拿到各个平台发布、修改文章的API，再通过自动化的方式一键发布、推广到各个平台，则人力成本可以忽略不计
* **马太效应**。仓库越多人点赞，点赞的人质量越高，说明越靠谱，用户点赞的阻力也越小

方法论利于用户分析，但不要走投机取巧的路子（但知道了至少想投的时候能投投）。专注于自我提升与内容质量本身，而非其他厚薄。在方法论方面，phodal有一些文章可供参考

* [如何提高影响力](https://www.phodal.com/blog/how-to-improve-impact/)
* [程序员如何提高影响力2.0](https://www.phodal.com/blog/improve-impact-2/)
* [什么样的文章受欢迎](https://github.com/phodal/beautiful-content/blob/gh-pages/chapters/chapter1.md)

![](http://7xqu8w.com1.z0.glb.clouddn.com/my-marketing-platforms-and-bandwidth.png)

从上图看，主要的流量还是来自掘金和v2ex，掘金的流量是直接导到七牛的主站。至于用户质量、有效的目标群体等仍无法知晓，但至少是一个推广的好去处。

就编辑体验来讲，OSCHINA/CSDN两个平台支持markdown编辑~~哪个平台不支持markdown~~，前者还能自动生成目录，界面进行过改版，比以前有较大提升，但细看还是丑。从流量上看，OSCHINA贡献了一小块流量~~OSC上给人浓浓的圈子感我就不说了~~，CSDN则似乎不能帮忙推荐首页，文章发了两天，浏览量还是一位数。对于尚未建立平台和品牌的个人程序员来说，要获取流量似乎比较困难。

iteye和博客园，两个网站都不支持用markdown编辑，要先在其他地方用markdown here转一次再copy过来，遑论其他手动编辑方法的效率。iteye的流量大概是OSChina的三倍左右，三小丢丢；博客园发布了两天，浏览量一位数以内。

segmentfault是我用过样式最好的网站，有目录，markdown渲染样式稳重不浮夸，可惜流量也不多。还有其他一些推广网站，比如githuber/百度知道等，流量都非常小。

### 小细节

* **吸引人的题目**。资讯辣么多，你平时浏览会怎么办？是不是先看题目抓不抓人，筛选出有兴趣的文章？除了被消费，我们似乎也没有更好的办法。下面列出了一些常用的题目模式
    * _我是如何xxx的_
    * _xxx的38个xxx（技巧、平台、工具、网站）_
    * _xxx，看这一篇就够了_
    * _xx屌丝的xx逆袭_
    * _15年编程生涯，资深架构师总结的7条经验_
* **图片**。一定要有一个封面图片，不需要内容非常相关，只要让人看了有食欲就行。这是另一个主题，无需多加发挥
* **目录**。很多时候，可能没什么兴趣看完你的整篇文章，只要被标题吸引进来了，这时有一个目录（如[OSC](http://my.oschina.net/u/1581831/blog/704441)和[segmentfault](https://segmentfault.com/a/1190000005858229)）明明白白指示文章结构，粗略滚动一下屏幕，如果看着图片又多，排版又好，内容也不差，点个赞，存个书签，表示到此一游了，就可以关掉页面点击下一个了
* **资源收集类**。比如一些awesome-list，资源收集、网站收集，点个赞，收藏个书签

其实小细节我觉得都反映出的是一个问题，就是看文章对于我们来说似乎已经变成一种阻力极小的习惯，我们更倾向于在碎片时间进行这种更加轻松不用动脑的阅读，安慰自己时刻在学习，但其实并没有进行深入阅读的心境，长期而言，被消费的其实是我们的时间和思考能力。如何应对？以我为主，网络和平台都只是工具，真正核心在自己所爱所想。去坚持，去生活，把时间给自己，给爱的人，就足够了，别没事晒照片逛论坛了。

—— 2016-07-03
