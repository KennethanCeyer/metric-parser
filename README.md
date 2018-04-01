# metric parser

[![NPM](https://nodei.co/npm/metric-parser.png)](https://nodei.co/npm/metric-parser/)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FKennethanCeyer%2Fmetric-parser.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FKennethanCeyer%2Fmetric-parser?ref=badge_shield)

[![npm version](https://badge.fury.io/js/metric-parser.svg)](https://badge.fury.io/js/metric-parser) [![Bower version](https://badge.fury.io/bo/metric-parser.svg)](https://badge.fury.io/bo/metric-parser) [![Join the chat at https://gitter.im/KennethanCeyer/PIGNOSE](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/KennethanCeyer/PIGNOSE?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![GitHub forks](https://img.shields.io/github/forks/KennethanCeyer/metric-parser.svg)](https://github.com/KennethanCeyer/metric-parser/network) [![GitHub license](https://img.shields.io/github/license/KennethanCeyer/metric-parser.svg)](https://github.com/KennethanCeyer/metric-parser/blob/master/LICENSE)

[![Build Status](https://travis-ci.org/KennethanCeyer/metric-parser.svg?branch=master)](https://travis-ci.org/KennethanCeyer/metric-parser) [![Coverage Status](https://coveralls.io/repos/github/KennethanCeyer/metric-parser/badge.svg)](https://coveralls.io/github/KennethanCeyer/metric-parser) [![codecov](https://codecov.io/gh/KennethanCeyer/metric-parser/branch/master/graph/badge.svg)](https://codecov.io/gh/KennethanCeyer/metric-parser) [![Maintainability](https://api.codeclimate.com/v1/badges/c69ae53f077a68618867/maintainability)](https://codeclimate.com/github/KennethanCeyer/metric-parser/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/c69ae53f077a68618867/test_coverage)](https://codeclimate.com/github/KennethanCeyer/metric-parser/test_coverage) [![CodeFactor](https://www.codefactor.io/repository/github/kennethanceyer/metric-parser/badge)](https://www.codefactor.io/repository/github/kennethanceyer/metric-parser)

[![dependencies Status](https://david-dm.org/KennethanCeyer/metric-parser/status.svg)](https://david-dm.org/KennethanCeyer/metric-parser) [![devDependencies Status](https://david-dm.org/KennethanCeyer/metric-parser/dev-status.svg)](https://david-dm.org/KennethanCeyer/metric-parser?type=dev)

----

### Special lovers :heart:

- [rhyscitlema.com](http://rhyscitlema.com/algorithms/expression-parsing-algorithm)
- [Precedence climbing](http://www.engr.mun.ca/~theo/Misc/exp_parsing.htm#climbing)

----

### Example

[See demo](http://www.pigno.se/barn/PIGNOSE-FormulaParser/)

![Screen Shot](http://www.pigno.se/barn/PIGNOSE-FormulaParser/demo/img/screenshot_main.png)

----

### Installation

#### zip

[zip download link](https://github.com/KennethanCeyer/metric-parser/archive/master.zip)

#### git

```bash
$ git clone git@github.com:KennethanCeyer/metric-parser.git
```

#### bower

```bash
$ bower install metric-parser
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

### Getting started

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

### DataType

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

### Roadmap

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

Do you have any question?

I'd like to help your issue.

Please contact to me to use either [gitter](https://gitter.im/KennethanCeyer/PIGNOSE) or [GitHub issues page](https://github.com/KennethanCeyer/metric-parser/issues)


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FKennethanCeyer%2Fmetric-parser.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FKennethanCeyer%2Fmetric-parser?ref=badge_large)