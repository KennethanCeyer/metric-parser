import { Token } from './token/token';
import { TokenHelper } from './token/token.helper';

export class AbstractSyntaxTree {
    private _value: Token.Token;
    private _leftNode: AbstractSyntaxTree;
    private _rightNode: AbstractSyntaxTree;
    private _parent: AbstractSyntaxTree;
    private _type: Token.Type;
    private _subType: Token.SubType;

    public constructor(value?: Token.Token) {
        if (value)
            this.setValue(value);
    }

    public findRoot(): AbstractSyntaxTree {
        if (!this._parent)
            return this;

        return this._parent.findRoot();
    }

    private findOpenedBracket(): AbstractSyntaxTree {
        if (TokenHelper.isBracketOpen(this.getValue()))
            return this;

        if (!this._parent)
            return null;

        return this._parent.findOpenedBracket();
    }

    public removeClosestBracket(): AbstractSyntaxTree {
        const node = this.findOpenedBracket();

        if (!node)
            return null;

        const targetNode = node.getLeftNode();
        targetNode.setSubType(Token.SubType.Group);

        if (!node._parent) {
            targetNode.removeParent();
            return targetNode;
        }

        if (node._parent.getLeftNode() === node)
            node._parent.setLeftNode(targetNode);
        else
            node._parent.setRightNode(targetNode);

        return node._parent;
    }

    private climbUp(token: Token.Token): AbstractSyntaxTree {
        const currentPrecedence = TokenHelper.getPrecedence(this._value);
        const tokenPrecedence = TokenHelper.getPrecedence(token);

        if (currentPrecedence - tokenPrecedence <= 0 && this.getSubType() !== Token.SubType.Group)
            return this;

        if (this.isClimbTop()) {
            const newNode = this.createParentNode(token);
            newNode.setLeftNode(this);
            return newNode;
        }

        return this._parent.climbUp(token);
    }

    private isClimbTop() {
        return !this._parent || TokenHelper.isBracketOpen(this._parent.getValue());
    }

    private createChildNode(value?: Token.Token): AbstractSyntaxTree {
        const node = new AbstractSyntaxTree(value);
        node.setParent(this);
        return node;
    }

    private createParentNode(value?: Token.Token): AbstractSyntaxTree {
        const node = new AbstractSyntaxTree(value);
        this.setParent(node);
        return node;
    }

    private insertOperatorNode(value: Token.Token) {
        const rootNode = this.climbUp(value);
        if (this === rootNode) {
            const newNode = this.createChildNode(value);
            newNode.setLeftNode(this.getRightNode());
            this.setRightNode(newNode);
            return newNode;
        }

        return rootNode;
    }

    public insertNode(value: Token.Token): AbstractSyntaxTree {
        if (TokenHelper.isSymbol(value)) {
            if (!this.getValue()) {
                this.setValue(value);
                return this;
            }

            return this.insertOperatorNode(value);
        }

        const newNode = this.createChildNode(value);
        if (!this.getLeftNode())
            this.setLeftNode(newNode);
        else
            this.setRightNode(newNode);

        return newNode;
    }

    public insertEmptyNode(value: Token.Token): AbstractSyntaxTree {
        if (!this.getLeftNode() && !TokenHelper.isBracket(this.getValue())) {
            const newNode = this.createChildNode(value);
            this.setLeftNode(newNode);
            return this;
        }

        const newNode = this.createChildNode();
        const leftNode = newNode.createChildNode(value);
        newNode.setLeftNode(leftNode);
        this.setLeftNode(newNode);
        return newNode;
    }

    public getParent(): AbstractSyntaxTree {
        return this._parent;
    }

    public getType(): Token.Type {
        return this._type;
    }

    public getSubType(): Token.SubType {
        return this._subType;
    }

    public getValue(): Token.Token {
        return TokenHelper.isNumeric(this._value)
            ? Number(this._value)
            : this._value;
    }

    public getLeftNode(): AbstractSyntaxTree {
        return this._leftNode;
    }

    public getRightNode(): AbstractSyntaxTree {
        return this._rightNode;
    }

    public removeLeftNode() {
        this._leftNode.removeParent();
        this._leftNode = undefined;
    }

    public removeRightNode() {
        this._rightNode.removeParent();
        this._rightNode = undefined;
    }

    public removeParent() {
        this._parent = undefined;
    }

    private setSubType(subType: Token.SubType) {
        this._subType = subType;
    }

    public setValue(value: Token.Token) {
        this._type = TokenHelper.induceType(value);
        this._value = value;
    }

    public setParent(node: AbstractSyntaxTree) {
        this._parent = node;
    }

    public setLeftNode(node: AbstractSyntaxTree) {
        if (!node)
            return;

        this._leftNode = node;
        node.setParent(this);
    }

    public setRightNode(node: AbstractSyntaxTree) {
        if (!node)
            return;

        this._rightNode = node;
        node.setParent(this);
    }
}
