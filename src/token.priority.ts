import { Token } from './token';

export var TokenPriority = [
    [Token.Mod, Token.Pow],
    [Token.Multiplication, Token.Division],
    [Token.Addition, Token.Subtraction]
]