import { Token } from './token';
import { ParserError } from '../error';
export declare class TokenValidator {
    static validateToken(token: Token.Token): ParserError | undefined;
    static validateValueToken(token: Token.Token, prevToken: Token.Token): ParserError | undefined;
    private static extractTokenLevel(token);
}
