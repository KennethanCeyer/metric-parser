import { TreeBuilderBase } from '../tree/tree.base';
import { ParserGeneralResult, ParserResult } from '../parser/parser.result';
import { ParserError } from '../error';
import { ParseData } from '../parser/parser';

export interface BuilderInterface<T> {
    build(data: ParseData | T): ParserGeneralResult | ParserResult<T>;
    parse(data: ParseData): ParserResult<T>;
    unparse(data: T): ParserGeneralResult;
}
