export interface ErrorValue {
    code: number;
    text: string;
}
export declare namespace GeneralError {
    const id: number;
    const unknownError: ErrorValue;
    const methodNotImplemented: ErrorValue;
}
