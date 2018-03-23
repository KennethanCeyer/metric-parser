export type OperandWrapper = Operand | ParserTree;

export interface ParserTree {
    operator: string;
    operand1: OperandWrapper;
    operand2: OperandWrapper;
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