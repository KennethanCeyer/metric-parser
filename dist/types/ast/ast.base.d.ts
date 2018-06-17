import { Token } from '../token/token';
import { AbstractSyntaxTreeNode } from './ast.node';
export declare abstract class AbstractSyntaxTreeBase extends AbstractSyntaxTreeNode {
    findRoot(): this;
    isRoot(): boolean;
    isValid(): boolean;
    hasOpenBracket(): boolean;
    private findOpenedBracket;
    removeRootBracket(): this;
    removeClosestBracket(): this;
    private climbUp;
    private isClimbTop;
    private isTokenHighest;
    private createChildNode;
    private createParentNode;
    private insertOperatorNode;
    private needJointRight;
    insertNode(value: Token.Token): this;
    private insertJointNodeToLeft;
    insertJointNodeToRight(value: Token.Token): this;
    removeLeftNode(): void;
    removeRightNode(): void;
    removeParent(): void;
}
