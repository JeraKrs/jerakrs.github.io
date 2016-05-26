---
layout: post
title: 使用Github Pages搭建个人博客
description: Github作为一个代码社区，管理着许多项目代码，为了使项目能够清晰直观地呈现给别人，介绍文档是不可或缺的，甚至有时需要一个完整的文档站。而Github Pages就是提供给用户用于介绍托管在Github上的项目，并且使用它可以很方便的建立自己的独立博客，并且免费。
category: study
---

开始写博客已经有三年了，一开始写博客是因为学习算法，在各种不同的OJ上刷题，然后写题解。后来觉得社区提供的版面样式太单一了，所以萌生了自己搭建博客站点的想法，而且有自己独立的域名也是挺酷的一件事。最近几天跟着网上的教程自己动手搭了博客，所以写篇文章分享下经验。

## Github Pages
如何使用、安装Git我就不多说了，但是使用[Github Pages][]，首先要注意的是Github Pages采用的是HTTP协议，不是HTTPS，区别在于HTTPS协议是由SSL+HTTP协议构建的可进行加密传输、身份认证的网络协议，所以不要做一些敏感的操作处理，比如发送用户密码；并且Github Pages限制每月带宽为100GB和10000次请求，每个站点有1G的空间，对于个人博客而言绰绰有余了，当然这个限额并不是说超过了就会怎样，只是Github会发邮件建议你将网站搬到其它平台上。

你也可以选择使用[WordPress][]搭建个人博客，一种使用PHP语言开发的博客平台，用户可以在支持PHP和MySQL数据库的服务器上架设属于自己的网站。

而我选择Github Pages是因为以下几个优点：

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

### 搭建本地jekyll环境

安装Jekyll是一个很简单的过程。但是有时候因为你的电脑的一些配置，前提环境的问题，又会变得很复杂。所需要的前提环境有：

* 需要有Ruby
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

RubyGems 是一个 Ruby 包的管理工具，就像 Homebrew，npm 等，可以下载 [安装包](https://rubygems.org/pages/download)到本地。安装到本地之后，在终端检查更新：

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

至此，你已经成功在本地电脑上安装好了 Jekyll。如果你使用Markdown的话，需要安装Markdown的解释器，并且在你的_config.yml里面设置`markdown:rdiscount`

	$ gem install jekyll rdiscount

#### Jekyll 的使用

切换到你的博客目录，输入命令：

	$ jekyll serve --watch

然后就可以通过端口`localhost:4000`来访问你的主页了。

### Jekyll 模板系统

## 购买、绑定独立域名

## 使用GitHub Pages建立博客

## 使用Disqus 实现评论功能

## 代码高亮插件

## 外部样式

## 结语






[Github Pages]: http://pages.github.com/ "Github Pages"
[WordPress]: https://cn.wordpress.org/ "WordPress"
[Markdown]: https://maxiang.io/ "Markdown"

