import { AbstractSyntaxTree } from '../../ast/ast';
import { TreeBuilderBase } from '../tree.base';
import { Tree } from './type';
export declare class TreeBuilder extends TreeBuilderBase<Tree> {
    makeTree(ast: AbstractSyntaxTree): Tree;
    makeAst(tree: Tree): AbstractSyntaxTree;
    private makeNode(node);
    private makeOperatorNode(sourceNode);
    private makeValueNode(sourceNode);
    private makeOperandValue(sourceNode);
    private makeAstNode(node);
    private static isTree(node);
    private static getValue(operand);
    private static isValid(node);
    private static isValidOperand(operand);
}
