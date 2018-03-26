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

    export const Addition = ['+'];
    export const Subtraction = ['-'];
    export const Multiplication = ['x', '*'];
    export const Division = ['/'];
    export const Mod = ['%'];
    export const Pow = ['^'];
    export const BracketOpen = '(';
    export const BracketClose = ')';
    export const Bracket = [ Token.BracketOpen, Token.BracketClose ];
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
