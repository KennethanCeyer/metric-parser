import { Token } from './token';
import { ParserError } from '../error';
export declare enum TokenValidateLevel {
    Pass = 0,
    Escape = 1,
    Fatal = 2
}
export declare class TokenValidator {
    static validateToken(token: Token.Token): ParserError | undefined;
    static validateValueToken(token: Token.Token, prevToken: Token.Token): ParserError | undefined;
    private static extractTokenLevel;
}
