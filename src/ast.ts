import { Token } from './token/token';
import { TokenHelper } from './token/token.helper';
import { AbstractSyntaxTreeHelper } from './ast.helper';
import { Tree } from './tree';

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

        if (!node.getParent()) {
            targetNode.removeParent();
            return targetNode;
        }

        if (node.getParent().getLeftNode() === node)
            node.getParent().setLeftNode(targetNode);
        else
            node.getParent().setRightNode(targetNode);

        return node.getParent();
    }

    private climbUp(token: Token.Token): AbstractSyntaxTree {
        return this.isClimbTop(token)
            ? this
            : this._parent.climbUp(token);
    }

    private isClimbTop(token: Token.Token) {
        return this.isTokenHighest(token) ||
            !this.getParent() ||
            TokenHelper.isBracketOpen(this.getValue());
    }

    private isTokenHighest(token: Token.Token) {
        return TokenHelper.isHigher(token, this.getValue()) && this.getSubType() !== Token.SubType.Group;
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

        if (TokenHelper.isBracketOpen(rootNode.getValue())) {
            const midNode = rootNode.createChildNode(value);
            const leftNode = rootNode.getLeftNode();
            const rightNode = rootNode.getRightNode();
            rootNode.setLeftNode(midNode);
            midNode.setLeftNode(leftNode);
            midNode.setRightNode(rightNode);
            return midNode;
        }

        if (rootNode.isTokenHighest(value) && rootNode.getParent()) {
            const midNode = rootNode.createChildNode(value);
            midNode.setLeftNode(rootNode.getRightNode());
            rootNode.setRightNode(midNode);
            return midNode;
        }

        if (this === rootNode) {
            const newNode = rootNode.createChildNode(value);
            newNode.setLeftNode(rootNode.getRightNode());
            rootNode.setRightNode(newNode);
            return newNode;
        }

        const newNode = rootNode.createParentNode(value);
        newNode.setLeftNode(rootNode);
        return newNode;
    }

    public insertNode(value: Token.Token): AbstractSyntaxTree {
        if (TokenHelper.isSymbol(value))
            if (!this.getValue()) {
                this.setValue(value);
                return this;
            }

        if (TokenHelper.isOperator(value))
            return this.insertOperatorNode(value);

        const valueNode = this.createChildNode(value);
        if (!this.getLeftNode())
            this.setLeftNode(valueNode);
        else
            this.setRightNode(valueNode);

        return valueNode;
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
