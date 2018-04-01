<p align="center"><img width="200" src="https://www.pigno.se/static/assets/images/metric-parser-logo.svg" /></p>

<p align="center"><a href="https://nodei.co/npm/metric-parser/"><img src="https://nodei.co/npm/metric-parser.png" alt="NPM"></a></p>

<p align="center">
    <a href="https://badge.fury.io/js/metric-parser"><img src="https://badge.fury.io/js/metric-parser.svg" alt="npm version"></a>
    <a href="https://gitter.im/KennethanCeyer/PIGNOSE?utm_source=badge&amp;utm_medium=badge&amp;utm_campaign=pr-badge&amp;utm_content=badge"><img src="https://badges.gitter.im/Join%20Chat.svg" alt="Join the chat at https://gitter.im/KennethanCeyer/PIGNOSE"></a>
    <a href="https://github.com/KennethanCeyer/metric-parser/network"><img src="https://img.shields.io/github/forks/KennethanCeyer/metric-parser.svg" alt="GitHub forks"></a>
    <a href="https://github.com/KennethanCeyer/metric-parser/blob/master/LICENSE"><img src="https://img.shields.io/github/license/KennethanCeyer/metric-parser.svg" alt="GitHub license"></a>
</p>

<p align="center">
    <a href="https://travis-ci.org/KennethanCeyer/metric-parser"><img src="https://travis-ci.org/KennethanCeyer/metric-parser.svg?branch=master" alt="Build Status"></a>
    <a href="https://coveralls.io/github/KennethanCeyer/metric-parser"><img src="https://coveralls.io/repos/github/KennethanCeyer/metric-parser/badge.svg" alt="Coverage Status"></a>
    <a href="https://codecov.io/gh/KennethanCeyer/metric-parser"><img src="https://codecov.io/gh/KennethanCeyer/metric-parser/branch/master/graph/badge.svg" alt="codecov"></a>
    <a href="https://codeclimate.com/github/KennethanCeyer/metric-parser/maintainability"><img src="https://api.codeclimate.com/v1/badges/c69ae53f077a68618867/maintainability" alt="Maintainability"></a>
    <a href="https://codeclimate.com/github/KennethanCeyer/metric-parser/test_coverage"><img src="https://api.codeclimate.com/v1/badges/c69ae53f077a68618867/test_coverage" alt="Test Coverage"></a>
    <a href="https://www.codefactor.io/repository/github/kennethanceyer/metric-parser"><img src="https://www.codefactor.io/repository/github/kennethanceyer/metric-parser/badge" alt="CodeFactor"></a>
</p>

<p align="center">
    <a href="https://david-dm.org/KennethanCeyer/metric-parser"><img src="https://david-dm.org/KennethanCeyer/metric-parser/status.svg" alt="dependencies Status"></a>
    <a href="https://david-dm.org/KennethanCeyer/metric-parser?type=dev"><img src="https://david-dm.org/KennethanCeyer/metric-parser/dev-status.svg" alt="devDependencies Status"></a>
</p>

----

### Special lovers :heart:

- [rhyscitlema.com](http://rhyscitlema.com/algorithms/expression-parsing-algorithm)
- [Precedence climbing](http://www.engr.mun.ca/~theo/Misc/exp_parsing.htm#climbing)

----

### :clap: Example

[See demo](http://www.pigno.se/barn/PIGNOSE-FormulaParser/)

![Screen Shot](http://www.pigno.se/barn/PIGNOSE-FormulaParser/demo/img/screenshot_main.png)

----

### :package: Installation

#### git

```bash
$ git clone git@github.com:KennethanCeyer/metric-parser.git
```

#### npm

```bash
$ npm install metric-parser
```

#### yarn

```bash
$ yarn add metric-parser
```

----

### :page_with_curl: Getting started

#### Javascript (Web)

```html
<script src="~/dist/metric.parser.umd.js"></script>
<script>
// { data: {tree object}, code: 0 }
const result = metricParser.convert('1 + (2 + 3)');

// { data: [ 1, '+', 2, '+', 3 ], code: 0 } <= bracket will be optimized
const expression = metricParser.convert(result.data);

// true | false <= true means valid
const valid = metricParser.valid(result.data);
</script>
```

#### Typescript
```typescript
import { convert, valid } from 'metric-parser';

// { data: {tree object}, code: 0 }
const result: ParserGeneralResult = convert('1 + (2 + 3)');

// { data: [ 1, '+', 2, '+', 3 ], code: 0 } <= bracket will be optimized
const expression: string[] = convert(result.data);

// true | false <= true means valid
const valid: boolean = valid(result.data);
```

#### NodeJS

```javascript
const parser = require('metric-parser');

// { data: {tree object}, code: 0 }
const result = parser.convert('1 + (2 + 3)');

// { data: [ 1, '+', 2, '+', 3 ], code: 0 } <= bracket will be optimized
const expression = parser.convert(result.data);

// true | false <= true means valid
const valid = parser.valid(result.data);
```

----

### :zap: Type

#### Tree
> Tree is a simple object that converted from AST. 

```typescript
const result = convert('1 + (2 + 3)');
const tree: Tree = result.data;
```

```javascript
{
  operator: '+',
  operand1: { value: { type: 'unit', unit: 1 } },
  operand2: {
    operator: '+',
    operand1: { value: { type: 'unit', unit: 2 } },
    operand1: { value: { type: 'unit', unit: 3 } }
  }
}
```

#### AST (AbstractSyntaxTree)
> AST is the most important object that contains the structure of a formula.

```typescript
const ast = convert('1 + (2 + 3)', true);

```

```typescript
{
  AbstractSyntaxTree {
    type: 1, // operator
    value: '+',
    leftNode: AbstractSyntaxTree {
      type: 2, // value
      value: 1
    },
    rightNode: AbstractSyntaxTree {
      type: 1, // operator
      value: '+',
      leftNode: AbstractSyntaxTree {
        type: 1, // value
        value: 2
      },
      rightNode: AbstractSyntaxTree {
        type: 1, // value,
        value: 3
      }
    }
  }
}
```

----

### :triangular_flag_on_post: Roadmap

**v0.0.1**

- [x] support typescript
- [x] support UMD and ES5 module
- [x] support automated test environment
- [x] support custom value (custom object as value)
- [x] support implicit patterns (multiplication omitted, operator aliases)
- [x] support reference docs
- [x] improve parser logic based [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree)
- [x] improve validation error (parserStack, codes)
- [x] add unit test with coverage rate over 90%
- [x] support validation for many cases

**v0.1.0**

- [ ] guidelines for developers
- [ ] guidelines for contributors

**v0.2.0**

- [ ] function expression `IF()`, `SUM()`, `AVG()`, `_CUSTOM_NAMED_FUNC_()`
- [ ] support custom tree model declaration

**v0.3.0**

- [ ] declare variable (operator and value type)

----

### :mag: License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FKennethanCeyer%2Fmetric-parser.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FKennethanCeyer%2Fmetric-parser?ref=badge_large)

The MIT License (MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
