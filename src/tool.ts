import { ParserGeneralResult } from './parser/parser.result';
import { Builder } from './builder';
import { Tree } from './tree/simple.tree/type';
import { ParseData } from './parser/parser';
import { TreeBuilder } from './tree/simple.tree/builder';

const _MODULE_VERSION_ = '0.0.4';

export function convert(data: ParseData | Tree): ParserGeneralResult {
    const builder = new Builder(new TreeBuilder());
    return builder.build(data);
}

export function getVersion() {
    return _MODULE_VERSION_;
}
