import { AbstractSyntaxTree } from '../ast';

export interface TreeBuilderInterface<T> {
    makeTree(ast: AbstractSyntaxTree): T;
}
