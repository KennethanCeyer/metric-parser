import { Token } from './token';
import { AbstractSyntaxTree } from '../ast/ast';
import { TokenEnumerable } from './token.enumerable';
export declare class TokenAnalyzer extends TokenEnumerable {
    private ast;
    private currentTree;
    constructor(token: Token.Token[]);
    parse(): AbstractSyntaxTree;
    private initialize();
    getAst(): AbstractSyntaxTree;
    private makeAst();
    private try<T>(tryFunction);
    private preValidate();
    private postValidate();
    private handleError(error);
    private doAnalyzeToken(token);
    private analyzeToken(token);
    private analyzeBracketToken(token);
    private analyzeOperatorToken(token);
    private analyzeImplicitToken();
    private insertImplicitMultiplication();
}
