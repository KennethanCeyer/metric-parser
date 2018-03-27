import { Token } from './token';
import { TokenValidateLevel } from '../token.validate.type';
import { TokenHelper } from './token.helper';

export class TokenValidator {
    public static validateToken(token: Token.Token): TokenValidateLevel {
        const levelExtractors = [
            { predicate: TokenHelper.isWhiteSpace, level: TokenValidateLevel.Escape },
            { predicate: TokenHelper.isToken, level: TokenValidateLevel.Pass }
        ];

        const extractedLevel = levelExtractors.find(extractor => extractor.predicate(token));
        return extractedLevel
            ? extractedLevel.level
            : TokenValidateLevel.Fatal;
    }
}
