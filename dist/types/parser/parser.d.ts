import { AbstractSyntaxTree } from '../ast/ast';
export declare type ParseData = string | string[];
export declare class Parser {
    static parse(data: ParseData): AbstractSyntaxTree;
    static unparse(ast: AbstractSyntaxTree): string[];
}
