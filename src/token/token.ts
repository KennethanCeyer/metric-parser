import Literal = Token.literal;

export namespace Token {
    export type Token = string | number | any;
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
        Unknown,
        Value,
        Dot,
        Operator,
        Bracket,
        Function,
        WhiteSpace,
        CompareToken
    }

    export enum SubType {
        Group
    }

    export const literal = {
        Addition: '+',
        Subtraction: '-',
        Multiplication: '*',
        MultiplicationLiteral: 'x',
        Division: '/',
        Mod: '%',
        Pow: '^',
        BracketOpen: '(',
        BracketClose: ')',
        Dot: '.'
    }

    export const addition = [literal.Addition];
    export const subtraction = [literal.Subtraction];
    export const multiplication = [literal.Multiplication, literal.MultiplicationLiteral];
    export const division = [literal.Division];
    export const mod = [literal.Mod];
    export const pow = [literal.Pow];
    export const bracketOpen = literal.BracketOpen;
    export const bracketClose = literal.BracketClose
    export const bracket = [ Token.bracketOpen, Token.bracketClose];
    export const precedence = [
        ...Token.addition,
        ...Token.subtraction,
        ...Token.multiplication,
        ...Token.division,
        ...Token.pow,
        ...Token.mod,
        ...Token.bracket,
    ];
    export const operators = [
        ...Token.addition,
        ...Token.subtraction,
        ...Token.multiplication,
        ...Token.division,
        ...Token.mod,
        ...Token.pow
    ];
    export const symbols = [
        ...Token.operators,
        ...Token.bracket
    ];
    export const whiteSpace = [
        ' ',
        '',
        null,
        undefined,
    ];
}
