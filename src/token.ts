import Literal = Token.Literal;

export namespace Token {
    export type Token = string | number;
    export type Addition = '+';
    export type Subtraction = '-';
    export type Multiplication = '*';
    export type MultiplicationLiteral = 'x';
    export type Division = '/';
    export type Mod = '%';
    export type Pow = '^';
    export type BracketOpen = '(';
    export type BracketClose = ')';
    export type Operator = Addition | Subtraction | Multiplication | MultiplicationLiteral | Division | Mod | Pow;

    export enum Type {
        Value,
        Operator,
        Bracket,
        Function,
        WhiteSpace,
        CompareToken
    }

    export enum SubType {
        Group
    }

    export const Literal = {
        Addition: '+',
        Substraction: '-',
        Multiplication: '*',
        MultiplicationLiteral: 'x',
        Division: '/',
        Mod: '%',
        Pow: '^',
        BracketOpen: '(',
        BracketClose: ')'
    }

    export const Addition = [ Literal.Addition ];
    export const Subtraction = [ Literal.Substraction ];
    export const Multiplication = [ Literal.Multiplication, Literal.MultiplicationLiteral ];
    export const Division = [ Literal.Division ];
    export const Mod = [ Literal.Mod ];
    export const Pow = [ Literal.Pow ];
    export const BracketOpen = Literal.BracketOpen;
    export const BracketClose = Literal.BracketClose
    export const Bracket = [ Token.BracketOpen, Token.BracketClose ];
    export const Precedence = [
        ...Token.Addition,
        ...Token.Subtraction,
        ...Token.Multiplication,
        ...Token.Division,
        ...Token.Pow,
        ...Token.Mod,
        ...Token.Bracket,
    ];
    export const Operators = [
        ...Token.Addition,
        ...Token.Subtraction,
        ...Token.Multiplication,
        ...Token.Division,
        ...Token.Mod,
        ...Token.Pow
    ];
    export const Symbols = [
        ...Token.Operators,
        ...Token.Bracket
    ];
    export const WhiteSpace = [
        ' ',
        '',
        null,
        undefined,
    ];
}
