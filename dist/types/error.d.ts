import { ErrorValue } from './error.value';
import { ParserStack } from './parser/parser.result';
export declare const success = 0;
export declare class ParserError extends Error implements ErrorValue {
    error: ErrorValue;
    parserStack: ParserStack;
    code: number;
    text: string;
    static readonly defaultParserStack: ParserStack;
    constructor(error: ErrorValue, ...args: string[]);
    withStack(stack: ParserStack): ParserError;
}
