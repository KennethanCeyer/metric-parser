import { Token } from '../token/token';
import { TokenHelper } from '../token/token.helper';

export abstract class AbstractSyntaxTreeNode {
    protected _value: Token.Token;
    protected _leftNode: this;
    protected _rightNode: this;
    protected _parent: this;
    protected _type: Token.Type;
    protected _subType: Token.SubType;

    get value(): Token.Token {
        return this._value;
    }

    set value(value: Token.Token) {
        this._value = TokenHelper.isNumeric(value)
            ? Number(value)
            : value;
        this._type = TokenHelper.induceType(this.value);
    }

    get type(): Token.Type {
        return this._type;
    }

    get subType(): Token.SubType {
        return this._subType;
    }

    set subType(value: Token.SubType) {
        this._subType = value;
    }

    get parent(): this {
        return this._parent;
    }

    set parent(value: this) {
        this._parent = value;
    }

    get leftNode(): this {
        return this._leftNode;
    }

    set leftNode(node: this) {
        if (!node) return;

        this._leftNode = node;
        node.parent = this;
    }

    get rightNode(): this {
        return this._rightNode;
    }

    set rightNode(node: this) {
        if (!node) return;

        this._rightNode = node;
        node.parent = this;
    }

    public constructor(value?: Token.Token) {
        if (value)
            this.value = value;
    }
}
