import { Token } from './token';
import { TokenHelperBase } from './token.helper.base';
export declare class TokenHelper extends TokenHelperBase {
    static induceType(token: Token.Token): Token.Type;
    static getPrecedence(token: Token.Token): number;
    static getPrecedenceDiff(source: Token.Token, target: Token.Token): number;
}
