import { LoggerCode } from './logger.code';
import { LoggerMessage } from './logger.message';
import { LoggerTrace } from './logger.trace';
import { ParserDefaultResult } from './parser.result';

export class StringHelper {
    private static formatString(value: string, mapping: string[]): string {
        let targetValue = value;
        mapping
            .forEach((match, index) => targetValue = StringHelper.replaceArg(index, targetValue, match));
        return targetValue;
    }

    private static replaceArg(match: number, target: string, value: string): string {
        return target.replace(new RegExp(`\\\{${idx}\\\}`, 'g'), value);
    }

    private stringToArray(value: string) {
        var splitedValue = value.split('');
        for (var idx = 0; idx < dataSplitedLen; idx++) {
            var item = splitedValue[idx];
            if (this.inArray(item, this.Units) !== -1 || ParserBuilder.isOperand(item) === true) {
                if (idx > 0 && ParserBuilder.isOperand(item) === true && ParserBuilder.isOperand(data[data.length - 1]) === true) {
                    data[data.length - 1] += item.toString();
                } else {
                    data.push(item);
                }
            }
        }
        return data;
    };
}