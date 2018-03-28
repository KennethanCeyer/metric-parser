import { expect } from 'chai';
import { Builder } from './builder';
import { BuilderError } from './builder.error';
import { ParserError } from './error';

describe('test method: Builder.build()', () => {
    it('should throws an error result with undefined data', () => {
        const builder = new Builder(undefined);

        expect(builder.build())
            .to.deep.equal({
                data: 'data is empty',
                code: BuilderError.emptyData.code,
                stack: { line: 0, col: 0 }
            });
    });
});
