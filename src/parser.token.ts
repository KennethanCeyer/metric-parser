import { ParserDefaultResult } from './parser.result';
import { AbstractSyntaxTree, ParseTree } from './parser.tree';
import { TokenHelper } from './token.helper';
import { TokenValidateLevel } from './token.validate';
import { LoggerCode } from './logger.code';
import { LoggerHelper } from './logger.helper';
import { LoggerTrace } from './logger.trace';
import { ParserProcess } from './parser.process';

export class ParserToken {
    private _token: string[] = [];
    private _tokenStack: string[] = [];
    private _AST: AbstractSyntaxTree;
    private _index: number = 0;
    private _lastError: ParserDefaultResult;

    constructor(token: string[]) {
        this._token = token;
    }

    public parse(): ParseTree {
        this.retrieveToken();
        return this.makeTree();
    }

    public getLastError(): ParserDefaultResult {
        return this._lastError;
    }

    private retrieveToken() {
        let token;
        while(token = this.next()) {
            const level = ParserToken.validateToken(token);
            if (level === TokenValidateLevel.Fatal) {
                this.makeError(LoggerCode.InvalidToken);
                return;
            } else if (level === TokenValidateLevel.Escape)
                continue;
        }
    }

    private static validateToken(token: any): TokenValidateLevel {
        if (TokenHelper.isToken(token))
            return TokenValidateLevel.Pass;

        if (TokenHelper.isWhiteSpace(token))
            return TokenValidateLevel.Escape;

        return TokenValidateLevel.Fatal;
    }

    private next() {
        if (this._token[this._index + 1]) {
            this._index += 1;
            return this._token[this._index];
        }
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
        this._lastError = LoggerHelper.getMessage(code, {
            process,
            line: 0,
            col: this._index
        }, mapping);
    }
}