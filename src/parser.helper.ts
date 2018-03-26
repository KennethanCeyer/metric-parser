import { FormulaParseData } from './types';

export class ParserHelper {
    public static getArray(data: FormulaParseData): string[] {
        return typeof data === 'string'
            ? this.stringToArray(data as string)
            : data;

    }

    private static stringToArray(value: string): string[] {
        return value.split('');
    };
}