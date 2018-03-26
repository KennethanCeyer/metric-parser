import { Operand, ParseTree } from './parser.tree';
import { TokenHelper } from './token.helper';

export class ParserTypeHelper {
    public static isOperand(data: ParseTree | Operand) {
        return !!(data as Operand).value;
    }

    public static isParseTree(value: any) {
        return TokenHelper.isObject(value) && !TokenHelper.isArray(value);
    }

    public static needParse(value: any) {
        return !ParserTypeHelper.isParseTree(value);
    }

    public static needUnparse(value: any) {
        return ParserTypeHelper.isParseTree(value);
    }
}
