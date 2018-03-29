import { ParserGeneralResult } from './parser/parser.result';
import { Tree } from './tree/simple.tree/type';
import { ParseData } from './parser/parser';
export declare function convert(data: ParseData | Tree): ParserGeneralResult;
export declare function getVersion(): string;
