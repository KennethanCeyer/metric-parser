import { ParserResult } from './parser/parser.result';
import { ParserError } from './error';

export class BuilderMessage {
    protected makeData<T>(data: T, code: number = 0): ParserResult<T> {
        return { code, data };
    }

    protected makeError(error: ParserError): ParserResult<string> {
        return {
            ...this.makeData(error.text, error.code),
            stack: error.parserStack
        };
    }
}
