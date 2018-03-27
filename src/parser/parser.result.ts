export interface ParserResult<T> {
    code: number;
    message?: string;
    data?: T;
    stack?: ParserStack;
}

export interface ParserGeneralResult extends ParserResult<any> {
}

export interface ParserStack {
    line: number;
    col: number;
}
