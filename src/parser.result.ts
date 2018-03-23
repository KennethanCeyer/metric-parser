import { LoggerCode } from './logger.code';
import { LoggerTrace } from './logger.trace';

export interface ParserResult<T> {
    code: LoggerCode;
    message?: string;
    trace?: LoggerTrace;
    data?: T;
}

export interface ParserDefaultResult extends ParserResult<any> {
}