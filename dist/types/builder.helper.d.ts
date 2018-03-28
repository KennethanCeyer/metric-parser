import { Operand, Tree } from './tree/simple.tree/type';
export declare class BuilderHelper {
    static isOperand(data: Tree | Operand): boolean;
    static isTree(value: any): boolean;
    static needParse(value: any): boolean;
    static needUnparse(value: any): boolean;
}
