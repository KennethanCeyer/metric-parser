import { Operand, TreeModel } from './tree.type';
export declare class BuilderHelper {
    static isOperand(data: TreeModel | Operand): boolean;
    static isTree(value: any): boolean;
    static needParse(value: any): boolean;
    static needUnparse(value: any): boolean;
}
