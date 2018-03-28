import { Builder } from './builder';
import { ParserGeneralResult } from './parser/parser.result';

const _PLUGIN_VERSION_ = '0.0.2';import { Tree } from './tree/simple.tree/type';

export type ConvertData = ParseData | UnparseData;

export type ParseData = string | string[];

export type UnparseData = Tree;

export function convert(formula: ConvertData): ParserGeneralResult {
    const builder = new Builder(formula);
    return builder.build();
}

export function getVersion() {
    return _PLUGIN_VERSION_;
}
