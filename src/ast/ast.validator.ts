import { AbstractSyntaxTree } from './ast';
import { ParserError } from '../error';
import { TokenError } from '../token/token.error';
import { Token } from '../token/token';
import { TokenHelper } from '../token/token.helper';

export class AbstractSyntaxTreeValidator {
    public static validate(ast: AbstractSyntaxTree, ...args: any[]): ParserError | undefined {
        const validators: ((...args: any[]) => ParserError | undefined)[] = [
            this.validateMissingValue,
            this.validateMissingCloseBracket
        ];
        return validators
            .map(validator => validator(ast, ...args))
            .find(validator => validator !== undefined);
    }

    public static validateMissingValue(ast: AbstractSyntaxTree): ParserError | undefined {
        if (!ast)
            return;

        const childError = AbstractSyntaxTreeValidator.validateChildMissingValue(ast);
        return childError || AbstractSyntaxTreeValidator.validateCurrentMissingValue(ast);
    }

    private static validateCurrentMissingValue(ast: AbstractSyntaxTree): ParserError | undefined {
        if (ast.type !== Token.Type.Operator || ast.leftNode && ast.rightNode)
            return;

        return !ast.leftNode
            ? new ParserError(TokenError.missingValueBefore, ast.value)
            : new ParserError(TokenError.missingValueAfter, ast.value);
    }

    private static validateChildMissingValue(ast: AbstractSyntaxTree): ParserError | undefined {
        return [
            AbstractSyntaxTreeValidator.validateMissingValue(ast.leftNode),
            AbstractSyntaxTreeValidator.validateMissingValue(ast.rightNode)
        ]
            .find(error => error !== undefined);
    }

    public static validateMissingCloseBracket(ast: AbstractSyntaxTree): ParserError | undefined {
        if (ast.hasOpenBracket())
            return new ParserError(TokenError.missingCloseBracket);
    }

    public static validateInvalidTwoOperator(
        ast: AbstractSyntaxTree,
        token: string,
        lastToken: string
    ): ParserError | undefined {
        if (!TokenHelper.isBracket(ast.value) && !ast.rightNode)
            return new ParserError(TokenError.invalidTwoOperator, lastToken, token);
    }
}
