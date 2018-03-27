import { expect } from 'chai';
import { convert } from './metric.parser';

describe('parse method', () => {
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
    }) ;
});
