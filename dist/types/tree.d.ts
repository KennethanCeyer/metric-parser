import { AbstractSyntaxTree } from './ast';
import { TreeModel } from './tree.type';
export declare class Tree {
    private ast;
    constructor(ast: AbstractSyntaxTree);
    makeTree(): TreeModel;
    private makeNode(sourceNode);
    private makeOperatorNode(sourceNode);
    private makeValueNode(sourceNode);
    private makeOperandValue(sourceNode);
}
