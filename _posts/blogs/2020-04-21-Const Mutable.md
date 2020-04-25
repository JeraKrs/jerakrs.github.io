---
layout: post
title: C++ const & mutable 关键字
description: C++ const 可以指定一个语义约束（指定一个不该被改动的对象），而编译器会强制实施这项约束。而mutable是为了突破 const 的限制而设置的，被mutable修饰的变量，将永远处于可变的状态，即使在一个const函数中。
category: C++
---

## Const 关键字

const 可以指定一个语义约束（指定一个不该被改动的对象），而编译器会强制实施这项约束。const 常用于修饰变量、指针、变量引用、成员函数等，可以起到一定的约束作用。对于用 const 类对象、指针、引用，只能调用类的const成员函数。 

### 修饰变量

const 修饰变量一般有两种，两种写法没有区别，都是表示变量的值不可变。

```c++
const TYPE value;
TYPE const value;
```

### 修饰指针

而用 const 关键字修饰一个指针的话，不同的写法会有不同情况：如果关键字 const 出现在星号左边，表示被指物是常量；如果出现在星号右边，表示指针自身是常量；如果出现在星号两边，表示被指物和指针都是常量。

```c++
char greeting[] = "Hello";
char* p = greeting;                // non-const pointer, non-const data;
const char* p = greeting;          // non-const pointer, const data;
char* const p = greeting;          // const pointer, non-const data;
const char* const p = greeting;    // const pointer, const data;
```

可以简单理解成 const 修饰的为 const 关键字右边的东西：

- `const char** p` ：指向一个 pointer 的指针 p，pointer 是一个指向const data的指针，我们可以通过指针 p 修改pointer的值，也可以修改指针 p 的值，但是不能通过p或pointer修改pointer指向的对象；
- `const char* const * p` ：指向一个 const pointer 的指针 p，pointer 是一个指向const data的指针，我们不可以通过 p 修改 const pointer 的值和 const pointer 指向的对象的值，但是可以修改指针 p 的值；
- `const char* const * const p` ：指向一个 const pointer 的指针 p，pointer 是一个指向const data的指针，不可以通过指针 p 修改 const pointer 的值和 const pointer 指向的对象的值，也不可以修改指针 p 的值；

### 修饰成员函数

- `const T func()` 表示返回的为 const 类型；
- `T func() const` 表示函数不能修改其成员变量； 

我们知道，成员函数的第一参数为默认的 `this` 指针，如果在成员函数后加 const 关键词，则传入的 `this` 指针是一个 const 指针。成员函数如果是 const 意味着什么？这里有流行的概念：bitwise constness（又称 physical constness）和 logical constness。

**bitwise constness** 认为，成员函数只有在不更改对象中任何成员变量时，才可以说是 const。不过很多成员函数虽然不具备 const 性质，但是却能通过 bitwise 测试，例如：

```c++
class CTextBlock {
public:
    char& operator[](std::size_t position) const {
        return pText[position];
    }
private:
    char* pText;
};
```

**logical constness**  主张一个 const 成员函数可以修改它所处理的对象内的某些 bits，但只有在客户端侦测不出的情况下才可以。但有时候符合 logical constness 的 const 成员函数并不能通过编译器，这时需要用 mutable（可变性）释放掉 non-static 成员变量的 bitwise constness 约束。

```c++
class CTextBlock {
private:
    mutable std::size_t textLength;
};
```

### 修饰引用

真实程序中 const 对象大多用于函数的 passed by pointer-to-const 或者 passed by reference-to-const 传递结果，可以减少值拷贝。

## Mutable 关键字

在C++中，mutable 也是为了突破const的限制而设置的。被 mutable 修饰的变量，将永远处于可变的状态，即使在一个 const 函数中。

```c++
class Node {
public:
	Node() : count(0) {}

	void process() const {
		count = count + 1;
		printf("%d\n", count);
	}
private:
	mutable int count;
};
```