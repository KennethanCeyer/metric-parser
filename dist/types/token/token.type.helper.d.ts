import { Token } from './token';
export declare abstract class TokenTypeHelper {
    static isNumeric(value: Token.Token): boolean;
    static isArray(token: Token.Token): boolean;
    static isString(token: Token.Token): boolean;
    static isObject(token: Token.Token): boolean;
    static isValue(token: Token.Token): boolean;
}
