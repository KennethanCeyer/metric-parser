import { expect } from 'chai';
import { AbstractSyntaxTree } from './ast';

describe('test getter: AbstractSyntaxTree.leftNode', () => {
    it('should return undefined with an AST and left node empty', () => {
        const ast = new AbstractSyntaxTree('+');

        expect(ast.leftNode).to.be.undefined;
    });
});

describe('test getter: AbstractSyntaxTree.rightNode', () => {
    it('should return undefined with an AST and right node empty', () => {
        const ast = new AbstractSyntaxTree('+');

        expect(ast.rightNode).to.be.undefined;
    });
});

describe('test getter: AbstractSyntaxTree.parent', () => {
    it('should return undefined with an AST and parent node empty', () => {
        const ast = new AbstractSyntaxTree('+');

        expect(ast.parent).to.be.undefined;
    });
});

describe('test gtter: AbstractSyntaxTree.expression', () => {
   it('should return `1 / (2 * 3)` with an AST', () => {
       const ast = new AbstractSyntaxTree('/');
       const rightAst = new AbstractSyntaxTree('*');
       rightAst.leftNode = new AbstractSyntaxTree(2);
       rightAst.rightNode = new AbstractSyntaxTree(3);
       ast.leftNode = new AbstractSyntaxTree(1);
       ast.rightNode = rightAst;

       expect(ast.expression).to.be.deep.equal([1, '/', '(', 2, '*', 3, ')']);
   });
});
