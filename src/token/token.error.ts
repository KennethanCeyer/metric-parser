import { ErrorValue } from '../error.value';

/* tslint:disable:max-line-length */
export namespace TokenError {
    export const id = 0x0100;
    export const invalidToken: ErrorValue = { code: 0x0100, text: '`{0}` token is invalid token type' };
    export const invalidTwoOperator: ErrorValue = { code: 0x0101, text: 'two operators `{0}`, `{1}` can not come together' };
}
/* tslint:enable:max-line-length */
