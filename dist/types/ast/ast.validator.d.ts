import { AbstractSyntaxTree } from './ast';
import { ParserError } from '../error';
export declare class AbstractSyntaxTreeValidator {
    static validate(ast: AbstractSyntaxTree, ...args: any[]): ParserError | undefined;
    static validateMissingValue(ast: AbstractSyntaxTree): ParserError | undefined;
    private static validateCurrentMissingValue(ast);
    private static validateChildMissingValue(ast);
    static validateMissingCloseBracket(ast: AbstractSyntaxTree): ParserError | undefined;
    static validateInvalidTwoOperator(ast: AbstractSyntaxTree, token: string, lastToken: string): ParserError | undefined;
}
