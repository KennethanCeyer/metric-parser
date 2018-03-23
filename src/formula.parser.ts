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

        getVersion() {
            return _PLUGIN_VERSION_;
        }
    }
}