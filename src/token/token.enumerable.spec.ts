import { expect } from 'chai';
import { TokenEnumerable } from './token.enumerable';

describe('test method: TokenEnumerable.next()', () => {
    it('should throw an error with tokenInvalid', () => {
        const data = ['1', undefined, '+', '2'];
        const enumerable = new TokenEnumerable(data);
        enumerable.next();
        expect(() => enumerable.next()).to.throw('`undefined` token is invalid token type');
    });
});
