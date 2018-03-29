import { ParseData } from './parser/parser';
import { ParserGeneralResult, ParserResult } from './parser/parser.result';
import { ParserError } from './error';
import { TreeBuilderBase } from './tree/tree.base';
import { BuilderInterface } from './builder.interface';
export declare class BuilderBase<T> implements BuilderInterface<T> {
    protected treeBuilder: TreeBuilderBase<T>;
    constructor(treeBuilder: TreeBuilderBase<T>);
    build(data: ParseData | T): ParserGeneralResult | ParserResult<T>;
    parse(data: ParseData): ParserResult<T>;
    unparse(data: T): ParserGeneralResult;
    protected handleError(error: ParserError): ParserResult<string>;
    protected try<K extends ParserGeneralResult>(tryFunc: (...args: any[]) => K): K;
    protected doBuild(data: ParseData | T): ParserResult<T> | ParserGeneralResult;
    protected doParse(data: ParseData): ParserResult<T>;
    protected doUnparse(data: T): ParserGeneralResult;
}
