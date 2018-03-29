import { AbstractSyntaxTree } from './ast';
import { AbstractSyntaxTreeHelper } from './ast.helper';
import { expect } from 'chai';

describe('test method: AbstractSyntaxTreeHelper.getNodeDisplay()', () => {
    it('should return valid string value', () => {
        const ast = new AbstractSyntaxTree('+');
        ast.leftNode = new AbstractSyntaxTree(1);
        ast.rightNode = new AbstractSyntaxTree(2);

        const expected = '* NODE\n- value: +\n- left:\n    * NODE\n' +
            '    - value: 1\n\n- right:\n    * NODE\n    - value: 2\n\n';

        expect(AbstractSyntaxTreeHelper.getNodeDisplay(ast)).to.equal(expected);
    });
});
