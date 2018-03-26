import { ParserTypeHelper } from './parser.type.helper';
import { Token } from './token';

export class TokenHelper {
    public static isToken(token: Token.Token) {
        return this.isNumeric(token) || this.isOperatorToken(token);
    }

    public static isWhiteSpace(token: Token.Token) {
        return Token.WhiteSpace.includes(String(token));
    }

    public static isNumeric(value: string | number) {
        return (/\d+(\.\d*)?|\.\d+/)
            .test(String(value));
    }

    public static isArray(value: any) {
        return Array.isArray(value);
    }

    public static isString(value: any) {
        return typeof value === 'string';
    }

    public static isObject(value: any) {
        return typeof value === 'object';
    }

    public static isOperatorToken(token: Token.Token) {
        return Token.Symbols.includes(String(token));
    }
}
