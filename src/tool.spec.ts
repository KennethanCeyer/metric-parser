import { expect } from 'chai';
import { convert, getVersion, valid } from './tool';
import { Tree } from './tree/simple.tree/type';
import { success } from './error';
import { ConvertData } from '../dist/types/converter';

describe('test method: convert()', () => {
    it('should return an valid tree with 1 + 2', () => {
        const data: ConvertData = '1 + 2';
        const result = convert(data);
        expect(result.code).to.equal(success);
        expect(result.data).to.deep.equal({
            operator: '+',
            operand1: { value: { type: 'unit', unit: 1 } },
            operand2: { value: { type: 'unit', unit: 2 } }
        });
    });

    it('should return an valid tree with 0', () => {
        const data: ConvertData = '0';
        const result = convert(data);
        expect(result.code).to.equal(success);
        expect(result.data).to.deep.equal({
            value: { type: 'unit', unit: 0 }
        });
    });

    it('should return an valid tree with 1.2 + 2.6', () => {
        const data: ConvertData = '1.2 + 2.6';
        const result = convert(data);
        expect(result.code).to.equal(success);
        expect(result.data).to.deep.equal({
            operator: '+',
            operand1: { value: { type: 'unit', unit: 1.2 } },
            operand2: { value: { type: 'unit', unit: 2.6 } }
        });
    });

    it('should return (1 + 2) * 3 with tree', () => {
        const data: Tree  = {
            operator: '*',
            operand1: {
                operator: '+',
                operand1: { value: { type: 'unit', unit: 1 } },
                operand2: { value: { type: 'unit', unit: 2 } }
            },
            operand2: { value: { type: 'unit', unit: 3 } }
        };
        const result = convert(data);
        expect(result.code).to.equal(success);
        expect(result.data).to.be.an('array').and.that.deep.equal(['(', 1, '+', 2, ')', '*', 3]);
    });

    it('should return 2.652 * 3.44 + 4.0 ^ 2.2 ^ (6 + 2.01) with tree', () => {
        const data: Tree  = {
            operator: '+',
            operand1: {
                operator: '*',
                operand1: { value: { type: 'unit', unit: 2.652 } },
                operand2: { value: { type: 'unit', unit: 3.44 } }
            },
            operand2: {
                operator: '^',
                operand1: {
                    operator: '^',
                    operand1: { value: { type: 'unit', unit: 4.0 } },
                    operand2: { value: { type: 'unit', unit: 2.2 } }
                },
                operand2: {
                    operator: '+',
                    operand1: { value: { type: 'unit', unit: 6 } },
                    operand2: { value: { type: 'unit', unit: 2.01 } }
                }
            }
        };
        const result = convert(data);
        expect(result.code).to.equal(success);
        expect(result.data).to.be.an('array').and.that.deep.equal([
            2.652, '*', 3.44, '+', 4.0, '^', 2.2, '^', '(', 6, '+', 2.01, ')'
        ]);
    });
});

describe('test method: valid()', () => {
    it('should return true with valid tree', () => {
        expect(valid({
            operator: '*',
            operand1: { value: { type: 'unit', unit: 1 } },
            operand2: { value: { type: 'unit', unit: 2 } }
        })).to.be.true;

        expect(valid({
            operator: '/',
            operand1: { value: { type: 'unit', unit: 4 } },
            operand2: {
                operator: '*',
                operand1: { value: { type: 'unit', unit: 4 } },
                operand2: { value: { type: 'unit', unit: 0 } }
            }
        })).to.be.true;

        expect(valid({
            operator: '/',
            operand1: { value: { type: 'unit', unit: -4 } },
            operand2: {
                operator: '*',
                operand1: { value: { type: 'item', item: {
                    type: 'custom',
                    value: 2,
                    aggregate: 'sum'
                }}},
                operand2: { value: { type: 'unit', unit: 0 } }
            }
        })).to.be.true;
    });

    it('should return false with invalid tree', () => {
        expect(valid({
            operator: '*',
            operand1: { value: { type: 'unit', unit: 1 } },
            operand2: { value: { type: 'unit' } }
        })).to.be.false;

        expect(valid({
            operator: '*',
            operand1: { value: { type: 'unit', unit: 1 } },
            operand2: { value: { type: 'item', unit: 2 } }
        })).to.be.false;

        expect(valid({
            operator: undefined,
            operand1: { value: { type: 'unit', unit: 4 } },
            operand2: {
                operator: '*',
                operand1: { value: { type: 'unit', unit: 4 } },
                operand2: { value: { type: 'unit', unit: 0 } }
            }
        })).to.be.false;

        expect(valid({
            operator: '/',
            operand1: { value: { type: 'unit', unit: 4 } },
            operand2: undefined
        })).to.be.false;
    });

    it('should return true with valid expression', () => {
        expect(valid('.0')).to.be.true;
        expect(valid('1 + 2')).to.be.true;
        expect(valid('01 + 2 * 2')).to.be.true;
        expect(valid('1.02 / 2 + .2')).to.be.true;
        expect(valid('6 / (2 + .2)')).to.be.true;
        expect(valid('4 (6 ^ 2)')).to.be.true;
        expect(valid('(2 + 4) (4 / 1)')).to.be.true;
    });

    it('should return false with invalid expression', () => {
        expect(valid(undefined)).to.be.false;
        expect(valid('')).to.be.false;
        expect(valid('1 + (2')).to.be.false;
        expect(valid('a + 1')).to.be.false;
        expect(valid('1 + 4 / (* 2 / 4)')).to.be.false;
        expect(valid('1 +* 2 * 2')).to.be.false;
        expect(valid('1.2.45 + 2')).to.be.false;
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
