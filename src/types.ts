import {TreeModel} from "./tree.type";

export type ConvertData = ParseData | UnparseData;

export type ParseData = string | string[];

export type UnparseData = TreeModel;
