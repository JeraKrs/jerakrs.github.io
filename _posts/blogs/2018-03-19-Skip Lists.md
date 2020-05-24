---
layout: post
title: 浅析 Skip List 原理与实现
description: 跳跃列表由 William Pugh 发明，它是一种数据结构，允许快速查询一个有序连续元素的数据链表。快速查询是通过维护一个多层次的链表，且每一层链表中的元素是前一层链表元素的子集。
category: algorithm
---


## Skip Lists 数据结构简介

二叉树（binary trees）在解决查询问题过程中，当元素插入顺序是随机时，它具有非常好的性能，但当元素是按顺序插入时，二叉树会退化成一条链，此时的查询性能会非常差。平衡树（balanced tree）为了解决这种退化问题，在每个元素被添加时，会调整树的结构，使平衡树始终保持一个平衡的状态，以此来保证查询效率，但其相应的实现会较为复杂一些。

跳表（skip lists）本质上也是一种查询结构，用于解决算法中的查询问题，即对于给定的 Key 值，找到对应的 Value 值。跳表通常用来代替平衡树一类的结构，不同于平衡树的强制性平衡，跳表使用一种概率性的平衡，这样使得跳表的插入和删除操作变得简单和高效。

### 链表 vs 跳表

跳跃链表是由链表拓展而来，所以我们先看一下链表结构，*图 a*。一个有序链表，每个结点除了要保存 Key 和 Value 值之外，还需要维护一个正向指针（forward pointer）来指向下一个结点。最后一个结点的正向指针为空，表示没有下一个结点。在这样的一个链表中，如果需要查找某个数据，需要遍历整个链表直到找到包含数据的那个结点，复杂度为 $o(n)$。而跳跃链表在链表的基础上，给结点分配了不同的等级，等级1的结点拥有一个正向指针，并指向下一个等级大于1的结点；等级为2的结点拥有两个正向指针，分别指向下一个等级大于1和下一个等级大于2的结点；以此类推。我们以最高等级数为2的跳跃链表为例，*图 b*，所有新增加的指针连成了一个新的链表，这条新的链表可以看作是原先链表的一个快速通道。

假如我们现在要查询 $Key=13$ 结点的值：

* 先和 $Key=7$ 的结点比较（跳过 $Key=3$ 的结点）
* 因为 $13>7$，所以我们继续在快速通道上移动，和 $Key=21$ 的结点比较
* 因为 $13<21$，范围锁定在 $Key=7$ 和 $Key=21$ 这两个结点之间，此时我们将转移到等级1的链表上，和 $Key=9$ 的结点比较
* 因为 $13>9$，所以我们继续移动到下一个结点，$Key=13$ 的结点 

这就是跳跃链表的查询原理，上述例子并没有体现出跳远链表的效率，因为结点的个数比较少，我们将在后面分析跳跃链表的性能问题。

![Figure 01](https://farm5.staticflickr.com/4779/27085375228_93184b055f_z.jpg)


## Skip Lists 的实现

跳跃链表的实现主要有基本数据结构的定义，链表初始化，查找、插入和删除操作，以及随机数生成器和释放链表。 接下来我们以 C 语言实现一个跳跃链表，方便大家理解，完整代码见 https://github.com/JeraKrs/acm/blob/master/algo/linear-list/skiplist.hpp。

### 数据结构定义

首先，跳跃链表是由结点组成的，与普通链表不同的是，跳跃链表的结点有多个正向指针。一个等级为 n 的结点，会有 n 个正向指针。结点不需要储存等级，跳跃链表中的多条链表隐含了结点的等级。这里的 _key 和 \_value 分别是结点保存对象的 Key 和 Value 值，\_forwards 指向正向指针数组，如果在实际应用中，跳跃链表的等级是固定，这里 \_forwards 可以直接定义成数组。

```c++
template <typename Key, typename Value>
class SkiplistItem {
private:
	Key _key;
	Value _val;
	SkiplistItem** _forwards;
};
```

有了结点，接下来就是跳跃链表结构，这里的 \_size 表示当前跳表的结点个数、\_level 表示跳表当前的最大高度、\_lvl_prob 则决定了每个新增结点的等级、\_header 为头部指针。

```c++
template <typename Key, typename Value>
class Skiplist {
private:
	uint32_t  _size;
	uint32_t _level;
	double _lvl_prob;

	SkiplistItem<Key, Value>* _header;
};
```

### 初始化

使用跳跃链表之前，跳表对象会有个初始状态，这个初始化的过程我们通过构造函数来完成：

- \_size 和 \_level 初始值都为 0；
- _lvl_prob 由自己指定，该值会直接影响跳表中结点的平均高度，从而影响跳表的性能，所以要根据实际情况来决定；
- 这里我们加了 \_max_level 和 \_max_size 两个成员变量，分别用来限制链表的最大高度和最大长度；
- 初始化需要申请头部结点，头部结点无意义，它的所有正向指针一开始均为空指针，\_header 保存头部结点的地址；

```c++
Skiplist(double lvl_prob = SKIPLIST_LEVEL_PROB,
			uint32_t max_level = SKIPLIST_MAX_LEVEL,
			uint32_t max_size = SKIPLIST_MAX_SIZE) :
		_size(0), _max_size(max_size),
		_level(0), _max_level(max_level),
		_lvl_prob(lvl_prob) {
		
	_header = new (std::nothrow) SkiplistItem<Key, Value>(_max_level);

	if (!_header) {
		fprintf(stderr, "Skiplist: failed to apply memory space for Skiplist.\n");
		throw std::bad_alloc();
	}
}
```

### 查询算法

查找的过程中就是给定一个指定的 Key，查找这个 Key 是否出现在跳跃表中，如果出现，则返回其值，如果不存在，则返回不存在。跳跃链表的查询算法会从等级最高链表开始查找，直到没有下一个结点或下一个结点的 Key 值比当前查找的 Key 值大时，跳跃链表会移动到下一级链表上查找，以此类推，直到查找到匹配的Key值。以查询 $Key=13$ 为例，查询过程有 *图-c*。

![Figure 02](https://farm1.staticflickr.com/819/27085394288_e3ac2c2d7a_z.jpg)

其中红色链路为查找的过程，下面是查询算法的实现：

```c++
template <typename Key, typename Value>
bool Skiplist<Key, Value>::search(const Key& key, Value* res) {
	SkiplistItem<Key, Value>* x = _header;
	for (int i = _level - 1; i >= 0; --i) {
		while (x->_forwards[i]
				&& x->_forwards[i]->_key < key) {
			x = x->_forwards[i];
		}
	}

	if (x->_forwards[0]) {
		x = x->_forwards[0];
		if (!(x->_key < key) && !(key < x->_key)) {
			*res = x->_val;
			return true;
		}
	}

	return false;
}
```

### 插入算法

插入算法先找到对应 Key 值所在位置，插入算法和查询算法大致相似，不同的是这里需要用一个 updates 数组存放查询路径上每个等级链表的最后一项，用于更新链表。再新增结点时，先为结点随机分配一个等级，随机数生成器会在后面的篇幅讲到。假设现在我们需要将一个 Key=10 的结点插入跳跃链表中，首先是找到新节点的位置，并更新 updates 数组，如*图-d*。

![Figure 03](https://farm1.staticflickr.com/817/26084666217_32bd9e48ba_z.jpg)

假如新节点的等级为 2，那么我们就需要修改 updates[0] 和 updates[1] 指向的结点的 \_forwards[0] 和 \_forwards[1]，令它们指向新增的结点，并且新增结点的正向指针值为原先 updates[0] 和 updates[1] 指向的结点的 \_forwards[0] 和 \_forwards[1]，如*图-e*，和链表的插入方法一致，不同的是需要同时更新多条链表，而更新多少条链表取决于新增结点的等级。


```c++
template <typename Key, typename Value>
bool Skiplist<Key, Value>::insert(const Key& key, const Value& val) {
	if (_size >= _max_size) {
		return false;
	}

	SkiplistItem<Key, Value>* updates[_max_level];
	SkiplistItem<Key, Value>* x = _header;

	for (int i = _level - 1; i >= 0; --i) {
		while (x->_forwards[i] && x->_forwards[i]->_key < key) {
			x = x->_forwards[i];
		}
		updates[i] = x;
	}

	if (x->_forwards[0]) {
		x = x->_forwards[0];
		// key is existing.
		if (!(x->_key < key) && !(key < x->_key)) {
			return false;
		}
	}

	uint32_t level = random_level();
	if (level > _level) {
		for (uint32_t i = _level; i < level; ++i) {
			updates[i] = _header;
		}
		_level = level;
	}

	SkiplistItem<Key, Value>* y = new (std::nothrow) SkiplistItem<Key, Value>(_max_level);
	if (y) {
		y->_key = key;
		y->_val = val;
	} else {
		fprintf(stderr, "Skiplist: failed to apply for memory space.\n");
		return false;
	}

	for (uint32_t i = 0; i < _level; ++i) {
		x = updates[i];
		y->_forwards[i] = x->_forwards[i];
		x->_forwards[i] = y;
	}

	++_size;
	return true;
}
```

### 删除算法

删除算法与插入算法类似，找到对应 Key 值的结点后，释放结点，并借助 updates 数组更新链表，这里就不再赘述。

```c++
template <typename Key, typename Value>
bool Skiplist<Key, Value>::remove(const Key& key) {
	SkiplistItem<Key, Value>* updates[_max_level];

	SkiplistItem<Key, Value>* x = _header;
	for (int i = _level - 1; i >= 0; --i) {
		while (x->_forwards[i] &&
				x->_forwards[i]->_key < key) {
			x = x->_forwards[i];
		}
		updates[i] = x;
	}

	if (x->_forwards[0]) {
		x = x->_forwards[0];

		if (!(x->_key < key) && !(key < x->_key)) {
			for (uint32_t i = 0; i < _level; ++i) {
				if (updates[i]->_forwards[i] != x) {
					break;
				}
				updates[i]->_forwards[i] = x->_forwards[i];
			}
			delete x;
			_size--;

			/* Update maximum level */
			while (_level && !_header->_forwards[_level-1]) {
				--_level;
			}

			return true;
		}
	}
	return false;
}
```

### 随机数生成器

这里的随机数生成器会随机生成1~\_max_level 之间的一个数，但每个数不是等概率的。假如现在有概率 P（$0 < PROB < 1$），我们希望有 $\frac{1}{P}$ 结点的等级是大于1的，有 $\frac{1}{P^{2}}$ 结点的等级是大于2的，以此类推，当然最大等级是有限制的。

```c++
template <typename Key, typename Value>
uint32_t Skiplist<Key, Value>::random_level() {
	uint32_t lvl = 1;
	while (lvl < _max_level
			&& (double)rand() / RAND_MAX < _lvl_prob) {
		++lvl;
	}
	return lvl;
}
```

### 释放表

链表中的结点是通过 new 函数申请的空间，所以在使用完跳跃链表后，需要释放空间。释放表的操作比较简单，在1级链表上逐个释放结点即可，与链表操作一致。

### 结点的最大等级

结点的最大等级与 P 和 N 值相关（P = \_lvl\_prob，N = \_max\_size），通常结点最大等级 $ = L(N)$，其中 $L(N) = log_{\frac{1}{P}}N$。例如 $P=\frac{1}{2}$，$N=16$ 时，跳跃链表的最大等级应该设为 4。

## 性能分析

### 查询长度的期望

为了求查找长度的期望值，我们可以将查找过程倒过来看，从右下方第1层上最后到达的那个节点开始进行回溯。令 $C(i)$ 表示移动到第 i 级链表的期望查询长度，有 $C(0)=0$，并且结点数量的关系（随机数生成器），向上一级的概率为 $P$，向左的概率为 $(1-P)$，所以有差分方程：

$$ C(k) = (1 - P) * (C(k) + 1) + P * (C(k-1) + 1)$$ <br>
$$ C(k) = \frac{1}{P} + C(k-1) $$ <br>
$$ C(k) = \frac{k}{P} $$ <br>


这个结果表示，从右下方起始结点开始，每爬一层需要移动的结点数期望值为 $\frac{1}{P}$。由于跳跃链表的最高等级为 $L(N)$，整个查询过程需要爬 $L(N) - 1$ 层，所以查询长度的期望值等于 $\frac{L(N)-1}{P}$。这里的 $L(N) = log_{\frac{1}{P}}N$ ，P 为常数，于是可知查询的时间复杂度为 $o(logN)$。

### 结点的平均等级

根据随机数生成器的实现可知，等级越高的结点，产生概率越低，并且有结点等级数恰好为 $k$ 的概率为 $(1-P)P^{k-1}$，于是可求结点等级的期望值（令 k 趋近与正无穷）：

$$ 1 * (1-P) + 2 * (1-P) * P + \dots + k * (1-P) * P^{k-1} $$<br>
$$ = (1-P) * (1 + 2 * P + \dots + k * P^{k-1}) $$ <br>$$ = (1-P) * (\frac{1- P^k}{(1-P)^{2}} - kP^{k+1}) $$ （这里使用错位相减法）<br>$$ \sim (1-P) * (\frac{1}{(1-P)^{2}}) $$ <br>
$$ = \frac{1}{1-P} $$ <br>

## 结语

跳跃链表最早由 William Pugh 在 1989 提出，建议大家阅读一下《Skip Lists: A Probabilistic Alternative to Balanced Trees》这篇论文。跳跃链表在查找和插入等操作的性能上不逊色于平衡树，并且在实现上比平衡树简单许多。

## 参考文献

[1] Pugh, William . "Skip Lists: A Probabilistic Alternative to Balanced Trees." *Algorithms and Data Structures, Workshop WADS '89, Ottawa, Canada, August 17-19, 1989, Proceedings* 1989.