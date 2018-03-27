export type TreeWrapper = Operand | TreeModel;

export interface TreeModel {
    operator: string;
    operand1: TreeWrapper;
    operand2: TreeWrapper;
}

export interface Operand {
    value: OperandValue;
}

export interface OperandValue {
    type: string;
    item?: OperandItemValue;
    unit?: OperandUnitValue;
}

export interface OperandItemValue {
    table: string;
    key: string;
    name: string;
    oper: string;
}

export type OperandUnitValue = string | number;
