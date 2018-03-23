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
    }
}