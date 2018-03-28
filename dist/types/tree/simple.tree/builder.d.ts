import { TreeBuilderBase } from '../tree.base';
import { Tree } from './type';
export declare class TreeBuilder extends TreeBuilderBase<Tree> {
    makeTree(): Tree;
    private makeNode(sourceNode);
    private makeOperatorNode(sourceNode);
    private makeValueNode(sourceNode);
    private makeOperandValue(sourceNode);
}
