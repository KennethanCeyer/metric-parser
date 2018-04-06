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
    private calculateStack(token);
    protected finalizeStack(): void;
    protected addStack(token: Token.Token): void;
    protected popStack(): Token.Token | undefined;
    next(): any;
    private proceedNext();
    private isSequentialValue(token, nextToken);
    private findToken();
    private getToken();
    private getAliasToken(token);
    private isTokenArrayNumeric(tokens);
    private makeToken(tokens);
    private makeTokenString(tokens);
}
