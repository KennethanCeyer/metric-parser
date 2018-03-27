import { ConvertData, ParseData } from './types';
import { LoggerCode } from './logger/logger.code';
import { TreeModel } from './tree.type';
import { ParserDefaultResult, ParserResult } from './parser/parser.result';
import { BuilderHelper } from './builder.helper';
import { ParserHelper } from './parser/parser.helper';
import { TokenAnalyzer } from './token/token.analyzer';

export class Builder {
    public constructor(private data: ConvertData) {
    }

    build() {
        if (BuilderHelper.needParse(this.data))
            return this.parse(this.data as ParseData);

        if (BuilderHelper.needUnparse(this.data))
            return this.unparse(this.data as TreeModel);
    }


    parse(data: ParseData, pos = 0): ParserResult<TreeModel> {
        const parserToken = new TokenAnalyzer(ParserHelper.getArray(data));
        const parseData = parserToken.parse();

        if (!parseData)
            return parserToken.getLastError();

        return {
            code: LoggerCode.Success,
            data: parseData
        };
    }

    unparse(data: TreeModel): ParserDefaultResult {
        // const result = this.parseTree(result);
        return {
            code: LoggerCode.Success,
            data: null // result.result
        };
    }
}
