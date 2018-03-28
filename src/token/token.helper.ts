import { Token } from './token';

export class TokenHelper {
    public static isToken(token: Token.Token): boolean {
        return token && (TokenHelper.isNumeric(token) || TokenHelper.isSymbol(token) || TokenHelper.isObject(token));
    }

    public static isUnkown(token: Token.Token): boolean {
        return token === undefined || token === null;
    }

    public static isLineEscape(token: Token.Token): boolean {
        return token === '\n';
    }

    public static isWhiteSpace(token: Token.Token): boolean {
        return Token.whiteSpace.includes(String(token));
    }

    public static isNumeric(value: Token.Token): boolean {
        return (/^[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?$/).test(String(value));
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

    public static isValue(value: Token.Token): boolean {
        return TokenHelper.isObject(value) || TokenHelper.isNumeric(value);
    }

    public static isDot(value: Token.Token): boolean {
        return value === Token.literal.Dot;
    }

    public static isAddition(token: Token.Token): boolean {
        return Token.addition.includes(token);
    }

    public static isSubtraction(token: Token.Token): boolean {
        return Token.subtraction.includes(token);
    }

    public static isMultiplication(token: Token.Token): boolean {
        return Token.multiplication.includes(token);
    }

    public static isDivision(token: Token.Token): boolean {
        return Token.division.includes(token);
    }

    public static isMod(token: Token.Token): boolean {
        return Token.mod.includes(token);
    }

    public static isPow(token: Token.Token): boolean {
        return Token.pow.includes(token);
    }

    public static isBracket(token: Token.Token): boolean {
        return Token.bracket.includes(token);
    }

    public static isBracketOpen(token: Token.Token): boolean {
        return token === Token.bracketOpen;
    }

    public static isBracketClose(token: Token.Token): boolean {
        return token === Token.bracketClose;
    }

    public static isSymbol(token: Token.Token): boolean {
        return Token.symbols.includes(String(token));
    }

    public static isOperator(token: Token.Token): boolean {
        return Token.operators.includes(String(token));
    }

    public static isHigher(source: Token.Token, target: Token.Token) {
        return TokenHelper.getPrecedence(source) - TokenHelper.getPrecedence(target) > 0;
    }

    public static induceType(value: Token.Token) {
        const typeInducers = [
            { predicate: TokenHelper.isUnkown, type: Token.Type.Unknown },
            { predicate: TokenHelper.isWhiteSpace, type: Token.Type.WhiteSpace },
            { predicate: TokenHelper.isOperator, type: Token.Type.Operator },
            { predicate: TokenHelper.isBracket, type: Token.Type.Bracket },
            { predicate: TokenHelper.isDot, type: Token.Type.Dot },
            { predicate: TokenHelper.isValue, type: Token.Type.Value }
        ];

        const extractedToken = typeInducers.find(inducer => inducer.predicate(value));
        return extractedToken
            ? extractedToken.type
            : Token.Type.Unknown;
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
