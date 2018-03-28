import { expect } from 'chai';
import { TokenAnalyzer } from './token.analyzer';
import { Token } from './token';
import error from 'rollup/dist/typings/utils/error';
import { ParserError } from '../error';

describe('case: basic parse token', () => {
    it('should return ast correctly from `1 + 2`', () => {
        const data = ['1', '+', '2'];
        const tokenAnalyzer = new TokenAnalyzer(data);
        tokenAnalyzer.parse();
        const ast = tokenAnalyzer.getAst();

        expect(ast.type).to.equal(Token.Type.Operator);
        expect(ast.value).to.equal(Token.literal.Addition);
        expect(ast.leftNode.type).to.equal(Token.Type.Value);
        expect(ast.leftNode.value).to.equal(1);
        expect(ast.rightNode.type).to.equal(Token.Type.Value);
        expect(ast.rightNode.value).to.equal(2);
    });

    it('should return ast correctly from `1 + 2.56 + 3`', () => {
        const data = ['1', '+', '2.56', '+', '3'];
        const tokenAnalyzer = new TokenAnalyzer(data);
        tokenAnalyzer.parse();
        const ast = tokenAnalyzer.getAst();
        const leftNode = ast.leftNode;

        expect(ast.type).to.equal(Token.Type.Operator);
        expect(ast.value).to.equal(Token.literal.Addition);
        expect(leftNode.type).to.equal(Token.Type.Operator);
        expect(leftNode.value).to.equal(Token.literal.Addition);
        expect(leftNode.leftNode.type).to.equal(Token.Type.Value);
        expect(leftNode.leftNode.type).to.equal(1);
        expect(leftNode.rightNode.type).to.equal(Token.Type.Value);
        expect(leftNode.rightNode.value).to.equal(2.56);
        expect(ast.rightNode.type).to.equal(Token.Type.Value);
        expect(ast.rightNode.value).to.equal(3);
    });

    it('should return ast correctly from `1 + 2 * 3`', () => {
        const data = ['1', '+', '2', '*', '3'];
        const tokenAnalyzer = new TokenAnalyzer(data);
        tokenAnalyzer.parse();
        const ast = tokenAnalyzer.getAst();
        const rightNode = ast.rightNode;

        expect(ast.type).to.equal(Token.Type.Operator);
        expect(ast.value).to.equal(Token.literal.Addition);
        expect(ast.leftNode.type).to.equal(Token.Type.Value);
        expect(ast.leftNode.value).to.equal(1);
        expect(rightNode.type).to.equal(Token.Type.Operator);
        expect(rightNode.value).to.equal(Token.literal.Multiplication);
        expect(rightNode.leftNode.type).to.equal(Token.Type.Value);
        expect(rightNode.leftNode.value).to.equal(2);
        expect(rightNode.rightNode.type).to.equal(Token.Type.Value);
        expect(rightNode.rightNode.value).to.equal(3);
    });

    it('should return ast correctly from `1 * 2 + 3`', () => {
        const data = ['1', '*', '2', '+', '3'];
        const tokenAnalyzer = new TokenAnalyzer(data);
        tokenAnalyzer.parse();
        const ast = tokenAnalyzer.getAst();
        const leftNode = ast.leftNode;

        expect(ast.type).to.equal(Token.Type.Operator);
        expect(ast.value).to.equal(Token.literal.Addition);
        expect(leftNode.type).to.equal(Token.Type.Operator);
        expect(leftNode.value).to.equal(Token.literal.Multiplication);
        expect(leftNode.leftNode.type).to.equal(Token.Type.Value);
        expect(leftNode.leftNode.value).to.equal(1);
        expect(leftNode.rightNode.type).to.equal(Token.Type.Value);
        expect(leftNode.rightNode.value).to.equal(2);
        expect(ast.rightNode.type).to.equal(Token.Type.Value);
        expect(ast.rightNode.value).to.equal(3);
    });
});

describe('case: parse token with bracket', () => {
    it('should return ast correctly from `(1 + 2) * 3`', () => {
        const data = ['(', '1', '+', '2', ')', '*', '3'];
        const tokenAnalyzer = new TokenAnalyzer(data);
        tokenAnalyzer.parse();
        const ast = tokenAnalyzer.getAst();
        const leftNode = ast.leftNode;

        expect(ast.type).to.equal(Token.Type.Operator);
        expect(ast.value).to.equal(Token.literal.Multiplication);
        expect(leftNode.type).to.equal(Token.Type.Operator);
        expect(leftNode.subType).to.equal(Token.SubType.Group);
        expect(leftNode.value).to.equal(Token.literal.Addition);
        expect(leftNode.leftNode.type).to.equal(Token.Type.Value);
        expect(leftNode.leftNode.value).to.equal(1);
        expect(leftNode.rightNode.type).to.equal(Token.Type.Value);
        expect(leftNode.rightNode.value).to.equal(2);
        expect(ast.rightNode.type).to.equal(Token.Type.Value);
        expect(ast.rightNode.value).to.equal(3);
    });

    it('should return ast correctly from `1 + (2 + 3) * 4`', () => {
        const data = ['1', '+', '(', '2', '+', '3', ')', '*', '4'];
        const tokenAnalyzer = new TokenAnalyzer(data);
        tokenAnalyzer.parse();
        const ast = tokenAnalyzer.getAst();
        const leftNode = ast.leftNode;
        const rightNode = ast.rightNode;

        expect(ast.type).to.equal(Token.Type.Operator);
        expect(ast.value).to.equal(Token.literal.Addition);
        expect(leftNode.type).to.equal(Token.Type.Value);
        expect(leftNode.value).to.equal(1);
        expect(rightNode.type).to.equal(Token.Type.Operator);
        expect(rightNode.value).to.equal(Token.literal.Multiplication);
        expect(rightNode.leftNode.type).to.equal(Token.Type.Operator);
        expect(rightNode.leftNode.subType).to.equal(Token.SubType.Group);
        expect(rightNode.leftNode.value).to.equal(Token.literal.Addition);
        expect(rightNode.leftNode.leftNode.type).to.equal(Token.Type.Value);
        expect(rightNode.leftNode.leftNode.value).to.equal(2);
        expect(rightNode.leftNode.rightNode.type).to.equal(Token.Type.Value);
        expect(rightNode.leftNode.rightNode.value).to.equal(3);
        expect(rightNode.rightNode.type).to.equal(Token.Type.Value);
        expect(rightNode.rightNode.value).to.equal(4);
    });

    it('should return ast correctly from `((((1) + (2)) + (3)) + (4))`', () => {
        const data = [
            '(', '(', '(', '(', '1', ')', '+', '(', '2', ')', ')', '+', '(', '3', ')', ')', '+', '(', '4', ')', ')'
        ];
        const tokenAnalyzer = new TokenAnalyzer(data);
        tokenAnalyzer.parse();
        const ast = tokenAnalyzer.getAst();
        const leftNode = ast.leftNode;
        const rightNode = ast.rightNode;

        expect(ast.type).to.equal(Token.Type.Operator);
        expect(ast.subType).to.equal(Token.SubType.Group);
        expect(ast.value).to.equal(Token.literal.Addition);
        expect(leftNode.type).to.equal(Token.Type.Operator);
        expect(leftNode.subType).to.equal(Token.SubType.Group);
        expect(leftNode.value).to.equal(Token.literal.Addition);
        expect(leftNode.leftNode.type).to.equal(Token.Type.Operator);
        expect(leftNode.leftNode.value).to.equal(Token.literal.Addition);
        expect(leftNode.leftNode.subType).to.equal(Token.SubType.Group);
        expect(leftNode.leftNode.leftNode.type).to.equal(Token.Type.Value);
        expect(leftNode.leftNode.leftNode.value).to.equal(1);
        expect(leftNode.leftNode.rightNode.type).to.equal(Token.Type.Value);
        expect(leftNode.leftNode.rightNode.value).to.equal(2);
        expect(leftNode.rightNode.type).to.equal(Token.Type.Value);
        expect(leftNode.rightNode.value).to.equal(3);
        expect(rightNode.type).to.equal(Token.Type.Value);
        expect(rightNode.value).to.equal(4);
    });

    it('should return ast correctly from `6 - 2 * 4 / (2 - 4)`', () => {
        const data = ['6', '-', '2', '*', '4', '/', '(', '2', '-', '4', ')'];
        const tokenAnalyzer = new TokenAnalyzer(data);
        tokenAnalyzer.parse();
        const ast = tokenAnalyzer.getAst();
        const leftNode = ast.leftNode;
        const rightNode = ast.rightNode;

        expect(ast.type).to.equal(Token.Type.Operator);
        expect(ast.value).to.equal(Token.literal.Subtraction);
        expect(leftNode.type).to.equal(Token.Type.Value);
        expect(leftNode.value).to.equal(6);
        expect(rightNode.type).to.equal(Token.Type.Operator);
        expect(rightNode.value).to.equal(Token.literal.Division);
        expect(rightNode.leftNode.type).to.equal(Token.Type.Operator);
        expect(rightNode.leftNode.value).to.equal(Token.literal.Multiplication);
        expect(rightNode.leftNode.leftNode.type).to.equal(Token.Type.Value);
        expect(rightNode.leftNode.leftNode.value).to.equal(2);
        expect(rightNode.leftNode.rightNode.type).to.equal(Token.Type.Value);
        expect(rightNode.leftNode.rightNode.value).to.equal(4);
        expect(rightNode.rightNode.type).to.equal(Token.Type.Operator);
        expect(rightNode.rightNode.subType).to.equal(Token.SubType.Group);
        expect(rightNode.rightNode.value).to.equal(Token.literal.Subtraction);
        expect(rightNode.rightNode.leftNode.type).to.equal(Token.Type.Value);
        expect(rightNode.rightNode.leftNode.value).to.equal(2);
        expect(rightNode.rightNode.rightNode.type).to.equal(Token.Type.Value);
        expect(rightNode.rightNode.rightNode.value).to.equal(4);
    });

    /* tslint:disable:max-line-length */
    it('should return ast correctly from `6 + 2 * (3 + (4 / 2) * 4 * (2 + (4 + 2 * 6)) * 2)`', () => {
        const data = [
            '6', '+', '2', '*', '(', '3', '+', '(', '4', '/', '2', ')', '*', '4', '*', '(', '2', '+', '(',
            '4', '+', '2', '*', '6', ')', ')', '*', '2', ')'
        ];
        const tokenAnalyzer = new TokenAnalyzer(data);
        tokenAnalyzer.parse();
        const ast = tokenAnalyzer.getAst();
        const leftNode = ast.leftNode;
        const rightNode = ast.rightNode;

        expect(ast.type).to.equal(Token.Type.Operator);
        expect(ast.value).to.equal(Token.literal.Addition);
        expect(leftNode.type).to.equal(Token.Type.Value);
        expect(leftNode.value).to.equal(6);
        expect(rightNode.type).to.equal(Token.Type.Operator);
        expect(rightNode.value).to.equal(Token.literal.Multiplication);
        expect(rightNode.leftNode.type).to.equal(Token.Type.Value);
        expect(rightNode.leftNode.value).to.equal(2);
        expect(rightNode.rightNode.type).to.equal(Token.Type.Operator);
        expect(rightNode.rightNode.subType).to.equal(Token.SubType.Group);
        expect(rightNode.rightNode.value).to.equal(Token.literal.Addition);
        expect(rightNode.rightNode.leftNode.type).to.equal(Token.Type.Value);
        expect(rightNode.rightNode.leftNode.value).to.equal(3);
        expect(rightNode.rightNode.rightNode.type).to.equal(Token.Type.Operator);
        expect(rightNode.rightNode.rightNode.value).to.equal(Token.literal.Multiplication);
        expect(rightNode.rightNode.rightNode.leftNode.type).to.equal(Token.Type.Operator);
        expect(rightNode.rightNode.rightNode.leftNode.value).to.equal(Token.literal.Multiplication);
        expect(rightNode.rightNode.rightNode.leftNode.leftNode.type).to.equal(Token.Type.Operator);
        expect(rightNode.rightNode.rightNode.leftNode.leftNode.value).to.equal(Token.literal.Multiplication);
        expect(rightNode.rightNode.rightNode.leftNode.leftNode.leftNode.type).to.equal(Token.Type.Operator);
        expect(rightNode.rightNode.rightNode.leftNode.leftNode.leftNode.subType).to.equal(Token.SubType.Group);
        expect(rightNode.rightNode.rightNode.leftNode.leftNode.leftNode.value).to.equal(Token.literal.Division);
        expect(rightNode.rightNode.rightNode.leftNode.leftNode.leftNode.leftNode.type).to.equal(Token.Type.Value);
        expect(rightNode.rightNode.rightNode.leftNode.leftNode.leftNode.leftNode.value).to.equal(4);
        expect(rightNode.rightNode.rightNode.leftNode.leftNode.leftNode.rightNode.type).to.equal(Token.Type.Value);
        expect(rightNode.rightNode.rightNode.leftNode.leftNode.leftNode.rightNode.value).to.equal(2);
        expect(rightNode.rightNode.rightNode.leftNode.leftNode.rightNode.type).to.equal(Token.Type.Value);
        expect(rightNode.rightNode.rightNode.leftNode.leftNode.rightNode.value).to.equal(4);
        expect(rightNode.rightNode.rightNode.leftNode.rightNode.type).to.equal(Token.Type.Operator);
        expect(rightNode.rightNode.rightNode.leftNode.rightNode.subType).to.equal(Token.SubType.Group);
        expect(rightNode.rightNode.rightNode.leftNode.rightNode.value).to.equal(Token.literal.Addition);
        expect(rightNode.rightNode.rightNode.leftNode.rightNode.leftNode.type).to.equal(Token.Type.Value);
        expect(rightNode.rightNode.rightNode.leftNode.rightNode.leftNode.value).to.equal(2);
        expect(rightNode.rightNode.rightNode.leftNode.rightNode.rightNode.type).to.equal(Token.Type.Operator);
        expect(rightNode.rightNode.rightNode.leftNode.rightNode.rightNode.subType).to.equal(Token.SubType.Group);
        expect(rightNode.rightNode.rightNode.leftNode.rightNode.rightNode.value).to.equal(Token.literal.Addition);
        expect(rightNode.rightNode.rightNode.leftNode.rightNode.rightNode.leftNode.type).to.equal(Token.Type.Value);
        expect(rightNode.rightNode.rightNode.leftNode.rightNode.rightNode.leftNode.value).to.equal(4);
        expect(rightNode.rightNode.rightNode.leftNode.rightNode.rightNode.rightNode.type).to.equal(Token.Type.Operator);
        expect(rightNode.rightNode.rightNode.leftNode.rightNode.rightNode.rightNode.value).to.equal(Token.literal.Multiplication);
        expect(rightNode.rightNode.rightNode.leftNode.rightNode.rightNode.rightNode.leftNode.type).to.equal(Token.Type.Value);
        expect(rightNode.rightNode.rightNode.leftNode.rightNode.rightNode.rightNode.leftNode.value).to.equal(2);
        expect(rightNode.rightNode.rightNode.leftNode.rightNode.rightNode.rightNode.rightNode.type).to.equal(Token.Type.Value);
        expect(rightNode.rightNode.rightNode.leftNode.rightNode.rightNode.rightNode.rightNode.value).to.equal(6);
        expect(rightNode.rightNode.rightNode.rightNode.type).to.equal(Token.Type.Value);
        expect(rightNode.rightNode.rightNode.rightNode.value).to.equal(2);
    });
    /* tslint:enable:max-line-length */
});

describe('case: parse token with advanced feature', () => {
    it('should return implicit multiplication ast from `2(3 + 4)`', () => {
        const data = ['2', '(', '3', '*', '4', ')'];
        const tokenAnalyzer = new TokenAnalyzer(data);
        tokenAnalyzer.parse();
        const ast = tokenAnalyzer.getAst();

        expect(ast.type).to.equal(Token.Type.Operator);
        expect(ast.value).to.equal(Token.literal.Multiplication);
        expect(ast.leftNode.type).to.equal(Token.Type.Value);
        expect(ast.leftNode.value).to.equal(2);
        expect(ast.rightNode.type).to.equal(Token.Type.Operator);
        expect(ast.rightNode.subType).to.equal(Token.SubType.Group);
        expect(ast.rightNode.value).to.equal(Token.literal.Multiplication);
        expect(ast.rightNode.leftNode.type).to.equal(Token.Type.Value);
        expect(ast.rightNode.leftNode.value).to.equal(3);
        expect(ast.rightNode.rightNode.type).to.equal(Token.Type.Value);
        expect(ast.rightNode.rightNode.value).to.equal(4);
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
        const ast = tokenAnalyzer.getAst();

        expect(ast.type).to.equal(Token.Type.Operator);
        expect(ast.value).to.equal(Token.literal.Multiplication);
        expect(ast.leftNode.type).to.equal(Token.Type.Value);
        expect(ast.leftNode.value).to.deep.equal(customInput);
        expect(ast.rightNode.type).to.equal(Token.Type.Value);
        expect(ast.rightNode.value).to.equal(2);
    });
});

describe('case: parse with invalid data', () => {
    it('should throws an error with tokenInvalidType ', () => {
        const data = ['1', '!', '2'];
        const tokenAnalyzer = new TokenAnalyzer(data);
        expect(() => tokenAnalyzer.parse()).to
            .throw('`!` token is invalid token type')
            .and.satisfy((error: ParserError) => error.parserStack.col === 1 && error.parserStack.line === 0);
    });

    it('should throws an error with invalidTwoOperator ', () => {
        const data = ['1', '+', '+', '4'];
        const tokenAnalyzer = new TokenAnalyzer(data);
        expect(() => tokenAnalyzer.parse()).to
            .throw('two operators `+`, `+` can not come together')
            .and.satisfy((error: ParserError) => error.parserStack.col === 2 && error.parserStack.line === 0);
    });

    it('should throws an error with missingOperator ', () => {
        const data = ['(', '1', '+', '2', ')', '3'];
        const tokenAnalyzer = new TokenAnalyzer(data);

        expect(() => tokenAnalyzer.parse()).to
            .throw('the operator is missing after `)`')
            .and.satisfy((error: ParserError) => error.parserStack.col === 5 && error.parserStack.line === 0);
    });

    it('should throws an error with bracketMustBeOpened ', () => {
        const data = ['2', '+', '3', ')', ')'];
        const tokenAnalyzer = new TokenAnalyzer(data);

        expect(() => tokenAnalyzer.parse()).to
            .throw('missing open bracket, you cannot close the bracket')
            .and.satisfy((error: ParserError) => error.parserStack.col === 3 && error.parserStack.line === 0);
    });

    it('should throws an error with missingOperator ', () => {
        const data = ['(', '(', '1', '+', '2'];
        const tokenAnalyzer = new TokenAnalyzer(data);

        expect(() => tokenAnalyzer.parse()).to
            .throw('missing close bracket, the bracket must be closed')
            .and.satisfy((error: ParserError) => error.parserStack.col === 5 && error.parserStack.line === 0);
    });
});
