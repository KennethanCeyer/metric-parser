import { Token } from './token';
export declare class TokenHelper {
    static isToken(token: Token.Token): boolean;
    static isUnkown(token: Token.Token): boolean;
    static isLineEscape(token: Token.Token): boolean;
    static isWhiteSpace(token: Token.Token): boolean;
    static isNumeric(value: Token.Token): boolean;
    static isArray(value: Token.Token): boolean;
    static isString(value: Token.Token): boolean;
    static isObject(value: Token.Token): boolean;
    static isValue(value: Token.Token): boolean;
    static isDot(value: Token.Token): boolean;
    static isAddition(token: Token.Token): boolean;
    static isSubtraction(token: Token.Token): boolean;
    static isMultiplication(token: Token.Token): boolean;
    static isDivision(token: Token.Token): boolean;
    static isMod(token: Token.Token): boolean;
    static isPow(token: Token.Token): boolean;
    static isBracket(token: Token.Token): boolean;
    static isBracketOpen(token: Token.Token): boolean;
    static isBracketClose(token: Token.Token): boolean;
    static isSymbol(token: Token.Token): boolean;
    static isOperator(token: Token.Token): boolean;
    static isHigher(source: Token.Token, target: Token.Token): boolean;
    static induceType(value: Token.Token): Token.Type;
    static getPrecedence(token: Token.Token): number;
}
