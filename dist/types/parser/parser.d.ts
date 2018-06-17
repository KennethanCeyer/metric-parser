import { AbstractSyntaxTree } from '../ast/ast';
export declare type ParseData = any | any[];
export declare class Parser {
    static parse(data: ParseData): AbstractSyntaxTree;
    static unparse(ast: AbstractSyntaxTree): string[];
}
