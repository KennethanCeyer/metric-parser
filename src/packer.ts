import { ParserResult } from './parser/parser.result';
import { ParserError, success } from './error';

export class Packer {
    public static makeData<T>(data: T, code: number = success): ParserResult<T> {
        return { code, data };
    }

    public static makeError(error: ParserError): ParserResult<string> {
        return {
            ...this.makeData(error.text, error.code),
            stack: error.parserStack || { ...ParserError.defaultParserStack }
        };
    }
}
