import { expect } from 'chai';
import { Formula } from './formula.parser';
import { ParserToken } from './parser.token';
import { Token } from './token';

describe('basic parse token', () => {
    it('should return ast correctly from `1 + 2`', () => {
        const data = ['1', '+', '2'];
        const parser = new ParserToken(data);
        parser.parse();
        const ast = parser.getAST();

        expect(ast.getType()).to.equal(Token.Type.Operator);
        expect(ast.getValue()).to.equal('+');
        expect(ast.getLeftNode().getType()).to.equal(Token.Type.Value);
        expect(ast.getLeftNode().getValue()).to.equal('1');
        expect(ast.getRightNode().getType()).to.equal(Token.Type.Value);
        expect(ast.getRightNode().getValue()).to.equal('2');
    });

    it('should return ast correctly from `1 + 2 + 3`', () => {
        const data = ['1', '+', '2', '+', '3'];
        const parser = new ParserToken(data);
        parser.parse();
        const ast = parser.getAST();
        const rightNode = ast.getRightNode();

        expect(ast.getType()).to.equal(Token.Type.Operator);
        expect(ast.getValue()).to.equal('+');
        expect(ast.getLeftNode().getType()).to.equal(Token.Type.Value);
        expect(ast.getLeftNode().getValue()).to.equal('1');
        expect(rightNode.getType()).to.equal(Token.Type.Operator);
        expect(rightNode.getValue()).to.equal('+');
        expect(rightNode.getLeftNode().getType()).to.equal(Token.Type.Value);
        expect(rightNode.getLeftNode().getValue()).to.equal('2');
        expect(rightNode.getRightNode().getType()).to.equal(Token.Type.Value);
        expect(rightNode.getRightNode().getValue()).to.equal('3');
    });

    it('should return ast correctly from `1 + 2 * 3`', () => {
        const data = ['1', '+', '2', '*', '3'];
        const parser = new ParserToken(data);
        parser.parse();
        const ast = parser.getAST();
        const rightNode = ast.getRightNode();

        expect(ast.getType()).to.equal(Token.Type.Operator);
        expect(ast.getValue()).to.equal('+');
        expect(ast.getLeftNode().getType()).to.equal(Token.Type.Value);
        expect(ast.getLeftNode().getValue()).to.equal('1');
        expect(rightNode.getType()).to.equal(Token.Type.Operator);
        expect(rightNode.getValue()).to.equal('*');
        expect(rightNode.getLeftNode().getType()).to.equal(Token.Type.Value);
        expect(rightNode.getLeftNode().getValue()).to.equal('2');
        expect(rightNode.getRightNode().getType()).to.equal(Token.Type.Value);
        expect(rightNode.getRightNode().getValue()).to.equal('3');
    });

    it('should return ast correctly from `1 * 2 + 3`', () => {
        const data = ['1', '*', '2', '+', '3'];
        const parser = new ParserToken(data);
        parser.parse();
        const ast = parser.getAST();
        const leftNode = ast.getLeftNode();

        expect(ast.getType()).to.equal(Token.Type.Operator);
        expect(ast.getValue()).to.equal('+');
        expect(leftNode.getType()).to.equal(Token.Type.Operator);
        expect(leftNode.getValue()).to.equal('*');
        expect(leftNode.getLeftNode().getType()).to.equal(Token.Type.Value);
        expect(leftNode.getLeftNode().getValue()).to.equal('1');
        expect(leftNode.getRightNode().getType()).to.equal(Token.Type.Value);
        expect(leftNode.getRightNode().getValue()).to.equal('2');
        expect(ast.getRightNode().getType()).to.equal(Token.Type.Value);
        expect(ast.getRightNode().getValue()).to.equal('3');
    });
});

describe('parse token with bracket', () => {
    it('should return ast correctly from `(1 + 2) * 3`', () => {
        // TODO: fill test code
    });
});