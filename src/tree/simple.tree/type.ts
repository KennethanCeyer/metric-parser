export type Node = Tree | Operand;

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

export type Value  = ItemValue | UnitValue;

export type ItemValue = any;

export type UnitValue = string | number;
