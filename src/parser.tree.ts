export interface ParserTree {
    operator: string;
    operand1: Operand | ParserTree;
    operand2: Operand | ParserTree;
}

export interface Operand {
    value: OperandValue;
}

export interface OperandValue {
    type: string;
    item?: OperandItemValue;
    unit?: string | number;
}

export interface OperandItemValue {
    table: string;
    key: string;
    name: string;
    oper: string;
}