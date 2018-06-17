import { Token } from './token';
import { AbstractSyntaxTree } from '../ast/ast';
import { TokenEnumerable } from './token.enumerable';
export declare class TokenAnalyzer extends TokenEnumerable {
    private ast;
    private currentTree;
    constructor(token: Token.Token[]);
    parse(): AbstractSyntaxTree;
    private initialize;
    getAst(): AbstractSyntaxTree;
    private makeAst;
    private try;
    private preValidate;
    private postValidate;
    private handleError;
    private doAnalyzeToken;
    private analyzeToken;
    private analyzeBracketToken;
    private analyzeOperatorToken;
    private analyzeImplicitToken;
    private insertImplicitMultiplication;
}
