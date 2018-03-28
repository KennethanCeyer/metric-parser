import { AbstractSyntaxTree } from '../ast';
import { TreeBuilderInterface } from './tree.interface';

export abstract class TreeBuilderBase<T> implements TreeBuilderInterface<T> {
    constructor(protected ast: AbstractSyntaxTree) {
    }

    public makeTree(ast: AbstractSyntaxTree): T {
        throw new Error('method not implemented.');
    }
}
