import { AbstractSyntaxTree } from '../ast/ast';
import { TreeBuilderInterface } from './tree.interface';
import { GeneralError } from '../error.value';
import { ParserError } from '../error';

export abstract class TreeBuilderBase<T> implements TreeBuilderInterface<T> {
    public makeTree(ast: AbstractSyntaxTree): T {
        throw new ParserError(GeneralError.methodNotImplemented);
    }

    public makeAst(tree: T): AbstractSyntaxTree {
        throw new ParserError(GeneralError.methodNotImplemented);
    }
}
