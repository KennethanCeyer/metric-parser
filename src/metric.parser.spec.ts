import { expect } from 'chai';
import { convert, getVersion } from './metric.parser';

describe('test method: convert()', () => {
    it('should return an array', () => {
        const data = '1 + 2';
        const result = convert(data);
        expect(result.data).to.deep.equal({
            operator: '+',
            operand1: {
                value: {
                    type: 'unit',
                    unit: 1
                }
            },
            operand2: {
                value: {
                    type: 'unit',
                    unit: 2
                }
            }
        });
    });
});

describe('test method: getVersion()', () => {
    it('should return type as string', () => {
        expect(getVersion()).to.a('string');
    });

    it('should return type a dot-separated character', () => {
        expect(getVersion().split('.'))
            .to.have.length(3)
            .and.that.satisfies(array => array.every(value => !isNaN(Number(value))));
    });
});
