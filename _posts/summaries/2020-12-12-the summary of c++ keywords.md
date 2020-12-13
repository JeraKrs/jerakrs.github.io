---
layout: post
title: 【总结】C++ 关键字梳理
description: 关键字（keyword）属于保留字，是整个语言范围内预留的标识符。C++11 标准一共有71个关键字，每个关键字都有特殊的含义。经过预处理后，关键字从预处理记号中区别出来，剩下的标识符作为记号，用于声明对象、函数、类型、命名空间。
category: summary
---

## auto 关键字

auto （[cppreference-auto](https://en.cppreference.com/w/cpp/keyword/auto)）可以让编译器自动判断变量的类型，不过 auto 定义的变量不带有 const 属性，并且不会定义变量的引用。

```
auto i =100; // i is int
auto p = new A(); // p is A*
const double eps = 1e-6;
auto f = eps; // f is double
```

如果想要让变量带 const 属性，或是定义一个应用，需要显示指明：

``` c++
int i = 1;
const auto ci = i;
auto& di = i;
```

## const 关键字

const （ [cppreference-const](https://en.cppreference.com/w/cpp/keyword/const )）可以指定一个语义约束，指定一个不该被改动的对象，而编译器会强制实施这项约束。const 常用于修饰变量、指针、变量引用、成员函数等，可以起到一定的约束作用。对于一个类的 const 对象、指针、引用，只能调用类的 const 成员函数。 

**修饰变量**：const 修饰变量一般有两种，两种写法没有区别，都是表示变量的值不可变：

```c++
const TYPE value;
TYPE const value;
```

**修饰指针**：用 const 关键字修饰一个指针的话，不同的写法会有不同情况，如果关键字 const 出现在星号左边，表示被指物是常量，此时指针的值可以修改，但是不可以通过指针取修改被指变量的值；如果出现在星号右边，表示指针自身是常量，此时指针的值是不能更改的，但是可以通过指针修改被指变量的值；如果出现在星号两边，表示被指物和指针都是常量，都是不能被修改的。

```c++
char greeting[] = "Hello";
char* p = greeting;                // non-const pointer, non-const data;
const char* p = greeting;          // non-const pointer, const data;
char* const p = greeting;          // const pointer, non-const data;
const char* const p = greeting;    // const pointer, const data;
```

可以简单理解成 const 修饰的为关键字右边的东西，例如：

- `const char** p`：指向一个 pointer 的指针 p，pointer 是一个指向 const data 的指针，我们可以通过指针 p 修改 pointer 的值，也可以修改指针 p 的值，但是不能通过 p 或 pointer 修改 pointer 指向的对象；
- `const char* const * p` ：指向一个 const pointer 的指针 p，pointer 是一个指向 const data 的指针，我们不可以通过 p 修改 const pointer 的值和 const pointer 指向的对象的值，但是可以修改指针 p 的值；
- `const char* const * const p` ：指向一个 const pointer 的指针 p，pointer 是一个指向 const data 的指针，不可以通过指针 p 修改 const pointer 的值和 const pointer 指向的对象的值，也不可以修改指针 p 的值；

**修饰成员函数**：

- `const T func()` 表示返回的为 const 类型；
- `T func() const` 表示函数不能修改其成员变量； 

我们知道，成员函数的第一参数为默认的 `this` 指针，如果在成员函数后加 const 关键字，则传入的 `this` 指针是一个 const 指针。成员函数如果是 const 意味着什么？这里有流行的概念：bitwise constness（又称 physical constness）和 logical constness。

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

**修饰引用**：真实程序中 const 对象大多用于函数的 passed by pointer-to-const 或者 passed by reference-to-const 传递结果，可以减少值拷贝。

```c++
void function(const int&, const int&);
```

**constexpr**：常量表达式是指在编译期间就可以确定值的表达式，我们可以通过 constexpr 告诉编译器这时一个常量表达式。

```c++
constexpr int fm = 10;
constexpr int limit = fm + 1;
```

## decltype 关键字

decltype （[cppreference-decltype](https://en.cppreference.com/w/cpp/keyword/decltype)）可以在编译期间解析一个变量或是表达式的的类型，它解析出来的类型可以带 const 属性，也可以是个引用。

```c++
const double eps = 1e-6;
decltype(eps) f = eps; // f is const double

double a = 10;  
double& da = a;   
decltype(da) dda = a; // dda is double&
```

## explicit 关键字

explicit （[cppreference-explicit](https://en.cppreference.com/w/cpp/keyword/explicit)）用来修饰构造函数声明，表示显式构造函数。

```c++
class Student {
public:
    Student() : _data(NULL) {}
    explicit Student(const int* data) : _data(data) {}
    ~Student() {}
private:
    const int* _data;
};
```

## extern 关键字

extern （[cppreference-extern](https://en.cppreference.com/w/cpp/keyword/extern)）可以用来修饰变量或者函数，表示变量或者函数的定义在别的文件中，提示编译器遇到此变量和函数时在其他模块中寻找其定义，可以理解成是对变量和函数的一个声明。

**extern 修饰一个 const 变量**时比较特殊，通常有两种方法，一是在定义变量前加 extern 修饰，二是在头文件中进行变量声明，然后使用的源文件中引入该头文件。

```c++
// main.cpp
#include <stdio.h>
#include "define.h"

extern int var;
extern const int extern_const_var;
extern const char* const_char_point;

int main () {
	printf("var=%d\n", var);
	printf("const_var=%d\n", const_var);
	printf("extern_const_var=%d\n", extern_const_var);
	printf("const_char_point=%s\n", const_char_point);
	return 0;
}

// define.h
extern const int const_var;

// define.cpp
#include "define.h"
int var = 0;
const int const_var = 0;
extern const int extern_const_var = 0;
const char* const_char_point = "const_char_point";

// compile command: g++ main.cpp define.cpp
```

**extern "C"**的主要作用就是为了能够正确实现C++代码调用其他C语言代码，加上extern "C"后，会指示编译器这部分代码按C语言（而不是C++）的方式进行编译。

```c++
extern "C"{
	// C-style code
}
```

## inline 关键字

被 inline（[cppreference-inline](https://en.cppreference.com/w/cpp/keyword/inline)）修饰的函数为内联函数，内联函数在内部工作时将对应的函数替换成执行的代码，以减少频繁调用函数对栈内存重复开辟所带来的消耗。内联函数内的代码必须简单，不能包含复杂的结构控制语句，例如 while、switch，并且不能是递归函数。

定义在类中的成员函数缺省是内联的。内联函数的定义最好是放在头文件中，因为内联函数要在调用点展开，所以编译器必须随处可见内联函数的定义，要不然就成了非内联函数的调用了。

```c++
// itx.h
class ITX {
public:
  int value() const {} // 默认为内联的
  void set_value();
};

// itx.cpp
inline void ITX::set_value() {} // 主动声明内联
```

inline 只是对编译器的一个建议，最终函数是不是内联函数取决于编译器的判断。**慎用inline**：内联函数是以代码膨胀为代价，去节约函数调用的开销。

**对比 define**：

- inline 由编译器处理，直接用函数体的逻辑替换函数调用处。
- `#define` 由预处理器处理，只是简单的进行文字替换。

## mutable 关键字

mutable（[cppreference-mutable](https://en.cppreference.com/w/cpp/keyword/mutable) ） 用于类的非静态非 const 数据成员，表示不受到 const 的限制，可以在 const 成员函数中修改该变量：

```c++
class CTextBlock {
public:
	CTextBlock() : count(0) {}
	void process() const {
		count = count + 1;
		printf("%d\n", count);
	}
private:
	mutable int count;
};
```

## sizeof 关键字

sizeof （[cppreference-sizeof](https://en.cppreference.com/w/cpp/keyword/sizeof)）用来计算一个类型或者一个变量占用的内存大小，一般情况是在编译时求值，所以 sizeof 中的表达式是不会被执行的。

```
int i = 0;
sizeof(i++); // i 仍然等于1
```

**sizeof数组和指针**：

- sizeof 数组：数组长度乘以数组类型所占用字节数；
- sizeof 指针：固定为指针所占用字节数（8）；

**对比 strlen**

1. sizeof 是一个操作符，strlen 是库函数。
2. sizeof 的参数可以是数据的类型，也可以是变量，而strlen 只能是以 `\0` 结尾的字符串作为参数。
3. 编译器在编译期计算出 sizeof 的结果，sizeof 计算的是数据类型占内存的大小；strlen 是在运行的时候才能算出，计算的是字符串的长度。
4. 数组传递给 sizeof 不会退化，传递给 strlen `会退化为指针。

**计算空类的内存大小**

1. 空类占用内存的大小为1。
2. 如果只定义了构造函数、析构函数、成员函数，但是没有定义虚函数时，内存占用仍为1。
3. 如果定义了虚函数，那么内存大小为4，因为有个指向虚表的指针。

sizeof 计算的是栈区中分配的大小，不在栈区的都不计算。比如类中的静态成员变量（放在全局数据区/静态存储区），构造函数/析构函数/普通成员函数/ 静态成员函数（放在程序代码区）。

## static 关键字

static （[cppreference-static](https://en.cppreference.com/w/cpp/keyword/static)）的用法可以分为两类：面向过程程序设计中的 static 和面向对象程序设计中的 static。

### 面向过程程序设计中的 static

**静态全局变量**：在全局变量前，加上关键字 static，该变量就被定义成为一个静态全局变量。静态变量在全局变量数据区分配内存，并且未经初始化静态全局变量会被程序自动初始化为0。

```c++
static int x; // x = 0
```

如果静态全局变量定义在源文件中，那么该变量的作用域仅限定在当前文件中（即静态全局变量不可以通过 extern 扩大作用域）；如果定义在头文件中，那么引入该头文件的文件均可访问该变量。

**静态局部变量**：在局部变量前，加上关键字 static，该变量就被定义成为一个静态局部变量。一般局部变量的存放在栈空间上，作用域仅在函数内，生命周期也是在函数的调用期间。而静态局部变量存放在全局变量数据区，虽然作用域也仅在函数内，但是生命周期为整个程序运行期间。

```c++
void func() {
	static int count = 0;
	printf("%d\n", count++);
}
int main () {
	func(); // output: 0
	func(); // output: 1
	func(); // output: 2
	return 0;
}
```

**static 修饰函数**：将函数的作用域限定在当前源文件中，使得其他文件无法使用该函数。

### 面向对象程序设计中的 static

**静态成员变量**：被 static 修饰的成员变量为静态成员变量，静态数据成员在程序中也只有一份拷贝，由该类型的所有对象共享访问。

```c++
class STextBlock {
public:
	static int count;
};
int STextBlock::count = 0; // 静态成员变量的初始化
```

静态成员变量有两种访问方式：通过类名访问 和 通过变量访问。

```c++
STextBlock::count = 10; // 通过类名访问
STextBlock x;
x.count = 10; // 通过变量访问
```

**静态成员函数**：在成员函数前加 static 关键字，静态成员函数可以通过类名直接访问静态成员变量。

## volatile 关键字

volatile（[cppreference-volatile](https://en.cppreference.com/w/cpp/keyword/volatile)） 表明变量可能会通过某种方式发生改变，所以它会告诉编译器不要去优化该变量的相关操作。我们来做个简单的实验，下面有两段代码：

```c++
// a.cpp
int main () {
	int a;
	a = 5;
	a = 7;
	printf("%d\n", a);
	return 0;
}
// b.cpp
int main () {
	volatile int a;
	a = 5;
	a = 7;
	printf("%d\n", a);
	return 0;
}
```

默认情况下，编译器的优化等级是固定，所以我们在编译的时候加上 `-O3` 参数，对比两个源文件的汇编产物可以发现，没有 volatile 修饰的话， `a=5` 这行代码会被优化。

```shell
g++ -O3 -S a.cpp -o a.s
g++ -O3 -S b.cpp -o b.s
```

## 参考文献

2. [C++ Primer, 5th Edition](https://book.douban.com/subject/24089577/)
2. [en.cppreference.com](https://en.cppreference.com/w/)
