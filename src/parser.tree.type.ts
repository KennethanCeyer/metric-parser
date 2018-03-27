import { Token } from './token';

export type ParserTreeValueWrapper = Operand | ParserTreeModel;

export interface ParserTreeModel {
    operator: string;
    operand1: ParserTreeValueWrapper;
    operand2: ParserTreeValueWrapper;
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
