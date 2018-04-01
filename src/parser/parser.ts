import { AbstractSyntaxTree } from '../ast/ast';
import { TokenAnalyzer } from '../token/token.analyzer';
import { ParserHelper } from './parser.helper';

export type ParseData = any | any[];

export class Parser {
    public static parse(data: ParseData): AbstractSyntaxTree {
        const analyzer = new TokenAnalyzer(ParserHelper.getArray(data));
        return analyzer.parse();
    }

    public static unparse(ast: AbstractSyntaxTree): string[] {
        return ast.expression;
    }
}
