import { AbstractSyntaxTree } from '../ast';
import { TreeBuilderInterface } from './tree.interface';
export declare abstract class TreeBuilderBase<T> implements TreeBuilderInterface<T> {
    protected ast: AbstractSyntaxTree;
    constructor(ast: AbstractSyntaxTree);
    makeTree(ast: AbstractSyntaxTree): T;
}
