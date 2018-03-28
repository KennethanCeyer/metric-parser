import { Token } from './token';
import { TokenHelper } from './token.helper';
import { ParserStack } from '../parser/parser.result';
import { TokenValidator } from './token.validator';
import { ParserError } from '../error';

export class TokenEnumerable {
    private tokenStack: Token.Token[] = [];
    private cursor: number = 0;
    private currentToken: Token.Token;
    private _stack: ParserStack;
    private _nextStack: ParserStack = {
        line: 0,
        col: 0
    };

    protected get stack(): ParserStack {
        return this._stack || this._nextStack;
    }

    protected set stack(value: ParserStack) {
        this._stack = this._nextStack;
        this._nextStack = value;
    }

    constructor(protected token: Token.Token[]) {
    }

    protected rewind() {
        this.cursor = 0;
        this.currentToken = undefined;
        this._stack = undefined;
        this._nextStack = {
            col: 0,
            line: 0
        };
    }

    private calculateStack(token: Token.Token) {
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
    }

    protected finalizeStack() {
        this.stack = undefined;
    }

    protected addStack(token: Token.Token) {
        this.tokenStack.push(token);
    }

    protected popStack(): Token.Token | undefined {
        return this.tokenStack.length
            ? this.tokenStack[this.tokenStack.length - 1]
            : undefined;
    }

    public next() {
        const tokenStack: Token.Token = [];

        if (this.cursor >= this.token.length)
            return undefined;

        do {
            this.currentToken = this.findToken();
            if (!TokenHelper.isUnkown(this.currentToken))
                tokenStack.push(this.currentToken);
        } while (this.proceedNext());

        const token = this.makeToken(tokenStack);
        const error = TokenValidator.validateToken(token);

        if (error)
            throw error.withStack(this.stack);

        return token;
    }

    private proceedNext(): boolean {
        const tokenType = TokenHelper.induceType(this.currentToken);
        const nextTokenType = TokenHelper.induceType(this.token[this.cursor]);

        return tokenType === Token.Type.Value &&
            TokenHelper.isNumeric(this.currentToken) &&
            tokenType === nextTokenType;
    }

    private findToken(): Token.Token {
        while (this.cursor < this.token.length) {
            const token = this.token[this.cursor];
            this.cursor += 1;
            this.calculateStack(token);

            if (!TokenHelper.isWhiteSpace(token))
                return token;

        }
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
}
