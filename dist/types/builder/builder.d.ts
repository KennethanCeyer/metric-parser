import { ParserGeneralResult, ParserResult } from '../parser/parser.result';
import { ParseData } from '../parser/parser';
import { BuilderBase } from './builder.base';
export declare class Builder<T> extends BuilderBase<T> {
    protected doBuild(data: ParseData | T): ParserResult<T> | ParserGeneralResult;
    protected doParse(data: ParseData): ParserResult<T>;
    protected doUnparse(data: T): ParserGeneralResult;
}
