import { expect } from 'chai';
import { Token } from './token';
import { TokenHelper } from './token.helper';

describe('test method: TokenHelper.getPrecedence()', () => {
    it('should return 0 with addition', () => {
        expect(TokenHelper.getPrecedence(Token.literal.Addition)).to.equal(0);
    });

    it('should return 0 with subtraction', () => {
        expect(TokenHelper.getPrecedence(Token.literal.Subtraction)).to.equal(0);
    });

    it('should return 1 with multiplication', () => {
        expect(TokenHelper.getPrecedence(Token.literal.Multiplication)).to.equal(1);
    });
    it('should return 1 with division', () => {
        expect(TokenHelper.getPrecedence(Token.literal.Division)).to.equal(1);
    });

    it('should return 2 with mod', () => {
        expect(TokenHelper.getPrecedence(Token.literal.Mod)).to.equal(2);
    });

    it('should return 2 with pow', () => {
        expect(TokenHelper.getPrecedence(Token.literal.Pow)).to.equal(2);
    });

    it('should return 3 with bracket open', () => {
        expect(TokenHelper.getPrecedence(Token.literal.BracketOpen)).to.equal(3);
    });

    it('should return 3 with bracket close', () => {
        expect(TokenHelper.getPrecedence(Token.literal.BracketClose)).to.equal(3);
    });
});
