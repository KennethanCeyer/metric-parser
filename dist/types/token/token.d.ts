export declare namespace Token {
    type Token = string | number | any;
    type Addition = '+';
    type Subtraction = '-';
    type Multiplication = '*';
    type MultiplicationLiteral = 'x';
    type Division = '/';
    type Mod = '%';
    type Pow = '^';
    type BracketOpen = '(';
    type BracketClose = ')';
    type Operator = Addition | Subtraction | Multiplication | MultiplicationLiteral | Division | Mod | Pow;
    enum Type {
        Unknown = 0,
        Value = 1,
        Operator = 2,
        Bracket = 3,
        Function = 4,
        WhiteSpace = 5,
        CompareToken = 6,
    }
    enum SubType {
        Group = 0,
    }
    const literal: {
        Addition: string;
        Subtraction: string;
        Multiplication: string;
        MultiplicationLiteral: string;
        Division: string;
        Mod: string;
        Pow: string;
        BracketOpen: string;
        BracketClose: string;
    };
    const addition: string[];
    const subtraction: string[];
    const multiplication: string[];
    const division: string[];
    const mod: string[];
    const pow: string[];
    const bracketOpen: string;
    const bracketClose: string;
    const bracket: string[];
    const precedence: string[];
    const operators: string[];
    const symbols: string[];
    const whiteSpace: string[];
}
