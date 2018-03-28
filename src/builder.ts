import { Tree } from './tree/simple.tree/type';
import { ParserGeneralResult, ParserResult } from './parser/parser.result';
import { BuilderHelper } from './builder.helper';
import { ParserHelper } from './parser/parser.helper';
import { TokenAnalyzer } from './token/token.analyzer';
import { BuilderMessage } from './builder.message';
import { ParserError } from './error';
import { TreeBuilder } from './tree/simple.tree/builder';
import { BuilderError } from './builder.error';
import { ConvertData, ParseData } from './metric.parser';

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

    private parse(data: ParseData): ParserResult<Tree> {
        const tokenAnalyzer = new TokenAnalyzer(ParserHelper.getArray(data));
        const parseData = tokenAnalyzer.parse();

        return this.makeData(parseData);
    }

    private unparse(data: Tree): ParserGeneralResult {
        const treeBuilder = new TreeBuilder();
        const ast = treeBuilder.makeAst(data);
        return this.makeData(ast.expression);
    }

    private tryBuild() {
        if (!this.data)
            throw new ParserError(BuilderError.emptyData);


        if (BuilderHelper.needParse(this.data))
            return this.parse(<ParseData>this.data);

        if (BuilderHelper.needUnparse(this.data))
            return this.unparse(<Tree>this.data);
    }

    private handleError(error: ParserError): ParserResult<string> {
        return this.makeError(error);
    }
}
