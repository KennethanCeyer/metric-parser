import { expect } from 'chai';
import { Token } from './token';
import { TokenHelper } from './token.helper';

describe('TokenHelper.getPrecedence(token)', () => {
    it('should return 0 with addition, subtraction', () => {
        expect(TokenHelper.getPrecedence(Token.Literal.Addition)).to.equal(0);
        expect(TokenHelper.getPrecedence(Token.Literal.Substraction)).to.equal(0);
    });

    it('should return 1 with multiplication, division', () => {
        expect(TokenHelper.getPrecedence(Token.Literal.Multiplication)).to.equal(1);
        expect(TokenHelper.getPrecedence(Token.Literal.Division)).to.equal(1);
    });

    it('should return 2 with mod, pow', () => {
        expect(TokenHelper.getPrecedence(Token.Literal.Mod)).to.equal(2);
        expect(TokenHelper.getPrecedence(Token.Literal.Pow)).to.equal(2);
    });

    it('should return 3 with brackets', () => {
        expect(TokenHelper.getPrecedence(Token.Literal.BracketOpen)).to.equal(3);
        expect(TokenHelper.getPrecedence(Token.Literal.BracketClose)).to.equal(3);
    });
});

describe('TokenHelper.isHigher(source, target)', () => {
    it('should return false compare multiplication, division', () => {
        expect(TokenHelper.isHigher(Token.Literal.Multiplication, Token.Literal.Division)).to.be.false;
    });
});
