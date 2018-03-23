import { FormulaData } from './types';
import { Token } from './operand.token';
import { ParserBuilder } from './parser.builder';

export namespace Formula {
    export class Parser {
        private _formula: FormulaData;

        public constructor(formula: FormulaData) {
            this._formula = formula;

            return new ParserBuilder(this._formula).build();
        }

        getVersion = function () {
            return _PLUGIN_VERSION_;
        };

        inArray = function (item, array) {
            for (var idx in array) if (array[idx] === item) return idx;
            return -1;
        };

        isOperand = function (item) {
            return typeof item === 'object' || this.isNumeric(item);
        };

        getOperatorPriority = function (operator) {
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
        };

        isNumeric = function (n) {
            return (/\d+(\.\d*)?|\.\d+/).test(n);
        };

        stringToArray = function (s) {
            var data = [];
            var dataSplited = s.split('');
            var dataSplitedLen = dataSplited.length;
            for (var idx = 0; idx < dataSplitedLen; idx++) {
                var item = dataSplited[idx];
                if (this.inArray(item, this.Units) !== -1 || this.isOperand(item) === true) {
                    if (idx > 0 && this.isOperand(item) === true && this.isOperand(data[data.length - 1]) === true) {
                        data[data.length - 1] += item.toString();
                    } else {
                        data.push(item);
                    }
                }
            }
            return data;
        };
    }
}