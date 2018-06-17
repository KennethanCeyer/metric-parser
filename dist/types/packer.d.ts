import { ParserResult } from './parser/parser.result';
import { ParserError } from './error';
export declare class Packer {
    static makeData<T>(data: T, code?: number): ParserResult<T>;
    static makeError(error: ParserError): ParserResult<string>;
}
