import { expect } from 'chai';
import { AbstractSyntaxTree } from './ast';

describe('test getter: AbstractSyntaxTree.leftNode', () => {
    it('should returns undefined with a AST with left node empty', () => {
        const ast = new AbstractSyntaxTree('+');

        expect(ast.leftNode).to.be.undefined;
    });
});

describe('test getter: AbstractSyntaxTree.rightNode', () => {
    it('should returns undefined with a AST with right node empty', () => {
        const ast = new AbstractSyntaxTree('+');

        expect(ast.rightNode).to.be.undefined;
    });
});

describe('test getter: AbstractSyntaxTree.parent', () => {
    it ('should returns undefined with a AST with parent node empty', () => {
        const ast = new AbstractSyntaxTree('+');

        expect(ast.parent).to.be.undefined;
    });
});
