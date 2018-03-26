import {ParseTree} from "./parser.tree";

export type FormulaData = FormulaParseData | FormulaUnparseData;

export type FormulaParseData = string | string[];

export type FormulaUnparseData = ParseTree;