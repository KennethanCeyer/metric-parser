import { Token } from './token';
import { TokenTypeHelper } from './token.type.helper';
export declare abstract class TokenHelperBase extends TokenTypeHelper {
    static isToken(token: Token.Token): boolean;
    static isUnkown(token: Token.Token): boolean;
    static isLineEscape(token: Token.Token): boolean;
    static isWhiteSpace(token: Token.Token): boolean;
    static isDot(token: Token.Token): boolean;
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
}
