import { Operand, Tree } from './tree/simple.tree/type';
import { TokenHelper } from './token/token.helper';

export class BuilderHelper {
    public static isOperand(data: Tree | Operand) {
        return !!(data as Operand).value;
    }

    public static isTree(value: any) {
        return TokenHelper.isObject(value) && !TokenHelper.isArray(value);
    }

    public static needParse(value: any) {
        return !BuilderHelper.isTree(value);
    }

    public static needUnparse(value: any) {
        return BuilderHelper.isTree(value);
    }
}
