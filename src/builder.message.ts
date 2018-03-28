import { ParserResult } from './parser/parser.result';
import { ParserError, success } from './error';

export class BuilderMessage {
    protected makeData<T>(data: T, code: number = success): ParserResult<T> {
        return { code, data };
    }

    protected makeError(error: ParserError): ParserResult<string> {
        return {
            ...this.makeData(error.text, error.code),
            stack: error.parserStack || { ...ParserError.defaultParserStack }
        };
    }
}
