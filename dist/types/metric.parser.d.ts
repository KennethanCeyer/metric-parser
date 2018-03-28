import { ParserGeneralResult } from './parser/parser.result';
import { Tree } from './tree/simple.tree/type';
export declare type ConvertData = ParseData | UnparseData;
export declare type ParseData = string | string[];
export declare type UnparseData = Tree;
export declare function convert(formula: ConvertData): ParserGeneralResult;
export declare function getVersion(): string;
