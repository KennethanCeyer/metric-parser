import { Tree } from '../tree/simple.tree/type';
import { Token } from './token';
import { AbstractSyntaxTree } from '../ast';
import { TokenEnumerable } from './token.enumerable';
export declare class TokenAnalyzer extends TokenEnumerable {
    private ast;
    private currentTree;
    constructor(token: Token.Token[]);
    parse(): Tree;
    private initialize();
    getAst(): AbstractSyntaxTree;
    private makeAst();
    private try<T>(tryFunction);
    private handleError(error);
    private doAnalyzeToken(token);
    private analyzeToken(token);
    private analyzeBracketToken(token);
    private analyzeOperatorToken(token);
    private insertImplicitMultiplication();
    private makeTree();
}
