import { ParserGeneralResult } from './parser/parser.result';
import { BuilderMessage } from './builder.message';
import { ConvertData } from './metric.parser';
export declare class Builder extends BuilderMessage {
    private data;
    constructor(data: ConvertData);
    build(): ParserGeneralResult;
    private parse(data);
    private unparse(data);
    private tryBuild();
    private handleError(error);
}
