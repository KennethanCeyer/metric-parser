import { AbstractSyntaxTree } from '../../ast/ast';
import { TreeBuilderBase } from '../tree.base';
import { Tree } from './type';
export declare class TreeBuilder extends TreeBuilderBase<Tree> {
    makeTree(ast: AbstractSyntaxTree): Tree;
    makeAst(tree: Tree): AbstractSyntaxTree;
    private makeNode;
    private makeOperatorNode;
    private makeValueNode;
    private makeOperandValue;
    private makeAstNode;
    private static isTree;
    private static getValue;
    private static isValid;
    private static isValidOperand;
}
