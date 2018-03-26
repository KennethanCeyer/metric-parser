import { ParserTypeHelper } from './parser.type.helper';
import { Token } from './token';

export class TokenHelper {
    private static readonly precedenceWeight: 10;

    public static isToken(token: Token.Token) {
        return this.isNumeric(token) || this.isSymbol(token);
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

    public static isAddition(token: string) {
        Token.Addition.includes(token);
    }

    public static isSubtraction(token: string) {
        Token.Subtraction.includes(token);
    }

    public static isMultiplication(token: string) {
        Token.Multiplication.includes(token);
    }

    public static isDivision(token: string) {
        Token.Division.includes(token);
    }

    public static isMod(token: string) {
        Token.Mod.includes(token);
    }

    public static isPow(token: string) {
        Token.Pow.includes(token);
    }

    public static isBracket(token: string) {
        return Token.Bracket.includes(token);
    }

    public static isBracketOpen(token: string) {
        return token === Token.BracketOpen;
    }

    public static isBracketClose(token: string) {
        return token === Token.BracketClose;
    }

    public static isSymbol(token: Token.Token) {
        return Token.Symbols.includes(String(token));
    }

    public static isOperator(token: Token.Token) {
        return Token.Operators.includes(String(token));
    }

    public static getPrecedence(token: string) {
        return Token.Precedence.indexOf(token);
    }
}
