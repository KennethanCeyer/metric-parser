import { ConvertData, ParseData } from './types';
import { Tree } from './tree/simple.tree/type';
import { ParserGeneralResult, ParserResult } from './parser/parser.result';
import { BuilderMessage } from './builder.message';
export declare class Builder extends BuilderMessage {
    private data;
    constructor(data: ConvertData);
    build(): ParserGeneralResult;
    parse(data: ParseData, pos?: number): ParserResult<Tree>;
    unparse(data: Tree): ParserGeneralResult;
    private tryBuild();
    private handleError(error);
}
