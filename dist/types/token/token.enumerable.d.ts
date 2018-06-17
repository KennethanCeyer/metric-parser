import { Token } from './token';
import { ParserStack } from '../parser/parser.result';
export declare class TokenEnumerable {
    protected token: Token.Token[];
    private tokenStack;
    private cursor;
    private currentToken;
    private _stack;
    private _nextStack;
    protected stack: ParserStack;
    constructor(token: Token.Token[]);
    protected rewind(): void;
    private calculateStack;
    protected finalizeStack(): void;
    protected addStack(token: Token.Token): void;
    protected popStack(): Token.Token | undefined;
    next(): any;
    private proceedNext;
    private isSequentialValue;
    private findToken;
    private getToken;
    private getAliasToken;
    private isTokenArrayNumeric;
    private makeToken;
    private makeTokenString;
}
