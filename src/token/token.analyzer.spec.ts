import { expect } from 'chai';
import { TokenAnalyzer } from './token.analyzer';
import { Token } from './token';

describe('basic parse token', () => {
    it('should return ast correctly from `1 + 2`', () => {
        const data = ['1', '+', '2'];
        const tokenAnalyzer = new TokenAnalyzer(data);
        tokenAnalyzer.parse();
        const ast = tokenAnalyzer.getAST();

        expect(ast.getType()).to.equal(Token.Type.Operator);
        expect(ast.getValue()).to.equal('+');
        expect(ast.getLeftNode().getType()).to.equal(Token.Type.Value);
        expect(ast.getLeftNode().getValue()).to.equal(1);
        expect(ast.getRightNode().getType()).to.equal(Token.Type.Value);
        expect(ast.getRightNode().getValue()).to.equal(2);
    });

    it('should return ast correctly from `1 + 2.56 + 3`', () => {
        const data = ['1', '+', '2.56', '+', '3'];
        const tokenAnalyzer = new TokenAnalyzer(data);
        tokenAnalyzer.parse();
        const ast = tokenAnalyzer.getAST();
        const rightNode = ast.getRightNode();

        expect(ast.getType()).to.equal(Token.Type.Operator);
        expect(ast.getValue()).to.equal('+');
        expect(ast.getLeftNode().getType()).to.equal(Token.Type.Value);
        expect(ast.getLeftNode().getValue()).to.equal(1);
        expect(rightNode.getType()).to.equal(Token.Type.Operator);
        expect(rightNode.getValue()).to.equal('+');
        expect(rightNode.getLeftNode().getType()).to.equal(Token.Type.Value);
        expect(rightNode.getLeftNode().getValue()).to.equal(2.56);
        expect(rightNode.getRightNode().getType()).to.equal(Token.Type.Value);
        expect(rightNode.getRightNode().getValue()).to.equal(3);
    });

    it('should return ast correctly from `1 + 2 * 3`', () => {
        const data = ['1', '+', '2', '*', '3'];
        const tokenAnalyzer = new TokenAnalyzer(data);
        tokenAnalyzer.parse();
        const ast = tokenAnalyzer.getAST();
        const rightNode = ast.getRightNode();

        expect(ast.getType()).to.equal(Token.Type.Operator);
        expect(ast.getValue()).to.equal('+');
        expect(ast.getLeftNode().getType()).to.equal(Token.Type.Value);
        expect(ast.getLeftNode().getValue()).to.equal(1);
        expect(rightNode.getType()).to.equal(Token.Type.Operator);
        expect(rightNode.getValue()).to.equal('*');
        expect(rightNode.getLeftNode().getType()).to.equal(Token.Type.Value);
        expect(rightNode.getLeftNode().getValue()).to.equal(2);
        expect(rightNode.getRightNode().getType()).to.equal(Token.Type.Value);
        expect(rightNode.getRightNode().getValue()).to.equal(3);
    });

    it('should return ast correctly from `1 * 2 + 3`', () => {
        const data = ['1', '*', '2', '+', '3'];
        const tokenAnalyzer = new TokenAnalyzer(data);
        tokenAnalyzer.parse();
        const ast = tokenAnalyzer.getAST();
        const leftNode = ast.getLeftNode();

        expect(ast.getType()).to.equal(Token.Type.Operator);
        expect(ast.getValue()).to.equal('+');
        expect(leftNode.getType()).to.equal(Token.Type.Operator);
        expect(leftNode.getValue()).to.equal('*');
        expect(leftNode.getLeftNode().getType()).to.equal(Token.Type.Value);
        expect(leftNode.getLeftNode().getValue()).to.equal(1);
        expect(leftNode.getRightNode().getType()).to.equal(Token.Type.Value);
        expect(leftNode.getRightNode().getValue()).to.equal(2);
        expect(ast.getRightNode().getType()).to.equal(Token.Type.Value);
        expect(ast.getRightNode().getValue()).to.equal(3);
    });
});

describe('parse token with bracket', () => {
    it('should return ast correctly from `(1 + 2) * 3`', () => {
        const data = ['(', '1', '+', '2', ')', '*', '3'];
        const tokenAnalyzer = new TokenAnalyzer(data);
        tokenAnalyzer.parse();
        const ast = tokenAnalyzer.getAST();
        const leftNode = ast.getLeftNode();

        expect(ast.getType()).to.equal(Token.Type.Operator);
        expect(ast.getValue()).to.equal('*');
        expect(leftNode.getType()).to.equal(Token.Type.Operator);
        expect(leftNode.getSubType()).to.equal(Token.SubType.Group);
        expect(leftNode.getValue()).to.equal('+');
        expect(leftNode.getLeftNode().getType()).to.equal(Token.Type.Value);
        expect(leftNode.getLeftNode().getValue()).to.equal(1);
        expect(leftNode.getRightNode().getType()).to.equal(Token.Type.Value);
        expect(leftNode.getRightNode().getValue()).to.equal(2);
        expect(ast.getRightNode().getType()).to.equal(Token.Type.Value);
        expect(ast.getRightNode().getValue()).to.equal(3);
    });

    it('should return ast correctly from `1 + (2 + 3) * 4`', () => {
        const data = ['1', '+', '(', '2', '+', '3', ')', '*', '4'];
        const tokenAnalyzer = new TokenAnalyzer(data);
        tokenAnalyzer.parse();
        const ast = tokenAnalyzer.getAST();
        const leftNode = ast.getLeftNode();
        const rightNode = ast.getRightNode();

        expect(ast.getType()).to.equal(Token.Type.Operator);
        expect(ast.getValue()).to.equal('+');
        expect(leftNode.getType()).to.equal(Token.Type.Value);
        expect(leftNode.getValue()).to.equal(1);
        expect(rightNode.getType()).to.equal(Token.Type.Operator);
        expect(rightNode.getValue()).to.equal('*');
        expect(rightNode.getLeftNode().getType()).to.equal(Token.Type.Operator);
        expect(rightNode.getLeftNode().getSubType()).to.equal(Token.SubType.Group);
        expect(rightNode.getLeftNode().getValue()).to.equal('+');
        expect(rightNode.getLeftNode().getLeftNode().getType()).to.equal(Token.Type.Value);
        expect(rightNode.getLeftNode().getLeftNode().getValue()).to.equal(2);
        expect(rightNode.getLeftNode().getRightNode().getType()).to.equal(Token.Type.Value);
        expect(rightNode.getLeftNode().getRightNode().getValue()).to.equal(3);
        expect(rightNode.getRightNode().getType()).to.equal(Token.Type.Value);
        expect(rightNode.getRightNode().getValue()).to.equal(4);
    });

    /* tslint:disable */
    it('should return ast correctly from `6 + 2 * (3 + (4 / 2) * 4 * (2 + (4 + 2 * 6)) * 2)`', () => {
        const data = [
            '6', '+', '2', '*', '(', '3', '+', '(', '4', '/', '2', ')', '*', '4', '*', '(', '2', '+', '(',
            '4', '+', '2', '*', '6', ')', ')', '*', '2', ')'
        ];
        const test = 6 + 2 * (3 + (4 / 2) * 4 * (2 + (4 + 2 * 6)) * 2);
        const tokenAnalyzer = new TokenAnalyzer(data);
        tokenAnalyzer.parse();
        const ast = tokenAnalyzer.getAST();
        const leftNode = ast.getLeftNode();
        const rightNode = ast.getRightNode();

        expect(ast.getType()).to.equal(Token.Type.Operator);
        expect(ast.getValue()).to.equal('+');
        expect(leftNode.getType()).to.equal(Token.Type.Value);
        expect(leftNode.getValue()).to.equal(6);
        expect(rightNode.getType()).to.equal(Token.Type.Operator);
        expect(rightNode.getValue()).to.equal('*');
        expect(rightNode.getLeftNode().getType()).to.equal(Token.Type.Value);
        expect(rightNode.getLeftNode().getValue()).to.equal(2);
        expect(rightNode.getRightNode().getType()).to.equal(Token.Type.Operator);
        expect(rightNode.getRightNode().getSubType()).to.equal(Token.SubType.Group);
        expect(rightNode.getRightNode().getValue()).to.equal('+');
        expect(rightNode.getRightNode().getLeftNode().getType()).to.equal(Token.Type.Value);
        expect(rightNode.getRightNode().getLeftNode().getValue()).to.equal(3);
        expect(rightNode.getRightNode().getRightNode().getType()).to.equal(Token.Type.Operator);
        expect(rightNode.getRightNode().getRightNode().getValue()).to.equal('*');
        expect(rightNode.getRightNode().getRightNode().getLeftNode().getType()).to.equal(Token.Type.Operator);
        expect(rightNode.getRightNode().getRightNode().getLeftNode().getSubType()).to.equal(Token.SubType.Group);
        expect(rightNode.getRightNode().getRightNode().getLeftNode().getValue()).to.equal('/');
        expect(rightNode.getRightNode().getRightNode().getLeftNode().getLeftNode().getType()).to.equal(Token.Type.Value);
        expect(rightNode.getRightNode().getRightNode().getLeftNode().getLeftNode().getValue()).to.equal(4);
        expect(rightNode.getRightNode().getRightNode().getLeftNode().getRightNode().getType()).to.equal(Token.Type.Value);
        expect(rightNode.getRightNode().getRightNode().getLeftNode().getRightNode().getValue()).to.equal(2);
        expect(rightNode.getRightNode().getRightNode().getRightNode().getType()).to.equal(Token.Type.Operator);
        expect(rightNode.getRightNode().getRightNode().getRightNode().getValue()).to.equal('*');
        expect(rightNode.getRightNode().getRightNode().getRightNode().getLeftNode().getType()).to.equal(Token.Type.Value);
        expect(rightNode.getRightNode().getRightNode().getRightNode().getLeftNode().getValue()).to.equal(4);
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getType()).to.equal(Token.Type.Operator);
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getValue()).to.equal('*');
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getLeftNode().getType()).to.equal(Token.Type.Operator);
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getLeftNode().getSubType()).to.equal(Token.SubType.Group);
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getLeftNode().getValue()).to.equal('+');
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getLeftNode().getLeftNode().getType()).to.equal(Token.Type.Value);
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getLeftNode().getLeftNode().getValue()).to.equal(2);
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getLeftNode().getRightNode().getType()).to.equal(Token.Type.Operator);
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getLeftNode().getRightNode().getSubType()).to.equal(Token.SubType.Group);
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getLeftNode().getRightNode().getValue()).to.equal('+');
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getLeftNode().getRightNode().getLeftNode().getType()).to.equal(Token.Type.Value);
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getLeftNode().getRightNode().getLeftNode().getValue()).to.equal(4);
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getLeftNode().getRightNode().getRightNode().getType()).to.equal(Token.Type.Operator);
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getLeftNode().getRightNode().getRightNode().getValue()).to.equal('*');
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getLeftNode().getRightNode().getRightNode().getLeftNode().getType()).to.equal(Token.Type.Value);
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getLeftNode().getRightNode().getRightNode().getLeftNode().getValue()).to.equal(2);
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getLeftNode().getRightNode().getRightNode().getRightNode().getType()).to.equal(Token.Type.Value);
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getLeftNode().getRightNode().getRightNode().getRightNode().getValue()).to.equal(6);
    });
    /* tslint:enable */
});

describe('parse token with advanced feature', () => {
    it('should return implicit multiplication ast from `2(3 + 4)`', () => {
        const data = ['2', '(', '3', '*', '4', ')'];
        const tokenAnalyzer = new TokenAnalyzer(data);
        tokenAnalyzer.parse();
        const ast = tokenAnalyzer.getAST();

        expect(ast.getType()).to.equal(Token.Type.Operator);
        expect(ast.getValue()).to.equal('*');
        expect(ast.getLeftNode().getType()).to.equal(Token.Type.Value);
        expect(ast.getLeftNode().getValue()).to.equal(2);
        expect(ast.getRightNode().getType()).to.equal(Token.Type.Operator);
        expect(ast.getRightNode().getSubType()).to.equal(Token.SubType.Group);
        expect(ast.getRightNode().getValue()).to.equal('*');
        expect(ast.getRightNode().getLeftNode().getType()).to.equal(Token.Type.Value);
        expect(ast.getRightNode().getLeftNode().getValue()).to.equal(3);
        expect(ast.getRightNode().getRightNode().getType()).to.equal(Token.Type.Value);
        expect(ast.getRightNode().getRightNode().getValue()).to.equal(4);
    });

    it('should return ast correctly from `{item} * 2`', () => {
        const customInput = {
            value: 3,
            aggregate: 'sum',
            type: 'number',
            scope: 'single'
        };
        const data = [customInput, '*', '2'];
        const tokenAnalyzer = new TokenAnalyzer(data);
        tokenAnalyzer.parse();
        const ast = tokenAnalyzer.getAST();

        expect(ast.getType()).to.equal(Token.Type.Operator);
        expect(ast.getValue()).to.equal('*');
        expect(ast.getLeftNode().getType()).to.equal(Token.Type.Value);
        expect(ast.getLeftNode().getValue()).to.deep.equal(customInput);
        expect(ast.getRightNode().getType()).to.equal(Token.Type.Value);
        expect(ast.getRightNode().getValue()).to.equal(2);
    });
});
