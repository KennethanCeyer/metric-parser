import { ParseData } from '../types';

export class ParserHelper {
    public static getArray(data: ParseData): string[] {
        return typeof data === 'string'
            ? this.stringToArray(data as string)
            : data;
    }

    private static stringToArray(value: string): string[] {
        return value.split('');
    };
}
