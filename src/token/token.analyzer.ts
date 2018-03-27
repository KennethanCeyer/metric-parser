import { ParserDefaultResult } from '../parser/parser.result';
import { TreeModel } from '../tree.type';
import { TokenHelper } from './token.helper';
import { TokenValidateLevel } from '../token.validate.type';
import { LoggerCode } from '../logger/logger.code';
import { LoggerHelper } from '../logger/logger.helper';
import { ParserProcess } from '../parser/parser.process.type';
import { Token } from './token';
import { AbstractSyntaxTree } from '../ast';
import { Tree } from '../tree';
import { TokenEnumerable } from './token.enumerable';
import { TokenValidator } from './token.validator';

export class TokenAnalyzer extends TokenEnumerable {
    private ast: AbstractSyntaxTree;
    private currentTree: AbstractSyntaxTree;
    private lastError: ParserDefaultResult;

    constructor(token: Token.Token[]) {
        super(token);
    }

    public parse(): TreeModel {
        this.initialize();
        this.makeAst();
        return this.makeTree();
    }

    public getLastError(): ParserDefaultResult {
        return this.lastError;
    }

    private initialize() {
        this.ast = new AbstractSyntaxTree(Token.Literal.BracketOpen);
        this.ast.leftNode = new AbstractSyntaxTree();
        this.currentTree = this.ast.leftNode;
        this.lastError = null;
        this.rewind();
    }

    public getAst(): AbstractSyntaxTree {
        return this.ast;
    }

    private makeAst() {
        let token;
        while (token = this.next()) {
            const level = TokenValidator.validateToken(token);

            if (level === TokenValidateLevel.Escape)
                continue;

            if (level === TokenValidateLevel.Fatal) {
                this.makeError(LoggerCode.InvalidToken);
                return;
            }

            this.analyzeToken(token);
            this.addStack(token);
        }
        this.ast = this.ast.removeClosestBracket().findRoot();
    }

    private analyzeToken(token: Token.Token) {
        if (TokenHelper.isBracket(token)) {
            this.analyzeBracketToken(token);
            return;
        }

        if (TokenHelper.isOperator(token)) {
            this.analyzeOperatorToken(token);
            return;
        }

        this.currentTree.insertNode(token);
    }

    private analyzeBracketToken(token: Token.Token) {
        const lastToken = this.popStack();
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
    }

    private analyzeOperatorToken(token: Token.Token) {
        const lastToken = this.popStack();

        if (TokenHelper.isOperator(lastToken))
        // Invalid Error: Operator left token is invalid
            console.log('error2', lastToken);

        if (!this.currentTree.value)
            this.currentTree.value = token;
        else {
            if (!TokenHelper.isBracket(this.currentTree.value) && !this.currentTree.rightNode)
            // Invalid Error: Duplicated operators
                console.log('error3');

            this.currentTree = this.currentTree.insertNode(token);
            this.ast = this.ast.findRoot();
        }
    }

    private insertImplicitMultiplication() {
        this.analyzeToken(Token.Literal.Multiplication);
        this.addStack(Token.Literal.Multiplication);
    }

    private makeTree(): TreeModel {
        const treeParser = new Tree(this.ast);
        return treeParser.makeTree();
    }

    private makeError(code: LoggerCode, mapping?: string[], process: ParserProcess = ParserProcess.Lexer) {
        const trace = {
            process,
            line: 0,
            col: 0
        };
        this.lastError = LoggerHelper.getMessage(code, trace, mapping);
    }
}
