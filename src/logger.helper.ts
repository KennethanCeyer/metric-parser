import { LoggerCode } from './logger.code';
import { LoggerMessage } from './logger.message';
import { LoggerTrace } from './logger.trace';

export class LoggerHelper {
    private static formatString(value: string, mapping: string[]) {
        let targetValue = value;
        return mapping
            .forEach((match, index) => targetValue = LoggerHelper.replaceArg(index, targetValue, match));
    }

    private static replaceArg(match: number, target: string, value: string): string {
        return target.replace(new RegExp(`\\\{${idx}\\\}`, 'g'), value);
    }

    public static getMessage(code: LoggerCode, trace: LoggerTrace, mapping?: string[]) {
        const message = LoggerHelper.formatString(LoggerMessage[code] || '', mapping);
        const status = code === LoggerCode.Success;

        return {
            status,
            code,
            message,
            trace
        };
    }
}