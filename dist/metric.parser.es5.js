var LoggerCode;
(function (LoggerCode) {
    LoggerCode[LoggerCode["Success"] = 0] = "Success";
    LoggerCode[LoggerCode["InvalidToken"] = 1] = "InvalidToken";
    LoggerCode[LoggerCode["NotSupported"] = 2] = "NotSupported";
    LoggerCode[LoggerCode["InvalidLeftOperand"] = 3] = "InvalidLeftOperand";
    LoggerCode[LoggerCode["InvalidRightOperand"] = 4] = "InvalidRightOperand";
    LoggerCode[LoggerCode["OpenBracket"] = 5] = "OpenBracket";
    LoggerCode[LoggerCode["CloseBracket"] = 6] = "CloseBracket";
    LoggerCode[LoggerCode["InvalidOperatorKey"] = 7] = "InvalidOperatorKey";
    LoggerCode[LoggerCode["InvalidLeftOperandKey"] = 8] = "InvalidLeftOperandKey";
    LoggerCode[LoggerCode["InvalidRightOperandKey"] = 9] = "InvalidRightOperandKey";
    LoggerCode[LoggerCode["InvalidFormulaExpression"] = 10] = "InvalidFormulaExpression";
})(LoggerCode || (LoggerCode = {}));

var Token;
(function (Token) {
    var Type;
    (function (Type) {
        Type[Type["Unkown"] = 0] = "Unkown";
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
    Token.Literal = {
        Addition: '+',
        Substraction: '-',
        Multiplication: '*',
        MultiplicationLiteral: 'x',
        Division: '/',
        Mod: '%',
        Pow: '^',
        BracketOpen: '(',
        BracketClose: ')'
    };
    Token.Addition = [Token.Literal.Addition];
    Token.Subtraction = [Token.Literal.Substraction];
    Token.Multiplication = [Token.Literal.Multiplication, Token.Literal.MultiplicationLiteral];
    Token.Division = [Token.Literal.Division];
    Token.Mod = [Token.Literal.Mod];
    Token.Pow = [Token.Literal.Pow];
    Token.BracketOpen = Token.Literal.BracketOpen;
    Token.BracketClose = Token.Literal.BracketClose;
    Token.Bracket = [Token.BracketOpen, Token.BracketClose];
    Token.Precedence = Token.Addition.concat(Token.Subtraction, Token.Multiplication, Token.Division, Token.Pow, Token.Mod, Token.Bracket);
    Token.Operators = Token.Addition.concat(Token.Subtraction, Token.Multiplication, Token.Division, Token.Mod, Token.Pow);
    Token.Symbols = Token.Operators.concat(Token.Bracket);
    Token.WhiteSpace = [
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
        return token && (TokenHelper.isNumeric(token) || this.isSymbol(token) || TokenHelper.isObject(token));
    };
    TokenHelper.isWhiteSpace = function (token) {
        return Token.WhiteSpace.includes(String(token));
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
    TokenHelper.isAddition = function (token) {
        return Token.Addition.includes(token);
    };
    TokenHelper.isSubtraction = function (token) {
        return Token.Subtraction.includes(token);
    };
    TokenHelper.isMultiplication = function (token) {
        return Token.Multiplication.includes(token);
    };
    TokenHelper.isDivision = function (token) {
        return Token.Division.includes(token);
    };
    TokenHelper.isMod = function (token) {
        return Token.Mod.includes(token);
    };
    TokenHelper.isPow = function (token) {
        return Token.Pow.includes(token);
    };
    TokenHelper.isBracket = function (token) {
        return Token.Bracket.includes(token);
    };
    TokenHelper.isBracketOpen = function (token) {
        return token === Token.BracketOpen;
    };
    TokenHelper.isBracketClose = function (token) {
        return token === Token.BracketClose;
    };
    TokenHelper.isSymbol = function (token) {
        return Token.Symbols.includes(String(token));
    };
    TokenHelper.isOperator = function (token) {
        return Token.Operators.includes(String(token));
    };
    TokenHelper.induceType = function (value) {
        if (!value)
            return Token.Type.Unkown;
        if (TokenHelper.isWhiteSpace(value))
            return Token.Type.WhiteSpace;
        if (TokenHelper.isOperator(value))
            return Token.Type.Operator;
        if (TokenHelper.isBracket(value))
            return Token.Type.Bracket;
        return Token.Type.Value;
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

var TokenValidateLevel;
(function (TokenValidateLevel) {
    TokenValidateLevel[TokenValidateLevel["Pass"] = 0] = "Pass";
    TokenValidateLevel[TokenValidateLevel["Escape"] = 1] = "Escape";
    TokenValidateLevel[TokenValidateLevel["Fatal"] = 2] = "Fatal";
})(TokenValidateLevel || (TokenValidateLevel = {}));

var LoggerMessage = (_a = {}, _a[LoggerCode.InvalidToken] = '{0} token is invalid type', _a[LoggerCode.NotSupported] = '\'{0}\' operator is not supported.', _a[LoggerCode.InvalidLeftOperand] = 'Left side operand is not valid.', _a[LoggerCode.InvalidRightOperand] = 'Right side operand is not valid.', _a[LoggerCode.OpenBracket] = 'Bracket must be opened.', _a[LoggerCode.CloseBracket] = 'Bracket must be closed.', _a[LoggerCode.InvalidOperatorKey] = 'Operator\'s key must be in result.', _a[LoggerCode.InvalidLeftOperandKey] = 'Left operand\'s key must be in result.', _a[LoggerCode.InvalidRightOperandKey] = 'Right operand\'s key must be in result.', _a[LoggerCode.InvalidFormulaExpression] = 'Metric expression is null or undefined.', _a);
var _a;

var StringHelper = /** @class */ (function () {
    function StringHelper() {
    }
    StringHelper.formatString = function (value, mapping) {
        var targetValue = value;
        if (mapping)
            mapping
                .forEach(function (match, index) { return targetValue = StringHelper.replaceArg(index, targetValue, match); });
        return targetValue;
    };
    StringHelper.replaceArg = function (match, target, value) {
        return target.replace(new RegExp("\\{" + match + "\\}", 'g'), value);
    };
    return StringHelper;
}());

var LoggerHelper = /** @class */ (function () {
    function LoggerHelper() {
    }
    LoggerHelper.getMessage = function (code, trace, mapping) {
        if (code === void 0) { code = LoggerCode.Success; }
        var message = StringHelper.formatString(LoggerMessage[code] || '', mapping);
        return {
            code: code,
            message: message,
            trace: trace
        };
    };
    return LoggerHelper;
}());

var ParserProcess = /** @class */ (function () {
    function ParserProcess() {
    }
    ParserProcess.Lexer = 'Initialize';
    ParserProcess.Tree = 'Tree';
    ParserProcess.Unparse = 'Unparse';
    return ParserProcess;
}());

var AbstractSyntaxTree = /** @class */ (function () {
    function AbstractSyntaxTree(value) {
        if (value)
            this.setValue(value);
    }
    AbstractSyntaxTree.prototype.findRoot = function () {
        if (!this._parent)
            return this;
        return this._parent.findRoot();
    };
    AbstractSyntaxTree.prototype.findOpenedBracket = function () {
        if (TokenHelper.isBracketOpen(this.getValue()))
            return this;
        if (!this._parent)
            return null;
        return this._parent.findOpenedBracket();
    };
    AbstractSyntaxTree.prototype.removeClosestBracket = function () {
        var node = this.findOpenedBracket();
        if (!node)
            return null;
        var targetNode = node.getLeftNode();
        targetNode.setSubType(Token.SubType.Group);
        if (!node._parent) {
            targetNode.removeParent();
            return targetNode;
        }
        if (node._parent.getLeftNode() === node)
            node._parent.setLeftNode(targetNode);
        else
            node._parent.setRightNode(targetNode);
        return node._parent;
    };
    AbstractSyntaxTree.prototype.climbUp = function (token) {
        return this.isClimbTop(token)
            ? this
            : this._parent.climbUp(token);
    };
    AbstractSyntaxTree.prototype.isClimbTop = function (token) {
        return this.isNeedMakeUpperNode(token) ||
            !this.getParent() ||
            TokenHelper.isBracketOpen(this.getValue());
    };
    AbstractSyntaxTree.prototype.isNeedMakeUpperNode = function (token) {
        return this.isTokenHigher(this.getValue(), token) && this.getSubType() !== Token.SubType.Group;
    };
    AbstractSyntaxTree.prototype.isTokenHigher = function (source, target) {
        return TokenHelper.getPrecedence(source) - TokenHelper.getPrecedence(target) <= 0;
    };
    AbstractSyntaxTree.prototype.createChildNode = function (value) {
        var node = new AbstractSyntaxTree(value);
        node.setParent(this);
        return node;
    };
    AbstractSyntaxTree.prototype.createParentNode = function (value) {
        var node = new AbstractSyntaxTree(value);
        this.setParent(node);
        return node;
    };
    AbstractSyntaxTree.prototype.insertOperatorNode = function (value) {
        var rootNode = this.climbUp(value);
        if (TokenHelper.isBracketOpen(rootNode.getValue())) {
            var midNode = rootNode.createChildNode(value);
            var leftNode = rootNode.getLeftNode();
            var rightNode = rootNode.getRightNode();
            rootNode.setLeftNode(midNode);
            midNode.setLeftNode(leftNode);
            midNode.setRightNode(rightNode);
            return midNode;
        }
        if (this === rootNode) {
            var newNode_1 = rootNode.createChildNode(value);
            newNode_1.setLeftNode(rootNode.getRightNode());
            rootNode.setRightNode(newNode_1);
            return newNode_1;
        }
        var newNode = rootNode.createParentNode(value);
        newNode.setLeftNode(rootNode);
        return newNode;
    };
    AbstractSyntaxTree.prototype.insertNode = function (value) {
        if (TokenHelper.isSymbol(value))
            if (!this.getValue()) {
                this.setValue(value);
                return this;
            }
        if (TokenHelper.isOperator(value))
            return this.insertOperatorNode(value);
        var valueNode = this.createChildNode(value);
        if (!this.getLeftNode())
            this.setLeftNode(valueNode);
        else
            this.setRightNode(valueNode);
        return valueNode;
    };
    AbstractSyntaxTree.prototype.getParent = function () {
        return this._parent;
    };
    AbstractSyntaxTree.prototype.getType = function () {
        return this._type;
    };
    AbstractSyntaxTree.prototype.getSubType = function () {
        return this._subType;
    };
    AbstractSyntaxTree.prototype.getValue = function () {
        return TokenHelper.isNumeric(this._value)
            ? Number(this._value)
            : this._value;
    };
    AbstractSyntaxTree.prototype.getLeftNode = function () {
        return this._leftNode;
    };
    AbstractSyntaxTree.prototype.getRightNode = function () {
        return this._rightNode;
    };
    AbstractSyntaxTree.prototype.removeLeftNode = function () {
        this._leftNode.removeParent();
        this._leftNode = undefined;
    };
    AbstractSyntaxTree.prototype.removeRightNode = function () {
        this._rightNode.removeParent();
        this._rightNode = undefined;
    };
    AbstractSyntaxTree.prototype.removeParent = function () {
        this._parent = undefined;
    };
    AbstractSyntaxTree.prototype.setSubType = function (subType) {
        this._subType = subType;
    };
    AbstractSyntaxTree.prototype.setValue = function (value) {
        this._type = TokenHelper.induceType(value);
        this._value = value;
    };
    AbstractSyntaxTree.prototype.setParent = function (node) {
        this._parent = node;
    };
    AbstractSyntaxTree.prototype.setLeftNode = function (node) {
        if (!node)
            return;
        this._leftNode = node;
        node.setParent(this);
    };
    AbstractSyntaxTree.prototype.setRightNode = function (node) {
        if (!node)
            return;
        this._rightNode = node;
        node.setParent(this);
    };
    return AbstractSyntaxTree;
}());

var Tree = /** @class */ (function () {
    function Tree(ast) {
        this.ast = ast;
    }
    Tree.prototype.makeTree = function () {
        if (!this.ast)
            return undefined;
        var tree = this.makeNode(this.ast);
        if (tree.value)
            throw new Error('error: invalid parser tree');
        return tree;
    };
    Tree.prototype.makeNode = function (sourceNode) {
        return sourceNode.getType() === Token.Type.Operator
            ? this.makeOperatorNode(sourceNode)
            : this.makeValueNode(sourceNode);
    };
    Tree.prototype.makeOperatorNode = function (sourceNode) {
        return {
            operator: sourceNode.getValue(),
            operand1: this.makeNode(sourceNode.getLeftNode()),
            operand2: this.makeNode(sourceNode.getRightNode())
        };
    };
    Tree.prototype.makeValueNode = function (sourceNode) {
        return {
            value: this.makeOperandValue(sourceNode)
        };
    };
    Tree.prototype.makeOperandValue = function (sourceNode) {
        var type = TokenHelper.isObject(sourceNode.getValue())
            ? 'item'
            : 'unit';
        return _a = {
                type: type
            }, _a[type] = sourceNode.getValue(), _a;
        var _a;
    };
    return Tree;
}());

var Literal = Token.Literal;
var TokenAnalyzer = /** @class */ (function () {
    function TokenAnalyzer(token) {
        this.token = token;
        this.tokenStack = [];
        this.index = 0;
    }
    TokenAnalyzer.prototype.parse = function () {
        this.initialize();
        this.makeAST();
        return this.makeTree();
    };
    TokenAnalyzer.prototype.getLastError = function () {
        return this.lastError;
    };
    TokenAnalyzer.prototype.initialize = function () {
        this.ast = new AbstractSyntaxTree(Token.Literal.BracketOpen);
        this.ast.setLeftNode(new AbstractSyntaxTree());
        this.currentTree = this.ast.getLeftNode();
        this.index = 0;
        this.lastError = null;
    };
    TokenAnalyzer.prototype.getAST = function () {
        return this.ast;
    };
    TokenAnalyzer.prototype.makeAST = function () {
        var token;
        while (token = this.next()) {
            var level = TokenAnalyzer.validateToken(token);
            if (level === TokenValidateLevel.Fatal) {
                this.makeError(LoggerCode.InvalidToken);
                return;
            }
            else if (level === TokenValidateLevel.Escape)
                continue;
            this.analyzeToken(token);
            this.tokenStack.push(token);
        }
        this.ast = this.ast.removeClosestBracket().findRoot();
    };
    TokenAnalyzer.prototype.popStack = function () {
        return this.tokenStack.length
            ? this.tokenStack[this.tokenStack.length - 1]
            : undefined;
    };
    TokenAnalyzer.prototype.analyzeToken = function (token) {
        if (TokenHelper.isBracket(token)) {
            this.analyzeBracketToken(token);
            return;
        }
        if (TokenHelper.isOperator(token)) {
            this.analyzeOperatorToken(token);
            return;
        }
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
            // Invalid Error: Operator left token is invalid
            console.log('error2', lastToken);
        if (!this.currentTree.getValue())
            this.currentTree.setValue(token);
        else {
            if (!TokenHelper.isBracket(this.currentTree.getValue()) && !this.currentTree.getRightNode())
                // Invalid Error: Duplicated operators
                console.log('error3');
            this.currentTree = this.currentTree.insertNode(token);
            this.ast = this.ast.findRoot();
        }
    };
    TokenAnalyzer.prototype.insertImplicitMultiplication = function () {
        var newToken = Literal.Multiplication;
        this.analyzeToken(newToken);
        this.tokenStack.push(newToken);
    };
    TokenAnalyzer.validateToken = function (token) {
        if (TokenHelper.isWhiteSpace(token))
            return TokenValidateLevel.Escape;
        if (TokenHelper.isToken(token))
            return TokenValidateLevel.Pass;
        return TokenValidateLevel.Fatal;
    };
    TokenAnalyzer.prototype.next = function () {
        var currentToken = [];
        do {
            currentToken.push(this.token[this.index]);
        } while (this.proceedNext());
        return this.makeToken(currentToken);
    };
    TokenAnalyzer.prototype.proceedNext = function () {
        var tokenType = TokenHelper.induceType(this.token[this.index]);
        var nextTokenType = TokenHelper.induceType(this.token[this.index + 1]);
        this.index += 1;
        return tokenType === Token.Type.Value &&
            TokenHelper.isNumeric(this.token[this.index]) &&
            tokenType === nextTokenType;
    };
    TokenAnalyzer.prototype.makeToken = function (tokens) {
        if (!tokens.length)
            return undefined;
        if (tokens.every(function (token) { return TokenHelper.isNumeric(token); }))
            return tokens.join('');
        if (tokens.length > 1)
            throw Error('error: non-numeric tokens can not be consecutive.');
        return tokens[0];
    };
    TokenAnalyzer.prototype.makeTree = function () {
        var treeParser = new Tree(this.ast);
        return treeParser.makeTree();
    };
    TokenAnalyzer.prototype.makeError = function (code, mapping, process) {
        if (process === void 0) { process = ParserProcess.Lexer; }
        var trace = {
            process: process,
            line: 0,
            col: this.index
        };
        this.lastError = LoggerHelper.getMessage(code, trace, mapping);
    };
    return TokenAnalyzer;
}());

var Builder = /** @class */ (function () {
    function Builder(data) {
        this.data = data;
    }
    Builder.prototype.build = function () {
        if (BuilderHelper.needParse(this.data))
            return this.parse(this.data);
        if (BuilderHelper.needUnparse(this.data))
            return this.unparse(this.data);
    };
    Builder.prototype.parse = function (data, pos) {
        if (pos === void 0) { pos = 0; }
        var parserToken = new TokenAnalyzer(ParserHelper.getArray(data));
        var parseData = parserToken.parse();
        if (!parseData)
            return parserToken.getLastError();
        return {
            code: LoggerCode.Success,
            data: parseData
        };
    };
    Builder.prototype.unparse = function (data) {
        // const result = this.parseTree(result);
        return {
            code: LoggerCode.Success,
            data: null // result.result
        };
    };
    return Builder;
}());

var _PLUGIN_VERSION_ = '1.0.0';
function convert(formula) {
    var builder = new Builder(formula);
    return builder.build();
}
function getVersion() {
    return _PLUGIN_VERSION_;
}

export { convert, getVersion };
