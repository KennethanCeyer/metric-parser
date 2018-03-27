import { expect } from 'chai';
import { convert } from './metric.parser';
import { StringHelper } from './string.helper';

describe('test method: StringHelper.format()', () => {
    it('should return `hello world` with (`{0} {1}`, `hello`, `world`)', () => {
        expect(StringHelper.format('{0} {1}', 'hello', 'world'))
            .to.be.equal('hello world');
    });
});
