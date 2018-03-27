import {ParserTreeModel} from "./parser.tree.type";

export type FormulaData = FormulaParseData | FormulaUnparseData;

export type FormulaParseData = string | string[];

export type FormulaUnparseData = ParserTreeModel;
