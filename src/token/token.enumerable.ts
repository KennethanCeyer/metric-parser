import { Token } from './token';
import { TokenHelper } from './token.helper';

export class TokenEnumerable {
    private tokenStack: Token.Token[] = [];
    private index: number = 0;

    constructor(protected token: Token.Token[]) {
    }

    protected rewind() {
        this.index = 0;
    }

    protected addStack(token: Token.Token) {
        this.tokenStack.push(token);
    }

    protected popStack(): Token.Token | undefined {
        return this.tokenStack.length
            ? this.tokenStack[this.tokenStack.length - 1]
            : undefined;
    }

    protected next() {
        const currentToken: Token.Token = [];
        do {
            currentToken.push(this.token[this.index]);
        } while (this.proceedNext());

        return this.makeToken(currentToken);
    }

    protected proceedNext(): boolean {
        const tokenType = TokenHelper.induceType(this.token[this.index]);
        const nextTokenType = TokenHelper.induceType(this.token[this.index + 1]);

        this.index += 1;
        return tokenType === Token.Type.Value &&
            TokenHelper.isNumeric(this.token[this.index]) &&
            tokenType === nextTokenType;
    }

    protected makeToken(tokens: Token.Token[]): Token.Token {
        if (!tokens.length)
            return undefined;

        if (tokens.every(token => TokenHelper.isNumeric(token)))
            return tokens.join('');

        if (tokens.length > 1)
            throw Error('error: non-numeric tokens can not be consecutive.');

        return tokens[0];
    }
}
