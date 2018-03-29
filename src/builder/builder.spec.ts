import { expect } from 'chai';
import { Builder } from './builder';
import { BuilderError } from './builder.error';
import { TreeBuilder } from '../tree/simple.tree/builder';

describe('test method: Builder.parse()', () => {
    it('should throw an error result with undefined data', () => {
        const builder = new Builder(new TreeBuilder());

        expect(builder.build(undefined))
            .to.deep.equal({
                data: 'data is empty',
                code: BuilderError.emptyData.code,
                stack: { line: 0, col: 0 }
            });
    });
});
