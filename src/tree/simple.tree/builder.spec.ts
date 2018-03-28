import { expect } from 'chai';
import { AbstractSyntaxTree } from '../../ast';
import { Token } from '../../token/token';
import { Operand, Tree } from './type';
import { TreeBuilder } from './builder';

describe('case: make tree', () => {
    it('should return parser tree', () => {
        const ast = new AbstractSyntaxTree(Token.literal.Multiplication);
        ast.leftNode = new AbstractSyntaxTree('2');
        ast.rightNode = new AbstractSyntaxTree('3');
        const treeBuilder = new TreeBuilder(ast);
        const tree = treeBuilder.makeTree();
        const leftOperand = tree.operand1 as Operand;
        const rightOperand = tree.operand2 as Operand;

        expect(tree.operator).to.equal('*');
        expect(leftOperand).to.be.an('object');
        expect(rightOperand).to.be.an('object');
        expect(leftOperand.value.type).to.equal('unit');
        expect(leftOperand.value.unit).to.equal(2);
        expect(rightOperand.value.type).to.equal('unit');
        expect(rightOperand.value.unit).to.equal(3);
    });

    it('should return advanced parser tree', () => {
        const customInput = {
            value: 1.56,
            type: 'decimal',
            aggregate: 'avg'
        };
        const customInput2 = {
            value: 'a',
            type: 'string',
            aggregate: 'none'
        };
        const subNode = new AbstractSyntaxTree(Token.literal.Division);
        subNode.leftNode = new AbstractSyntaxTree('3');
        subNode.rightNode = new AbstractSyntaxTree(customInput2);
        const ast = new AbstractSyntaxTree(Token.literal.Addition);
        ast.leftNode = new AbstractSyntaxTree(customInput);
        ast.rightNode = subNode;
        const treeBuilder = new TreeBuilder(ast);
        const tree = treeBuilder.makeTree();
        const leftOperand = tree.operand1 as Operand;
        const rightOperand = tree.operand2 as Tree;
        const leftOperandOfRightNode = rightOperand.operand1 as Operand;
        const rightOperandOfRightNode = rightOperand.operand2 as Operand;

        expect(tree.operator).to.equal(Token.literal.Addition);
        expect(leftOperand).to.be.an('object');
        expect(rightOperand).to.be.an('object');
        expect(leftOperand.value.type).to.equal('item');
        expect(leftOperand.value.item).to.deep.equal(customInput);
        expect(rightOperand.operator).to.equal(Token.literal.Division);
        expect(leftOperandOfRightNode).to.be.an('object');
        expect(rightOperandOfRightNode).to.be.an('object');
        expect(leftOperandOfRightNode.value.type).to.equal('unit');
        expect(leftOperandOfRightNode.value.unit).to.equal(3);
        expect(rightOperandOfRightNode.value.type).to.equal('item');
        expect(rightOperandOfRightNode.value.item).to.deep.equal(customInput2);
    });
});
