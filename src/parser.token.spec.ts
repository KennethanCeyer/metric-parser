import { expect } from 'chai';
import { Formula } from './formula.parser';
import { ParserToken } from './parser.token';
import { Token } from './token';
import { ParserAstHelper } from './parser.ast.helper';
import { TokenHelper } from './token.helper';

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
        const data = ['(', '1', '+', '2', ')', '*', '3'];
        const parser = new ParserToken(data);
        parser.parse();
        const ast = parser.getAST();
        const leftNode = ast.getLeftNode();

        expect(ast.getType()).to.equal(Token.Type.Operator);
        expect(ast.getValue()).to.equal('*');
        expect(leftNode.getType()).to.equal(Token.Type.Operator);
        expect(leftNode.getSubType()).to.equal(Token.SubType.Group);
        expect(leftNode.getValue()).to.equal('+');
        expect(leftNode.getLeftNode().getType()).to.equal(Token.Type.Value);
        expect(leftNode.getLeftNode().getValue()).to.equal('1');
        expect(leftNode.getRightNode().getType()).to.equal(Token.Type.Value);
        expect(leftNode.getRightNode().getValue()).to.equal('2');
        expect(ast.getRightNode().getType()).to.equal(Token.Type.Value);
        expect(ast.getRightNode().getValue()).to.equal('3');
    });

    it('should return ast correctly from `1 + (2 + 3) * 4`', () => {
        const data = ['1', '+', '(', '2', '+', '3', ')', '*', '4'];
        const parser = new ParserToken(data);
        parser.parse();
        const ast = parser.getAST();
        const leftNode = ast.getLeftNode();
        const rightNode = ast.getRightNode();

        expect(ast.getType()).to.equal(Token.Type.Operator);
        expect(ast.getValue()).to.equal('+');
        expect(leftNode.getType()).to.equal(Token.Type.Value);
        expect(leftNode.getValue()).to.equal('1');
        expect(rightNode.getType()).to.equal(Token.Type.Operator);
        expect(rightNode.getValue()).to.equal('*');
        expect(rightNode.getLeftNode().getType()).to.equal(Token.Type.Operator);
        expect(rightNode.getLeftNode().getSubType()).to.equal(Token.SubType.Group);
        expect(rightNode.getLeftNode().getValue()).to.equal('+');
        expect(rightNode.getLeftNode().getLeftNode().getType()).to.equal(Token.Type.Value);
        expect(rightNode.getLeftNode().getLeftNode().getValue()).to.equal('2');
        expect(rightNode.getLeftNode().getRightNode().getType()).to.equal(Token.Type.Value);
        expect(rightNode.getLeftNode().getRightNode().getValue()).to.equal('3');
        expect(rightNode.getRightNode().getType()).to.equal(Token.Type.Value);
        expect(rightNode.getRightNode().getValue()).to.equal('4');
    });

    it('should return ast correctly from `6 + 2 * (3 + (4 / 2) * 4 * (2 + (4 + 2 * 6)) * 2)`', () => {
        const data = [
            '6', '+', '2', '*', '(', '3', '+', '(', '4', '/', '2', ')', '*', '4', '*', '(', '2', '+', '(',
            '4', '+', '2', '*', '6', ')', ')', '*', '2', ')'
        ];
        const test = 6 + 2 * (3 + (4 / 2) * 4 * (2 + (4 + 2 * 6)) * 2);
        const parser = new ParserToken(data);
        parser.parse();
        const ast = parser.getAST();
        const leftNode = ast.getLeftNode();
        const rightNode = ast.getRightNode();

        expect(ast.getType()).to.equal(Token.Type.Operator);
        expect(ast.getValue()).to.equal('+');
        expect(leftNode.getType()).to.equal(Token.Type.Value);
        expect(leftNode.getValue()).to.equal('6');
        expect(rightNode.getType()).to.equal(Token.Type.Operator);
        expect(rightNode.getValue()).to.equal('*');
        expect(rightNode.getLeftNode().getType()).to.equal(Token.Type.Value);
        expect(rightNode.getLeftNode().getValue()).to.equal('2');
        expect(rightNode.getRightNode().getType()).to.equal(Token.Type.Operator);
        expect(rightNode.getRightNode().getSubType()).to.equal(Token.SubType.Group);
        expect(rightNode.getRightNode().getValue()).to.equal('+');
        expect(rightNode.getRightNode().getLeftNode().getType()).to.equal(Token.Type.Value);
        expect(rightNode.getRightNode().getLeftNode().getValue()).to.equal('3');
        expect(rightNode.getRightNode().getRightNode().getType()).to.equal(Token.Type.Operator);
        expect(rightNode.getRightNode().getRightNode().getValue()).to.equal('*');
        expect(rightNode.getRightNode().getRightNode().getLeftNode().getType()).to.equal(Token.Type.Operator);
        expect(rightNode.getRightNode().getRightNode().getLeftNode().getSubType()).to.equal(Token.SubType.Group);
        expect(rightNode.getRightNode().getRightNode().getLeftNode().getValue()).to.equal('/');
        expect(rightNode.getRightNode().getRightNode().getLeftNode().getLeftNode().getType()).to.equal(Token.Type.Value);
        expect(rightNode.getRightNode().getRightNode().getLeftNode().getLeftNode().getValue()).to.equal('4');
        expect(rightNode.getRightNode().getRightNode().getLeftNode().getRightNode().getType()).to.equal(Token.Type.Value);
        expect(rightNode.getRightNode().getRightNode().getLeftNode().getRightNode().getValue()).to.equal('2');
        expect(rightNode.getRightNode().getRightNode().getRightNode().getType()).to.equal(Token.Type.Operator);
        expect(rightNode.getRightNode().getRightNode().getRightNode().getValue()).to.equal('*');
        expect(rightNode.getRightNode().getRightNode().getRightNode().getLeftNode().getType()).to.equal(Token.Type.Value);
        expect(rightNode.getRightNode().getRightNode().getRightNode().getLeftNode().getValue()).to.equal('4');
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getType()).to.equal(Token.Type.Operator);
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getValue()).to.equal('*');
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getLeftNode().getType()).to.equal(Token.Type.Operator);
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getLeftNode().getSubType()).to.equal(Token.SubType.Group);
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getLeftNode().getValue()).to.equal('+');
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getLeftNode().getLeftNode().getType()).to.equal(Token.Type.Value);
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getLeftNode().getLeftNode().getValue()).to.equal('2');
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getLeftNode().getRightNode().getType()).to.equal(Token.Type.Operator);
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getLeftNode().getRightNode().getSubType()).to.equal(Token.SubType.Group);
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getLeftNode().getRightNode().getValue()).to.equal('+');
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getLeftNode().getRightNode().getLeftNode().getType()).to.equal(Token.Type.Value);
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getLeftNode().getRightNode().getLeftNode().getValue()).to.equal('4');
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getLeftNode().getRightNode().getRightNode().getType()).to.equal(Token.Type.Operator);
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getLeftNode().getRightNode().getRightNode().getValue()).to.equal('*');
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getLeftNode().getRightNode().getRightNode().getLeftNode().getType()).to.equal(Token.Type.Value);
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getLeftNode().getRightNode().getRightNode().getLeftNode().getValue()).to.equal('2');
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getLeftNode().getRightNode().getRightNode().getRightNode().getType()).to.equal(Token.Type.Value);
        expect(rightNode.getRightNode().getRightNode().getRightNode().getRightNode().getLeftNode().getRightNode().getRightNode().getRightNode().getValue()).to.equal('6');
    });
});

describe('parse token with advanced feature', () => {
    it('should return ast correctly from `{item} * 2`', () => {
        const customInput = {
            value: 2,
            aggregate: 'sum',
            type: 'number',
            scope: 'single'
        };
        const data = [customInput, '*', 2];
        const parser = new ParserToken(data);
        parser.parse();
        const ast = parser.getAST();
        console.log(ParserAstHelper.getNodeDisplay(ast));
    });
});
