import { AbstractSyntaxTree } from '../ast';
import { TreeBuilderInterface } from './tree.interface';

export abstract class TreeBuilderBase<T> implements TreeBuilderInterface<T> {
    public makeTree(ast: AbstractSyntaxTree): T {
        throw new Error('method not implemented.');
    }

    public makeAst(tree: T): AbstractSyntaxTree {
        throw new Error('method not implemented.');
    }
}
