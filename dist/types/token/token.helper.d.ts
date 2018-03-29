import { Token } from './token';
import { TokenHelperBase } from './token.helper.base';
export declare class TokenHelper extends TokenHelperBase {
    static isHigher(source: Token.Token, target: Token.Token): boolean;
    static induceType(token: Token.Token): Token.Type;
    static getPrecedence(token: Token.Token): number;
}
