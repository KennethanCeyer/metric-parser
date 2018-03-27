import { LoggerCode } from './logger.code';
import { LoggerMessage } from './logger.message';
import { LoggerTrace } from './logger.trace';
import { ParserDefaultResult } from '../parser/parser.result';
import { StringHelper } from '../string.helper';

export class LoggerHelper {
    public static getMessage(
        code: LoggerCode = LoggerCode.Success,
        trace?: LoggerTrace,
        mapping?: string[]
    ): ParserDefaultResult {
        const message = StringHelper.formatString(LoggerMessage[code] || '', mapping);

        return {
            code,
            message,
            trace
        };
    }
}