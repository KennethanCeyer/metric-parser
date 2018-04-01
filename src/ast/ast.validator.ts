import { AbstractSyntaxTree } from './ast';
import { ParserError } from '../error';
import { TokenError } from '../token/token.error';
import { Token } from '../token/token';

export class AbstractSyntaxTreeValidator {
    public static validate(ast: AbstractSyntaxTree): ParserError | undefined {
        return [
            this.validateMissingValue,
            this.validateMissingCloseBracket
        ]
            .map(validator => validator(ast))
            .find(validator => validator !== undefined);
    }

    public static validateMissingValue(ast: AbstractSyntaxTree): ParserError | undefined {
        if (!ast)
            return;

        const childError = [
            AbstractSyntaxTreeValidator.validateMissingValue(ast.leftNode),
            AbstractSyntaxTreeValidator.validateMissingValue(ast.rightNode)
        ]
            .find(error => error !== undefined);

        if (childError)
            return childError;

        if (ast.type !== Token.Type.Operator)
            return;

        if (!ast.leftNode)
            return new ParserError(TokenError.missingValueBefore, ast.value);

        if (!ast.rightNode)
            return new ParserError(TokenError.missingValueAfter, ast.value);
    }

    public static validateMissingCloseBracket(ast: AbstractSyntaxTree): ParserError | undefined {
        if (ast.hasOpenBracket())
            return new ParserError(TokenError.missingCloseBracket);
    }
}
