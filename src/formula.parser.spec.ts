import { expect } from 'chai';
import { Formula } from './formula.parser';

describe('parse method', () => {
    it('should return an array', () => {
        const data = '1 + 2 + 3';
        const parser = new Formula.Parser(data);
        expect(parser.result.data).to.deep.equal({
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
