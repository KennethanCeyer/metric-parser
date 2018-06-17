import { ErrorValue } from '../error.value';
export declare namespace TokenError {
    const id = 256;
    const invalidToken: ErrorValue;
    const invalidTwoOperator: ErrorValue;
    const invalidNonNumericValue: ErrorValue;
    const missingOperator: ErrorValue;
    const missingOpenBracket: ErrorValue;
    const missingCloseBracket: ErrorValue;
    const missingValueBefore: ErrorValue;
    const missingValueAfter: ErrorValue;
    const emptyToken: ErrorValue;
}
