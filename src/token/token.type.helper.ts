import { Token } from './token';

export abstract class TokenTypeHelper {
    public static isNumeric(value: Token.Token): boolean {
        return (/^[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?$/).test(String(value));
    }

    public static isArray(token: Token.Token): boolean {
        return Array.isArray(token);
    }

    public static isString(token: Token.Token): boolean {
        return typeof token === 'string';
    }

    public static isObject(token: Token.Token): boolean {
        return typeof token === 'object';
    }

    public static isValue(token: Token.Token): boolean {
        return TokenTypeHelper.isObject(token) || TokenTypeHelper.isNumeric(token);
    }
}
