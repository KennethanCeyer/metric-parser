import { expect } from 'chai';
import { AbstractSyntaxTree } from '../../ast';
import { Token } from '../../token/token';
import { Operand, Tree } from './type';
import { TreeBuilder } from './builder';
import { AbstractSyntaxTreeHelper } from '../../ast.helper';

describe('test method: SimpleTree.makeTree()', () => {
    it('should return parser tree', () => {
        const ast = new AbstractSyntaxTree(Token.literal.Multiplication);
        ast.leftNode = new AbstractSyntaxTree('2');
        ast.rightNode = new AbstractSyntaxTree('3');
        const treeBuilder = new TreeBuilder();
        const tree = treeBuilder.makeTree(ast);
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
        const treeBuilder = new TreeBuilder();
        const tree = treeBuilder.makeTree(ast);
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

describe('test method: SimpleTree.makeAst()', () => {
    it('should return ast', () => {
        const data: Tree = {
            operator: '*',
            operand1: {
                operator: '-',
                operand1: {
                    value: {
                        type: 'unit',
                        unit: 2
                    }
                },
                operand2: {
                    value: {
                        type: 'unit',
                        unit: 1
                    }
                }
            },
            operand2: {
                value: {
                    type: 'unit',
                    unit: 3
                }
            }
        };
        const treeBuilder = new TreeBuilder();
        const ast = treeBuilder.makeAst(data);

        expect(ast.type).to.equal(Token.Type.Operator);
        expect(ast.value).to.equal(Token.literal.Multiplication);
        expect(ast.leftNode.type).to.equal(Token.Type.Operator);
        expect(ast.leftNode.value).to.equal(Token.literal.Subtraction);
        expect(ast.leftNode.leftNode.type).to.equal(Token.Type.Value);
        expect(ast.leftNode.leftNode.value).to.equal(2);
        expect(ast.leftNode.rightNode.type).to.equal(Token.Type.Value);
        expect(ast.leftNode.rightNode.value).to.equal(1);
        expect(ast.rightNode.type).to.equal(Token.Type.Value);
        expect(ast.rightNode.value).to.equal(3);
    });
});
