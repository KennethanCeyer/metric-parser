# FormulaParser

[![npm version](https://badge.fury.io/js/pg-formula-parser.svg)](https://badge.fury.io/js/pg-formula-parser) [![Bower version](https://badge.fury.io/bo/pg-formula-parser.svg)](https://badge.fury.io/bo/pg-formula-parser) [![Join the chat at https://gitter.im/KennethanCeyer/PIGNOSE](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/KennethanCeyer/PIGNOSE?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Build Status](https://travis-ci.org/KennethanCeyer/formula-parser.svg?branch=master)](https://travis-ci.org/KennethanCeyer/formula-parser) [![Coverage Status](https://coveralls.io/repos/github/KennethanCeyer/formula-parser/badge.svg)](https://coveralls.io/github/KennethanCeyer/formula-parser) [![codecov](https://codecov.io/gh/KennethanCeyer/formula-parser/branch/master/graph/badge.svg)](https://codecov.io/gh/KennethanCeyer/formula-parser) [![Maintainability](https://api.codeclimate.com/v1/badges/9ab3eed6a3b758c6d2d9/maintainability)](https://codeclimate.com/github/KennethanCeyer/formula-parser/maintainability) [![CodeFactor](https://www.codefactor.io/repository/github/kennethanceyer/formula-parser/badge)](https://www.codefactor.io/repository/github/kennethanceyer/formula-parser)

[![dependencies Status](https://david-dm.org/KennethanCeyer/formula-parser/status.svg)](https://david-dm.org/KennethanCeyer/formula-parser) [![devDependencies Status](https://david-dm.org/KennethanCeyer/formula-parser/dev-status.svg)](https://david-dm.org/KennethanCeyer/formula-parser?type=dev)

----

### Special lovers

- [rhyscitlema.com](http://rhyscitlema.com/algorithms/expression-parsing-algorithm)
- [Precedence climbing](http://www.engr.mun.ca/~theo/Misc/exp_parsing.htm#climbing)

----

### Example

[See demo](http://www.pigno.se/barn/PIGNOSE-FormulaParser/)

![Screen Shot](http://www.pigno.se/barn/PIGNOSE-FormulaParser/demo/img/screenshot_main.png)

----

### Roadmap

**v1.0.0**

- [x] support typescript
- [x] support UMD and ES5 module
- [x] support automated test environment
- [x] support custom value (custom object as value)
- [x] support implicit patterns (multiplication omitted, operator aliases)
- [x] support reference docs
- [ ] guidelines for developers
- [ ] guidelines for contributors
- [ ] support validation for many cases
- [x] improve parser logic based [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree)
- [x] improve validation error (parserStack, codes)
- [x] add unit test with coverage rate over 90%

**v1.0.1**
- [ ] function expression `IF()`, `SUM()`, `AVG()`, `_CUSTOM_NAMED_FUNC_()`
- [ ] support custom tree model declaration

**v1.0.2**
- [ ] declare variable (operator and value type)

If you want join the contribution, Fork it and send a pull request.

----

### Installation

#### zip

[Latest zip file link](https://github.com/KennethanCeyer/FormulaParser/archive/master.zip)

#### git

```bash
git clone git@github.com:KennethanCeyer/FormulaParser.git
```

#### bower

```bash
bower install metric-parser
```

#### npm

```bash
npm install metric-parser
```

----

Do you have any question?

I'd like to help your issue.

Please contact to me to use either [gitter](https://gitter.im/KennethanCeyer/PIGNOSE) or [GitHub issues page](https://github.com/KennethanCeyer/FormulaParser/issues)
