import { FormulaData } from './types';
import { ParserProcess } from './parser.process';
import { LoggerMessage } from './logger.message';
import { LoggerCode } from './logger.code';
import { LoggerHelper } from './logger.helper';
import { Operand, OperandItemValue, OperandUnitValue, OperandValue, OperandWrapper, ParserTree } from './parser.tree';
import { ParserResult } from './parser.result';

export class ParserBuilder {
    private _formula: FormulaData;

    private static isOperand(data: ParserTree | Operand) {
        return !!(data as Operand).value;
    }

    private static isNumeric(value: string | number) {
        return (/\d+(\.\d*)?|\.\d+/).test(value);
    };

    private isString() {
        return typeof this._formula === 'string';
    }

    private isArray() {
        return Array.isArray(this._formula);
    }

    private isObject() {
        return typeof this._formula === 'object';
    }

    private isParseTree() {
        return this.isObject() && !this.isArray();
    }

    private needParse() {
        return !this.isParseTree();
    }

    private needUnparse() {
        return this.isParseTree();
    }

    public constructor(formula: FormulaData) {
        this._formula = formula;
    }

    build() {
        if (!this._formula)
            return LoggerHelper.getMessage(LoggerCode.Invalid, {
                process: ParserProcess.Initialize,
                line: 0,
                col: 0
            });

        if (this.needParse())
            return this.search();

        if (this.needUnparse())
            return this.collapse();
    }

    getOperatorPriority(operator) {
        if (this.inArray(operator, this.Operators) === -1) {
            return -1;
        } else {
            var priority = -1;
            for (var idx = 0; idx < this.OperandPriority.length; idx++) {
                if (this.inArray(operator, this.OperandPriority[idx]) !== -1) {
                    priority = idx;
                    break;
                }
            }
            return priority;
        }
    }

    layerParser(data, pos, depth) {
        var innerDepth = 0;
        var startPos = [], endPos = [];
        var currentParser = this.ParserMap.LayerParser;
        var totalLength = data.length;

        depth = depth || 0;

        if (typeof data === 'object' && data.length === 1) {
            return {
                status: true,
                data: data[0],
                length: 1
            };
        }

        for (var idx = 0; idx < data.length; idx++) {
            var item = data[idx];
            if (item === '(') {
                innerDepth++;
                startPos[innerDepth] = idx + 1;
            } else if (item === ')') {
                if (innerDepth < 1) {
                    return this.log(0x05, {
                        stack: currentParser,
                        col: startPos.length > 0 ? startPos[startPos.length - 1] : 0
                    });
                }

                if (innerDepth === 1) {
                    var paramData = [];
                    endPos[innerDepth] = idx - 1;

                    for (var j = startPos[innerDepth]; j <= endPos[innerDepth]; j++) {
                        paramData.push(data[j]);
                    }

                    var result = this.search(paramData, pos + startPos[innerDepth] + 1, depth + 1);

                    if (result.status === false) {
                        return result;
                    } else {
                        var length = result.length;
                        if (typeof result.data === 'object' && typeof result.data[0] !== 'object' && result.data.length === 1) {
                            result.data = result.data[0];
                        }
                        data.splice(startPos[innerDepth] - 1, length + 2, result.data);
                        idx -= length + 1;
                    }
                }
                innerDepth--;
            }
        }

        if (innerDepth > 0) {
            return this.log(0x06, {
                stack: currentParser,
                col: data.length || -1
            });
        }

        return {
            status: true,
            depth: depth,
            length: totalLength || -1
        };
    }

    syntaxParser(data, pos, depth, length, operators) {
        this.currentParser = this.ParserMap.SyntaxParser;

        data = data || [];
        pos = pos || 0;

        var cursor = pos;

        if (
            typeof data[0] !== 'undefined' &&
            data[0] !== null &&
            typeof data[0][0] === 'object' &&
            (
                typeof data[0].operator === 'undefined' ||
                data[0].operator === null
            )
        ) {
            data[0] = data[0][0];
        }

        if (data.length < 3) {
            if (typeof data === 'object' && data.length === 1) {
                return data[0];
            } else {
                return this.log(0x01, {
                    stack: this.currentParser,
                    col: pos + (typeof data[0] === 'object' ? data[0].length : 0) + 1
                }, [3]);
            }
        }

        if (typeof data.length !== 'undefined') {
            if (data.length > 1) {
                for (var idx = 0; idx < data.length; idx++) {
                    cursor = idx + pos;
                    var item = data[idx];
                    if (this.inArray(item, this.Operators) === -1 && ParserBuilder.isOperand(item) === false) {
                        return this.log(0x02, {
                            stack: this.currentParser,
                            col: cursor
                        }, [item]);
                    }

                    if (this.inArray(item, operators) !== -1) {
                        if (ParserBuilder.isOperand(data[idx - 1]) === false) {
                            return this.log(0x03, {
                                stack: this.currentParser,
                                col: cursor - 1
                            });
                        }

                        if (ParserBuilder.isOperand(data[idx + 1]) === false) {
                            return this.log(0x04, {
                                stack: this.currentParser,
                                col: cursor + 1
                            });
                        }

                        if (typeof data[idx - 1] === 'object' && data[idx - 1].length === 1) {
                            data[idx - 1] = data[idx - 1][0];
                        }

                        if (typeof data[idx + 1] === 'object' && data[idx + 1].length === 1) {
                            data[idx + 1] = data[idx + 1][0];
                        }

                        data.splice(idx - 1, 3, {
                            operator: item,
                            operand1: data[idx - 1],
                            operand2: data[idx + 1],
                            length: length
                        });

                        if (typeof data[idx - 1][0] === 'object') {
                            data[idx - 1] = data[idx - 1][0];
                        }

                        idx--;
                    }
                }
            }
        }

        return {
            status: true,
            data: data
        };
    }

    getOperandValue(operandValue: OperandValue): OperandItemValue | OperandUnitValue {
        return (operandValue.type || '').toUpperCase() === 'UNIT'
            ? operandValue.unit
            : operandValue.item;
    }

    getOperand(operand: OperandWrapper) {
        const operandObject = operand as Operand;
        return operandObject.value
            ? this.getOperandValue(operandObject.value)
            : operand;
    }

    validateParseTree(data: OperandWrapper, line: number, col: number) {
        if (ParserBuilder.isOperand(data))
            return LoggerHelper.getMessage();

        const tree = data as ParserTree;
        if (!tree.operator)
            return LoggerHelper.getMessage(LoggerCode.InvalidOperatorKey, {
                line,
                col,
                process: ParserProcess.String
            });

        if (!tree.operand1)
            return LoggerHelper.getMessage(LoggerCode.InvalidLeftOperand, {
                line,
                col,
                process: ParserProcess.String
            });

        if (!tree.operand2)
            return LoggerHelper.getMessage(LoggerCode.InvalidRightOperand, {
                line,
                col,
                process: ParserProcess.String
            });
    }

    parseTree(data: OperandWrapper, line = 0,  col = 0): ParserResult<(OperandItemValue | OperandUnitValue)[]> {
        this.validateParseTree(data, line, col);

        if (!ParserBuilder.isOperand(data))
            return {
                code: LoggerCode.Success,
                data: [this.getOperandValue((data as Operand).value)]
            };

        var params = ['operand1', 'operator', 'operand2'];
        for (var idx = 0; idx < params.length; idx++) {
            var param = params[idx];
            if (typeof data[param] === 'object') {
                var result = _this.parseTree(data[param], col + idx);
                if (result.status === false) {
                    return result;
                } else {
                    formula = formula.concat(result.data);
                    if (typeof data.operator !== 'undefined' && data.operator !== null && typeof result.operator !== 'undefined' && result.operator !== null) {
                        if (this.getOperatorPriority(data.operator) < this.getOperatorPriority(result.operator) && this.getOperatorPriority(data.operator) !== -1) {
                            formula.splice([formula.length - 3], 0, '(');
                            formula.splice([formula.length], 0, ')');
                        }
                    }
                }
            } else {
                formula.push(data[param]);
            }
        }

        return {
            status: true,
            data: formula,
            operator: depth > 0 ? data.operator : undefined
        };
    }

    parse(data: FormulaData, pos = 0) {
        if (typeof data === 'string') {
            data = this.stringToArray(data);
        }

        var result = null;
        var len = this.OperandPriority.length + 1;
        var parserLength = 0;
        var parserComplete = function () {
            if (depth === 0) {
                data = _super.filterParser(data);
            }

            return {
                status: true,
                data: data,
                length: depth === 0 ? undefined : parserLength
            };
        };

        for (var i = 0; i < len; i++) {
            if (result !== null && typeof result.data !== 'undefined' && result.data.length === 1) {
                return parserComplete.call();
            }

            if (i === 0) {
                result = this.layerParser(data, pos, depth);
                parserLength = result.length;
            } else {
                result = this.syntaxParser(data, pos, depth, parserLength, this.OperandPriority[i - 1]);
            }

            if (result.status === false) {
                return result;
            } else if (i + 1 === len) {
                return parserComplete.call();
            }
        }
    }

    unparse(data: ParserTree): ParserResult<> {
        const result = this.parseTree(data);
        return {
            status: true,
            data: result.data
        };
    }
}