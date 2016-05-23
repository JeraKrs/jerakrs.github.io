---
layout: post
title: 使用Github Pages搭建个人博客
description: Github作为一个代码社区，管理着许多项目代码，为了使项目能够清晰直观地呈现给别人，介绍文档是不可或缺的，甚至有时需要一个完整的文档站。而Github Pages就是提供给用户用于介绍托管在Github上的项目，使用它可以很方便的建立自己的独立博客，并且免费。
category: study
---

开始写博客已经有三年了，一开始写博客是因为学习算法，在各种不同的OJ上刷题，然后写题解。后来觉得社区提供的版面样式太单一了，所以萌生了自己搭建博客站点的想法，而且有自己独立的域名也是挺酷的一件事。最近几天跟着网上的教程自己动手搭了博客，就写篇分享下经验。

## Github Pages
如何使用、安装Git我就不多说了，但是使用[Github Pages][]，首先要注意的是Github Pages采用的是HTTP协议，不是HTTPS，区别在于HTTPS协议是由SSL+HTTP协议构建的可进行加密传输、身份认证的网络协议，所以不要做一些敏感的操作处理，比如发送用户密码；并且Github Pages限制每月带宽为100GB和10000次请求，每个站点有1G的空间。

Github Pages有以下几个优点：

* 轻量级的博客系统，没有麻烦的配置
* 使用标记语言，比如[Markdown](https://maxiang.io/)
* 无需自己搭建服务器，免费空间
* 可以绑定自己的域名

[Github Pages]: http://pages.github.com/ "Github Pages"
