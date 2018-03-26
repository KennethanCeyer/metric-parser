import { ParserProcess } from './parser.process';

export interface LoggerTrace {
    line: number;
    col: number;
    process: ParserProcess;
}