import { ParserGeneralResult } from './parser/parser.result';
import { Builder } from './builder/builder';
import { Tree } from './tree/simple.tree/type';
import { ParseData } from './parser/parser';
import { TreeBuilder } from './tree/simple.tree/builder';
import { success } from './error';

const _MODULE_VERSION_ = '0.0.5';

export function getVersion() {
    return _MODULE_VERSION_;
}

export function convert(data: ParseData | Tree): ParserGeneralResult {
    const builder = new Builder(new TreeBuilder());
    return builder.build(data);
}

export function valid(data: ParseData | Tree): boolean {
    const builder = new Builder(new TreeBuilder());
    return builder.build(data).code === success;
}
