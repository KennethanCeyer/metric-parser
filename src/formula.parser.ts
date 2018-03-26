import { FormulaData } from './types';
import { ParserBuilder } from './parser.builder';
import { ParserDefaultResult } from './parser.result';

const _PLUGIN_VERSION_ = '1.0.0';

export namespace Formula {
    export class Parser {
        private _builder: ParserBuilder;
        public result: ParserDefaultResult;

        public constructor(formula: FormulaData) {
            this._builder = new ParserBuilder(formula);
            this.result = this._builder.build();
        }

        getVersion() {
            return _PLUGIN_VERSION_;
        }
    }
}
