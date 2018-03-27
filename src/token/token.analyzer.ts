import { ParserDefaultResult } from '../parser/parser.result';
import { TreeModel } from '../tree.type';
import { TokenHelper } from './token.helper';
import { TokenValidateLevel } from '../token.validate.type';
import { LoggerCode } from '../logger/logger.code';
import { LoggerHelper } from '../logger/logger.helper';
import { ParserProcess } from '../parser/parser.process.type';
import { Token } from './token';
import { AbstractSyntaxTree } from '../ast';
import Literal = Token.Literal;
import { Tree } from '../tree';

export class TokenAnalyzer {
    private tokenStack: Token.Token[] = [];
    private ast: AbstractSyntaxTree;
    private currentTree: AbstractSyntaxTree;
    private index: number = 0;
    private lastError: ParserDefaultResult;

    constructor(private token: Token.Token[]) {
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
        this.index = 0;
        this.lastError = null;
    }

    public getAst(): AbstractSyntaxTree {
        return this.ast;
    }

    private makeAst() {
        let token;
        while (token = this.next()) {
            const level = TokenAnalyzer.validateToken(token);
            if (level === TokenValidateLevel.Fatal) {
                this.makeError(LoggerCode.InvalidToken);
                return;
            } else if (level === TokenValidateLevel.Escape)
                continue;

            this.analyzeToken(token);
            this.tokenStack.push(token);
        }
        this.ast = this.ast.removeClosestBracket().findRoot();
    }

    private popStack(): string | undefined {
        return this.tokenStack.length
            ? this.tokenStack[this.tokenStack.length - 1]
            : undefined;
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
        const newToken = Literal.Multiplication;
        this.analyzeToken(newToken);
        this.tokenStack.push(newToken);
    }

    private static validateToken(token: Token.Token): TokenValidateLevel {
        if (TokenHelper.isWhiteSpace(token))
            return TokenValidateLevel.Escape;

        if (TokenHelper.isToken(token))
            return TokenValidateLevel.Pass;

        return TokenValidateLevel.Fatal;
    }

    private next() {
        const currentToken: Token.Token = [];
        do {
            currentToken.push(this.token[this.index]);
        } while (this.proceedNext());

        return this.makeToken(currentToken);
    }

    private proceedNext(): boolean {
        const tokenType = TokenHelper.induceType(this.token[this.index]);
        const nextTokenType = TokenHelper.induceType(this.token[this.index + 1]);

        this.index += 1;
        return tokenType === Token.Type.Value &&
            TokenHelper.isNumeric(this.token[this.index]) &&
            tokenType === nextTokenType;
    }

    private makeToken(tokens: Token.Token[]): Token.Token {
        if (!tokens.length)
            return undefined;

        if (tokens.every(token => TokenHelper.isNumeric(token)))
            return tokens.join('');

        if (tokens.length > 1)
            throw Error('error: non-numeric tokens can not be consecutive.');

        return tokens[0];
    }

    private makeTree(): TreeModel {
        const treeParser = new Tree(this.ast);
        return treeParser.makeTree();
    }

    private makeError(code: LoggerCode, mapping?: string[], process: ParserProcess = ParserProcess.Lexer) {
        const trace = {
            process,
            line: 0,
            col: this.index
        };
        this.lastError = LoggerHelper.getMessage(code, trace, mapping);
    }

}
