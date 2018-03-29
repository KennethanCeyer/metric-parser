import { Token } from './token';
import { TokenTypeHelper } from './token.type.helper';

export abstract class TokenHelperBase extends TokenTypeHelper {
    public static isToken(token: Token.Token): boolean {
        const validators = [
            TokenHelperBase.isNumeric,
            TokenHelperBase.isSymbol,
            TokenHelperBase.isObject
        ];
        return token && validators.some(validator => validator(token));
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

    public static isDot(token: Token.Token): boolean {
        return token === Token.literal.Dot;
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
}
