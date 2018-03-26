import { ParserTypeHelper } from './parser.type.helper';
import { Token } from './token';

export class TokenHelper {
    public static isToken(token: Token.Token): boolean {
        return this.isNumeric(token) || this.isSymbol(token);
    }

    public static isWhiteSpace(token: Token.Token): boolean {
        return Token.WhiteSpace.includes(String(token));
    }

    public static isNumeric(value: string | number): boolean {
        return (/\d+(\.\d*)?|\.\d+/)
            .test(String(value));
    }

    public static isArray(value: any): boolean {
        return Array.isArray(value);
    }

    public static isString(value: any): boolean {
        return typeof value === 'string';
    }

    public static isObject(value: any): boolean {
        return typeof value === 'object';
    }

    public static isAddition(token: string): boolean {
        return Token.Addition.includes(token);
    }

    public static isSubtraction(token: string): boolean {
        return Token.Subtraction.includes(token);
    }

    public static isMultiplication(token: string): boolean {
        return Token.Multiplication.includes(token);
    }

    public static isDivision(token: string): boolean {
        return Token.Division.includes(token);
    }

    public static isMod(token: string): boolean {
        return Token.Mod.includes(token);
    }

    public static isPow(token: string): boolean {
        return Token.Pow.includes(token);
    }

    public static isBracket(token: string): boolean {
        return Token.Bracket.includes(token);
    }

    public static isBracketOpen(token: string): boolean {
        return token === Token.BracketOpen;
    }

    public static isBracketClose(token: string): boolean {
        return token === Token.BracketClose;
    }

    public static isSymbol(token: Token.Token): boolean {
        return Token.Symbols.includes(String(token));
    }

    public static isOperator(token: Token.Token): boolean {
        return Token.Operators.includes(String(token));
    }

    public static getPrecedence(token: string) {
        return [
            [TokenHelper.isAddition, TokenHelper.isSubtraction],
            [TokenHelper.isMultiplication, TokenHelper.isDivision],
            [TokenHelper.isMod, TokenHelper.isPow],
            [TokenHelper.isBracket]
        ].findIndex(predicate => predicate.some(func => func(token)));
    }
}
