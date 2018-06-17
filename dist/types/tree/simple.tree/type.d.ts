export declare type Node = Tree | Operand;
export interface Tree {
    operator: string;
    operand1: Node;
    operand2: Node;
}
export interface Operand {
    value: ValueObject;
}
export interface ValueObject {
    type: string;
    item?: ItemValue;
    unit?: UnitValue;
}
export declare type Value = ItemValue | UnitValue;
export declare type ItemValue = any;
export declare type UnitValue = string | number;
