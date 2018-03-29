import { Token } from '../token/token';
import { AbstractSyntaxTreeNode } from './ast.node';
export declare abstract class AbstractSyntaxTreeBase extends AbstractSyntaxTreeNode {
    findRoot(): this;
    isRoot(): boolean;
    isValid(): boolean;
    hasOpenBracket(): boolean;
    private findOpenedBracket();
    removeRootBracket(): this;
    removeClosestBracket(): this;
    private climbUp(token);
    private isClimbTop(token);
    private isTokenHighest(token);
    private createChildNode(value?);
    private createParentNode(value?);
    private insertOperatorNode(value);
    private needJointRight(rootNode, value);
    insertNode(value: Token.Token): this;
    private insertJointNodeToLeft(value);
    insertJointNodeToRight(value: Token.Token): this;
    removeLeftNode(): void;
    removeRightNode(): void;
    removeParent(): void;
}
