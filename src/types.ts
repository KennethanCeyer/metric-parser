import {TreeModel} from "./tree.type";

export type FormulaData = FormulaParseData | FormulaUnparseData;

export type FormulaParseData = string | string[];

export type FormulaUnparseData = TreeModel;
