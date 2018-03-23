import { Token } from './operand.token';

export var Priority = [
    [Token.Mod, Token.Pow],
    [Token.Multiplication, Token.Division],
    [Token.Addition, Token.Subtraction]
]