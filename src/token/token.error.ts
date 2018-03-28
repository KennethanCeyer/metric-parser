import { ErrorValue } from '../error.value';

/* tslint:disable:max-line-length */
export namespace TokenError {
    export const id = 0x0100;
    export const invalidToken: ErrorValue = { code: 0x0100, text: '`{0}` token is invalid token type' };
    export const invalidTwoOperator: ErrorValue = { code: 0x0101, text: 'two operators `{0}`, `{1}` can not come together' };
    export const missingOperator: ErrorValue = { code: 0x0112, text: 'the operator is missing after `{0}`' };
    export const missingOpenBracket: ErrorValue = { code: 0x0120, text: 'missing open bracket, you cannot close the bracket' };
    export const missingCloseBracket: ErrorValue = { code: 0x0121, text: 'missing close bracket, the bracket must be closed' };
}
/* tslint:enable:max-line-length */
