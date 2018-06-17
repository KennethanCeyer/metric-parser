import { AbstractSyntaxTree } from '../ast/ast';
import { TreeBuilderInterface } from './tree.interface';
export declare abstract class TreeBuilderBase<T> implements TreeBuilderInterface<T> {
    makeTree(ast: AbstractSyntaxTree): T;
    makeAst(tree: T): AbstractSyntaxTree;
}
