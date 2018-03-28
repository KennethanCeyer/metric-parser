export interface ErrorValue {
    code: number;
    text: string;
}

export namespace GeneralError {
    export const id: number = 0x1000;
    export const unknownError: ErrorValue = { code: 0x1000, text: 'unknown error is occurred' };
    export const methodNotImplemented: ErrorValue = { code: 0x1001, text: 'method not implemented' };
}
