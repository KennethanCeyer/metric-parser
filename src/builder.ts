import { FormulaData, FormulaParseData } from './types';
import { LoggerCode } from './logger/logger.code';
import { TreeModel } from './tree.type';
import { ParserDefaultResult, ParserResult } from './parser/parser.result';
import { BuilderHelper } from './builder.helper';
import { ParserHelper } from './parser/parser.helper';
import { TokenAnalyzer } from './token/token.analyzer';

export class Builder {
    private _formula: FormulaData;

    public constructor(formula: FormulaData) {
        this._formula = formula;
    }

    build() {
        if (BuilderHelper.needParse(this._formula))
            return this.parse(this._formula as FormulaParseData);

        if (BuilderHelper.needUnparse(this._formula))
            return this.unparse(this._formula as TreeModel);
    }


    parse(data: FormulaParseData, pos = 0): ParserResult<TreeModel> {
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
