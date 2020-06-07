---
layout: post
title: C++ 全局变量初始化顺序问题
description: 如果某编译单元内的 non-local 对象的初始化动作使用了另一编译单元内的 non-local 对象，可能因初始化顺序不明确导致异常情况。
category: C++
---

## 问题描述

C++ 对”定义于不同编译单元内的 non-local 对象“ 的初始化次序无明确定义，所以当某个编译单元内的 non-local 对象的初始化操作依赖了另一个编译单元内的 non-local 对象，可能因初始化顺序导致异常情况发生。下面举一个例子：

```c++
// file_system.h
class FileSystem {
public:
	FileSystem(int* p_size) : _p_size(p_size) {
		printf("tfs init.\n");
	}

	int size() const {
		return *_p_size;
	}
private:
	int* _p_size;
};

// file_system.cpp
extern Dick dic;
FileSystem tfs(dic.p_size());

// directory.h
class Directory {
public:
	Directory();
	int size() const;
private:
	int _size;
};

class Dick {
public:
	Dick();
	int* p_size() const;
private:
	int* _p_size;
};

// directory.cpp
int maxn = 100;
extern FileSystem tfs;

Directory::Directory() {
	_size = tfs.size();
	printf("dir init\n");
}

int Directory::size() const {
	return _size;
}

Dick::Dick() {
	_p_size = &maxn;
	printf("dic init\n");
}

int* Dick::p_size() const {
	return _p_size;
}

Directory dir;
Dick dic;

// main.cpp
extern Directory dir;

int main () {
	printf("%d\n", dir.size());
	return 0;
}
```

这里一共三个编译单元，dir 和 dic 两个变量在同一个编译单元内，在同一编译单元内，全局变量初始化顺序按照定义顺序，所以 dir 的初始化操作在 dic 前，而 dir 初始化依赖 tfs，tfs 变量的初始化依赖 dic。这里虽然是主动实现一个依赖循环，但是这也说明了一个问题，全局变量的初始化操作顺序是不明确的。

## 解决方案

为了避免全局变量初始顺序不明确导致的问题，最好避免全局变量的初始化操作依赖另一个编译单元的全局变量，或者把它们放到同一个编译单元内（因为同一个编译单元内的全局变量初始化顺序按照定义顺序）。如果无法避免，我们可以通过 Singleton 模式，将每个全局变量对象搬到自己的专属函数内，并且该对象在此函数内被声明为 static：

```c++
FileSystem& tfs() {
  static FileSystem fs;
  return fs;
}
```

