import { ParserResult } from './parser/parser.result';
import { ParserError } from './error';
export declare class BuilderMessage {
    protected makeData<T>(data: T, code?: number): ParserResult<T>;
    protected makeError(error: ParserError): ParserResult<string>;
}
