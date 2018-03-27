import { ParserProcess } from '../parser/parser.process.type';

export interface LoggerTrace {
    line: number;
    col: number;
    process: ParserProcess;
}
