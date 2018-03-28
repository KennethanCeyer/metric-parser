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
        Type[Type["Operator"] = 2] = "Operator";
        Type[Type["Bracket"] = 3] = "Bracket";
        Type[Type["Function"] = 4] = "Function";
        Type[Type["WhiteSpace"] = 5] = "WhiteSpace";
        Type[Type["CompareToken"] = 6] = "CompareToken";
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
        BracketClose: ')'
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
        undefined,
    ];
})(Token || (Token = {}));

var TokenHelper = /** @class */ (function () {
    function TokenHelper() {
    }
    TokenHelper.isToken = function (token) {
        return token && (TokenHelper.isNumeric(token) || TokenHelper.isSymbol(token) || TokenHelper.isObject(token));
    };
    TokenHelper.isUnkown = function (token) {
        return token === undefined || token === null;
    };
    TokenHelper.isLineEscape = function (token) {
        return token === '\n';
    };
    TokenHelper.isWhiteSpace = function (token) {
        return Token.whiteSpace.includes(String(token));
    };
    TokenHelper.isNumeric = function (value) {
        return (/\d+(\.\d*)?|\.\d+/).test(String(value));
    };
    TokenHelper.isArray = function (value) {
        return Array.isArray(value);
    };
    TokenHelper.isString = function (value) {
        return typeof value === 'string';
    };
    TokenHelper.isObject = function (value) {
        return typeof value === 'object';
    };
    TokenHelper.isValue = function (value) {
        return TokenHelper.isObject(value) || TokenHelper.isNumeric(value);
    };
    TokenHelper.isAddition = function (token) {
        return Token.addition.includes(token);
    };
    TokenHelper.isSubtraction = function (token) {
        return Token.subtraction.includes(token);
    };
    TokenHelper.isMultiplication = function (token) {
        return Token.multiplication.includes(token);
    };
    TokenHelper.isDivision = function (token) {
        return Token.division.includes(token);
    };
    TokenHelper.isMod = function (token) {
        return Token.mod.includes(token);
    };
    TokenHelper.isPow = function (token) {
        return Token.pow.includes(token);
    };
    TokenHelper.isBracket = function (token) {
        return Token.bracket.includes(token);
    };
    TokenHelper.isBracketOpen = function (token) {
        return token === Token.bracketOpen;
    };
    TokenHelper.isBracketClose = function (token) {
        return token === Token.bracketClose;
    };
    TokenHelper.isSymbol = function (token) {
        return Token.symbols.includes(String(token));
    };
    TokenHelper.isOperator = function (token) {
        return Token.operators.includes(String(token));
    };
    TokenHelper.isHigher = function (source, target) {
        return TokenHelper.getPrecedence(source) - TokenHelper.getPrecedence(target) > 0;
    };
    TokenHelper.induceType = function (value) {
        var typeInducers = [
            { predicate: TokenHelper.isUnkown, type: Token.Type.Unknown },
            { predicate: TokenHelper.isWhiteSpace, type: Token.Type.WhiteSpace },
            { predicate: TokenHelper.isOperator, type: Token.Type.Operator },
            { predicate: TokenHelper.isBracket, type: Token.Type.Bracket },
            { predicate: TokenHelper.isValue, type: Token.Type.Value }
        ];
        var extractedToken = typeInducers.find(function (inducer) { return inducer.predicate(value); });
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
    return TokenHelper;
}());

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
    return ParserError;
}(Error));

/* tslint:disable:max-line-length */
var TokenError;
(function (TokenError) {
    TokenError.id = 0x0100;
    TokenError.invalidToken = { code: 0x0100, text: '`{0}` token is invalid token type' };
    TokenError.invalidTwoOperator = { code: 0x0101, text: 'two operators `{0}`, `{1}` can not come together' };
    TokenError.missingOperator = { code: 0x0112, text: 'the operator is missing after `{0}`' };
    TokenError.missingOpenBracket = { code: 0x0120, text: 'missing open bracket, you cannot close the bracket' };
    TokenError.missingCloseBracket = { code: 0x0121, text: 'missing close bracket, the bracket must be closed' };
})(TokenError || (TokenError = {}));
/* tslint:enable:max-line-length */

var AbstractSyntaxTreeBase = /** @class */ (function () {
    function AbstractSyntaxTreeBase(value) {
        if (value)
            this.value = value;
    }
    Object.defineProperty(AbstractSyntaxTreeBase.prototype, "value", {
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
    Object.defineProperty(AbstractSyntaxTreeBase.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractSyntaxTreeBase.prototype, "subType", {
        get: function () {
            return this._subType;
        },
        set: function (value) {
            this._subType = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractSyntaxTreeBase.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        set: function (value) {
            this._parent = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractSyntaxTreeBase.prototype, "leftNode", {
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
    Object.defineProperty(AbstractSyntaxTreeBase.prototype, "rightNode", {
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
    AbstractSyntaxTreeBase.prototype.findRoot = function () {
        if (this.isRoot())
            return this;
        return this._parent.findRoot();
    };
    AbstractSyntaxTreeBase.prototype.isRoot = function () {
        return !this._parent;
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
        return TokenHelper.isHigher(token, this.value) && this.subType !== Token.SubType.Group;
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
}());

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
    AbstractSyntaxTree.prototype.makeOperatorExpression = function () {
        var expression = (this.leftNode ? this.leftNode.expression : []).concat([
            this.value
        ], this.rightNode ? this.rightNode.expression : []);
        var parentOperator = this.getParentOperator();
        return parentOperator && TokenHelper.isHigher(parentOperator.value, this.value)
            ? [Token.literal.BracketOpen].concat(expression, [Token.literal.BracketClose]) : expression;
    };
    AbstractSyntaxTree.prototype.makeValueExpression = function () {
        return [this.value];
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
            throw error.withStack(this.stack);
        return token;
    };
    TokenEnumerable.prototype.proceedNext = function () {
        var tokenType = TokenHelper.induceType(this.currentToken);
        var nextTokenType = TokenHelper.induceType(this.token[this.cursor]);
        return tokenType === Token.Type.Value &&
            TokenHelper.isNumeric(this.currentToken) &&
            tokenType === nextTokenType;
    };
    TokenEnumerable.prototype.findToken = function () {
        while (this.cursor < this.token.length) {
            var token = this.token[this.cursor];
            this.cursor += 1;
            this.calculateStack(token);
            if (!TokenHelper.isWhiteSpace(token))
                return token;
        }
    };
    TokenEnumerable.prototype.makeToken = function (tokens) {
        if (!tokens.length)
            return undefined;
        if (tokens.every(function (token) { return TokenHelper.isNumeric(token); }))
            return tokens.join('');
        if (tokens.length > 1)
            throw Error('error: non-numeric tokens can not be consecutive.');
        return tokens[0];
    };
    return TokenEnumerable;
}());

/* tslint:disable:max-line-length */
var TreeError;
(function (TreeError) {
    TreeError.id = 0x0200;
    TreeError.astIsEmpty = { code: 0x0200, text: 'AST is empty' };
    TreeError.invalidParserTree = { code: 0x0201, text: 'invalid parser tree' };
})(TreeError || (TreeError = {}));
/* tslint:enable:max-line-length */

var TreeBuilderBase = /** @class */ (function () {
    function TreeBuilderBase() {
    }
    TreeBuilderBase.prototype.makeTree = function (ast) {
        throw new Error('method not implemented.');
    };
    TreeBuilderBase.prototype.makeAst = function (tree) {
        throw new Error('method not implemented.');
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
            throw new ParserError(TreeError.astIsEmpty);
        var tree = this.makeNode(ast);
        if (tree.value)
            throw new ParserError(TreeError.invalidParserTree);
        return tree;
    };
    TreeBuilder.prototype.makeAst = function (tree) {
        return this.makeAstNode(tree);
    };
    TreeBuilder.prototype.makeNode = function (sourceNode) {
        return sourceNode.type === Token.Type.Operator
            ? this.makeOperatorNode(sourceNode)
            : this.makeValueNode(sourceNode);
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
        var type = TokenHelper.isObject(sourceNode.value)
            ? 'item'
            : 'unit';
        return _a = {
                type: type
            }, _a[type] = sourceNode.value, _a;
        var _a;
    };
    TreeBuilder.prototype.makeAstNode = function (node) {
        if (!node)
            return;
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
        return operand.value.type === 'item'
            ? operand.value.item
            : operand.value.unit;
    };
    return TreeBuilder;
}(TreeBuilderBase));

var TokenAnalyzer = /** @class */ (function (_super) {
    __extends(TokenAnalyzer, _super);
    function TokenAnalyzer(token) {
        return _super.call(this, token) || this;
    }
    TokenAnalyzer.prototype.parse = function () {
        var _this = this;
        this.initialize();
        this.makeAst();
        return this.try(function () { return _this.makeTree(); });
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
        if (this.ast.hasOpenBracket())
            this.handleError(new ParserError(TokenError.missingCloseBracket));
    };
    TokenAnalyzer.prototype.try = function (tryFunction) {
        try {
            return tryFunction();
        }
        catch (error) {
            this.handleError(error);
        }
    };
    TokenAnalyzer.prototype.handleError = function (error) {
        throw error.withStack(this.stack);
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
        var lastToken = this.popStack();
        if (TokenHelper.isBracketOpen(token)) {
            if (lastToken && !TokenHelper.isSymbol(lastToken))
                this.insertImplicitMultiplication();
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
        if (!this.currentTree.value)
            this.currentTree.value = token;
        else {
            if (!TokenHelper.isBracket(this.currentTree.value) && !this.currentTree.rightNode)
                throw new ParserError(TokenError.invalidTwoOperator, lastToken, token);
            this.currentTree = this.currentTree.insertNode(token);
            this.ast = this.ast.findRoot();
        }
    };
    TokenAnalyzer.prototype.insertImplicitMultiplication = function () {
        this.analyzeToken(Token.literal.Multiplication);
        this.addStack(Token.literal.Multiplication);
    };
    TokenAnalyzer.prototype.makeTree = function () {
        var treeParser = new TreeBuilder();
        return treeParser.makeTree(this.ast);
    };
    return TokenAnalyzer;
}(TokenEnumerable));

var BuilderMessage = /** @class */ (function () {
    function BuilderMessage() {
    }
    BuilderMessage.prototype.makeData = function (data, code) {
        if (code === void 0) { code = 0; }
        return { code: code, data: data };
    };
    BuilderMessage.prototype.makeError = function (error) {
        return __assign({}, this.makeData(error.text, error.code), { stack: error.parserStack });
    };
    return BuilderMessage;
}());

var Builder = /** @class */ (function (_super) {
    __extends(Builder, _super);
    function Builder(data) {
        var _this = _super.call(this) || this;
        _this.data = data;
        return _this;
    }
    Builder.prototype.build = function () {
        try {
            return this.tryBuild();
        }
        catch (error) {
            return this.handleError(error);
        }
    };
    Builder.prototype.parse = function (data, pos) {
        if (pos === void 0) { pos = 0; }
        var tokenAnalyzer = new TokenAnalyzer(ParserHelper.getArray(data));
        var parseData = tokenAnalyzer.parse();
        return this.makeData(parseData);
    };
    Builder.prototype.unparse = function (data) {
        var treeBuilder = new TreeBuilder();
        var ast = treeBuilder.makeAst(data);
        return this.makeData(ast.expression);
    };
    Builder.prototype.tryBuild = function () {
        if (BuilderHelper.needParse(this.data))
            return this.parse(this.data);
        if (BuilderHelper.needUnparse(this.data))
            return this.unparse(this.data);
    };
    Builder.prototype.handleError = function (error) {
        return this.makeError(error);
    };
    return Builder;
}(BuilderMessage));

var _PLUGIN_VERSION_ = '0.0.1';
function convert(formula) {
    var builder = new Builder(formula);
    return builder.build();
}
function getVersion() {
    return _PLUGIN_VERSION_;
}

export { convert, getVersion };
