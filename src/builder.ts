import { FormulaData, FormulaParseData } from './types';
import { ParserProcess } from './parser/parser.process.type';
import { LoggerCode } from './logger/logger.code';
import { LoggerHelper } from './logger/logger.helper';
import { Operand, OperandItemValue, OperandUnitValue, OperandValue, TreeWrapper, TreeModel } from './tree.type';
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

    /*
    parseTree(result: TreeWrapper, line = 0,  col = 0): ParserResult<(OperandItemValue | OperandUnitValue)[]> {
        this.validateParseTree(result, line, col);

        if (!BuilderHelper.isOperand(result))
            return {
                code: LoggerCode.Success,
                result: [this.getOperandValue((result as Operand).value)]
            };

        var params = ['operand1', 'operator', 'operand2'];
        for (var idx = 0; idx < params.length; idx++) {
            var param = params[idx];
            if (typeof result[param] === 'object') {
                var result = _this.parseTree(result[param], col + idx);
                if (result.status === false) {
                    return result;
                } else {
                    formula = formula.concat(result.result);
                    if (typeof result.operator !== 'undefined' && result.operator !== null && typeof result.operator !== 'undefined' && result.operator !== null) {
                        if (this.getOperatorPriority(result.operator) < this.getOperatorPriority(result.operator) && this.getOperatorPriority(result.operator) !== -1) {
                            formula.splice([formula.length - 3], 0, '(');
                            formula.splice([formula.length], 0, ')');
                        }
                    }
                }
            } else {
                formula.push(result[param]);
            }
        }

        return {
            status: true,
            result: formula,
            operator: depth > 0 ? result.operator : undefined
        };
    }
    */

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
