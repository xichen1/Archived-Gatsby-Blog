---
title: 如何写一个简单的parser
date: "2020-06-21"
description: "compiler"
tags: ["compiler"]
---

### 起因

因为最近学了一点 js, 准备做几个项目练练手, 就盯上了万年老坑计算器. 说他坑主要是因为可易可难, 如果要加上很多科学计算器的功能估计会很麻烦. 于是我就准备做一个只有最基础四则运算功能的版本. 看了几篇给 js 初学者看的文章发现基本都是先从基本逻辑讲起, 再不断往上堆功能最后再考虑边际情况. 感觉这种方法又啰嗦又不 robust, 就突然想起了大一课上学过一个叫逆波兰表达式的东西(Reverse Polish notation), 貌似能很方便的计算任意的一个 expression, 然后我就把 js 扔在了一边开始研究怎么把给出的一个数学 expression 转换成 RPN 形式.

### 逆波兰表达式(RPN)

逆波兰表达式中的所有符号都在第二个操作数的后面
EX:
1 2 3 + \*
在这个表达式里, +号在 3 后面, 所以+连接 2 和 3, 而\*号在 2 和 3 后面, 所以\*号连接 1 和(2+3).
使用 stack 后 RPN 的计算可以变得非常方便, 具体计算一个 RPN 值的方法是:
依次把 token 放进 stack, 遇到 operator 时把入栈的 token 数字都拿出并且用 operator 连接求值, 将值放进 stack. 遍历过一遍 RPN 后, stack 顶的值就是这个 RPN 的值.

#### 问题

但是使用 RPN 计算一个表达式的值有一个问题, 就是如何把普通的 expression 又称中缀表达式转换成 RPN. Wikipedia 告诉我可以用一个叫调度场算法的方法来 convert. 但由于其适应性不够(只能用在 RPN 问题中)而且貌似很难证明, 遂放弃. 而这个时候我发现了 parser 的存在.

### Parser

根据[王垠的文章](https://www.yinwang.org/blog-cn/2015/09/19/parser), parser 是能把文本转换成一种叫抽象语法树(AST)的数据结构的工具. 对于 1+2 这样的表达式, 计算机无法直接对其计算, 而要通过 AST 来计算他的值.
对于 1+2 这样的数学表达式来说 AST 是一个二叉树, 每一个 node 代表了一个操作符, 而二叉树的 leaf 则为最初始的操作数. //TODD: add img

因此一个中缀表达式可以被转换成由操作符和操作数组成的无括号的二叉树, 而有了这棵二叉树, 中缀转 RPN 将会变得非常简单. 更简单的是我可以通过遍历这棵树来直接求得中缀 expression 的答案. 而 parser 要干的事, 就是自动地把任意一个 expression 转换成这棵 AST.

#### 算法

于是问题就变成了如何造出一个 parser, which 能接受任意的带括号的四则运算表达式, 并且能输出一棵 AST.

通过[轮子哥的博客](http://www.cppblog.com/vczh/archive/2008/06/15/53373.html), 我了解到一般编译器中用到的 parser 都是用一种叫递归下降的算法写的.

我们可以先分析一下一个 expression 的语法. 一个 expression: 1+2*(3+4)/*5+6/7-8, 我们可以把他分成三个部分, 一是最简单的 term. 一个 term 可以是一个数字, 也可以是由()围起来的一个 expression, 这么分是因()的值和数字值地位相同.

其次我们可以把由\*或/连接的元素称为 factor. 在例子中, 2\*(3+4)/5 就是一个 factor, 这么分的原因是可以观察到所有 factor 中的被\*或/连接的元素都是一个 term, 如 2, (3+4) 和 5. 要注意的是, 在实现的过程中, 要考虑只有一个 term 而不需要\*或/来连接的情况,　这种情况下, 我们也称这个 term 为 factor.

最后, 我们可以把由+或-连接的元素称为 expression. 在例子中如 1+2(3+4)/5+6/7-8, 和 3+4 这样的都被称为 expression. 这么划分 expression 的原因是由+或-直接连接的元素都是 factor. 要注意的是, 在实现过程中, 要考虑只有一个 term 而不需要\+或-来连接的情况, 这种情况下, 我们也称这个 factor 为 expression.

如 ”1“ 这个表达式, 他不需要加减号来连接, 因此他自己就是一个 expression, 也是一个 factor. 而他也没有乘除号来连接因此他也是一个 term.

通过这种划分方法来递推 expression 的方法是这样的:

EX: 1+2\*3-4/5

这是一个 expression, 含有 3 个 factors, 分别是 1, 2\*3 和 4/5. 1 中含有一个纯数字 term 1, 这时我们就到了 AST 的底端, 而这个 leaf 的值, 就是这个 term 的值 1. 2\*3 中含有两个纯数字 term 2 和 3, 而 2 和 3 可以分别被存放在最低端的两个 leaf 中, 值分别是 2 和 3. 而这两个 leaf 的 father node, 则存放了连接这两个 term 的 operator, 在这个例子中为\*. 4/5 同理. 到目前为止,我们有了 3 个 factor

![factor1](./factor1.JPG)

![factor2](./factor2.JPG)

![factor3](./factor3.JPG)

向上一级, 考虑 factor 组成的 expression. 程序先检测到 factor1 和 2\*3, 然后 1 和\*的 father node 就变成了+. 程序继续考虑 4/5 也是 factor, 于是+和/的 father node 变成了-.

![result1](./result1.JPG)

#### 代码

我们先建一个 node class 作为存放 node 值的数据结构, 这个类中定义了该 node 是不是纯数字 term, 他的左右 child 分别是什么, 以及如果不是 leaf node, 他存放了什么 operator:

```
struct Expression {
	bool Isnumber;
    int Number;
    char Operator;
    Expression *Left;
    Expression *Right;

    // arrive the bottom of the AST, only number on the node
    Expression(int aNumber) {
        Number = aNumber;
        Isnumber = true;
        Left = nullptr;
        Right = nullptr;
        Operator = 0;
    }

    // operator nodes of the AST
    Expression(char aOperator, Expression *left, Expression *right){
        Operator = aOperator;
        Left = left;
        Right = right;
        Isnumber = false;
        Number = 0;
    }
};
```

其中的构造函数分别是为后面建两种 node 准备的.

我们需要至少三个函数, 来依次检测 expression, factor 和 term, 如果 term 中又出现了 expression, 则又需要调用检测 expression 的函数. 此外, 我们还需要检测 term 中是否是纯数字的函数, 如果是纯数字, 则需把数字存在 leaf node 中. 因此声明四个函数:

```
Expression *exp(char *&Stream);
Expression *factor(char *&Stream);
Expression *term(char *&Stream);
Expression *number(char *&Stream);
```

给出一个函数,　其他三个的实现方法类似

```
Expression *expr(char *&Stream) {
    char *Read = Stream;
    Expression *t = fact(Read);
    if (t) {
        Expression *result = t;

        while (true) {
            char sign = 0;
            if (comp(Read, "+")) {
                sign = '+';
            } else if (comp(Read, "-")) {
                sign = '-';
            } else {
                break;
            }
            Expression *next = fact(Read);
            if (next) {
                result = new Expression(sign, result, next);
            } else {
                return nullptr;
            }
        }
        Stream = Read;

        return result;
    } else {
        return nullptr;
    }
}
```

而最后遍历树求值的方法比较简单, 代码就不放了.

因为最近才开始学 C++, 一些 C++11 的特性不是很熟悉, 很多还是用写 C 的经验写的. 代码等熟悉了还可以改进.

### 总结

这次主要是写了个最简单的 parser, 然后解决了表达式计算值的问题, 其实也可以用这个 parser 转成 RPN 再求值, 不过那就要多一步 stack 操作的过程了. 网上的很多人说 parser 是实现编译器的第零步,这么看起来 compiler 也挺好玩的, 改天可以写个解析语言或者 json 这样文本的 parser 试试.