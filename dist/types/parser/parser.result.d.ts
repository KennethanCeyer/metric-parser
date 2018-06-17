export interface ParserResult<T> {
    code: number;
    message?: string;
    data?: T;
    stack?: ParserStack;
}
export declare type ParserGeneralResult = ParserResult<any>;
export interface ParserStack {
    line: number;
    col: number;
}
