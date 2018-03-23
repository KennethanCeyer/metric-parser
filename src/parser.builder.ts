import { FormulaData } from './types';
import { ParserProcess } from './parser.process';
import { LoggerMessage } from './logger.message';
import { LoggerCode } from './logger.code';
import { LoggerHelper } from './logger.helper';

export class ParserBuilder {
    private _formula: FormulaData;

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
        depth = depth || 0;

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
                    if (this.inArray(item, this.Operators) === -1 && this.isOperand(item) === false) {
                        return this.log(0x02, {
                            stack: this.currentParser,
                            col: cursor
                        }, [item]);
                    }

                    if (this.inArray(item, operators) !== -1) {
                        if (this.isOperand(data[idx - 1]) === false) {
                            return this.log(0x03, {
                                stack: this.currentParser,
                                col: cursor - 1
                            });
                        }

                        if (this.isOperand(data[idx + 1]) === false) {
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

    filterParser (data) {
        if (typeof data.operand1 === 'object') {
            this.filterParser(data.operand1);
        }

        if (typeof data.operand2 === 'object') {
            this.filterParser(data.operand2);
        }

        if (typeof data.length !== 'undefined') {
            delete data.length;
        }

        if (typeof data === 'object' && data.length === 1) {
            data = data[0];
        }

        return data;
    }

    stringParser(data: FormulaData, depth = 0, pos = 0) {
        if (typeof data.value === 'undefined' || data.value === null) {
            if (typeof data.operator === 'undefined' || data.operator === null) {
                return this.log(0x20, {
                    stack: this.currentParser,
                    col: pos,
                    depth: depth
                });
            } else if (typeof data.operand1 === 'undefined' || data.operand1 === null) {
                return this.log(0x21, {
                    stack: this.currentParser,
                    col: pos,
                    depth: depth
                });
            } else if (typeof data.operand2 === 'undefined' || data.operand2 === null) {
                return this.log(0x22, {
                    stack: this.currentParser,
                    col: pos,
                    depth: depth
                });
            }
        } else {
            return {
                status: true,
                data: ((data.value.type === 'unit') ? data.value.unit : data.value)
            };
        }

        var params = ['operand1', 'operator', 'operand2'];
        for (var idx = 0; idx < params.length; idx++) {
            var param = params[idx];
            if (typeof data[param] === 'object') {
                var result = _this.stringParser(data[param], depth + 1, pos + idx);
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

    parse(data, pos, depth) {
        var _super = this;
        pos = pos || 0;
        depth = depth || 0;

        if (typeof data === 'string' && depth < 1) {
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
                length: depth === 0 ? undefined : parserLength,
                depth: depth === 0 ? undefined : depth
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

    unparse(data) {
        const result = this.stringParser(data);
        return {
            status: true,
            data: result.data
        };
    }
}