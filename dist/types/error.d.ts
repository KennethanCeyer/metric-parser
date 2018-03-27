import { ErrorValue } from './error.value';
import { ParserStack } from './parser/parser.result';
export declare class ParserError extends Error implements ErrorValue {
    error: ErrorValue;
    parserStack: ParserStack;
    code: number;
    text: string;
    constructor(error: ErrorValue, ...args: string[]);
    withStack(stack: ParserStack): ParserError;
}
