import { Token } from './token';
import { TokenHelper } from './token.helper';

export class AbstractSyntaxTree {
    private _value: string;
    private _leftNode: AbstractSyntaxTree;
    private _rightNode: AbstractSyntaxTree;
    private _parent: AbstractSyntaxTree;
    private _type: Token.Type;
    private _subType: Token.SubType;

    public constructor(value?: string) {
        this._type = this.induceType(value);
        this._value = value;
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

    private climbUp(token: string): AbstractSyntaxTree {
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

    private induceType(value: string) {
        if (TokenHelper.isOperator(value))
            return Token.Type.Operator;

        if (TokenHelper.isBracketOpen(value))
            return Token.Type.Bracket;

        return Token.Type.Value;
    }

    private createChildNode(value?: string): AbstractSyntaxTree {
        const node = new AbstractSyntaxTree(value);
        node.setParent(this);
        return node;
    }

    private createParentNode(value?: string): AbstractSyntaxTree {
        const node = new AbstractSyntaxTree(value);
        this.setParent(node);
        return node;
    }

    private insertOperatorNode(value: string) {
        const rootNode = this.climbUp(value);
        if (this === rootNode) {
            const newNode = this.createChildNode(value);
            newNode.setLeftNode(this.getRightNode());
            this.setRightNode(newNode);
            return newNode;
        }

        return rootNode;
    }

    public insertNode(value: string): AbstractSyntaxTree {
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

    public insertEmptyNode(numberValue: string): AbstractSyntaxTree {
        if (!this.getLeftNode() && !TokenHelper.isBracket(this.getValue())) {
            const newNode = this.createChildNode(numberValue);
            this.setLeftNode(newNode);
            return this;
        }

        const newNode = this.createChildNode();
        const leftNode = newNode.createChildNode(numberValue);
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

    public getValue(): string {
        return this._value;
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

    public setValue(value: string) {
        this._type = this.induceType(value);
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

    public getNodeDisplay(node?: AbstractSyntaxTree, depth: number = 0): string {
        if (!node && depth > 0)
            return;

        const currentNode = node || this;
        const leftNode = currentNode.getLeftNode();
        const rightNode = currentNode.getRightNode();

        const tabString = this.getTab(depth);

        let display = '';
        display += `${tabString}* NODE\n`;
        display += `${tabString}- value: ${currentNode.getValue()}\n`;

        if (leftNode) {
            display += `${tabString}- left:\n`;
            display += `${tabString}${this.getNodeDisplay(leftNode, depth + 1)}\n`;
        }

        if (rightNode) {
            display += `${tabString}- right:\n`;
            display += `${tabString}${this.getNodeDisplay(rightNode, depth + 1)}\n`;
        }

        return display;
    }

    private getTab(depth: number): string {
        const tab = [];
        const tabSize = 4;
        const tabCharacter = ' ';
        for (let index = 0; index < depth * tabSize; index += 1)
            tab.push(tabCharacter);
        return tab.join('');
    }
}