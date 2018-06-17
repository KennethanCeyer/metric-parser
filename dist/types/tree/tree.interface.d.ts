import { AbstractSyntaxTree } from '../ast/ast';
export interface TreeBuilderInterface<T> {
    makeTree(ast: AbstractSyntaxTree): T;
    makeAst(tree: T): AbstractSyntaxTree;
}
