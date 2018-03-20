---
layout: post
title: 使用Github Pages搭建个人博客
description: Github作为一个代码社区，管理着许多项目代码，为了使项目能够清晰直观地呈现给别人，介绍文档是不可或缺的，甚至有时需要一个完整的文档站。而Github Pages就是提供给用户用于介绍托管在Github上的项目，并且使用它可以很方便的建立自己的独立博客，并且免费。
category: blog
---

开始写博客已经有三年了，一开始写博客是因为学习算法，在各种不同的OJ上刷题，然后写题解。后来觉得社区提供的版面样式太单一了，所以萌生了自己搭建博客站点的想法，而且有自己独立的域名也是挺酷的一件事。最近几天跟着网上的教程自己动手搭了博客，所以写篇文章分享下经验。

## Github Pages
如何使用、安装Git我就不多说了，但是使用[Github Pages][]，首先要注意的是Github Pages采用的是HTTP协议，不是HTTPS，区别在于HTTPS协议是由SSL+HTTP协议构建的可进行加密传输、身份认证的网络协议，所以不要做一些敏感的操作处理，比如发送用户密码；并且Github Pages限制每月带宽为100GB和10000次请求，每个站点有1G的空间，对于个人博客而言绰绰有余了，当然这个限额并不是说超过了就会怎样，只是Github会发邮件建议你将网站搬到其它平台上。

你也可以选择使用[WordPress][]搭建个人博客，WordPress一种使用PHP语言开发的博客平台，用户可以在支持PHP和MySQL数据库的服务器上架设属于自己的网站。

而我选择使用Github Pages是因为以下几个优点：

* 轻量级的博客系统，不需要麻烦的配置
* 可以使用自己喜欢的编辑器或标记语言，比如[Markdown][]
* 无需自己搭建服务器，免费流量和空间，但每月有限额
* 可以绑定自己的域名

当然，Github Pages也存在局限性：

* 需要一定技术支持，例如使用Git和网页开发经验
* 静态网页，动态功能必须使用外部服务，例如评论
* 无法使用数据库，不适于与大型网站

## Jekyll
GitHub Pages为了提供对HTML内容的支持，选择了Jekyll作为模板系统，Jekyll是一个静态站点生成器，它会根据网页源码生成静态文件。它提供了模板、变量、插件等功能，所以可以用来编写整个网站。你可以查看Jekyll的[官方文档](http://jekyllrb.com/docs/configuration/)。

### 搭建本地 Jekyll 环境

安装Jekyll是一个很简单的过程。但是有时候因为你的电脑的一些配置，前提环境的问题，又会变得很复杂。所需要的前提环境有：

* 需要安装有Ruby
* 在Ruby的基础上，安装好RubyGems
* Linux, Unix, or Mac OS X
* Python

#### 安装Ruby

在本地安装Ruby，Linux系统下操作：

	$ sudo apt-get install ruby2.3.1

Mac系统下使用homebrew进行安装：
		
	$ brew install ruby

安装完之后，在终端检查是否安装好。运行ruby -v，查看ruby版本。

#### 安装 RubyGems

RubyGems 是一个 Ruby 包的管理工具，就像 Homebrew，npm 等，可以下载 [安装包](https://rubygems.org/pages/download)到本地。然后，在终端检查更新：

	##可能需要根权限
	$ gem update --system

	##检查安装情况，输出当前版本
	$ gem -v

#### 安装 Jekyll

最好的安装方法应该是通过 RubyGems 来安装，在终端输入：

	##可能需要根权限
	$ gem install jekyll
	
	##同样在安装完成后输出版本号检查结果
	$ jekyll -v

至此，你已经成功在本地电脑上安装好了 Jekyll。如果你使用Markdown的话，需要安装Markdown的解释器，并且在你的\_config.yml里面设置`markdown:rdiscount`

	$ gem install jekyll rdiscount

#### Jekyll 的使用

切换到你的博客目录，输入命令：

	$ jekyll serve --watch

然后就可以通过端口`localhost:4000`来访问你的主页了。

### Jekyll 模板系统

Jekyll 其实就是一个文本的转换引擎，使用[Liquid](https://github.com/shopify/liquid/wiki/liquid-for-designers)板语言，支持一些标记语言，通过layout将文档拼装在一起展示。Jekyll 有着严格的结构定义：

```
/jekyll_demo
　　|--　_config.yml
　　|--  _includes
　　|--　_layouts
　　|　　　|--　default.html 
　　|--　_posts
　　|　　　|--　2016-05-27-hello-world.html
　　|-- _site
　　|--  index.html
```

#### \_config.yml

Jekyll 的配置文件，具体解释参见[官方文档](http://jekyllrb.com/docs/configuration/)。

#### \_includes

用来存放一些小的可复用的模块，通过`{ % include file.ext %}`（‘{’后的空格不加，下面同理）活调用。这条命令会调用**_includes/file.ext**文件。

#### \_layouts

这是模板文件存放的位置。使用模板需要通过YAML front matter来定义，`{ { content }}`标记可以将数据插入到这些模板中来。

#### _posts

动态内容，也就是你的博客正文所存放的文件夹。博客文件的命名有严格规定，必须以`日期+名称`的方式，例如**2016-05-27-XXX.md**。

每篇文章的头部，可以通过一个yaml文件头，来设置一些元数据。它用三根短划线"---"，标记开始和结束，里面每一行设置一种元数据。`layout: default`，表示该文章的模板使用**_layouts**目录下的**default.html**文件；`title: Hello World`，表示该文章的标题是"Hello World"，如果不设置这个值，默认使用嵌入文件名的标题，即"hello world"。而文章的分类索引也是通过元数据设定的，`category: study`。

```
---
layout: default
title: Hello World
category: study
---
```

#### \_site

这个是 Jekyll 运行后生成的最终的文档，不用去关心。

#### index.html

博客的首页，即输入网址后默认显示的页面。

以上是 Jekyll 模板固定的结构，其它的可以根据个人需求自行添加。如果需要实例的话，可以参照我的[项目源码](https://github.com/JeraKrs/jerakrs.github.io)。


## 关联 Github

GitHub Pages分两种，一种是你的GitHub用户名建立的`username.github.io`这样的用户&组织页（站），另一种是依附项目的pages。对于个人博客当然是属于第一种了，使用`username.github.io`就可以访问的网站，每个用户名下面只能建立一个。

在你的Github主页上创建一个项目，名为`username.github.io`（注意这里的username是你自己的用户名）。然后与你本地的博客目录绑定，怎么绑定这里就不过说了，和一般Git的使用一样。

每当有文件更新，比如新添加了一遍博客。可以通过：
		
	$ git add --all
	$ git commit -m""
	$ git push origin master

将文章推送到主页上。第一次页面生效需要的时间要长一些。

关于第二种项目pages，它和用户pages使用的后台程序是同一套，只不过它的目的是项目的帮助文档等跟项目绑定的内容，所以需要在项目的gh-pages分支上去提交相应的文件，GitHub会自动帮你生成项目pages。

## 购买、绑定独立域名

我的域名是在[新网](http://www.xinnet.com/?utm_source=pc&utm_medium=pz&utm_term=%E6%A0%87%E9%A2%98&utm_content=%E6%A0%87%E9%A2%98&utm_campaign=%E6%A0%87%E9%A2%98%E6%8F%8F%E8%BF%B0)上买的，[JeraKrs.com](jerakrs.com)。使用哪个服务商其实无所谓，只要能买到喜欢的、有个性的域名就行了。对于个人备案的，建议选择com/net；对于企业级备案的，建议选择cn。选定后注册对应服务商账号，购买想要的域名。

购买完域名之后需要做两个操作，一是在自己的项目根目录下添加一个**CNAME**文件，输入你的域名；二是在自己的域名下添加一条[A记录](http://baike.baidu.com/view/65575.htm)，地址就是Github Pages的服务IP地址：	192.30.252.153/154。这个地址可能会变，可以在[这里](https://help.github.com/articles/setting-up-an-apex-domain/)查看。如果绑定的是二级域名，则DNS要新建一条CNAME记录，指向username.github.com（将username换成你的用户名）。添加A记录的方法是在购买完域名后，点击解析，会跳转出域名管理的页面。


## 使用 Disqus 实现评论功能

上面提到 Github Pages 通过 Jekyll 生成的页面是静态页面，所以评论功能需要借助外部服务。我选用的是 [Disqus][]，而专做评论模块的产品有很多，比如国产的[多说][]，它支持国内主流社交网络平台，不过据说有剽窃用户数据的嫌疑。

Disqus 使用起来很方便，注册用户后，点击`Admin`：

![Alt text](/images/blogs/2016-05-28-01.png)

选择`Installing Disqus`，会跳转至选择平台的页面，选择`Universal Code`，Disqus会根据你的账户生成一段代码，复制到你的源码中。

```
	<div id="disqus_thread"></div>
	<script>
	/**
		* RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
		* LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables
	*/
	/*
	var disqus_config = function () {
	this.page.url = PAGE_URL; // Replace PAGE_URL with your page's canonical URL variable
	this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
};
	*/
	(function() { // DON'T EDIT BELOW THIS LINE
	var d = document, s = d.createElement('script');

	s.src = '//username.disqus.com/embed.js';

	s.setAttribute('data-timestamp', +new Date());
	(d.head || d.body).appendChild(s);
	})();
	</script>
	<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript" rel="nofollow">comments powered by Disqus.</a></noscript>
```

如果你不喜欢Disqus的样式，也可以根据他生成的HTML结构，自己改写样式覆盖它的。

## 代码高亮插件

如果是写技术博客，代码高亮少不了，我选用的是Google Code Prettify，基本支持任何语言。并且在使用上也很方便，将整个Google Code Prettify的文件夹拷贝到你的项目中，然后只需要在`<pre>`的标签上加入prettyprint就可以了。


## 外部样式

对于博客的样式呢，网上有很多模板，也有很多大牛的博客可以借鉴。我这里只给大家介绍一个[FontAwesome](http://fontawesome.dashgame.com/)一个图标文字库，现在也拓展CSS样式，使用起来很方便。

## 结语

至此，就算介绍完毕了，其实搭建个人不是非常难，只要动手尝试都能成功。



[Github Pages]: http://pages.github.com/ "Github Pages"
[WordPress]: https://cn.wordpress.org/ "WordPress"
[Markdown]: https://maxiang.io/ "Markdown"
[Disqus]: https://disqus.com/ "Disqus"
[多说]: http://duoshuo.com/ "多说"

