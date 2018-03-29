import { convert } from './metric.parser';
import { expect } from 'chai';
import { success } from './error';

describe('integration: convert()', () => {
    it ('should return valid result', () => {
        const parseResult = convert('1 + 2 * 3');

        expect(parseResult.code).to.equal(success);
        expect(parseResult.data).to.deep.equal({
            operator: '+',
            operand1: { value: { type: 'unit', unit: 1 }},
            operand2: {
                operator: '*',
                operand1: { value: { type: 'unit', unit: 2 }},
                operand2: { value: { type: 'unit', unit: 3 }}
            }
        });

        const unparseResult = convert(parseResult.data);
        expect(unparseResult.code).to.equal(success);
        expect(unparseResult.data).to.deep.equal([1, '+', 2, '*', 3]);
    });
});
