---
title: 说开去——项目的JavaScript模块化实践（下篇）
---

为保护商业机密，本博客中出现的所有代码与文字均已隐去所有与客户相关的信息。若仍有泄露请第一时间联系博主我：linesh.simpcity@gmail.com。

## 再次出发

在这个说开去系列的[上篇](#/posts/2016-03-17-a-module-require-confusion)中，我们已经回答了项目自带的模块化的实现，同时也带出了更多的问题，总结起来有以下这些。它们是本篇视图回答的问题：

* `module.js`是如何被打包到`laodian-basic.js`中去？
* 我们找到的这个js是在什么地方被include到页面上的？
* 什么时候被include进来的？
* 项目上用了什么方式来复用include这个js的那段代码？

### 如何打包？
上面我们还留下了一条线索：`laodian-basic.js`。既然`module.js`没有被引用的地方，那么就搜索下`laodian-basic.js`的引用点。这里我看到了两个引用点：

1. ```jawr.js.bundle.laodian.id=/bundles/laodian-basic.js```
2. ```<laodian:script bundle="/bundles/laodian-basic.js" useVersionNumber="true" />```

看来似乎是配置了一些东西，然后直接在前端jsp(咦前端jsp怎么听起来怪怪的)通过`jsp tag`来引用。其中，第一个文件位于一个`jawr.properties`文件下，第二个文件的目录结构如下图所示。

![brand-specific-jsp-directory-structure](http://7xqu8w.com1.z0.glb.clouddn.com/a82b64e24b984d2a92c0c39397481825.png)

百年老店的项目有一个特点，就是支持多品牌，同一套代码需要服务不同地区的用户。我们挑了一个服务于大英地区的文件`british.jsp`，`Alt+F7`之，不能找到它的引用点。如我们第4点所要探索的问题所指出，由于要支持多品牌多页面，这个文件可能最终是通过这样的形式来被使用的：`<%@ include file="${brand}.jsp" %>`（手动反射）。这个目前还没有太多线索，那么先看看第一条线索，Google一下[jawr](https://jawr.java.net/index.html)：它是一个可配置的、支持共用开发与发布代码的JS/CSS文件压缩与打包工具。配置简单：

```java
jawr.js.budnle.laodian-basic.id=/bundle/laodian-basic.js
jawr.js.budnle.laodian-basic.child.names=laodian-pages
jawr.js.budnle.laodian-pages.mappings=/js/laodian-pages/**/*.js
```

看到上面这段代码就很清楚了，jawr会把`/js/laodian-pages/`文件夹下的所有js文件打包到`laodian-basic.js`文件中。JAWR其实还有一个`JawrServlet`，它会去读取`jawr.properties`(在`web.xml`文件的`init-param`配置`configLocation`)中的配置，并且拦截所有匹配`/js/*`的路径。


### js是如何被引用到页面上的？——SiteMesh
从上面搜搜到的这段代码已经可以看出，`laodian-basic.js`这个文件是在`british.jsp`中被引用的，后者引入了大量的CSS/JS/FAVICON等文件，似乎是一个入口文件，但它却没有再被其他文件引用：

```html
<head>
  <script type="text/javascript" src="laodian/common/js/laodian-libraries.generated.js"></script>
  <script type="text/javascript" src="laodian/common/js/bootstrap.generated.js"></script>
  <home:script bundle="/bundles/laodian-basic.js" useVersionNumber="true" />

  <link rel="stylesheet" type="text/css" href="laodian/british/css/british-specific.less" />
</head>

<body id="${activePage}" class="${activePage}">
  <decorator:usePage id="specific-page" />
  <div class="page">
    <header class="Header">...</header>
    <main id="main-wrapper">
      <decorator:body />
    </main>
    <footer class="Footer">...</footer>
  </div>
</body>
```

笔者眼尖，看到了`<decorator>`这个标签。它是SiteMesh框架定义的一个标签，sitemesh是一个分离页面内容和展现（presentation）的轻量级框架，其设计中运用了四人帮的装饰模式。Google Trends了一下它的热度，以及与它同类型的一些产品/框架的趋势，如下图，看起来似乎都要挂了。sitemesh3/tiles分别已经1/2年没维护了，只有wicket还在持续对Java8增加支持。这是不是意味着它所依附的模板技术也差不多日暮西山了？而模板技术又是前后端难以分离的一个重要的点，其实也从侧面印证了前后端分离的大趋势吧。

![Trends-jsp-freemarker-etc](http://7xqu8w.com1.z0.glb.clouddn.com/f366e36a7e197a73e0b3cb46c563658d.png)

![Trends-sitemesh-tiles-etc](http://7xqu8w.com1.z0.glb.clouddn.com/0b4e597eb0f1fba6eefa6c0d774e0961.png)

Anyway不要跑题，火速看一下sitemesh的[文档](http://wiki.sitemesh.org/wiki/display/sitemesh/Setup+SiteMesh+in+5+Minutes+or+Less)，寻找启动项目的配置文件：`decorator.xml`！搜索一下项目的对应配置文件，果然有。看它的配置文件：

```xml
<decorators defaultdir="/WEB-INF/decorators">
  <decorator name="master-decorator" page="main.jsp">
    <pattern>/british</pattern>
    <pattern>/america</pattern>
    <pattern>/...</pattern>
  </decorator>
</decorators>
```

这段代码在向我殷殷诉说：从特定路径下来的页面请求都会被`main.jsp`文件所前置装饰，再看到`main.jsp`文件：

```java
...
<%
  try {
    String target = getLocale();
    request.getRequestDispatcher("/WEB-INF/decorators/" + target + ".jsp")
      .include(request, response);
  } catch (...) {
%>
```

这段代码也验证了我们一开始的判断，即我们是通过类似`${locale}.jsp`的形式来引用目标jsp文件的。至此所有实现都已经很清楚了：**通过SiteMesh对所有待渲染页面进行装饰，根据不同的地区分配到不同的`${locale}.jsp`模板去，后者再开始加载框架性（module模块化实现等）代码，最后渲染一般的html/js/jsp(template)。**

## 总结与思考 Further Thinking

许多时候一个项目的框架已经搭好，我们在使用的时候很少不会接触框架性的部分，比如js/css的压缩加载过程、多品牌的处理、框架选型等。既要写好业务代码，对于技术代码框架代码也要多了解，学会自己选型、搭脚手架。本文上篇讨论的其实是模块化的问题，下篇话题擦了模板技术的一点皮毛。深挖下去，还有许多问题可以了解：

* 模块化的现状与实现。包括吕立青在[这里](http://blog.jimmylv.info/2016-03-10-getting-webpack-done-and-js-module-history)提到的一些相关技术或规范：CommonJS/AMD/WebPack/Browserify/NodeJS等
* 模板技术。模板技术是依托于后端技术选型的，在选型的时候必须考虑现有的技术构架和迁移成本。另外在讨论模板技术孰优孰劣之前，也有必要先思考一下它所依托的后端框架的发展现状，比如Spring的生态圈（MVC/Boot)，比如是否必须要用Java来写后端代码等
