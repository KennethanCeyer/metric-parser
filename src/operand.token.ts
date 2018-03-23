export class Token {
    public static readonly Addition = ['+'];
    public static readonly Subtraction = ['-'];
    public static readonly Multiplication = ['x', '*'];
    public static readonly Division = ['/'];
    public static readonly Mod = ['%'];
    public static readonly Pow = ['^'];
    public static readonly Bracket = ['(', ')', '[', ']', '{', '}'];
    public static readonly Operators = [
        ...Token.Addition,
        ...Token.Subtraction,
        ...Token.Multiplication,
        ...Token.Division,
        ...Token.Mod,
        ...Token.Pow
    ];
    public static readonly Symbols = [
        ...Token.Operators,
        ...Token.Bracket
    ];
}