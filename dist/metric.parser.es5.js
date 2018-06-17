/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};

var Token;
(function (Token) {
    var Type;
    (function (Type) {
        Type[Type["Unknown"] = 0] = "Unknown";
        Type[Type["Value"] = 1] = "Value";
        Type[Type["Dot"] = 2] = "Dot";
        Type[Type["Operator"] = 3] = "Operator";
        Type[Type["Bracket"] = 4] = "Bracket";
        Type[Type["Function"] = 5] = "Function";
        Type[Type["WhiteSpace"] = 6] = "WhiteSpace";
        Type[Type["CompareToken"] = 7] = "CompareToken";
    })(Type = Token.Type || (Token.Type = {}));
    var SubType;
    (function (SubType) {
        SubType[SubType["Group"] = 0] = "Group";
    })(SubType = Token.SubType || (Token.SubType = {}));
    Token.literal = {
        Addition: '+',
        Subtraction: '-',
        Multiplication: '*',
        MultiplicationLiteral: 'x',
        Division: '/',
        Mod: '%',
        Pow: '^',
        BracketOpen: '(',
        BracketClose: ')',
        Dot: '.'
    };
    Token.value = {
        Addition: {
            symbols: [Token.literal.Addition],
            alias: Token.literal.Addition
        },
        Subtraction: {
            symbols: [Token.literal.Subtraction],
            alias: Token.literal.Subtraction
        },
        Multiplication: {
            symbols: [Token.literal.Multiplication, Token.literal.MultiplicationLiteral],
            alias: Token.literal.Multiplication
        },
        Division: {
            symbols: [Token.literal.Division],
            alias: Token.literal.Division
        },
        Mod: {
            symbols: [Token.literal.Mod],
            alias: Token.literal.Mod
        },
        Pow: {
            symbols: [Token.literal.Pow],
            alias: Token.literal.Pow
        },
        BracketOpen: {
            symbols: [Token.literal.BracketOpen],
            alias: Token.literal.BracketOpen
        },
        BracketClose: {
            symbols: [Token.literal.BracketClose],
            alias: Token.literal.BracketOpen
        },
        Dot: {
            symbols: [Token.literal.Dot],
            alias: Token.literal.Dot
        }
    };
    Token.addition = [Token.literal.Addition];
    Token.subtraction = [Token.literal.Subtraction];
    Token.multiplication = [Token.literal.Multiplication, Token.literal.MultiplicationLiteral];
    Token.division = [Token.literal.Division];
    Token.mod = [Token.literal.Mod];
    Token.pow = [Token.literal.Pow];
    Token.bracketOpen = Token.literal.BracketOpen;
    Token.bracketClose = Token.literal.BracketClose;
    Token.bracket = [Token.bracketOpen, Token.bracketClose];
    Token.precedence = Token.addition.concat(Token.subtraction, Token.multiplication, Token.division, Token.pow, Token.mod, Token.bracket);
    Token.operators = Token.addition.concat(Token.subtraction, Token.multiplication, Token.division, Token.mod, Token.pow);
    Token.symbols = Token.operators.concat(Token.bracket);
    Token.whiteSpace = [
        ' ',
        '',
        null,
        undefined
    ];
})(Token || (Token = {}));

var TokenTypeHelper = /** @class */ (function () {
    function TokenTypeHelper() {
    }
    TokenTypeHelper.isNumeric = function (value) {
        return (/^[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?$/).test(String(value));
    };
    TokenTypeHelper.isArray = function (token) {
        return Array.isArray(token);
    };
    TokenTypeHelper.isString = function (token) {
        return typeof token === 'string';
    };
    TokenTypeHelper.isObject = function (token) {
        return typeof token === 'object';
    };
    TokenTypeHelper.isValue = function (token) {
        return TokenTypeHelper.isObject(token) || TokenTypeHelper.isNumeric(token);
    };
    return TokenTypeHelper;
}());

var TokenHelperBase = /** @class */ (function (_super) {
    __extends(TokenHelperBase, _super);
    function TokenHelperBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TokenHelperBase.isToken = function (token) {
        var validators = [
            TokenHelperBase.isNumeric,
            TokenHelperBase.isSymbol,
            TokenHelperBase.isObject
        ];
        return token && validators.some(function (validator) { return validator(token); });
    };
    TokenHelperBase.isUnkown = function (token) {
        return token === undefined || token === null;
    };
    TokenHelperBase.isLineEscape = function (token) {
        return token === '\n';
    };
    TokenHelperBase.isWhiteSpace = function (token) {
        return Token.whiteSpace.includes(String(token));
    };
    TokenHelperBase.isDot = function (token) {
        return token === Token.literal.Dot;
    };
    TokenHelperBase.isAddition = function (token) {
        return Token.addition.includes(token);
    };
    TokenHelperBase.isSubtraction = function (token) {
        return Token.subtraction.includes(token);
    };
    TokenHelperBase.isMultiplication = function (token) {
        return Token.multiplication.includes(token);
    };
    TokenHelperBase.isDivision = function (token) {
        return Token.division.includes(token);
    };
    TokenHelperBase.isMod = function (token) {
        return Token.mod.includes(token);
    };
    TokenHelperBase.isPow = function (token) {
        return Token.pow.includes(token);
    };
    TokenHelperBase.isBracket = function (token) {
        return Token.bracket.includes(token);
    };
    TokenHelperBase.isBracketOpen = function (token) {
        return token === Token.bracketOpen;
    };
    TokenHelperBase.isBracketClose = function (token) {
        return token === Token.bracketClose;
    };
    TokenHelperBase.isSymbol = function (token) {
        return Token.symbols.includes(String(token));
    };
    TokenHelperBase.isOperator = function (token) {
        return Token.operators.includes(String(token));
    };
    return TokenHelperBase;
}(TokenTypeHelper));

var TokenHelper = /** @class */ (function (_super) {
    __extends(TokenHelper, _super);
    function TokenHelper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TokenHelper.induceType = function (token) {
        var typeInducers = [
            { predicate: TokenHelper.isUnkown, type: Token.Type.Unknown },
            { predicate: TokenHelper.isWhiteSpace, type: Token.Type.WhiteSpace },
            { predicate: TokenHelper.isOperator, type: Token.Type.Operator },
            { predicate: TokenHelper.isBracket, type: Token.Type.Bracket },
            { predicate: TokenHelper.isDot, type: Token.Type.Dot },
            { predicate: TokenHelper.isValue, type: Token.Type.Value }
        ];
        var extractedToken = typeInducers.find(function (inducer) { return inducer.predicate(token); });
        return extractedToken
            ? extractedToken.type
            : Token.Type.Unknown;
    };
    TokenHelper.getPrecedence = function (token) {
        return [
            [TokenHelper.isAddition, TokenHelper.isSubtraction],
            [TokenHelper.isMultiplication, TokenHelper.isDivision],
            [TokenHelper.isMod, TokenHelper.isPow],
            [TokenHelper.isBracket]
        ].findIndex(function (predicate) { return predicate.some(function (func) { return func(token); }); });
    };
    TokenHelper.getPrecedenceDiff = function (source, target) {
        return TokenHelper.getPrecedence(source) - TokenHelper.getPrecedence(target);
    };
    return TokenHelper;
}(TokenHelperBase));

var BuilderHelper = /** @class */ (function () {
    function BuilderHelper() {
    }
    BuilderHelper.isOperand = function (data) {
        return !!data.value;
    };
    BuilderHelper.isTree = function (value) {
        return TokenHelper.isObject(value) && !TokenHelper.isArray(value);
    };
    BuilderHelper.needParse = function (value) {
        return !BuilderHelper.isTree(value);
    };
    BuilderHelper.needUnparse = function (value) {
        return BuilderHelper.isTree(value);
    };
    return BuilderHelper;
}());

var StringHelper = /** @class */ (function () {
    function StringHelper() {
    }
    StringHelper.format = function (value) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var targetValue = value;
        if (args)
            args.forEach(function (match, index) { return targetValue = StringHelper.replaceArg(index, targetValue, match); });
        return targetValue;
    };
    StringHelper.replaceArg = function (match, target, value) {
        return target.replace(new RegExp("\\{" + match + "\\}", 'g'), value);
    };
    return StringHelper;
}());

var success = 0;
var ParserError = /** @class */ (function (_super) {
    __extends(ParserError, _super);
    function ParserError(error) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _this = _super.call(this) || this;
        _this.error = error;
        Object.setPrototypeOf(_this, ParserError.prototype);
        if (args.length)
            _this.error = __assign({}, _this.error, { text: StringHelper.format.apply(StringHelper, [_this.error.text].concat(args)) });
        _this.code = _this.error.code;
        _this.text = _this.error.text;
        _this.message = _this.text;
        return _this;
    }
    ParserError.prototype.withStack = function (stack) {
        this.parserStack = stack;
        return this;
    };
    ParserError.defaultParserStack = { line: 0, col: 0 };
    return ParserError;
}(Error));

var Packer = /** @class */ (function () {
    function Packer() {
    }
    Packer.makeData = function (data, code) {
        if (code === void 0) { code = success; }
        return { code: code, data: data };
    };
    Packer.makeError = function (error) {
        return __assign({}, this.makeData(error.text, error.code), { stack: error.parserStack || __assign({}, ParserError.defaultParserStack) });
    };
    return Packer;
}());

/* tslint:disable:max-line-length */
var BuilderError;
(function (BuilderError) {
    BuilderError.id = 0x0300;
    BuilderError.emptyData = { code: 0x0300, text: 'data is empty' };
})(BuilderError || (BuilderError = {}));
/* tslint:enable:max-line-length */

/* tslint:disable:max-line-length */
var TokenError;
(function (TokenError) {
    TokenError.id = 0x0100;
    TokenError.invalidToken = { code: 0x0100, text: '`{0}` token is invalid token type' };
    TokenError.invalidTwoOperator = { code: 0x0101, text: 'two operators `{0}`, `{1}` can not come together' };
    TokenError.invalidNonNumericValue = { code: 0x0102, text: 'non-numeric token `{0}` can not be consecutive' };
    TokenError.missingOperator = { code: 0x0112, text: 'the operator is missing after `{0}`' };
    TokenError.missingOpenBracket = { code: 0x0120, text: 'missing open bracket, you cannot close the bracket' };
    TokenError.missingCloseBracket = { code: 0x0121, text: 'missing close bracket, the bracket must be closed' };
    TokenError.missingValueBefore = { code: 0x0122, text: 'missing value before `{0}` token' };
    TokenError.missingValueAfter = { code: 0x0123, text: 'missing value after `{0}` token' };
    TokenError.emptyToken = { code: 0x0150, text: 'token is empty' };
})(TokenError || (TokenError = {}));
/* tslint:enable:max-line-length */

var AbstractSyntaxTreeNode = /** @class */ (function () {
    function AbstractSyntaxTreeNode(value) {
        if (value)
            this.value = value;
    }
    Object.defineProperty(AbstractSyntaxTreeNode.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (value) {
            this._value = TokenHelper.isNumeric(value)
                ? Number(value)
                : value;
            this._type = TokenHelper.induceType(this.value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractSyntaxTreeNode.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractSyntaxTreeNode.prototype, "subType", {
        get: function () {
            return this._subType;
        },
        set: function (value) {
            this._subType = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractSyntaxTreeNode.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        set: function (value) {
            this._parent = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractSyntaxTreeNode.prototype, "leftNode", {
        get: function () {
            return this._leftNode;
        },
        set: function (node) {
            if (!node)
                return;
            this._leftNode = node;
            node.parent = this;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractSyntaxTreeNode.prototype, "rightNode", {
        get: function () {
            return this._rightNode;
        },
        set: function (node) {
            if (!node)
                return;
            this._rightNode = node;
            node.parent = this;
        },
        enumerable: true,
        configurable: true
    });
    return AbstractSyntaxTreeNode;
}());

var AbstractSyntaxTreeBase = /** @class */ (function (_super) {
    __extends(AbstractSyntaxTreeBase, _super);
    function AbstractSyntaxTreeBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AbstractSyntaxTreeBase.prototype.findRoot = function () {
        if (this.isRoot())
            return this.value !== undefined || !this.leftNode
                ? this
                : this.leftNode;
        return this._parent.findRoot();
    };
    AbstractSyntaxTreeBase.prototype.isRoot = function () {
        return !this._parent;
    };
    AbstractSyntaxTreeBase.prototype.isValid = function () {
        return this.value && (!this.leftNode && !this.rightNode) || (!!this.leftNode && !!this.rightNode);
    };
    AbstractSyntaxTreeBase.prototype.hasOpenBracket = function () {
        if (TokenHelper.isBracketOpen(this.value))
            return true;
        var leftNodeHasOpenBracket = this.leftNode ? this.leftNode.hasOpenBracket() : false;
        var rightNodeHasOpenBracket = this.rightNode ? this.rightNode.hasOpenBracket() : false;
        return leftNodeHasOpenBracket || rightNodeHasOpenBracket;
    };
    AbstractSyntaxTreeBase.prototype.findOpenedBracket = function () {
        if (this.isRoot())
            return undefined;
        if (TokenHelper.isBracketOpen(this._value))
            return this;
        return this._parent.findOpenedBracket();
    };
    AbstractSyntaxTreeBase.prototype.removeRootBracket = function () {
        var rootNode = this.findRoot();
        if (TokenHelper.isBracketOpen(rootNode.value))
            rootNode.leftNode.removeParent();
        return this === rootNode
            ? rootNode.leftNode
            : this;
    };
    AbstractSyntaxTreeBase.prototype.removeClosestBracket = function () {
        var node = this.findOpenedBracket();
        if (!node)
            throw new ParserError(TokenError.missingOpenBracket);
        var targetNode = node.leftNode;
        targetNode.subType = Token.SubType.Group;
        if (!node.parent) {
            targetNode.removeParent();
            return targetNode;
        }
        if (node.parent.leftNode === node)
            node.parent.leftNode = targetNode;
        else
            node.parent.rightNode = targetNode;
        return node.parent;
    };
    AbstractSyntaxTreeBase.prototype.climbUp = function (token) {
        return this.isClimbTop(token)
            ? this
            : this._parent.climbUp(token);
    };
    AbstractSyntaxTreeBase.prototype.isClimbTop = function (token) {
        return this.isTokenHighest(token) ||
            !this.parent ||
            TokenHelper.isBracketOpen(this.value);
    };
    AbstractSyntaxTreeBase.prototype.isTokenHighest = function (token) {
        return TokenHelper.getPrecedenceDiff(token, this.value) > 0 && this.subType !== Token.SubType.Group;
    };
    AbstractSyntaxTreeBase.prototype.createChildNode = function (value) {
        var node = new this.constructor(value);
        node.parent = this;
        return node;
    };
    AbstractSyntaxTreeBase.prototype.createParentNode = function (value) {
        var node = new this.constructor(value);
        this.parent = node;
        return node;
    };
    AbstractSyntaxTreeBase.prototype.insertOperatorNode = function (value) {
        var rootNode = this.climbUp(value);
        if (TokenHelper.isBracketOpen(rootNode.value))
            return rootNode.insertJointNodeToLeft(value);
        if (this.needJointRight(rootNode, value))
            return rootNode.insertJointNodeToRight(value);
        var newNode = rootNode.createParentNode(value);
        newNode.leftNode = rootNode;
        return newNode;
    };
    AbstractSyntaxTreeBase.prototype.needJointRight = function (rootNode, value) {
        return rootNode.isTokenHighest(value) && rootNode.parent || this === rootNode;
    };
    AbstractSyntaxTreeBase.prototype.insertNode = function (value) {
        if (TokenHelper.isSymbol(value))
            if (!this.value) {
                this.value = value;
                return this;
            }
        if (TokenHelper.isOperator(value))
            return this.insertOperatorNode(value);
        var valueNode = this.createChildNode(value);
        if (!this.leftNode)
            this.leftNode = valueNode;
        else
            this.rightNode = valueNode;
        return valueNode;
    };
    AbstractSyntaxTreeBase.prototype.insertJointNodeToLeft = function (value) {
        var jointNode = this.createChildNode(value);
        jointNode.leftNode = this.leftNode;
        jointNode.rightNode = this.rightNode;
        this.leftNode = jointNode;
        return jointNode;
    };
    AbstractSyntaxTreeBase.prototype.insertJointNodeToRight = function (value) {
        var jointNode = this.createChildNode(value);
        jointNode.leftNode = this.rightNode;
        this.rightNode = jointNode;
        return jointNode;
    };
    AbstractSyntaxTreeBase.prototype.removeLeftNode = function () {
        this._leftNode.removeParent();
        this._leftNode = undefined;
    };
    AbstractSyntaxTreeBase.prototype.removeRightNode = function () {
        this._rightNode.removeParent();
        this._rightNode = undefined;
    };
    AbstractSyntaxTreeBase.prototype.removeParent = function () {
        this._parent = undefined;
    };
    return AbstractSyntaxTreeBase;
}(AbstractSyntaxTreeNode));

var AbstractSyntaxTree = /** @class */ (function (_super) {
    __extends(AbstractSyntaxTree, _super);
    function AbstractSyntaxTree() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(AbstractSyntaxTree.prototype, "expression", {
        get: function () {
            return this.makeExpression();
        },
        enumerable: true,
        configurable: true
    });
    AbstractSyntaxTree.prototype.getParentOperator = function () {
        if (this.isRoot())
            return undefined;
        return this.parent.findOperator();
    };
    AbstractSyntaxTree.prototype.isNeededBracket = function () {
        var parentOperator = this.getParentOperator();
        return parentOperator &&
            (TokenHelper.getPrecedenceDiff(parentOperator.value, this.value) > 0 ||
                TokenHelper.getPrecedenceDiff(parentOperator.value, this.value) >= 0 &&
                    this.parent.rightNode === this);
    };
    AbstractSyntaxTree.prototype.findOperator = function () {
        if (this.type === Token.Type.Operator)
            return this;
        return this.parent.findOperator();
    };
    AbstractSyntaxTree.prototype.makeExpression = function () {
        return this.type === Token.Type.Operator
            ? this.makeOperatorExpression()
            : this.makeValueExpression();
    };
    AbstractSyntaxTree.prototype.makeOperatorClause = function () {
        return (this.leftNode ? this.leftNode.expression : []).concat([
            this.value
        ], this.rightNode ? this.rightNode.expression : []);
    };
    AbstractSyntaxTree.prototype.makeOperatorExpression = function () {
        var expression = this.makeOperatorClause();
        return this.isNeededBracket()
            ? this.wrapBracket(expression)
            : expression;
    };
    AbstractSyntaxTree.prototype.makeValueExpression = function () {
        return [this.value];
    };
    AbstractSyntaxTree.prototype.wrapBracket = function (expression) {
        return [Token.literal.BracketOpen].concat(expression, [Token.literal.BracketClose]);
    };
    return AbstractSyntaxTree;
}(AbstractSyntaxTreeBase));

var TokenValidateLevel;
(function (TokenValidateLevel) {
    TokenValidateLevel[TokenValidateLevel["Pass"] = 0] = "Pass";
    TokenValidateLevel[TokenValidateLevel["Escape"] = 1] = "Escape";
    TokenValidateLevel[TokenValidateLevel["Fatal"] = 2] = "Fatal";
})(TokenValidateLevel || (TokenValidateLevel = {}));
var TokenValidator = /** @class */ (function () {
    function TokenValidator() {
    }
    TokenValidator.validateToken = function (token) {
        var level = TokenValidator.extractTokenLevel(token);
        if (level === TokenValidateLevel.Fatal)
            return new ParserError(TokenError.invalidToken, token);
    };
    TokenValidator.validateValueToken = function (token, prevToken) {
        if (!prevToken)
            return undefined;
        if (TokenHelper.isValue(prevToken))
            return new ParserError(TokenError.missingOperator, prevToken);
        if (!TokenHelper.isBracketOpen(prevToken) && !TokenHelper.isOperator(prevToken))
            return new ParserError(TokenError.missingOperator, prevToken);
    };
    TokenValidator.extractTokenLevel = function (token) {
        var levelExtractors = [
            { predicate: TokenHelper.isUnkown, level: TokenValidateLevel.Fatal },
            { predicate: TokenHelper.isToken, level: TokenValidateLevel.Pass }
        ];
        var extractedLevel = levelExtractors.find(function (extractor) { return extractor.predicate(token); });
        return extractedLevel
            ? extractedLevel.level
            : TokenValidateLevel.Fatal;
    };
    return TokenValidator;
}());

var TokenEnumerable = /** @class */ (function () {
    function TokenEnumerable(token) {
        this.token = token;
        this.tokenStack = [];
        this.cursor = 0;
        this._nextStack = {
            line: 0,
            col: 0
        };
    }
    Object.defineProperty(TokenEnumerable.prototype, "stack", {
        get: function () {
            return this._stack || this._nextStack;
        },
        set: function (value) {
            this._stack = this._nextStack;
            this._nextStack = value;
        },
        enumerable: true,
        configurable: true
    });
    TokenEnumerable.prototype.rewind = function () {
        this.cursor = 0;
        this.currentToken = undefined;
        this._stack = undefined;
        this._nextStack = {
            col: 0,
            line: 0
        };
        this.tokenStack = [];
    };
    TokenEnumerable.prototype.calculateStack = function (token) {
        if (TokenHelper.isLineEscape(token)) {
            this.stack = {
                line: this._nextStack.line + 1,
                col: 0
            };
            return;
        }
        this.stack = {
            line: this._nextStack.line,
            col: this._nextStack.col + 1
        };
    };
    TokenEnumerable.prototype.finalizeStack = function () {
        this.stack = undefined;
    };
    TokenEnumerable.prototype.addStack = function (token) {
        this.tokenStack.push(token);
    };
    TokenEnumerable.prototype.popStack = function () {
        return this.tokenStack.length
            ? this.tokenStack[this.tokenStack.length - 1]
            : undefined;
    };
    TokenEnumerable.prototype.next = function () {
        var tokenStack = [];
        if (this.cursor >= this.token.length)
            return undefined;
        do {
            this.currentToken = this.findToken();
            if (!TokenHelper.isUnkown(this.currentToken))
                tokenStack.push(this.currentToken);
        } while (this.proceedNext());
        var token = this.makeToken(tokenStack);
        var error = TokenValidator.validateToken(token);
        if (error)
            throw error;
        return token;
    };
    TokenEnumerable.prototype.proceedNext = function () {
        var token = this.currentToken;
        var nextToken = this.token[this.cursor];
        return this.isSequentialValue(token, nextToken);
    };
    TokenEnumerable.prototype.isSequentialValue = function (token, nextToken) {
        var tokenType = TokenHelper.induceType(token);
        var nextTokenType = TokenHelper.induceType(nextToken);
        return tokenType === Token.Type.Value && TokenHelper.isNumeric(token) && tokenType === nextTokenType ||
            tokenType === Token.Type.Value && TokenHelper.isNumeric(token) && nextTokenType === Token.Type.Dot ||
            tokenType === Token.Type.Dot && TokenHelper.isNumeric(nextToken) && nextTokenType === Token.Type.Value;
    };
    TokenEnumerable.prototype.findToken = function () {
        while (this.cursor < this.token.length) {
            var token = this.getToken();
            this.cursor += 1;
            this.calculateStack(token);
            if (!TokenHelper.isWhiteSpace(token))
                return token;
        }
    };
    TokenEnumerable.prototype.getToken = function () {
        var token = this.token[this.cursor];
        return this.getAliasToken(token);
    };
    TokenEnumerable.prototype.getAliasToken = function (token) {
        if (!TokenHelper.isOperator(token))
            return token;
        return Object.keys(Token.value)
            .map(function (operatorType) { return Token.value[operatorType].symbols.includes(token)
            ? Token.value[operatorType].alias
            : undefined; })
            .find(function (alias) { return alias !== undefined; }) || token;
    };
    TokenEnumerable.prototype.isTokenArrayNumeric = function (tokens) {
        return tokens.every(function (token) { return TokenHelper.isNumeric(token) || TokenHelper.isDot(token); });
    };
    TokenEnumerable.prototype.makeToken = function (tokens) {
        if (!tokens.length)
            return undefined;
        if (this.isTokenArrayNumeric(tokens))
            return tokens.join('');
        if (tokens.length > 1)
            throw new ParserError(TokenError.invalidNonNumericValue, this.makeTokenString(tokens));
        return tokens[0];
    };
    TokenEnumerable.prototype.makeTokenString = function (tokens) {
        return tokens.map(function (token) { return typeof token === 'object' ? JSON.stringify(token) : token; }).join('');
    };
    return TokenEnumerable;
}());

var GeneralError;
(function (GeneralError) {
    GeneralError.id = 0x1000;
    GeneralError.unknownError = { code: 0x1000, text: 'unknown error is occurred' };
    GeneralError.methodNotImplemented = { code: 0x1001, text: 'method not implemented' };
})(GeneralError || (GeneralError = {}));

var AbstractSyntaxTreeValidator = /** @class */ (function () {
    function AbstractSyntaxTreeValidator() {
    }
    AbstractSyntaxTreeValidator.validate = function (ast) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var validators = [
            this.validateMissingValue,
            this.validateMissingCloseBracket
        ];
        return validators
            .map(function (validator) { return validator.apply(void 0, [ast].concat(args)); })
            .find(function (validator) { return validator !== undefined; });
    };
    AbstractSyntaxTreeValidator.validateMissingValue = function (ast) {
        if (!ast)
            return;
        var childError = AbstractSyntaxTreeValidator.validateChildMissingValue(ast);
        return childError || AbstractSyntaxTreeValidator.validateCurrentMissingValue(ast);
    };
    AbstractSyntaxTreeValidator.validateCurrentMissingValue = function (ast) {
        if (ast.type !== Token.Type.Operator || ast.leftNode && ast.rightNode)
            return;
        return !ast.leftNode
            ? new ParserError(TokenError.missingValueBefore, ast.value)
            : new ParserError(TokenError.missingValueAfter, ast.value);
    };
    AbstractSyntaxTreeValidator.validateChildMissingValue = function (ast) {
        return [
            AbstractSyntaxTreeValidator.validateMissingValue(ast.leftNode),
            AbstractSyntaxTreeValidator.validateMissingValue(ast.rightNode)
        ]
            .find(function (error) { return error !== undefined; });
    };
    AbstractSyntaxTreeValidator.validateMissingCloseBracket = function (ast) {
        if (ast.hasOpenBracket())
            return new ParserError(TokenError.missingCloseBracket);
    };
    AbstractSyntaxTreeValidator.validateInvalidTwoOperator = function (ast, token, lastToken) {
        if (!TokenHelper.isBracket(ast.value) && !ast.rightNode)
            return new ParserError(TokenError.invalidTwoOperator, lastToken, token);
    };
    return AbstractSyntaxTreeValidator;
}());

var TokenAnalyzer = /** @class */ (function (_super) {
    __extends(TokenAnalyzer, _super);
    function TokenAnalyzer(token) {
        return _super.call(this, token) || this;
    }
    TokenAnalyzer.prototype.parse = function () {
        var _this = this;
        this.try(function () { return _this.preValidate(); });
        this.initialize();
        this.try(function () { return _this.makeAst(); });
        this.try(function () { return _this.postValidate(); });
        return this.ast;
    };
    TokenAnalyzer.prototype.initialize = function () {
        this.ast = new AbstractSyntaxTree(Token.literal.BracketOpen);
        this.ast.leftNode = new AbstractSyntaxTree();
        this.currentTree = this.ast.leftNode;
        this.rewind();
    };
    TokenAnalyzer.prototype.getAst = function () {
        return this.ast;
    };
    TokenAnalyzer.prototype.makeAst = function () {
        var _this = this;
        var token;
        while (token = this.next()) {
            this.try(function () { return _this.doAnalyzeToken(token); });
        }
        this.finalizeStack();
        this.ast = this.ast.removeRootBracket().findRoot();
    };
    TokenAnalyzer.prototype.try = function (tryFunction) {
        try {
            return tryFunction();
        }
        catch (error) {
            this.handleError(error);
        }
    };
    TokenAnalyzer.prototype.preValidate = function () {
        if (!this.token || !this.token.length)
            throw new ParserError(TokenError.emptyToken);
    };
    TokenAnalyzer.prototype.postValidate = function () {
        var error = AbstractSyntaxTreeValidator.validate(this.ast);
        if (error)
            throw error;
    };
    TokenAnalyzer.prototype.handleError = function (error) {
        if (error instanceof ParserError)
            throw error.withStack(this.stack);
        throw new ParserError(GeneralError.unknownError).withStack(this.stack);
    };
    TokenAnalyzer.prototype.doAnalyzeToken = function (token) {
        this.analyzeToken(token);
        this.addStack(token);
    };
    TokenAnalyzer.prototype.analyzeToken = function (token) {
        var lastToken = this.popStack();
        if (TokenHelper.isBracket(token)) {
            this.analyzeBracketToken(token);
            return;
        }
        if (TokenHelper.isOperator(token)) {
            this.analyzeOperatorToken(token);
            return;
        }
        var error = TokenValidator.validateValueToken(token, lastToken);
        if (error)
            throw error;
        this.currentTree.insertNode(token);
    };
    TokenAnalyzer.prototype.analyzeBracketToken = function (token) {
        if (TokenHelper.isBracketOpen(token)) {
            this.analyzeImplicitToken();
            this.currentTree = this.currentTree.insertNode(token);
            return;
        }
        if (TokenHelper.isBracketClose(token)) {
            this.currentTree = this.currentTree.removeClosestBracket();
            this.ast = this.currentTree.findRoot();
            return;
        }
    };
    TokenAnalyzer.prototype.analyzeOperatorToken = function (token) {
        var lastToken = this.popStack();
        if (TokenHelper.isOperator(lastToken))
            throw new ParserError(TokenError.invalidTwoOperator, lastToken, token);
        if (!this.currentTree.value) {
            this.currentTree.value = token;
            return;
        }
        var error = AbstractSyntaxTreeValidator.validateInvalidTwoOperator(this.currentTree, token, lastToken);
        if (error)
            throw error;
        this.currentTree = this.currentTree.insertNode(token);
        this.ast = this.ast.findRoot();
    };
    TokenAnalyzer.prototype.analyzeImplicitToken = function () {
        var lastToken = this.popStack();
        if (lastToken && !TokenHelper.isSymbol(lastToken) || TokenHelper.isBracketClose(lastToken))
            this.insertImplicitMultiplication();
    };
    TokenAnalyzer.prototype.insertImplicitMultiplication = function () {
        this.analyzeToken(Token.literal.Multiplication);
        this.addStack(Token.literal.Multiplication);
    };
    return TokenAnalyzer;
}(TokenEnumerable));

var ParserHelper = /** @class */ (function () {
    function ParserHelper() {
    }
    ParserHelper.getArray = function (data) {
        return typeof data === 'string'
            ? this.stringToArray(data)
            : data;
    };
    ParserHelper.stringToArray = function (value) {
        return value.split('');
    };
    return ParserHelper;
}());

var Parser = /** @class */ (function () {
    function Parser() {
    }
    Parser.parse = function (data) {
        var analyzer = new TokenAnalyzer(ParserHelper.getArray(data));
        return analyzer.parse();
    };
    Parser.unparse = function (ast) {
        return ast.expression;
    };
    return Parser;
}());

var BuilderBase = /** @class */ (function () {
    function BuilderBase(treeBuilder) {
        this.treeBuilder = treeBuilder;
    }
    BuilderBase.prototype.build = function (data) {
        var _this = this;
        return this.try(function () { return _this.doBuild(data); });
    };
    BuilderBase.prototype.parse = function (data) {
        var _this = this;
        return this.try(function () { return _this.doParse(data); });
    };
    BuilderBase.prototype.unparse = function (data) {
        var _this = this;
        return this.try(function () { return _this.doUnparse(data); });
    };
    BuilderBase.prototype.handleError = function (error) {
        return Packer.makeError(error);
    };
    BuilderBase.prototype.try = function (tryFunc) {
        try {
            return tryFunc();
        }
        catch (error) {
            return this.handleError(error);
        }
    };
    BuilderBase.prototype.doBuild = function (data) {
        throw new ParserError(GeneralError.methodNotImplemented);
    };
    BuilderBase.prototype.doParse = function (data) {
        throw new ParserError(GeneralError.methodNotImplemented);
    };
    BuilderBase.prototype.doUnparse = function (data) {
        throw new ParserError(GeneralError.methodNotImplemented);
    };
    return BuilderBase;
}());

var Builder = /** @class */ (function (_super) {
    __extends(Builder, _super);
    function Builder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Builder.prototype.doBuild = function (data) {
        if (!data)
            throw new ParserError(BuilderError.emptyData);
        if (BuilderHelper.needParse(data))
            return this.parse(data);
        if (BuilderHelper.needUnparse(data))
            return this.unparse(data);
    };
    Builder.prototype.doParse = function (data) {
        var ast = Parser.parse(data);
        var tree = this.treeBuilder.makeTree(ast);
        return Packer.makeData(tree);
    };
    Builder.prototype.doUnparse = function (data) {
        var ast = this.treeBuilder.makeAst(data);
        var expression = Parser.unparse(ast);
        return Packer.makeData(expression);
    };
    return Builder;
}(BuilderBase));

/* tslint:disable:max-line-length */
var TreeError;
(function (TreeError) {
    TreeError.id = 0x0200;
    TreeError.emptyAst = { code: 0x0200, text: 'AST is empty' };
    TreeError.emptyTree = { code: 0x0201, text: 'tree is empty' };
    TreeError.invalidParserTree = { code: 0x0220, text: 'invalid parser tree' };
})(TreeError || (TreeError = {}));
/* tslint:enable:max-line-length */

var TreeBuilderBase = /** @class */ (function () {
    function TreeBuilderBase() {
    }
    TreeBuilderBase.prototype.makeTree = function (ast) {
        throw new ParserError(GeneralError.methodNotImplemented);
    };
    TreeBuilderBase.prototype.makeAst = function (tree) {
        throw new ParserError(GeneralError.methodNotImplemented);
    };
    return TreeBuilderBase;
}());

var TreeBuilder = /** @class */ (function (_super) {
    __extends(TreeBuilder, _super);
    function TreeBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TreeBuilder.prototype.makeTree = function (ast) {
        if (!ast)
            throw new ParserError(TreeError.emptyAst);
        var tree = this.makeNode(ast);
        if (!TreeBuilder.isValid(tree))
            throw new ParserError(TreeError.invalidParserTree);
        return tree;
    };
    TreeBuilder.prototype.makeAst = function (tree) {
        if (!tree)
            throw new ParserError(TreeError.emptyTree);
        var ast = this.makeAstNode(tree);
        if (!ast.isValid())
            throw new ParserError(TreeError.invalidParserTree);
        return ast;
    };
    TreeBuilder.prototype.makeNode = function (node) {
        if (!node)
            return undefined;
        return node.type === Token.Type.Operator
            ? this.makeOperatorNode(node)
            : this.makeValueNode(node);
    };
    TreeBuilder.prototype.makeOperatorNode = function (sourceNode) {
        return {
            operator: sourceNode.value,
            operand1: this.makeNode(sourceNode.leftNode),
            operand2: this.makeNode(sourceNode.rightNode)
        };
    };
    TreeBuilder.prototype.makeValueNode = function (sourceNode) {
        return {
            value: this.makeOperandValue(sourceNode)
        };
    };
    TreeBuilder.prototype.makeOperandValue = function (sourceNode) {
        var _a;
        var type = TokenHelper.isObject(sourceNode.value)
            ? 'item'
            : 'unit';
        return _a = {
                type: type
            },
            _a[type] = sourceNode.value,
            _a;
    };
    TreeBuilder.prototype.makeAstNode = function (node) {
        if (!node)
            return undefined;
        if (TreeBuilder.isTree(node)) {
            var tree = node;
            var ast = new AbstractSyntaxTree(tree.operator);
            ast.leftNode = this.makeAstNode(tree.operand1);
            ast.rightNode = this.makeAstNode(tree.operand2);
            return ast;
        }
        var operand = node;
        return new AbstractSyntaxTree(TreeBuilder.getValue(operand));
    };
    TreeBuilder.isTree = function (node) {
        return !!node.operator;
    };
    TreeBuilder.getValue = function (operand) {
        if (!TreeBuilder.isValidOperand(operand))
            throw new ParserError(TreeError.invalidParserTree);
        return operand.value.type === 'item'
            ? operand.value.item
            : operand.value.unit;
    };
    TreeBuilder.isValid = function (node) {
        var tree = node;
        var operand = node;
        return !!(tree.operator && tree.operand1 && tree.operand2) || operand.value !== undefined;
    };
    TreeBuilder.isValidOperand = function (operand) {
        return operand && operand.value && operand.value.type && operand.value[operand.value.type] !== undefined;
    };
    return TreeBuilder;
}(TreeBuilderBase));

var _MODULE_VERSION_ = '0.0.12';
function getVersion() {
    return _MODULE_VERSION_;
}
function convert(data) {
    var builder = new Builder(new TreeBuilder());
    return builder.build(data);
}
function valid(data) {
    var builder = new Builder(new TreeBuilder());
    return builder.build(data).code === success;
}

export { getVersion, convert, valid };
