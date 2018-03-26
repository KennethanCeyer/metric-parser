import { ParserDefaultResult } from './parser.result';
import { ParseTree } from './parser.tree';
import { TokenHelper } from './token.helper';
import { TokenValidateLevel } from './token.validate';
import { LoggerCode } from './logger.code';
import { LoggerHelper } from './logger.helper';
import { LoggerTrace } from './logger.trace';
import { ParserProcess } from './parser.process';
import { Token } from './token';
import Literal = Token.Literal;
import { AbstractSyntaxTree } from './parser.ast';

export class ParserToken {
    private _token: string[] = [];
    private _tokenStack: string[] = [];
    private _AST: AbstractSyntaxTree;
    private _currentTree: AbstractSyntaxTree;
    private _index: number = 0;
    private _lastError: ParserDefaultResult;

    constructor(token: string[]) {
        this._token = token;
    }

    public parse(): ParseTree {
        this.initialize();
        this.makeAST();
        return this.makeTree();
    }

    public getLastError(): ParserDefaultResult {
        return this._lastError;
    }

    private initialize() {
        this._AST = new AbstractSyntaxTree();
        this._currentTree = this._AST;
        this._index = 0;
        this._lastError = null;
    }

    public getAST(): AbstractSyntaxTree {
        return this._AST;
    }

    private makeAST() {
        let token;
        while (token = this.next()) {
            const level = ParserToken.validateToken(token);
            if (level === TokenValidateLevel.Fatal) {
                this.makeError(LoggerCode.InvalidToken);
                return;
            } else if (level === TokenValidateLevel.Escape)
                continue;

            this.analyzeToken(token);
            this._tokenStack.push(token);
        }
    }

    private popStack(): string | undefined {
        return this._tokenStack.length
            ? this._tokenStack[this._tokenStack.length - 1]
            : undefined;
    }

    private analyzeToken(token: string) {
        if (TokenHelper.isBracket(token)) {
            this.analyzeBracketToken(token);
            return;
        }

        if (TokenHelper.isOperator(token)) {
            this.analyzeOperatorToken(token);
            return;
        }

        if (!TokenHelper.isOperator(this._currentTree.getValue())) {
            this._currentTree = this._currentTree.insertEmptyNode(token);
            return;
        }

        this._currentTree.setRightNode(this._currentTree.insertNode(token));
    }

    private analyzeBracketToken(token: string) {
        const lastToken = this.popStack();
        if (TokenHelper.isBracketOpen(token)) {
            if (lastToken && !TokenHelper.isSymbol(lastToken))
                this.insertImplicitMultiplication();

            this._currentTree = this._currentTree.insertNode(token);
            return;
        }

        if (TokenHelper.isBracketClose(token)) {
            this._currentTree = this._currentTree.removeClosestBracket();
            this._AST = this._currentTree.findRoot();
            return;
        }
    }

    private analyzeOperatorToken(token: string) {
        const lastToken = this.popStack();
        if (lastToken && !TokenHelper.isBracketClose(lastToken) && !TokenHelper.isNumeric(lastToken))
        // Invalid Error: Operator left token is invalid
            console.log('error2', lastToken);

        if (!this._currentTree.getValue())
            this._currentTree.setValue(token);
        else {
            if (!this._currentTree.getRightNode())
            // Invalid Error: Duplicated operators
                console.log('error3');

            this._currentTree = this._currentTree.insertNode(token);
            this._AST = this._AST.findRoot();
        }
    }

    private insertImplicitMultiplication() {
        const newToken = Literal.Multiplication;
        this.analyzeToken(newToken);
        this._tokenStack.push(newToken);
    }

    private static validateToken(token: any): TokenValidateLevel {
        if (TokenHelper.isToken(token))
            return TokenValidateLevel.Pass;

        if (TokenHelper.isWhiteSpace(token))
            return TokenValidateLevel.Escape;

        return TokenValidateLevel.Fatal;
    }

    private next() {
        const currentToken = this._token[this._index];
        this._index += 1;

        if (currentToken)
            return currentToken;

        return undefined;
    }

    private makeTree(): ParseTree {
        // TODO: make some magic here
        return {
            operator: '+',
            operand1: {
                value: {
                    type: 'unit',
                    unit: 1
                }
            },
            operand2: {
                value: {
                    type: 'unit',
                    unit: 2
                }
            }
        };
    }

    private makeError(code: LoggerCode, mapping?: string[], process: ParserProcess = ParserProcess.Lexer) {
        const trace = {
            process,
            line: 0,
            col: this._index
        };
        this._lastError = LoggerHelper.getMessage(code, trace, mapping);
    }

}
