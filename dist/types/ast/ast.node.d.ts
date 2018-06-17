import { Token } from '../token/token';
export declare abstract class AbstractSyntaxTreeNode {
    protected _value: Token.Token;
    protected _leftNode: this;
    protected _rightNode: this;
    protected _parent: this;
    protected _type: Token.Type;
    protected _subType: Token.SubType;
    value: Token.Token;
    readonly type: Token.Type;
    subType: Token.SubType;
    parent: this;
    leftNode: this;
    rightNode: this;
    constructor(value?: Token.Token);
}
