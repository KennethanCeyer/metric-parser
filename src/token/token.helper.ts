import { Token } from './token';

export class TokenHelper {

    public static isToken(token: Token.Token): boolean {
        return token && (TokenHelper.isNumeric(token) || this.isSymbol(token) || TokenHelper.isObject(token));
    }

    public static isWhiteSpace(token: Token.Token): boolean {
        return Token.WhiteSpace.includes(String(token));
    }

    public static isNumeric(value: Token.Token): boolean {
        return (/\d+(\.\d*)?|\.\d+/).test(String(value));
    }

    public static isArray(value: Token.Token): boolean {
        return Array.isArray(value);
    }

    public static isString(value: Token.Token): boolean {
        return typeof value === 'string';
    }

    public static isObject(value: Token.Token): boolean {
        return typeof value === 'object';
    }

    public static isAddition(token: Token.Token): boolean {
        return Token.Addition.includes(token);
    }

    public static isSubtraction(token: Token.Token): boolean {
        return Token.Subtraction.includes(token);
    }

    public static isMultiplication(token: Token.Token): boolean {
        return Token.Multiplication.includes(token);
    }

    public static isDivision(token: Token.Token): boolean {
        return Token.Division.includes(token);
    }

    public static isMod(token: Token.Token): boolean {
        return Token.Mod.includes(token);
    }

    public static isPow(token: Token.Token): boolean {
        return Token.Pow.includes(token);
    }

    public static isBracket(token: Token.Token): boolean {
        return Token.Bracket.includes(token);
    }

    public static isBracketOpen(token: Token.Token): boolean {
        return token === Token.BracketOpen;
    }

    public static isBracketClose(token: Token.Token): boolean {
        return token === Token.BracketClose;
    }

    public static isSymbol(token: Token.Token): boolean {
        return Token.Symbols.includes(String(token));
    }

    public static isOperator(token: Token.Token): boolean {
        return Token.Operators.includes(String(token));
    }

    public static isHigher(source: Token.Token, target: Token.Token) {
        return TokenHelper.getPrecedence(source) - TokenHelper.getPrecedence(target) > 0;
    }

    public static induceType(value: Token.Token) {
        if (!value)
            return Token.Type.Unkown;

        if (TokenHelper.isWhiteSpace(value))
            return Token.Type.WhiteSpace;

        if (TokenHelper.isOperator(value))
            return Token.Type.Operator;

        if (TokenHelper.isBracket(value))
            return Token.Type.Bracket;

        return Token.Type.Value;
    }
    public static getPrecedence(token: Token.Token) {
        return [
            [TokenHelper.isAddition, TokenHelper.isSubtraction],
            [TokenHelper.isMultiplication, TokenHelper.isDivision],
            [TokenHelper.isMod, TokenHelper.isPow],
            [TokenHelper.isBracket]
        ].findIndex(predicate => predicate.some(func => func(token)));
    }
}
