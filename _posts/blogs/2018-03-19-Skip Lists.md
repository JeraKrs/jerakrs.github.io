---
layout: post
title: 浅析 Skip List 原理与实现
description: 跳跃列表由 William Pugh 发明，它是一种数据结构，允许快速查询一个有序连续元素的数据链表。快速查询是通过维护一个多层次的链表，且每一层链表中的元素是前一层链表元素的子集。
category: algorithm
---


## Skip Lists 数据结构简介

二叉树（binary trees）在解决查询问题过程中，当元素插入顺序是随机时，它具有非常好的性能，但当元素是按顺序插入时，二叉树会退化成一条链，此时的查询性能会非常差。平衡树（balanced tree）为了解决这种退化问题，在每个元素被添加时，会调整树的结构，使平衡树始终保持一个平衡的状态，以此来保证查询效率。

跳表（skip lists）本质上也是一种查询结构，用于解决算法中的查询问题，即对于给定的Key值，找到对应的Value值。跳表通常用来代替平衡树一类的结构，不同于平衡树的强制性平衡，跳表使用一种概率性的平衡，这样使得跳表的插入和删除操作变得简单和高效。

### 链表 vs 跳表

跳跃链表是由链表拓展而来，所以我们先看一下链表结构，*图 a*。一个有序链表，每个结点除了要保存Key和Value值之外，还需要维护一个正向指针（forward pointer）来指向下一个结点。最后一个结点的正向指针为空，表示没有下一个结点。在这样的一个链表中，如果需要查找某个数据，需要遍历整个链表直到找到包含数据的那个结点，复杂度为 $o(n)$。而跳跃链表在链表的基础上，给结点分配了不同的等级，等级1的结点拥有一个正向指针，并指向下一个等级大于1的结点；等级为2的结点拥有两个正向指针，分别指向下一个等级大于1和下一个等级大于2的结点；以此类推。我们以最高等级数为2的跳跃链表为例，*图 b*，所有新增加的指针连成了一个新的链表，这条新的链表可以看作是原先链表的一个快速通道。

假如我们现在要查询 $Key=13$ 结点的值：

* 先和 $Key=7$ 的结点比较（跳过 $Key=3$ 的结点）
* 因为 $13>7$，所以我们继续在快速通道上移动，和 $Key=21$ 的结点比较
* 因为 $13<21$，范围锁定在 $Key=7$ 和 $Key=21$ 这两个结点之间，此时我们将转移到等级1的链表上，和 $Key=9$ 的结点比较
* 因为 $13>9$，所以我们继续移动到下一个结点，$Key=13$ 的结点 

这就是跳跃链表的查询原理，上述例子并没有体现出跳远链表的效率，因为结点的个数比较少，我们将在后面分析跳跃链表的性能问题。

![Figure 01](https://farm5.staticflickr.com/4779/27085375228_93184b055f_z.jpg)


## Skip Lists 的实现

跳跃链表的实现主要有基本数据结构的定义，链表初始化，查找、插入和删除操作，以及随机数生成器和释放链表。 以C语言实现跳跃链表为例，假设Key值和Value值的最大长度为255，跳跃链表中结点的最高级数为10。

### 数据结构定义

首先，跳跃链表是由结点组成的，但跳跃链表的结点可以有多个正向指针。一个等级为n的结点，会有n个正向指针。结点不需要储存等级，跳跃链表中的多条链表隐含了结点的等级。

```
struct node {
    char key[MAXN];
    char val[MAXN];
    struct node* forwards[MAXL];
};
```

有了结点，接下来就是链表结构，其中需要储存结点个数、当前跳跃表内最大的层数和指向头结点的指针。

```
struct skiplist {
    int nItems;
    int level;
    struct node* header;
};
```

### 初始化

使用跳跃链表之前，需要对其进行初始化，初始化需要申请头结点，头结点无意义，它的所有正向指针均为NULL。此时的结点个数和跳跃表内最大的层数为零。

```
struct skiplist* initSkiplist() {
	struct skiplist* items = (struct skiplist*)malloc(sizeof(struct skiplist));

	if (items == NULL) {
		fprintf(stderr, "**ERROR**: initSkiplist() fail to"
				" initialise the skip list.\n");
		exit(1);
	}

	items->nItems = 0;
	items->level = 0;
	items->header = newNode();
	return items;
}
```

### 查询算法

查找的过程中就是给定一个指定的Key，查找这个Key是否出现在跳跃表中，如果出现，则返回其值，如果不存在，则返回不存在。跳跃链表的查询算法会从等级最高链表开始查找，直到没有下一个结点或下一个结点的Key值比当前查找的Key值大时，跳跃链表会移动到下一级链表上查找，以此类推，直到查找到匹配的Key值。以查询 $Key=13$ 为例，查询过程有 *图-c*。

![Figure 02](https://farm1.staticflickr.com/819/27085394288_e3ac2c2d7a_z.jpg)

其中红色链路为查找的过程。

```
int searchSkiplist(struct skiplist* items, const char* key, char* ret) {
	if (items == NULL) return -1;
	if (key == NULL || strlen(key) >= MAXN) return -1;
    if (ret == NULL) return -1;

	struct node* x = items->header;
	for (int i = items->level - 1; i >= 0; i--) {
		while (x->forwards[i] != NULL &&
				strcmp(x->forwards[i]->key, key) < 0) {
			x = x->forwards[i];
		}
	}

	if (x->forwards[0] != NULL) {
		x = x->forwards[0];
		if (strcmp(x->key, key) == 0) {
			strcpy(ret, x->val);
			return 0;
		}
	}

	return 1;
}
```

### 插入算法

插入算法需要先找到对应Key值所在位置，实现和查找算法一致，不同的是这里需要用一个updates数组存放查询路径上每个等级链表的最后一项，用于更新链表，然后新增结点，并为结点随机分配一个等级，随机数生成器会在后面的篇幅讲到。假设现在我们需要将一个 Key=10 的结点插入跳跃链表中，首先是找到新节点的位置，并更新updates数组，如*图-d*。

![Figure 03](https://farm1.staticflickr.com/817/26084666217_32bd9e48ba_z.jpg)

新节点的等级为2，所以我们需要修改updates[0]和updates[1]指向的结点的正向指针，如*图-e*。


```
int insertSkiplist(struct skiplist* items, const char* key, const char* val) {
	if (items == NULL) return -1;
	if (key == NULL || strlen(key) >= MAXN) return -1;
    if (val == NULL || strlen(val) >= MAXN) return -1;
	if (items->nItems == MAXITEMS - 1) return -1;

	struct node* updates[MAXL];
	struct node* x = items->header;

	for (int i = items->level - 1; i >= 0; i--) {
		while (x->forwards[i] != NULL &&
				strcmp(x->forwards[i]->key, key) < 0) {
			x = x->forwards[i];
		}
		updates[i] = x;
	}

	if (x->forwards[0] != NULL) {
		x = x->forwards[0];
		/* Key is exists */
		if (strcmp(x->key, key) == 0) {
			return -1;
		}
	}

	int lvl = randomLevel();

	if (lvl > items->level) {
		for (int i = items->level; i < lvl; i++)
			updates[i] = items->header;
		items->level = lvl;
	}

	struct node* y = newNode();
	strcpy(y->key, key);
	strcpy(y->val, val);

	for (int i = 0; i < items->level; i++) {
		x = updates[i];
		y->forwards[i] = x->forwards[i];
		x->forwards[i] = y;
	}

	items->nItems++;
	return 0;
}
```

### 删除算法

删除算法与插入算法类似，找到对应Key值的结点后，释放结点，并借助updates数组更新链表。

```
int deleteSkiplist(struct skiplist* items, const char* key) {
	if (items == NULL) return -1;
	if (key == NULL || strlen(key) >= MAXN)	return -1;

	struct node* updates[MAXL];

	struct node* x = items->header;
	for (int i = items->level - 1; i >= 0; i--) {
		while (x->forwards[i] != NULL &&
				strcmp(x->forwards[i]->key, key) < 0) {
			x = x->forwards[i];
		}
		updates[i] = x;
	}

	if (x->forwards[0] != NULL) {
		x = x->forwards[0];
		if (strcmp(x->key, key) == 0) {
			for (int i = 0; i < items->level; i++) {
				if (updates[i]->forwards[i] != x) break;
				updates[i]->forwards[i] = x->forwards[i];
			}
			free(x);
			items->nItems--;
			/* Update maximum level */
			while (items->level && items->header->forwards[items->level-1] == NULL) {
				items->level--;
			}
			return 0;
		}
	}
	return -1;
}
```

### 随机数生成器

这里的随机数生成器会随机生成1~MaxLevel之间的一个数，但每个数不是等概率的。假如现在有概率PROB（$0 < PROB < 1$），我们希望有 $\frac{1}{PROB}$ 结点的等级是大于1的，有 $\frac{1}{PROB^{2}}$ 结点的等级是大于2的，以此类推，当然最大等级是有限制的。

```
int randomLevel() {
	int v = 1;
	while (v < MAXL && (double)rand() / RAND_MAX < PROB) {
		v++;
	}
	return v;
}
```

### 释放表

链表中的结点是通过 malloc 函数申请的空间，所以在使用完跳跃链表后，需要释放空间。释放表的操作比较简单，在1级链表上逐个释放结点即可，与链表操作一致。

### 结点的最大等级

结点的最大等级和PROB值相关，$MaxLevel = L(N)$，其中 $L(N) = log_{\frac{1}{PROB}}N$。例如 $PROB=\frac{1}{2}$，$N=16$ 时，跳跃链表的最大等级为4。

## 性能分析

### 查询长度的期望

为了求查找长度的期望值，我们可以将查找过程倒过来看，从右下方第1层上最后到达的那个节点开始进行回溯。令 $C(i)$ 表示移动到第i级链表的期望查询长度，有 $C(0)=0$，并且结点数量的关系（随机数生成器），向上一级的概率为 $PROB$，向左的概率为 $(1-PROB)$，所以有差分方程：

$$ C(k) = (1 - PROB) * (C(k) + 1) + PROB * C(k-1) $$ <br>
$$ C(k) = \frac{1}{PROB} + C(k-1) $$ <br>
$$ C(k) = \frac{k}{PROB} $$ <br>


这个结果表示，从右下方起始结点开始，每爬一层需要移动的结点数期望值为 $\frac{1}{PROB}$。由于跳跃链表的最高等级为 $L(N)$，整个查询过程需要爬 $L(N) - 1$ 层，所以查询长度的期望值等于 $\frac{L(N)-1}{PROB}$。这里的 $L(N)$ 也是一个期望值，我们知道对于每级链表而言，向上增长的概率为 $\frac{1}{PROB}$，于是有等级数大于 $k$ 的结点个数等于 $ \frac{N}{PROB^{k}} $。反向考虑，当结点个数为1时，该结点近似于最高等级的结点。

至此，可知查询的时间复杂度为 $o(logN)$（$PROB$为常数）。

### 结点的平均等级

根据随机数生成器的实现可知，等级越高的结点，产生概率越低，并且有结点等级数恰好为 $k$ 的概率为 $(1-PROB)PROB^{k-1}$，于是可求结点等级的期望值（k趋近与正无穷）：

$$ 1 * (1-PROB) + 2 * (1-PROB) * PROB + \dots + k * (1-PROB) * PROB^{k-1} $$ <br>
$$ = (1-PROB) * (1 + 2 * PROB + \dots + k * PROB^{k-1}) $$ <br>
$$ = (1-PROB) * (\frac{1}{(1-PROB)^{2}}) $$ <br>
$$ = \frac{1}{1-PROB} $$ <br>

## 结语

跳跃链表最早由 William Pugh 在 1990 提出，建议大家阅读一下《Skip Lists: A Probabilistic Alternative to Balanced Trees》这篇论文。跳跃链表在查找和插入等操作的性能上不逊色于平衡树，并且在实现上比平衡树简单许多。

