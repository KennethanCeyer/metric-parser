import { ConvertData, ParseData } from './types';
import { TreeModel } from './tree.type';
import { ParserGeneralResult, ParserResult } from './parser/parser.result';
import { BuilderHelper } from './builder.helper';
import { ParserHelper } from './parser/parser.helper';
import { TokenAnalyzer } from './token/token.analyzer';
import { ErrorValue } from './error.value';
import { BuilderMessage } from './builder.message';
import { ParserError } from './error';

export class Builder extends BuilderMessage {
    public constructor(private data: ConvertData) {
        super();
    }

    build() {
        try {
            return this.tryBuild();
        } catch (error) {
            return this.handleError(error);
        }
    }


    parse(data: ParseData, pos = 0): ParserResult<TreeModel> {
        const tokenAnalyzer = new TokenAnalyzer(ParserHelper.getArray(data));
        const parseData = tokenAnalyzer.parse();

        return this.makeData(parseData);
    }

    unparse(data: TreeModel): ParserGeneralResult {
        return this.makeData(null);
    }

    private tryBuild() {
        if (BuilderHelper.needParse(this.data))
            return this.parse(this.data as ParseData);

        if (BuilderHelper.needUnparse(this.data))
            return this.unparse(this.data as TreeModel);
    }

    private handleError(error: ParserError): ParserResult<string> {
        return this.makeError(error);
    }
}
